import { useState } from "preact/hooks";

export default function Bio() {
  const [bio, setBio] = useState("long");

  const handleBioChange = (value) => () => {
    setBio(value);
    console.log(bio);
  };

  return (
    <div>
      <label for="f-option" class="l-radio" className="text-teal-500">
        <input
          type="radio"
          id="f-option"
          name="selector"
          tabindex="1"
          value="short"
          checked={bio === "short"}
          onchange={handleBioChange("short")}
        />
        <span>Short</span>
      </label>
      <label for="s-option" class="l-radio" className="text-blue-500">
        <input
          type="radio"
          id="s-option"
          name="selector"
          tabindex="2"
          value="best"
          checked={bio === "best"}
          onchange={handleBioChange("best")}
        />
        <span>Best</span>
      </label>
      <label for="t-option" class="l-radio" className="text-red-500">
        <input
          type="radio"
          id="t-option"
          name="selector"
          tabindex="3"
          value="long"
          checked={bio === "long"}
          onchange={handleBioChange("long")}
        />
        <span>Long</span>
      </label>

      {bio === "short" ? (
        <p class="text-justify font-normal text-sm md:text-lg dark:text-zinc-400 text-zinc-600 leading-relaxed mt-4">
          I'm a tech explorer, bouncing between design, AI, and cloud. It's all
          about making cool stuff and solving puzzles. Always learning, always
          curious. What tech are you geeking out about?
        </p>
      ) : bio === "best" ? (
        <p class="text-justify font-normal text-sm md:text-lg dark:text-zinc-400 text-zinc-600 leading-relaxed mt-4">
          I love making software people actually enjoy using, and figuring out how
          to build the stuff that makes them work. Lately, I'm obsessed with AI
          and cloud automation. it's wild how smart things are getting! I'm
          constantly trying to connect the dots between different tech, and I'm
          always up for learning something new. What kind of tech adventures are
          you getting into?.
        </p>
      ) : (
        <>
          <p class="text-justify font-normal text-sm md:text-lg dark:text-zinc-400 text-zinc-600 leading-relaxed mt-4">
            Hey there, welcome to my little corner of the internet where I jot
            down my tech adventures. Think of it as my digital notebook. I'm
            always bouncing between different things, from making websites look
            good to figuring out how to make computers think smarter.
          </p>
          <p class="text-justify font-normal text-sm md:text-lg dark:text-zinc-400 text-zinc-600 leading-relaxed mt-4">
            You'd find a bit of a creative mess in my digital space. I get a
            real kick out of designing websites that are actually fun to use,
            and I'm always geeking out over the latest design trends. But I also
            love the challenge of building the behind-the-scenes stuff, you
            know, making sure everything runs smoothly. It's like solving a
            really cool puzzle.
          </p>
          <p class="text-justify font-normal text-sm md:text-lg dark:text-zinc-400 text-zinc-600 leading-relaxed mt-4">
            Lately, I've been diving into the world of AI and machine learning.
            It's mind-blowing how smart computers are getting, especially with
            those language models. And because I'm a bit of a lazy
            perfectionist, I'm always looking for ways to automate things.
            That's why I'm so into cloud computing it lets me build stuff that
            just works, without me having to babysit it all the time.
          </p>
          <p class="text-justify font-normal text-sm md:text-lg dark:text-zinc-400 text-zinc-600 leading-relaxed mt-4">
            Basically, I'm on a never-ending learning journey, always trying to
            connect the dots between different technologies. I'm excited to see
            where it all leads, and I'd love to hear about what you're working
            on too!"
          </p>
          <p class="text-justify font-normal text-sm md:text-lg dark:text-zinc-400 text-zinc-600 leading-relaxed mt-4">
            What are your thoughts? What's filling your thought log these days?
            Let's connect and share our tech journeys!
          </p>
        </>
      )}
    </div>
  );
}
