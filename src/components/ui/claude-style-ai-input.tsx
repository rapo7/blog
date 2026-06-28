"use client";

import type React from 'react';
import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Plus,
  ArrowUp,
  X,
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  ChevronDown,
  ChevronRight,
  Check,
  Loader2,
  AlertCircle,
  Copy,
  BookOpen,
  BriefcaseBusiness,
  HeartPulse,
  Lightbulb,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FileWithPreview {
  id: string;
  file: File;
  preview?: string;
  type: string;
  uploadStatus: 'pending' | 'uploading' | 'complete' | 'error';
  uploadProgress?: number;
  abortController?: AbortController;
  textContent?: string;
}

export interface PastedContent {
  id: string;
  content: string;
  timestamp: Date;
  wordCount: number;
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  badge?: string;
}

export interface ChatInputSuggestion {
  id: string;
  text: string;
  category?: string;
}

interface ChatInputProps {
  onSendMessage?: (
    message: string,
    files: FileWithPreview[],
    pastedContent: PastedContent[],
  ) => void;
  disabled?: boolean;
  placeholder?: string;
  maxFiles?: number;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
  models?: ModelOption[];
  defaultModel?: string;
  onModelChange?: (modelId: string) => void;
  suggestions?: ChatInputSuggestion[];
  variant?: 'anthropic' | 'openai';
  onVariantChange?: (variant: 'anthropic' | 'openai') => void;
  hasMessageHistory?: boolean;
  siteTheme?: 'dark' | 'light';
}

const MAX_FILES = 10;
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const PASTE_THRESHOLD = 200;
const DEFAULT_MODELS_INTERNAL: ModelOption[] = [
  {
    id: 'claude-sonnet-4',
    name: 'Claude Sonnet 4',
    description: 'Balanced model',
    badge: 'Latest',
  },
  {
    id: 'claude-opus-3.5',
    name: 'Claude Opus 3.5',
    description: 'Highest intelligence',
  },
  {
    id: 'claude-haiku-3',
    name: 'Claude Haiku 3',
    description: 'Fastest responses',
  },
];

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const AnthropicThemeIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    {Array.from({ length: 16 }).map((_, index) => {
      const angle = (index * 22.5 * Math.PI) / 180;
      const x1 = 32 + Math.cos(angle) * 7;
      const y1 = 32 + Math.sin(angle) * 7;
      const x2 = 32 + Math.cos(angle) * 25;
      const y2 = 32 + Math.sin(angle) * 25;
      return (
        <line
          key={index}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      );
    })}
  </svg>
);

const OpenAIThemeIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
    <g
      stroke="currentColor"
      strokeWidth="4.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M32 8.6c4.1 0 7.5 2.6 8.8 6.2 3.8-.5 7.7 1.3 9.8 4.9 2.1 3.6 1.6 7.8-.7 10.9 2.4 3.1 2.8 7.3.8 10.9-2.1 3.6-5.9 5.5-9.8 5-1.4 3.6-4.8 6.1-8.9 6.1s-7.5-2.5-8.9-6.1c-3.8.5-7.7-1.4-9.8-5-2.1-3.6-1.6-7.8.8-10.9-2.4-3.1-2.8-7.3-.7-10.9 2.1-3.6 5.9-5.4 9.8-4.9C24.5 11.2 27.9 8.6 32 8.6Z" />
      <path d="M40.8 14.8 25.7 23.5a8.3 8.3 0 0 0-4.1 7.2v15.8" />
      <path d="M49.9 30.6 34.8 21.9a8.3 8.3 0 0 0-8.2 0L12.9 29.8" />
      <path d="M40.9 46.5V29.1a8.3 8.3 0 0 0-4.1-7.2L23.2 14" />
      <path d="M23.2 46.5 38.3 37.8a8.3 8.3 0 0 0 4.1-7.2V14.8" />
      <path d="M14.1 30.6 29.2 39.3a8.3 8.3 0 0 0 8.2 0l13.7-7.9" />
      <path d="M23.1 14.8v17.4a8.3 8.3 0 0 0 4.1 7.2l13.6 7.9" />
    </g>
  </svg>
);

const getFileIcon = (type: string, isSiteDark: boolean) => {
  const iconClassName = isSiteDark
    ? 'h-5 w-5 text-zinc-400'
    : 'h-5 w-5 text-[var(--color-text-offset)]';

  if (type.startsWith('image/')) {
    return <ImageIcon className={iconClassName} />;
  }
  if (type.startsWith('video/')) {
    return <Video className={iconClassName} />;
  }
  if (type.startsWith('audio/')) {
    return <Music className={iconClassName} />;
  }
  if (type.includes('zip') || type.includes('rar') || type.includes('tar')) {
    return <Archive className={iconClassName} />;
  }
  return <FileText className={iconClassName} />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const getFileTypeLabel = (type: string): string => {
  const parts = type.split('/');
  let label = parts[parts.length - 1].toUpperCase();
  if (label.length > 7 && label.includes('-')) {
    label = label.substring(0, label.indexOf('-'));
  }
  if (label.length > 10) {
    label = `${label.substring(0, 10)}...`;
  }
  return label;
};

const isTextualFile = (file: File): boolean => {
  const textualTypes = [
    'text/',
    'application/json',
    'application/xml',
    'application/javascript',
    'application/typescript',
  ];

  const textualExtensions = [
    'txt',
    'md',
    'py',
    'js',
    'ts',
    'jsx',
    'tsx',
    'html',
    'htm',
    'css',
    'scss',
    'sass',
    'json',
    'xml',
    'yaml',
    'yml',
    'csv',
    'sql',
    'sh',
    'bash',
    'php',
    'rb',
    'go',
    'java',
    'c',
    'cpp',
    'h',
    'hpp',
    'cs',
    'rs',
    'swift',
    'kt',
    'scala',
    'r',
    'vue',
    'svelte',
    'astro',
    'config',
    'conf',
    'ini',
    'toml',
    'log',
    'gitignore',
    'dockerfile',
    'makefile',
    'readme',
  ];

  const isTextualMimeType = textualTypes.some((type) =>
    file.type.toLowerCase().startsWith(type),
  );

  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const lowerName = file.name.toLowerCase();
  const isTextualExtension =
    textualExtensions.includes(extension) ||
    lowerName.includes('readme') ||
    lowerName.includes('dockerfile') ||
    lowerName.includes('makefile');

  return isTextualMimeType || isTextualExtension;
};

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve((event.target?.result as string) || '');
    reader.onerror = (event) => reject(event);
    reader.readAsText(file);
  });
};

const getFileExtension = (filename: string): string => {
  const extension = filename.split('.').pop()?.toUpperCase() || 'FILE';
  return extension.length > 8 ? `${extension.substring(0, 8)}...` : extension;
};

