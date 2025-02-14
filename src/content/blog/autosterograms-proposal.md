---
title: Unlocking Hidden Depths, The Art and Science of Autostereograms
description: Process to be used to generate a autostereogram using a unique AI generated pattern with image features.
pubDate: 2024-11-11
updatedDate: 2024-11-11
hero: "~/assets/heros/magic-eye.png"
heroAlt: "Coer of the 'Magic eye' - A new way of looking at the world - Part 1"
tags:
  [
    "Autostereograms",
    "LLMs",
    "AI image generation",
    "AI art",
    "Image generation",
    "Prompt engineering",
    "AI models",
    "Artificial intelligence",
    "Machine learning",
  ]
---

What if the world around you could be hidden in plain sight, waiting to be discovered by your own eyes? Autostereograms offer a fascinating blend of art and science, allowing us to uncover 3D images from flat 2D patterns. In this project, I aim to take this idea a step further by creating custom autostereograms from user-uploaded images. Through innovative techniques like depth estimation, pattern generation, and artificial intelligence, I want to bring the hidden world in your photos to life.

## The Approach: Bringing Images to Life

The core of my project is the generation of autostereograms based on user-uploaded images. Here’s how I do it:

1.  **Depth Map Generation**: To understand the spatial arrangement of objects in the image, I use **MiDaS-small**, a powerful depth estimation model. Trained on real-world images, MiDaS-small generates depth maps that capture the relative distances of objects in the scene.
2.  **Pattern Creation**: Using edge detection, I extract features like dominant colors, textures, and shapes from the image. This step ensures the pattern aligns with the elements of the original photo, preserving the integrity of the 3D structure. I also explore how a prompt can be generated or filled with the values from these extracted features. This might even include asking a large language model (LLM) for suggestions on a good prompt that captures the essential characteristics of the image.
3.  **Bringing the Image to Life with AI**: To add complexity and realism, I use a large language model (LLM) to generate prompts based on the extracted features. These prompts help transform the image into a dynamic pattern that reflects both the depth and the visual characteristics of the original.
4.  **Autostereogram Generation**: Finally, the created pattern is used to generate the autostereogram. When viewed with the correct eye technique, this pattern reveals a hidden 3D version of the uploaded image.

## Pattern Generation: Why It Matters

Pattern generation is crucial for creating an effective autostereogram. It’s not just about creating a visually appealing design — it’s about encoding depth information in a way that the brain can decode.

### Aligning with the Image

By using edge detection and analyzing the colors, textures, and shapes in the image, I ensure that the pattern reflects the original image’s structure and depth. These elements guide the viewer’s eyes, helping them focus on the correct parts of the pattern and unlock the 3D scene.

### Depth Through Design

The pattern is designed to leverage complementary colors and textures to enhance the perception of depth. For example, contrasting textures for closer objects and smoother textures for distant ones ensure that the viewer can perceive the depth transitions effectively. The LLM further enhances the pattern’s complexity, adding nuance and helping create more detailed and accurate autostereograms.

#### Creating Interactive Experiences

Pattern generation opens up the possibility of creating personalized, interactive autostereograms. By aligning the pattern with the user’s uploaded image, I can provide a tailored experience that’s visually rich and engaging. It’s this unique interaction between pattern and viewer focus that makes autostereograms such a fascinating way to explore hidden 3D worlds.

![AI generated cat](https://miro.medium.com/v2/resize:fit:668/format:webp/1*S-KfMMiTcB2smSoNXXzjpg.jpeg)!
_AI generated cat_
[Depth map](https://miro.medium.com/v2/resize:fit:668/format:webp/1*qFMJkeVWrTBnctjIxHsfDA.jpeg)
_Depth Map_
![autostereogram using generated image and pattern](https://miro.medium.com/v2/resize:fit:668/format:webp/1*0St5YYczFTaG7TcymhhLuA.png)
_Autostereogram using generated image and pattern_

for the same cat we have an auto stereogram with generated pattern

![AI generated Pattern](https://miro.medium.com/v2/resize:fit:1000/format:webp/1*BzkNiDztYgFdEP6xN7ZzRw.jpeg)
_AI generated Pattern_
![ Autostereogram](https://miro.medium.com/v2/resize:fit:768/format:webp/1*3ydrZ3CR0cFKBzRZbo5jjQ.jpeg)
_Autostereogram_

### Data Flow

- **Input**: A user-uploaded 2D image (photo, graphic, etc.)
- **Output**: A custom autostereogram that reveals a hidden 3D object or scene when viewed correctly.

### Data Sources

I use **MiDaS-small** to generate depth maps, which are trained on large-scale datasets of real-world images. The pattern generation process uses the extracted features from the image, including colors, textures, and shapes, guided by edge detection algorithms.

### Art Inspiraions

I am interested in exploring the work of artists like Rosie Booth, particularly her recently trending “Rosie Booth Effect,” which has gained attention through a collaboration with singer Rosie on a viral project featuring Bruno Mars, currently trending on YouTube Shorts([Link to the effect](https://www.youtube.com/effect/671be31a-0000-2f77-a677-582429c3b7b4/shorts?bp=8gWDAUKAAQp-CiQ2NzFiZTMxYS0wMDAwLTJmNzctYTY3Ny01ODI0MjljM2I3YjQSJFNSQ0VTdHhOWmJEckRmc0tpdThrWlUtYTdQblF6RTR1Z3ZqbhowdGhpcmRfcGFydHlfNjcxYmUzMWFfMDAwMF8yZjc3X2E2NzdfNTgyNDI5YzNiN2I0) ) . Rosie Booth is renowned for her unique technique of metal perforation, where she creates intricate artworks by puncturing metal sheets to form dynamic three-dimensional effects from two-dimensional images. A key challenge in her process is maintaining the integrity of the metal sheet while achieving these complex visual effects. This innovative approach has inspired me to incorporate similar principles into my own work, particularly in the development of autostereogram-based designs. For reference, Booth’s artistic style can be explored further on her Instagram page. ([here](https://www.instagram.com/rosieboothart/))

![Sample Picture from rosie booth instagram](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*E-yk3X0Z25GTKwkbE6CacQ.jpeg)
_Sample Picture from rosie booth instagram_
I want to recreate the effect making the image hide in perforations.I want to draw the lines around the image highlight/subject and draw. perforations in background areas.

![Rosie Booth effect from Youtube](https://miro.medium.com/v2/resize:fit:1078/format:webp/1*F0yforCv43vkiaNUKMzUng.png)
_Rosie Booth effect from Youtube_
something like the above picture/gif.

## Evaluation

I’ll evaluate the system through subjective user feedback on how effectively the 3D object is revealed and how engaging the autostereogram experience is. Additionally, I’ll use objective measures like depth map accuracy and the clarity of the hidden 3D object to refine the system and ensure high-quality results.

## Impact

If successful, this project could have broad applications:

- **Interactive Art**: Artists could create dynamic, interactive pieces where hidden details emerge through the viewer’s focus.
- **Education**: It could serve as an engaging tool for teaching depth perception and 3D imaging.
- **Virtual Reality**: Autostereograms could add hidden layers of depth in virtual environments.
- **Accessibility**: People with visual impairments could experience depth in a new way, without the need for specialized equipment.

This project has the potential to change how we interact with images and art, making the experience more immersive and meaningful.

## Conclusion

Autostereograms remind us that there’s more to see than meets the eye. By using advanced techniques in depth estimation, pattern generation, and AI, We will be able to unlock hidden 3D worlds within everyday images. This project is about more than just creating illusions — it’s about exploring new ways to perceive, interact with, and experience the world.
