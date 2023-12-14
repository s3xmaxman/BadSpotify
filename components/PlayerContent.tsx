"use client";

import useSound from 'use-sound';
import { useEffect, useState, useRef } from "react";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BsRepeat1 } from "react-icons/bs";

import { Song } from "@/types";
import usePlayer from "@/hooks/usePlayer";

import LikeButton from "./LikeButton";
import MediaItem from "./MediaItem";
import Slider from "./Slider";
import Seekbar from './Seekbar';


interface PlayerContentProps {
  song: Song;
  songUrl: string;
}

const PlayerContent: React.FC<PlayerContentProps> = ({ 
  song, 
  songUrl
}) => {
    const player = usePlayer();
    const [volume, setVolume] = useState(0.1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);
    const [playbackTime, setPlaybackTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const isRepeatingRef = useRef(isRepeating);

   

    // 再生状態に応じてアイコンを切り替えます。
    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    // 音量状態に応じてボリュームアイコンを切り替えます。
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

    const onPlayNext = () => {
      if (player.ids.length === 0) {
        return;
      }
  
      const currentIndex = player.ids.findIndex((id) => id === player.activeId);
      const nextSong = player.ids[currentIndex + 1];
  
      if (!nextSong) {
        return player.setId(player.ids[0]);
      }
  
      player.setId(nextSong);
    }
  
    const onPlayPrevious = () => {
      if (player.ids.length === 0) {
        return;
      }
  
      const currentIndex = player.ids.findIndex((id) => id === player.activeId);
      const previousSong = player.ids[currentIndex - 1];
  
      if (!previousSong) {
        return player.setId(player.ids[player.ids.length - 1]);
      }
  
      player.setId(previousSong);
    }

    
    const [play, {
      pause,
      sound,
      duration: soundDuration,
      stop
     }] = useSound(
      songUrl,
      { 
        volume: volume,
        loop: isRepeating,
        onplay: () => setIsPlaying(true),
        onend: () => {
          setIsPlaying(false);
          if (!isRepeatingRef.current) {
            onPlayNext();
          } else {
            play();
          }  
        },
        onpause: () => setIsPlaying(false),
        format: ['mp3'],
        onload: () => setDuration(soundDuration), // ロード時に総時間をセット
      }
     );

     useEffect(() => {
      isRepeatingRef.current = isRepeating;
    }, [isRepeating]);
    

  
     
    const formatTime = (seconds: number): string => {
      const pad = (num: number, size: number): string => num.toString().padStart(size, '0');
      const minutes = pad(Math.floor(seconds / 60), 2);
      const secondsLeft = pad(Math.abs(Math.floor(seconds % 60)), 2); 
      return `${minutes}:${secondsLeft}`;
      };
      
      const currentTime = formatTime(playbackTime);
      const remainingTime = formatTime(duration - playbackTime);

      useEffect(() => {
        const interval = setInterval(() => {
          if (sound?.playing()) {
            setPlaybackTime(Math.round(sound.seek()));
          }
        }, 1000); // 1秒ごとに更新
      
        return () => {
          clearInterval(interval);
        };
      }, [isPlaying, sound]);
      
       
    // コンポーネントがアンマウントされるときにサウンドをアンロードします。
      useEffect(() => {
          sound?.play(); // サウンドがあれば再生します。
          
          return () => {
          sound?.unload(); // コンポーネントのクリーンアップ時にサウンドをアンロードします。
          }
      }, [isPlaying, sound]);


     // 再生ボタンのハンドラです。再生中ではない場合は再生を開始し、そうでなければ一時停止します。
     const handlePlay = () => {
      if (!isPlaying) {
        play();
        } else {
        pause();
      }
    }  
       

    // ミュート切り替え関数です。現在ミュートされていれば音量を戻し、そうでなければミュートします。
    const toggleMute = () => {
        if (volume === 0) {
        setVolume(0.1);
        } else {
        setVolume(0);
        }
    }

    const toggleRepeat = () => {
      setIsRepeating(!isRepeating);
      console.log('Repeat status changed to:', !isRepeating);
    };

    return ( 
      <div className="grid grid-cols-2 md:grid-cols-3 h-full">
          <div className="flex w-full justify-start">
            <div className="flex items-center gap-x-4">
              <MediaItem data={song} />
              <LikeButton songId={song.id} />
            </div>
          </div>
  
          <div 
            className="
              flex 
              md:hidden 
              col-auto 
              w-full 
              justify-end 
              items-center
            "
          >
            <div 
              onClick={handlePlay} 
              className="
                h-10
                w-10
                flex 
                items-center 
                justify-center 
                rounded-full 
                bg-white 
                p-1 
                cursor-pointer
              "
            >
              <Icon size={30} className="text-black" />
            </div>
          </div>
  
          <div 
            className="
              hidden
              h-full
              md:flex 
              justify-center 
              items-center 
              w-full 
              max-w-[722px] 
              gap-x-6
            "
          >
            <span>{currentTime}</span>
            <AiFillStepBackward
              onClick={onPlayPrevious}
              size={30} 
              className="
                text-neutral-400 
                cursor-pointer 
                hover:text-white 
                transition
              "
            />
            <div 
              onClick={handlePlay} 
              className="
                flex 
                items-center 
                justify-center
                h-10
                w-10 
                rounded-full 
                bg-white 
                p-1 
                cursor-pointer
              "
            >
              <Icon size={30} className="text-black" />
            </div>
            <AiFillStepForward
              onClick={onPlayNext}
              size={30} 
              className="
                text-neutral-400 
                cursor-pointer 
                hover:text-white 
                transition
              " 
            />
          <BsRepeat1
            onClick={toggleRepeat}
            size={25}
            className= "text-neutral-400 cursor-pointer hover:text-white transition" 
            style={{color: isRepeating ? 'green' : 'white'}}
          />
          </div>
      
          <div className="hidden md:flex w-full justify-end pr-2">
            <div className="flex items-center gap-x-2 w-[120px]">
              <VolumeIcon 
                onClick={toggleMute} 
                className="cursor-pointer" 
                size={34} 
              />
              <Slider 
                value={volume} 
                onChange={(value) => setVolume(value)}
              />
            </div>
          </div>
        </div>
     );
  
}
 
export default PlayerContent;