function renderHighlightedSuggestion(
  text: string,
  highlight: string,
  isOpenAI: boolean,
  isSiteDark: boolean,
) {
  const trimmedHighlight = highlight.trim();
  const mutedClassName = isOpenAI
    ? (isSiteDark ? 'text-[#b7b7b7]' : 'text-[#64748b]')
    : (isSiteDark ? 'text-[#cfc8bd]' : 'text-[#64748b]');
  const highlightClassName = isOpenAI
    ? (isSiteDark ? 'font-medium text-[#f4f4f4]' : 'font-medium text-[var(--color-text)]')
    : (isSiteDark ? 'font-medium text-[#f4efe7]' : 'font-medium text-[var(--color-text)]');

  if (!trimmedHighlight) {
    return <span className={mutedClassName}>{text}</span>;
  }

  const textLower = text.toLowerCase();
  const highlightLower = trimmedHighlight.toLowerCase();
  const index = textLower.indexOf(highlightLower);

  if (index === -1) {
    return <span className={mutedClassName}>{text}</span>;
  }

  const before = text.slice(0, index);
  const match = text.slice(index, index + trimmedHighlight.length);
  const after = text.slice(index + trimmedHighlight.length);

  return (
    <>
      {before && <span className={mutedClassName}>{before}</span>}
      <span className={highlightClassName}>{match}</span>
      {after && <span className={mutedClassName}>{after}</span>}
    </>
  );
}

