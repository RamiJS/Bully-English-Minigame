"use client";

import React, { useEffect, useState } from 'react';
import { ApiResponse } from '../page';
import ValidateAnswerStore from '../hooks/ValidateAnswer';

import { MdShuffle } from "react-icons/md";
import toast from 'react-hot-toast';
import { useRandomFailureMessage, useRandomSuccessMessage, useRoastTFOUTTAUser } from '../hooks/useNoti';

interface Props {
  items: ApiResponse;
}

const Question = ({ items }: Props) => {
  const { setSubmittedAnswers, submittedAnswers, started, currentQuesiton } = ValidateAnswerStore()

  // handle duplicated puzzle letters
  let letters = items.items[currentQuesiton]['Letters Given'].split(' ').map((letter, index, array) => {
    if (array.indexOf(letter) !== index) {
      return letter.toLowerCase();
    }
    return letter;
  });
  let [givenLetters, setGivenLetters ] = useState(letters)

  // update letter
  useEffect(() => {
    setGivenLetters(letters)
  }, [currentQuesiton])

  const [hashmap, setHashmap] = useState(new Map());
  const chosenLetters = Array.from(hashmap.values());

  let formattedWords = items.items[currentQuesiton].Words.split(' ').map(word => word)

  
  const [failureCount, setFailureCount] = useState<number>(0);
  function handleSubmit(chosenLetter: string[]) {
    let submitted = chosenLetter.join('');
    if(submitted.length == 0) return;


    submitted = submitted.toUpperCase();

    if(submittedAnswers.includes(submitted)) {
      toast("You have already submitted this answer", {
        icon: "🧐"
      })
      setHashmap(new Map());
      return 
    }

    if (formattedWords.includes(submitted)) {
      setSubmittedAnswers(submitted)
      setHashmap(new Map());
      toast(useRandomSuccessMessage(), {
        icon: "🥰"
      })

      // reset the count
      setFailureCount(0)
    } else {
      // Handle Failure
      setHashmap(new Map());
      setFailureCount((prev) => prev + 1)
      
      // Handle if user is braindead
      if(failureCount < 2){
        toast(useRandomFailureMessage(), {
          icon: "😅"
        })
      } else {
        toast(useRoastTFOUTTAUser(submitted), {
          icon: "💀"
        })
      }

    }
  }


  const isBlurred = !started ? "blur-[6px] pointer-events-none" : "";

  return (
    <div
      className="relative top-1/2 left-1/2 
    -translate-x-1/2 -translate-y-1/2 w-[16rem] 
    h-52 flex flex-col justify-between items-center 
    gap-14"
    >
      <div className="">
        {givenLetters.map((letter, index) => (
          <span
            key={index}
            style={{
              position: "absolute",
              left: hashmap.get(index) === letter ? chosenLetters.indexOf(letter) * 50 : index * 50,
              top: hashmap.get(index) === letter ? index + 100 : 50,
            }}
            className={`text-4xl uppercase hover:text-yellow-500 cursor-pointer transition-all duration-300 ${isBlurred}`}
            onClick={() => {
              let newHashMap = new Map(hashmap);
              newHashMap.set(index, letter);
              setHashmap(newHashMap);

            }}
          >
            {letter}
          </span>
        ))}
      </div>
      <div className="flex flex-row gap-2">
      <button
      className={`rounded-lg bg-transparent border border-black/5 hover:bg-black/5 focus:scale-95
      transition-all duration-300 px-4 text-lg ${isBlurred}`}
        onClick={() => {
          const scrambledLetters = [...letters];
          for (let i = scrambledLetters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [scrambledLetters[i], scrambledLetters[j]] = [scrambledLetters[j], scrambledLetters[i]];
          }
          setGivenLetters(scrambledLetters);
        }}
      >
        <MdShuffle />
      </button>
        <button
          className={`rounded-lg bg-black focus:scale-95
          transition-all duration-300 text-white py-2 px-4 text-3xl ${isBlurred}`}
          onClick={() => {
            handleSubmit(chosenLetters);
          }}
        >
          Enter
        </button>
      </div>
    </div>
  );
};

export default Question;