import React, { useState, useRef, useEffect } from "react";
import { VideoIcon, Newspaper, Play, Pause, SkipBack, SkipForward, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const podcasts = [
  {
    id: 1,
    title: "Understanding Accessibility",
    episode: "Episode 1",
    duration: "32 min",
    image: "/lovable-uploads/3a00a201-c1ea-4ef2-b3a5-cc25c9a6aa29.png",
  },
  {
    id: 2,
    title: "Sign Language Basics",
    episode: "Episode 2",
    duration: "45 min",
    image: "/lovable-uploads/efa0a8cc-c777-43c9-9eb9-dbf9f72e92a8.png",
  },
  {
    id: 3,
    title: "Tech for Inclusivity",
    episode: "Episode 3",
    duration: "28 min",
    image: "/lovable-uploads/5bd02c50-2c1b-4d5d-b578-4b192bc6685f.png",
  },
];

const articles = [
  {
    id: 1,
    title: "New Advancements in Sign Language Recognition Technology",
    date: "May 15, 2023",
    content: "Recent breakthroughs in computer vision are making sign language recognition more accurate and accessible than ever before.",
    url: "#",
  },
  {
    id: 2,
    title: "How AI is Transforming Accessibility Tools",
    date: "April 22, 2023",
    content: "Artificial intelligence is revolutionizing accessibility tools, making them more intuitive and personalized for users with diverse needs.",
    url: "#",
  },
  {
    id: 3,
    title: "Government Launches New Schemes for Specially Abled Individuals",
    date: "March 10, 2023",
    content: "A comprehensive look at the latest government initiatives aimed at supporting and empowering the specially abled community.",
    url: "#",
  },
  {
    id: 4,
    title: "The Evolution of Assistive Technology",
    date: "February 5, 2023",
    content: "From simple tools to sophisticated digital solutions, explore how assistive technology has evolved over the decades.",
    url: "#",
  },
];

const AudioPlayer = ({ audioSrc, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.src = audioSrc || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

    const onLoaded = () => setDuration(audio.duration);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioSrc]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => {
        toast.error("Playback failed.");
      });
      setIsPlaying(true);
      toast.success(`Now playing: ${title}`);
    }
  };

  const skip = (delta) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + delta));
  };

  const onSeek = (e) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const format = (t) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-4">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-white">{title}</span>
          <span className="text-xs text-gray-400">{format(currentTime)} / {format(duration)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={onSeek}
          className="w-full"
        />
        <div className="flex justify-center items-center space-x-4">
          <button onClick={() => skip(-10)} className="p-2 rounded-full hover:bg-white/20">
            <SkipBack size={20} className="text-white" />
          </button>
          <button onClick={togglePlay} className="p-2 rounded-full bg-white/20 hover:bg-white/30">
            {isPlaying ? <Pause size={20} className="text-white"/> : <Play size={20} className="text-white" />}
          </button>
          <button onClick={() => skip(10)} className="p-2 rounded-full hover:bg-white/20">
            <SkipForward size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

const PodcastCard = ({ title, episode, duration, image }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
      <div className="aspect-video">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        <p className="text-gray-300 text-sm mb-4">{episode} • {duration}</p>
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-center gap-2 py-2 border border-white/20 rounded-md hover:bg-white/20"
        >
          <Play size={16} className="text-white" />
          <span className="text-white text-sm">{open ? 'Hide Player' : 'Play Episode'}</span>
        </button>
        {open && <AudioPlayer audioSrc="https://www.youtube.com/watch?v=xhLmgYgi9dI" title={`${title} - ${episode}`} />}
      </div>
    </div>
  );
};

const ArticleCard = ({ title, date, content, url }) => (
  <div className="bg-white/5 p-4 rounded-lg">  
    <p className="text-gray-400 text-xs mb-1">{date}</p>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300 mb-3">{content}</p>
    <a href={url} className="inline-flex items-center text-white hover:text-gray-200">
      <span className="mr-1">Read more</span>
      <ArrowRight size={16} />
    </a>
  </div>
);

const MultimediaContent = () => (
  <div className="mt-8 space-y-12">
    <section>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <VideoIcon size={24} /> Podcasts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {podcasts.map(p => <PodcastCard key={p.id} {...p} />)}
      </div>
    </section>
    <section>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Newspaper size={24} /> Articles & News
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map(a => <ArticleCard key={a.id} {...a} />)}
      </div>
    </section>
  </div>
);

export default MultimediaContent;