const FilePreviewCard: React.FC<{
  file: FileWithPreview;
  onRemove: (id: string) => void;
  isSiteDark?: boolean;
}> = ({ file, onRemove, isSiteDark = false }) => {
  const isImage = file.type.startsWith('image/');
  const isTextual = isTextualFile(file.file);

  if (isTextual) {
    return <TextualFilePreviewCard file={file} onRemove={onRemove} isSiteDark={isSiteDark} />;
  }

  return (
    <div
      className={cn(
        isSiteDark
          ? 'relative group bg-zinc-700 border w-fit border-zinc-600 rounded-lg shadow-md flex-shrink-0 overflow-hidden'
          : 'relative group bg-[var(--color-surface)] border w-fit border-[var(--color-border)] rounded-lg shadow-sm flex-shrink-0 overflow-hidden',
        isImage ? 'p-0' : 'p-3',
      )}
    >
      <div className="flex items-start gap-3 size-[125px] overflow-hidden">
        {isImage && file.preview ? (
          <div className={cn('relative size-full rounded-md overflow-hidden', isSiteDark ? 'bg-zinc-600' : 'bg-[var(--color-background-offset)]')}>
            <img
              src={file.preview || '/placeholder.svg'}
              alt={file.file.name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}
        {!isImage && (
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center gap-1.5 mb-1">
              <div className={cn(
                'group absolute flex justify-start items-end p-2 inset-0 bg-gradient-to-b overflow-hidden',
                isSiteDark
                  ? 'to-[#30302E]'
                  : 'to-[var(--color-surface)] from-[var(--color-background)]',
              )}
              >
                <p className={cn(
                  'absolute bottom-2 left-2 capitalize text-xs px-2 py-1 rounded-md',
                  isSiteDark
                    ? 'text-white bg-zinc-800 border border-zinc-700'
                    : 'text-[var(--color-text)] bg-[var(--color-surface)] border border-[var(--color-border)]',
                )}
                >
                  {getFileTypeLabel(file.type)}
                </p>
              </div>
              {getFileIcon(file.type, isSiteDark)}
              {file.uploadStatus === 'uploading' && (
                <Loader2 className={cn('h-3.5 w-3.5 animate-spin', isSiteDark ? 'text-blue-400' : 'text-blue-600')} />
              )}
              {file.uploadStatus === 'error' && (
                <AlertCircle className="h-3.5 w-3.5 text-red-400" />
              )}
            </div>

            <p
              className={cn('max-w-[90%] text-xs font-medium truncate', isSiteDark ? 'text-zinc-100' : 'text-[var(--color-text)]')}
              title={file.file.name}
            >
              {file.file.name}
            </p>
            <p className={cn('text-[10px] mt-1', isSiteDark ? 'text-zinc-500' : 'text-[var(--color-text-offset)]')}>
              {formatFileSize(file.file.size)}
            </p>
          </div>
        )}
      </div>
      <Button
        size="icon"
        variant="outline"
        className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
        onClick={() => onRemove(file.id)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

const PastedContentCard: React.FC<{
  content: PastedContent;
  onRemove: (id: string) => void;
  isSiteDark?: boolean;
}> = ({ content, onRemove, isSiteDark = false }) => {
  const previewText = content.content.slice(0, 150);
  const needsTruncation = content.content.length > 150;

  return (
    <div className={cn(
      isSiteDark
        ? 'bg-zinc-700 border border-zinc-600 relative rounded-lg p-3 size-[125px] shadow-md flex-shrink-0 overflow-hidden'
        : 'bg-[var(--color-surface)] border border-[var(--color-border)] relative rounded-lg p-3 size-[125px] shadow-sm flex-shrink-0 overflow-hidden',
    )}>
      <div className={cn('text-[8px] whitespace-pre-wrap break-words max-h-24 overflow-y-auto custom-scrollbar', isSiteDark ? 'text-zinc-300' : 'text-[var(--color-text-offset)]')}>
        {previewText}
        {needsTruncation && '...'}
      </div>
      <div className={cn(
        'group absolute flex justify-start items-end p-2 inset-0 bg-gradient-to-b from-transparent overflow-hidden',
        isSiteDark ? 'to-[#30302E]' : 'to-[var(--color-surface)]',
      )}>
        <p className={cn(
          'capitalize text-xs px-2 py-1 rounded-md',
          isSiteDark
            ? 'text-white bg-zinc-800 border border-zinc-700'
            : 'text-[var(--color-text)] bg-[var(--color-surface)] border border-[var(--color-border)]',
        )}>
          PASTED
        </p>
        <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 flex items-center gap-0.5 absolute top-2 right-2">
          <Button
            size="icon"
            variant="outline"
            className="size-6"
            onClick={() => navigator.clipboard.writeText(content.content)}
            title="Copy content"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="size-6"
            onClick={() => onRemove(content.id)}
            title="Remove content"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const OPENAI_EFFORTS_BY_MODEL: Record<string, string[]> = {
  '5.5': ['Instant', 'Medium', 'High', 'Extra High', 'Pro'],
  '5.4': ['Instant', 'Medium', 'High'],
  '5.3': ['Instant'],
  o3: ['Medium'],
};

const ModelSelectorDropdown: React.FC<{
  models: ModelOption[];
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  variant?: 'anthropic' | 'openai';
  siteTheme?: 'dark' | 'light';
  onOpenChange?: (isOpen: boolean) => void;
  onInteractionChange?: (isInteracting: boolean) => void;
}> = ({
  models,
  selectedModel,
  onModelChange,
  variant = 'anthropic',
  siteTheme = 'dark',
  onOpenChange,
  onInteractionChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties | null>(null);
  const [menuPlacement, setMenuPlacement] = useState<'above' | 'below'>('above');
  const [anthropicPanel, setAnthropicPanel] = useState<'effort' | null>(null);
  const [anthropicEffort, setAnthropicEffort] = useState<'Low' | 'Medium' | 'High' | 'Max'>('Low');
  const [isThinkingEnabled, setIsThinkingEnabled] = useState(false);
  const [openAIEffort, setOpenAIEffort] = useState('Instant');
  const [isOpenAIModelPanelOpen, setIsOpenAIModelPanelOpen] = useState(false);
  const isOpenAI = variant === 'openai';
  const isSiteDark = siteTheme === 'dark';
  const selectedModelData =
    models.find((model) => model.id === selectedModel) || models[0];
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const setDropdownOpen = useCallback(
    (nextIsOpen: boolean) => {
      setIsOpen(nextIsOpen);
      onOpenChange?.(nextIsOpen);
      onInteractionChange?.(nextIsOpen);
      if (!nextIsOpen) {
        setMenuStyle(null);
        setAnthropicPanel(null);
        setIsOpenAIModelPanelOpen(false);
      }
    },
    [onInteractionChange, onOpenChange],
  );

  const updateMenuPosition = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const mainMenuWidth = isOpenAI ? 176 : 318;
    const mainWidth = Math.min(mainMenuWidth, viewportWidth - 16);
    const left = Math.min(
      Math.max(8, rect.right - mainWidth),
      viewportWidth - mainWidth - 8,
    );
    const hasSidePanel =
      (isOpenAI && isOpenAIModelPanelOpen) ||
      (!isOpenAI && anthropicPanel !== null);
    const panelGap = hasSidePanel ? 8 : 0;
    const availableSideWidth = viewportWidth - left - mainWidth - panelGap - 8;
    const desiredSideWidth = isOpenAI ? 186 : 320;
    const sideWidth = hasSidePanel
      ? Math.max(0, Math.min(desiredSideWidth, availableSideWidth))
      : 0;
    const menuWidth = mainWidth + panelGap + sideWidth;
    const menuGap = 8;
    const showAbove = rect.top > viewportHeight - rect.bottom;
    const maxHeight =
      Math.max(
        132,
        Math.floor(showAbove
          ? rect.top - menuGap - 8
          : viewportHeight - rect.bottom - menuGap - 8,
        ),
      );
    setMenuPlacement(showAbove ? 'above' : 'below');

    setMenuStyle({
      left: `${Math.round(left)}px`,
      top: showAbove
        ? `${Math.round(rect.top - menuGap)}px`
        : `${Math.round(rect.bottom + menuGap)}px`,
      width: `${menuWidth}px`,
      maxHeight: `${Math.min(maxHeight, 280)}px`,
      transform: showAbove ? 'translateY(-100%)' : undefined,
      transformOrigin: showAbove ? 'bottom right' : 'top right',
    });
  }, [anthropicPanel, isOpenAI, isOpenAIModelPanelOpen]);

  const checkColorClassName = isOpenAI
    ? isSiteDark
      ? 'text-white'
      : 'text-[#0d0d0d]'
    : isSiteDark
      ? 'text-[#4d9cff]'
      : 'text-[#2563eb]';

  const selectedLabel = isOpenAI
    ? `${selectedModelData.name} ${openAIEffort}`
    : `${selectedModelData.name} ${anthropicEffort}`;
  const menuWidthValue =
    Number.parseInt(String(menuStyle?.width || ''), 10) || (isOpenAI ? 176 : 318);
  const hasSidePanel =
    (isOpenAI && isOpenAIModelPanelOpen) ||
    (!isOpenAI && anthropicPanel !== null);
  const mainPanelWidth = isOpenAI
    ? Math.min(176, menuWidthValue)
    : Math.min(318, menuWidthValue);
  const sidePanelWidth = hasSidePanel
    ? Math.max(0, menuWidthValue - mainPanelWidth - 8)
    : 0;
  const openAIEfforts =
    OPENAI_EFFORTS_BY_MODEL[selectedModel] || OPENAI_EFFORTS_BY_MODEL['5.5'];
  const openAIDefaultEffort = openAIEfforts[0] || 'Instant';

  useEffect(() => {
    if (!isOpenAI || openAIEfforts.includes(openAIEffort)) return;
    setOpenAIEffort(openAIDefaultEffort);
  }, [isOpenAI, openAIDefaultEffort, openAIEffort, openAIEfforts]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    updateMenuPosition();
    window.addEventListener('scroll', updateMenuPosition, true);
    window.addEventListener('resize', updateMenuPosition);
    return () => {
      window.removeEventListener('scroll', updateMenuPosition, true);
      window.removeEventListener('resize', updateMenuPosition);
    };
  }, [isOpen, updateMenuPosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleEscape(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setDropdownOpen]);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
        <Button
            ref={buttonRef}
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              'h-9 px-3 text-sm font-semibold',
              isOpenAI
                ? isSiteDark
                  ? 'rounded-full border-0 bg-[#30302f] text-[#f4f4f4] hover:bg-[#3b3b39] hover:text-white'
                  : 'rounded-full border-0 bg-[#f1f1f1] text-[#0d0d0d] hover:bg-[#e9e9e9]'
                : isSiteDark
                  ? 'h-8 rounded-lg border-0 bg-[#10100f] text-[#f3eee5] hover:bg-[#191917] hover:text-white'
                  : 'h-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-background-offset)] text-[var(--color-text)] hover:bg-[var(--color-surface)]',
            )}
        aria-label={`Current intelligence setting: ${selectedLabel}`}
        title={selectedLabel}
        aria-expanded={isOpen}
        onClick={() => setDropdownOpen(!isOpen)}
      >
        {isOpenAI ? (
          <span className="flex min-w-0 max-w-[150px] items-center gap-1.5 truncate sm:max-w-[200px]">
            <span className="shrink-0">{selectedModelData.name}</span>
            <span className={cn('min-w-0 truncate', isSiteDark ? 'text-white/[0.62]' : 'text-black/[0.58]')}>
              {openAIEffort}
            </span>
          </span>
        ) : (
          <span className="truncate max-w-[150px] sm:max-w-[200px]">
            {selectedLabel}
          </span>
        )}
        <ChevronDown
          className={cn(
            'ml-1 h-4 w-4 shrink-0 opacity-70 transition-transform',
            isOpen && 'rotate-180',
          )}
        />
      </Button>
      {isOpen && menuStyle &&
        createPortal(
          <div
            ref={menuRef}
            style={menuStyle}
            className={cn(
              'fixed z-[220] flex gap-2',
              menuPlacement === 'above' ? 'items-end' : 'items-start',
              isOpenAI ? 'font-openai' : 'font-anthropic',
            )}
          >
            <div
              className={cn(
                'max-h-full overflow-y-auto rounded-2xl border p-1.5 shadow-[0_18px_48px_rgb(0_0_0_/_45%)]',
                isOpenAI
                  ? isSiteDark
                    ? 'border-white/[0.12] bg-[#3a3a3a] text-white shadow-black/40'
                    : 'border-[#d9d9e3] bg-white text-[#0d0d0d] shadow-[0_8px_22px_rgb(0_0_0_/_16%)]'
                  : isSiteDark
                    ? 'border-white/[0.12] bg-[#383834] text-[#f2f0ea] shadow-black/40'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-[0_8px_22px_rgb(31_25_16_/_14%)]',
              )}
              style={{ width: mainPanelWidth }}
              role="listbox"
            >
              {isOpenAI ? (
                <>
                  <div className={cn(
                    'px-3 pb-2 pt-3 text-base font-medium',
                    isSiteDark ? 'text-white/[0.62]' : 'text-[#6b6b6b]',
                  )}
                  >
                    Intelligence
                  </div>
                  {openAIEfforts.map((effort) => (
                    <button
                      key={effort}
                      type="button"
                      className={cn(
                        'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-base font-semibold transition-colors',
                        isSiteDark ? 'hover:bg-white/[0.08]' : 'hover:bg-[#f4f4f4]',
                      )}
                      role="option"
                      aria-selected={effort === openAIEffort}
                      onClick={() => {
                        setOpenAIEffort(effort);
                        setDropdownOpen(false);
                      }}
                    >
                      <span className={cn(isSiteDark ? 'text-white/[0.78]' : 'text-black/[0.68]')}>
                        {effort}
                      </span>
                      {effort === openAIEffort && (
                        <Check className={cn('h-5 w-5 shrink-0', checkColorClassName)} />
                      )}
                    </button>
                  ))}
                  <div className={cn('mx-3 my-2 border-t', isSiteDark ? 'border-white/[0.12]' : 'border-black/10')} />
                  <button
                    type="button"
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-base font-semibold transition-colors',
                      isOpenAIModelPanelOpen
                        ? isSiteDark ? 'bg-white/[0.10]' : 'bg-[#f4f4f4]'
                        : isSiteDark ? 'hover:bg-white/[0.08]' : 'hover:bg-[#f4f4f4]',
                    )}
                    onClick={() => setIsOpenAIModelPanelOpen((value) => !value)}
                    aria-expanded={isOpenAIModelPanelOpen}
                  >
                    <span>{selectedModelData.name}</span>
                    <ChevronRight className="h-4 w-4 opacity-70" />
                  </button>
                </>
              ) : (
                <>
                  {models.map((model) => {
                    const isSelected = model.id === selectedModel;

                    return (
                      <button
                        key={model.id}
                        type="button"
                        className={cn(
                          'flex w-full items-start justify-between rounded-xl px-3 py-2 text-left transition-colors',
                          isSiteDark ? 'hover:bg-white/[0.06]' : 'hover:bg-[var(--color-background-offset)]',
                        )}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onModelChange(model.id);
                          setDropdownOpen(false);
                        }}
                      >
                        <span className="min-w-0">
                          <span className="flex min-w-0 items-center gap-1.5 text-sm font-medium leading-tight">
                            <span className="truncate">{model.name}</span>
                            {model.badge && (
                              <span className={cn(
                                'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                                isSiteDark ? 'bg-white/[0.07] text-white/[0.45]' : 'bg-black/[0.05] text-[var(--color-text-offset)]',
                              )}
                              >
                                {model.badge}
                              </span>
                            )}
                          </span>
                          <span className={cn(
                            'mt-0.5 block text-xs leading-snug',
                            isSiteDark ? 'text-white/[0.44]' : 'text-[var(--color-text-offset)]',
                          )}
                          >
                            {model.description}
                          </span>
                        </span>
                        <span className="ml-3 flex h-5 shrink-0 items-center">
                          {isSelected && (
                            <Check className={cn('h-4 w-4', checkColorClassName)} />
                          )}
                        </span>
                      </button>
                    );
                  })}
                  <div className={cn('mx-3 my-1 border-t', isSiteDark ? 'border-white/[0.12]' : 'border-black/10')} />
                  <button
                    type="button"
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors',
                      anthropicPanel === 'effort'
                        ? isSiteDark ? 'bg-white/[0.07]' : 'bg-[var(--color-background-offset)]'
                        : isSiteDark ? 'hover:bg-white/[0.06]' : 'hover:bg-[var(--color-background-offset)]',
                    )}
                    onClick={() => setAnthropicPanel((panel) => panel === 'effort' ? null : 'effort')}
                    aria-expanded={anthropicPanel === 'effort'}
                  >
                    <span>Effort</span>
                    <span className={cn('flex items-center gap-2', isSiteDark ? 'text-white/50' : 'text-[var(--color-text-offset)]')}>
                      {anthropicEffort}
                      <ChevronRight className="h-4 w-4 opacity-60" />
                    </span>
                  </button>
                </>
              )}
            </div>
            {isOpenAI && isOpenAIModelPanelOpen && (
              <div
                className={cn(
                  'max-h-full overflow-y-auto rounded-2xl border p-2 shadow-[0_18px_48px_rgb(0_0_0_/_42%)]',
                  isSiteDark
                    ? 'border-white/[0.12] bg-[#3a3a3a] text-white'
                    : 'border-[#d9d9e3] bg-white text-[#0d0d0d]',
                )}
                style={{ width: sidePanelWidth }}
              >
                {models.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-base font-semibold transition-colors',
                      isSiteDark ? 'hover:bg-white/[0.08]' : 'hover:bg-[#f4f4f4]',
                    )}
                    role="option"
                    aria-selected={model.id === selectedModel}
                    onClick={() => {
                      const nextEfforts =
                        OPENAI_EFFORTS_BY_MODEL[model.id] || OPENAI_EFFORTS_BY_MODEL['5.5'];
                      setOpenAIEffort(nextEfforts[0] || 'Instant');
                      onModelChange(model.id);
                      setDropdownOpen(false);
                    }}
                  >
                    <span className="min-w-0 truncate">{model.name}</span>
                    {model.id === selectedModel && (
                      <Check className={cn('h-5 w-5 shrink-0', checkColorClassName)} />
                    )}
                  </button>
                ))}
              </div>
            )}
            {!isOpenAI && anthropicPanel === 'effort' && (
              <div
                className={cn(
                  'max-h-full overflow-y-auto rounded-2xl border p-3 shadow-[0_18px_48px_rgb(0_0_0_/_42%)]',
                  isSiteDark
                    ? 'border-white/[0.12] bg-[#383834] text-[#f2f0ea]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]',
                )}
                style={{ width: sidePanelWidth }}
              >
                <p className={cn('px-1 pb-2 text-sm leading-snug', isSiteDark ? 'text-white/[0.48]' : 'text-[var(--color-text-offset)]')}>
                  Higher effort means more thorough responses, but takes longer and uses your limits faster.
                </p>
                {(['Low', 'Medium', 'High', 'Max'] as const).map((effort) => (
                  <button
                    key={effort}
                    type="button"
                    className={cn(
                      'flex w-full items-center justify-between rounded-xl px-2 py-2 text-left text-sm font-medium transition-colors',
                      isSiteDark ? 'hover:bg-white/[0.06]' : 'hover:bg-[var(--color-background-offset)]',
                    )}
                    onClick={() => setAnthropicEffort(effort)}
                  >
                    <span className="flex items-center gap-2">
                      {effort}
                      {effort === 'Low' && (
                        <span className={cn(
                          'rounded px-1.5 py-0.5 text-[10px]',
                          isSiteDark ? 'bg-white/[0.07] text-white/[0.55]' : 'bg-black/[0.05] text-[var(--color-text-offset)]',
                        )}
                        >
                          Default
                        </span>
                      )}
                      {effort === 'Max' && (
                        <span className={cn('text-[11px]', isSiteDark ? 'text-white/40' : 'text-[var(--color-text-offset)]')}>
                          (i)
                        </span>
                      )}
                    </span>
                    {anthropicEffort === effort && (
                      <Check className={cn('h-4 w-4', checkColorClassName)} />
                    )}
                  </button>
                ))}
                <div className={cn('mx-2 my-2 border-t', isSiteDark ? 'border-white/[0.12]' : 'border-black/10')} />
                <button
                  type="button"
                  role="switch"
                  aria-checked={isThinkingEnabled}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl px-2 py-2 text-left transition-colors',
                    isSiteDark ? 'hover:bg-white/[0.06]' : 'hover:bg-[var(--color-background-offset)]',
                  )}
                  onClick={() => setIsThinkingEnabled((value) => !value)}
                >
                  <span>
                    <span className="block text-sm font-medium leading-tight">Thinking</span>
                    <span className={cn('mt-0.5 block text-xs leading-snug', isSiteDark ? 'text-white/[0.44]' : 'text-[var(--color-text-offset)]')}>
                      Can think for more complex tasks
                    </span>
                  </span>
                  <span
                    className={cn(
                      'relative h-5 w-9 shrink-0 rounded-full transition-colors',
                      isThinkingEnabled ? 'bg-[#4d9cff]' : isSiteDark ? 'bg-white/[0.18]' : 'bg-black/[0.15]',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform',
                        isThinkingEnabled ? 'translate-x-[18px]' : 'translate-x-0.5',
                      )}
                    />
                  </span>
                </button>
              </div>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
};

const TextualFilePreviewCard: React.FC<{
  file: FileWithPreview;
  onRemove: (id: string) => void;
  isSiteDark?: boolean;
}> = ({ file, onRemove, isSiteDark = false }) => {
  const previewText = file.textContent?.slice(0, 150) || '';
  const needsTruncation = (file.textContent?.length || 0) > 150;
  const fileExtension = getFileExtension(file.file.name);

  return (
    <div className={cn(
      isSiteDark
        ? 'bg-zinc-700 border border-zinc-600 relative rounded-lg p-3 size-[125px] shadow-md flex-shrink-0 overflow-hidden'
        : 'bg-[var(--color-surface)] border border-[var(--color-border)] relative rounded-lg p-3 size-[125px] shadow-sm flex-shrink-0 overflow-hidden',
    )}>
      <div className={cn('text-[8px] whitespace-pre-wrap break-words max-h-24 overflow-y-auto custom-scrollbar', isSiteDark ? 'text-zinc-300' : 'text-[var(--color-text-offset)]')}>
        {file.textContent ? (
          <>
            {previewText}
            {needsTruncation && '...'}
          </>
        ) : (
          <div className={cn('flex items-center justify-center h-full', isSiteDark ? 'text-zinc-400' : 'text-[var(--color-text-offset)]')}>
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>
      <div className={cn(
        'group absolute flex justify-start items-end p-2 inset-0 bg-gradient-to-b from-transparent overflow-hidden',
        isSiteDark ? 'to-[#30302E]' : 'to-[var(--color-surface)]',
      )}>
        <p className={cn(
          'capitalize text-xs px-2 py-1 rounded-md',
          isSiteDark
            ? 'text-white bg-zinc-800 border border-zinc-700'
            : 'text-[var(--color-text)] bg-[var(--color-surface)] border border-[var(--color-border)]',
        )}
        >
          {fileExtension}
        </p>
        {file.uploadStatus === 'uploading' && (
          <div className="absolute top-2 left-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
          </div>
        )}
        {file.uploadStatus === 'error' && (
          <div className="absolute top-2 left-2">
            <AlertCircle className="h-3.5 w-3.5 text-red-400" />
          </div>
        )}
        <div className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 flex items-center gap-0.5 absolute top-2 right-2">
          {file.textContent && (
            <Button
              size="icon"
              variant="outline"
              className="size-6"
              onClick={() =>
                navigator.clipboard.writeText(file.textContent || '')
              }
              title="Copy content"
            >
              <Copy className="h-3 w-3" />
            </Button>
          )}
          <Button
            size="icon"
            variant="outline"
            className="size-6"
            onClick={() => onRemove(file.id)}
            title="Remove file"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ClaudeChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = 'How can I help you today?',
  maxFiles = MAX_FILES,
  maxFileSize = MAX_FILE_SIZE,
  acceptedFileTypes,
  models = DEFAULT_MODELS_INTERNAL,
  defaultModel,
  onModelChange,
  suggestions = [],
  variant = 'anthropic',
  onVariantChange,
  hasMessageHistory = false,
  siteTheme = 'dark',
}) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [pastedContent, setPastedContent] = useState<PastedContent[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [addMenuStyle, setAddMenuStyle] = useState<React.CSSProperties | null>(null);
  const [selectedModel, setSelectedModel] = useState(
    defaultModel || models[0]?.id || '',
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nextModel =
      defaultModel && models.some((model) => model.id === defaultModel)
        ? defaultModel
        : models[0]?.id || '';

    setSelectedModel(nextModel);
  }, [defaultModel, models]);

  const updateAddMenuPosition = useCallback(() => {
    const button = addButtonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const desiredWidth = 272;
    const menuWidth = Math.min(desiredWidth, viewportWidth - 16);
    const left = Math.min(
      Math.max(8, rect.left),
      viewportWidth - menuWidth - 8,
    );
    const menuGap = 8;
    const showAbove = rect.top > viewportHeight - rect.bottom;
    const maxHeight = Math.max(
      132,
      Math.floor(showAbove
        ? rect.top - menuGap - 8
        : viewportHeight - rect.bottom - menuGap - 8),
    );

    setAddMenuStyle({
      left: `${Math.round(left)}px`,
      top: showAbove
        ? `${Math.round(rect.top - menuGap)}px`
        : `${Math.round(rect.bottom + menuGap)}px`,
      width: `${menuWidth}px`,
      maxHeight: `${Math.min(maxHeight, 280)}px`,
      transform: showAbove ? 'translateY(-100%)' : undefined,
      transformOrigin: showAbove ? 'bottom left' : 'top left',
    });
  }, []);

  useLayoutEffect(() => {
    if (!isAddMenuOpen) {
      setAddMenuStyle(null);
      return;
    }

    updateAddMenuPosition();
    window.addEventListener('scroll', updateAddMenuPosition, true);
    window.addEventListener('resize', updateAddMenuPosition);
    return () => {
      window.removeEventListener('scroll', updateAddMenuPosition, true);
      window.removeEventListener('resize', updateAddMenuPosition);
    };
  }, [isAddMenuOpen, updateAddMenuPosition]);

  useEffect(() => {
    if (!isAddMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !addMenuRef.current?.contains(target) &&
        !addButtonRef.current?.contains(target)
      ) {
        setIsAddMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsAddMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAddMenuOpen]);

  const adjustTextareaHeight = useCallback((textarea = textareaRef.current) => {
    if (!textarea) return;

    textarea.style.height = 'auto';
    const maxHeight =
      Number.parseInt(getComputedStyle(textarea).maxHeight, 10) || 160;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, []);

  useLayoutEffect(() => {
    adjustTextareaHeight();
  }, [adjustTextareaHeight, message]);

  const handleFileSelect = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return;

      const currentFileCount = files.length;
      if (currentFileCount >= maxFiles) {
        alert(
          `Maximum ${maxFiles} files allowed. Please remove some files to add new ones.`,
        );
        return;
      }

      const availableSlots = maxFiles - currentFileCount;
      const filesToAdd = Array.from(selectedFiles).slice(0, availableSlots);

      if (selectedFiles.length > availableSlots) {
        alert(
          `You can only add ${availableSlots} more file(s). ${
            selectedFiles.length - availableSlots
          } file(s) were not added.`,
        );
      }

      const newFiles = filesToAdd
        .filter((file) => {
          if (file.size > maxFileSize) {
            alert(
              `File ${file.name} (${formatFileSize(
                file.size,
              )}) exceeds size limit of ${formatFileSize(maxFileSize)}.`,
            );
            return false;
          }
          if (
            acceptedFileTypes &&
            !acceptedFileTypes.some(
              (type) =>
                file.type.includes(type) || type === file.name.split('.').pop(),
            )
          ) {
            alert(
              `File type for ${
                file.name
              } not supported. Accepted types: ${acceptedFileTypes.join(', ')}`,
            );
            return false;
          }
          return true;
        })
        .map((file) => ({
          id: createId(),
          file,
          preview: file.type.startsWith('image/')
            ? URL.createObjectURL(file)
            : undefined,
          type: file.type || 'application/octet-stream',
          uploadStatus: 'pending' as const,
          uploadProgress: 0,
        }));

      setFiles((prev) => [...prev, ...newFiles]);

      newFiles.forEach((fileToUpload) => {
        if (isTextualFile(fileToUpload.file)) {
          readFileAsText(fileToUpload.file)
            .then((textContent) => {
              setFiles((prev) =>
                prev.map((file) =>
                  file.id === fileToUpload.id ? { ...file, textContent } : file,
                ),
              );
            })
            .catch((error) => {
              console.error('Error reading file content:', error);
              setFiles((prev) =>
                prev.map((file) =>
                  file.id === fileToUpload.id
                    ? { ...file, textContent: 'Error reading file content' }
                    : file,
                ),
              );
            });
        }

        setFiles((prev) =>
          prev.map((file) =>
            file.id === fileToUpload.id
              ? { ...file, uploadStatus: 'uploading' }
              : file,
          ),
        );

        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 20 + 5;
          if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setFiles((prev) =>
              prev.map((file) =>
                file.id === fileToUpload.id
                  ? { ...file, uploadStatus: 'complete', uploadProgress: 100 }
                  : file,
              ),
            );
          } else {
            setFiles((prev) =>
              prev.map((file) =>
                file.id === fileToUpload.id
                  ? { ...file, uploadProgress: progress }
                  : file,
              ),
            );
          }
        }, 150);
      });
    },
    [files.length, maxFiles, maxFileSize, acceptedFileTypes],
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((file) => file.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((file) => file.id !== id);
    });
  }, []);

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const clipboardData = event.clipboardData;
      const items = clipboardData.items;

      const fileItems = Array.from(items).filter(
        (item) => item.kind === 'file',
      );
      if (fileItems.length > 0 && files.length < maxFiles) {
        event.preventDefault();
        const pastedFiles = fileItems
          .map((item) => item.getAsFile())
          .filter(Boolean) as File[];
        const dataTransfer = new DataTransfer();
        pastedFiles.forEach((file) => dataTransfer.items.add(file));
        handleFileSelect(dataTransfer.files);
        return;
      }

      const textData = clipboardData.getData('text');
      if (
        textData &&
        textData.length > PASTE_THRESHOLD &&
        pastedContent.length < 5
      ) {
        event.preventDefault();
        setMessage(`${message}${textData.slice(0, PASTE_THRESHOLD)}...`);

        const pastedItem: PastedContent = {
          id: createId(),
          content: textData,
          timestamp: new Date(),
          wordCount: textData.split(/\s+/).filter(Boolean).length,
        };

        setPastedContent((prev) => [...prev, pastedItem]);
      }
    },
    [handleFileSelect, files.length, maxFiles, pastedContent.length, message],
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      if (event.dataTransfer.files) {
        handleFileSelect(event.dataTransfer.files);
      }
    },
    [handleFileSelect],
  );

  const handleSend = useCallback(() => {
    if (
      disabled ||
      (!message.trim() && files.length === 0 && pastedContent.length === 0)
    ) {
      return;
    }

    if (files.some((file) => file.uploadStatus === 'uploading')) {
      alert('Please wait for all files to finish uploading.');
      return;
    }

    onSendMessage?.(message, files, pastedContent);

    setMessage('');
    files.forEach((file) => {
      if (file.preview) URL.revokeObjectURL(file.preview);
    });
    setFiles([]);
    setPastedContent([]);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }, [message, files, pastedContent, disabled, onSendMessage]);

  const handleModelChangeInternal = useCallback(
    (modelId: string) => {
      setSelectedModel(modelId);
      onModelChange?.(modelId);
    },
    [onModelChange],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
        event.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleMessageChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(event.target.value);
      adjustTextareaHeight(event.target);
    },
    [adjustTextareaHeight],
  );

  const handleComposerClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;

      const target = event.target as HTMLElement;
      if (target.closest('button, input, textarea, [role="button"]')) return;

      textareaRef.current?.focus();
    },
    [disabled],
  );

  const hasContent =
    message.trim() || files.length > 0 || pastedContent.length > 0;
  const canSend =
    hasContent &&
    !disabled &&
    !files.some((file) => file.uploadStatus === 'uploading');
  const noMessageHistory = !hasMessageHistory;
  const isOpenAI = variant === 'openai';
  const isSiteDark = siteTheme === 'dark';
  const suggestionQuery = message.trim().toLowerCase();
  const suggestionTokens = suggestionQuery.split(/\s+/).filter(Boolean);
  const visibleSuggestions = (suggestionTokens.length > 0
    ? suggestions.filter((suggestion) => {
        const searchableText = `${suggestion.text} ${suggestion.category || ''}`.toLowerCase();
        return suggestionTokens.every((token) => searchableText.includes(token));
      })
    : suggestions
  ).slice(0, 3);
  const shouldShowSuggestions =
    noMessageHistory &&
    visibleSuggestions.length > 0;

  return (
    <div
      className="relative mx-auto w-full max-w-2xl min-w-0"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
      <div
        className={cn(
          'absolute inset-0 z-50 flex flex-col items-center justify-center rounded-xl border-2 border-dashed pointer-events-none',
          isOpenAI
            ? isSiteDark
              ? 'border-[#4d9cff] bg-[#111111] text-[#8ec2ff]'
              : 'border-[#d9d9e3] bg-white text-[#0d0d0d]'
            : isSiteDark
              ? 'border-blue-500 bg-[#1C3F62] text-blue-500'
              : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]',
        )}
      >
          <p className="text-sm flex items-center gap-2">
            <ImageIcon className="size-4 opacity-50" />
            Drop files here to add to chat
          </p>
        </div>
      )}

      {shouldShowSuggestions && (
        <div
          className={cn(
            'absolute bottom-[calc(100%+0.8rem)] left-0 right-0 z-30 mx-auto grid max-w-2xl gap-2',
            isOpenAI ? 'font-openai' : 'font-anthropic',
            isSiteDark
              ? ''
              : isOpenAI
                ? ''
                : 'text-[var(--color-text)]',
          )}
        >
          {visibleSuggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              className={cn(
                'group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
                  isOpenAI
                    ? isSiteDark
                      ? 'hover:bg-white/10 focus-visible:outline-[#4d9cff]'
                      : 'hover:bg-[#f7f7f8] focus-visible:outline-[#0d0d0d]'
                    : isSiteDark
                      ? 'hover:bg-[#d97745]/10 focus-visible:outline-[#d97745]'
                      : 'hover:bg-[var(--color-background-offset)] focus-visible:outline-[var(--color-text)]',
              )}
              onClick={() => {
                setMessage(suggestion.text);
                textareaRef.current?.focus();
              }}
              title={suggestion.text}
            >
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center',
                isOpenAI
                  ? isSiteDark
                    ? 'text-[#9f9f9f] group-hover:text-[#4d9cff]'
                    : 'text-black group-hover:text-black'
                  : isSiteDark
                    ? 'text-[#d97745]'
                    : 'text-[#d97745]',
                )}
              >
                <SuggestionIcon
                  category={suggestion.category}
                  text={suggestion.text}
                  className="h-5 w-5 shrink-0"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    'block whitespace-pre-wrap break-words',
                    isOpenAI
                      ? 'text-sm font-semibold leading-snug tracking-normal'
                      : 'text-sm font-semibold leading-snug',
                  )}
                >
                  {renderHighlightedSuggestion(
                    suggestion.text,
                    message,
                    isOpenAI,
                    isSiteDark,
                  )}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      <div
        onClick={handleComposerClick}
        className={cn(
          'flex min-h-[104px] cursor-text flex-col items-end gap-2 overflow-x-hidden overflow-y-visible rounded-[28px] border p-2 shadow-lg [contain:inline-size]',
          isOpenAI
            ? isSiteDark
              ? 'border-white/10 bg-[#181818] shadow-black/30'
              : 'border-[#d9d9e3] bg-white shadow-[0_2px_10px_rgb(0_0_0_/_8%)]'
            : isSiteDark
              ? 'border-zinc-700 bg-[#30302E]'
              : 'border-[var(--color-border)] bg-[var(--color-surface)]',
        )}
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleMessageChange}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'min-h-[44px] w-full max-h-[160px] resize-none border-none bg-transparent px-3 py-2 text-base leading-[26px] shadow-none outline-none focus:border-none focus:outline-none focus-visible:ring-0 focus-within:border-none focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-0 custom-scrollbar',
            isOpenAI
              ? isSiteDark
                ? 'text-[#f4f4f4] placeholder:text-[#8e8e8e]'
                : 'text-[#0d0d0d] placeholder:text-[#8e8ea0]'
              : isSiteDark
                ? 'text-zinc-100 placeholder:text-zinc-500'
                : 'text-[var(--color-text)] placeholder:text-[var(--color-text-offset)]',
          )}
          rows={1}
        />
        <div className="flex w-full items-center justify-between gap-2 px-1 pb-0.5">
          <div className="flex items-center gap-2">
            <div
              className="relative"
              onClick={(event) => event.stopPropagation()}
            >
              <Button
                ref={addButtonRef}
                size="icon"
                variant="ghost"
                className={cn(
                  'h-9 w-9 p-0 flex-shrink-0',
                  isOpenAI
                    ? isSiteDark
                      ? 'text-[#f4f4f4] hover:bg-white/10 hover:text-white'
                      : 'text-[#5f5f66] hover:bg-[#f7f7f8] hover:text-[#0d0d0d]'
                    : isSiteDark
                      ? 'text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                      : 'text-[var(--color-text-offset)] hover:bg-[var(--color-background-offset)]',
                )}
                onClick={(event) => {
                  event.stopPropagation();
                  setIsAddMenuOpen((isOpen) => !isOpen);
                }}
                disabled={disabled}
                title="Add"
                aria-label="Open add menu"
                aria-haspopup="menu"
                aria-expanded={isAddMenuOpen}
              >
                <Plus className="h-5 w-5" />
              </Button>
              {isAddMenuOpen && addMenuStyle &&
                createPortal(
                  <div
                    ref={addMenuRef}
                    style={addMenuStyle}
                    className={cn(
                      'fixed z-[230] overflow-y-auto rounded-2xl border p-2 text-left shadow-[0_18px_48px_rgb(0_0_0_/_38%)]',
                      isOpenAI
                        ? isSiteDark
                          ? 'border-white/[0.12] bg-[#2f2f2f] text-white'
                          : 'border-[#d9d9e3] bg-white text-[#0d0d0d] shadow-[0_8px_22px_rgb(0_0_0_/_14%)]'
                        : isSiteDark
                          ? 'border-white/[0.12] bg-[#383834] text-[#f2f0ea]'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-[0_8px_22px_rgb(31_25_16_/_14%)]',
                    )}
                    role="menu"
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className={cn('px-3 pb-1 pt-1 text-sm font-semibold', isSiteDark ? 'text-white/[0.52]' : 'text-black/[0.52]')}>
                      Add
                    </div>
                    <button
                      type="button"
                      role="menuitem"
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45',
                        isOpenAI
                          ? isSiteDark ? 'hover:bg-white/[0.08]' : 'hover:bg-[#f4f4f4]'
                          : isSiteDark ? 'hover:bg-white/[0.06]' : 'hover:bg-[var(--color-background-offset)]',
                      )}
                      disabled={files.length >= maxFiles}
                      onClick={() => {
                        setIsAddMenuOpen(false);
                        fileInputRef.current?.click();
                      }}
                    >
                      <FileText className="h-4 w-4 shrink-0 opacity-80" />
                      <span className="min-w-0">
                        <span className="block">Add files</span>
                        {files.length >= maxFiles && (
                          <span className={cn('block text-xs font-medium', isSiteDark ? 'text-white/[0.45]' : 'text-black/[0.45]')}>
                            Max {maxFiles} files reached
                          </span>
                        )}
                      </span>
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45',
                        isOpenAI
                          ? isSiteDark ? 'hover:bg-white/[0.08]' : 'hover:bg-[#f4f4f4]'
                          : isSiteDark ? 'hover:bg-white/[0.06]' : 'hover:bg-[var(--color-background-offset)]',
                      )}
                      disabled={!onVariantChange}
                      onClick={() => {
                        setIsAddMenuOpen(false);
                        onVariantChange?.(isOpenAI ? 'anthropic' : 'openai');
                      }}
                    >
                      {isOpenAI ? (
                        <AnthropicThemeIcon className="h-4 w-4 shrink-0 text-[#d97745]" />
                      ) : (
                        <OpenAIThemeIcon className={cn('h-4 w-4 shrink-0', isSiteDark ? 'text-white' : 'text-black')} />
                      )}
                      <span className="min-w-0">
                        <span className="block">Switch theme</span>
                        <span className={cn('block text-xs font-medium', isSiteDark ? 'text-white/[0.45]' : 'text-black/[0.45]')}>
                          {isOpenAI ? 'Anthropic style' : 'OpenAI style'}
                        </span>
                      </span>
                    </button>
                  </div>,
                  document.body,
                )}
            </div>
          </div>
          <div className="flex min-w-0 items-center gap-2">
            {models && models.length > 0 && (
              <ModelSelectorDropdown
                models={models}
                selectedModel={selectedModel}
                onModelChange={handleModelChangeInternal}
                variant={variant}
                siteTheme={siteTheme}
              />
            )}

            <Button
              size="icon"
              className={cn(
                'h-9 w-9 p-0 flex-shrink-0 transition-colors',
                isOpenAI
                  ? canSend
                    ? isSiteDark
                      ? 'rounded-full bg-white text-black hover:bg-[#ececec]'
                      : 'rounded-full bg-[#0d0d0d] text-white hover:bg-[#2f2f2f]'
                    : isSiteDark
                      ? 'rounded-full bg-white text-black cursor-not-allowed opacity-40'
                      : 'rounded-full bg-[#0d0d0d] text-white cursor-not-allowed opacity-40'
                  : canSend
                    ? 'rounded-md bg-amber-600 hover:bg-amber-700 text-white'
                    : 'rounded-md bg-zinc-700 text-zinc-500 cursor-not-allowed',
              )}
              onClick={handleSend}
              disabled={!canSend}
              title="Send message"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {(files.length > 0 || pastedContent.length > 0) && (
          <div
            className={cn(
              'overflow-x-auto border-t-[1px] p-3 w-full hide-scroll-bar',
              isOpenAI
                ? isSiteDark
                  ? 'border-white/10 bg-[#111111]'
                  : 'border-[#ececf1] bg-[#f7f7f8]'
                : isSiteDark
                  ? 'border-zinc-700 bg-[#262624]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface)]',
            )}
          >
            <div className="flex gap-3">
              {pastedContent.map((content) => (
                <PastedContentCard
                  key={content.id}
                  content={content}
                  isSiteDark={isSiteDark}
                  onRemove={(id) =>
                    setPastedContent((prev) => prev.filter((item) => item.id !== id))
                  }
                />
              ))}
              {files.map((file) => (
                <FilePreviewCard
                  key={file.id}
                  file={file}
                  onRemove={removeFile}
                  isSiteDark={isSiteDark}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        accept={acceptedFileTypes?.join(',')}
        onChange={(event) => {
          handleFileSelect(event.target.files);
          if (event.target) event.target.value = '';
        }}
      />
    </div>
  );
};

export const Component = () => {
  const handleSendMessage = (
    message: string,
    files: FileWithPreview[],
    pastedContent: PastedContent[],
  ) => {
    console.log('Message:', message);
    console.log('Files:', files);
    console.log('Pasted Content:', pastedContent);
  };

  return (
    <div className="min-h-screen w-screen bg-[#262624] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center py-16">
          <h1 className="text-3xl font-serif font-light text-[#C2C0B6] mb-2">
            What&apos;s new, Suraj?
          </h1>
        </div>

        <ClaudeChatInput
          onSendMessage={handleSendMessage}
          placeholder="Try pasting large text or uploading textual files..."
          maxFiles={10}
          maxFileSize={10 * 1024 * 1024}
        />
      </div>
    </div>
  );
};

function SuggestionIcon({
  category,
  text,
  className = 'h-3.5 w-3.5 shrink-0 text-zinc-400',
}: {
  category?: string;
  text: string;
  className?: string;
}) {
  if (text.toLowerCase().includes('contact')) {
    return <Mail className={className} />;
  }

  if (category === 'Work') {
    return <BriefcaseBusiness className={className} />;
  }

  if (category === 'Skills') {
    return <Lightbulb className={className} />;
  }

  if (category === 'Hobbies') {
    return <HeartPulse className={className} />;
  }

  return <BookOpen className={className} />;
}
