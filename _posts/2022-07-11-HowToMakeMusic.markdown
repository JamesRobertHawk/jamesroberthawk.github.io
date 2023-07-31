---
layout: post
title:  "How to make music for your indie game"
date:   2022-07-11 10:20:01 +0000
categories: indiedev update
image: /assets/Images/Blog/Ps1Platformers.jpg
nextpost: "Vertical slice postmortem for Chaos the devil."

---

# Introduction
Game music plays a huge role in generating the correct feel for a game. The best soundtracks help transport the player to through the game world. 

This article discusses my experience creating game music with zero prior musical experience.

It's important to note that I am obviously not an expert, not even close, this is a guide written by the opposite of an expert; a diary of how a music novice went about creating songs. My hope is that my experience can help others in the same boat.

# Why make the music myself
The first thing I want to briefly touch on is that probably the easiest way to get past this problem is to outsource this problem to the experts.

So why bother?

Chaos the Devil is a completely self designed project written atop my custom engine. I enjoy learning and I use my game projects as a way to learn in an applied environment. Music production is a side to game development I have only touched briefly in the past and I want to expand that knowledge.

# My target music style
Chaos the Devil aims to emulate the feel of PS1 3D platformers such as Croc and Crash Bandicoot. Soundtracks from that time, although impressive, are quite simple compared to todays full orchestral game soundtracks.

That said these are not 8bit sounds. The songs consist of real layered instruments and are beloved by many even today, myself included.

I have never written any music before, I am not about to hire an orchestra, what would I even do with one?

# Training my ear
For months, every time I had chance to listen to music, I would listen to soundtracks from PS1 3D platformers. Buying food in the shops, I would rock out to Rachet and Clank. Trying to hush my babies to sleep, I would be listening to creepy Croc dungeons, and walking to buy my 100th daily coffee I would listen to Spyro.

While listening, I challenged myself to try to break down the songs, notice patterns, and hoped that I might be able to emulate the musical tricks.

I listened and focused on a different instruments. Trying to answer: 

1. what sort of beat was it doing? 

2. Was the sound something that looped? 

3. How often did it loop? How many notes did it have?

4. Was the tempo slow or fast? 

Some instruments were easier to understand than others. For example I found melody and percussion simple, but bass and background elements much harder to isolate in my mind.

Patterns started to emerge:

1. Songs were about a minute long, shorter than I imagined.

2. Instruments mostly had two tune patterns that would play during the song, switching at different times.

3. Songs felt like they would deconstruct at points, some instruments muting while the main melody continued. Then they would all return again.

4. Instruments often would steal the melody from one another.

5. Instruments could do what I thought of as a call and response style for the melody. One instrument would play a tune, then the other instrument with usually a much different sound would respond with a similar tune.

6. The songs were clearly matched in mood to the levels, creepy, happy, grand battle. However, many elements would pop up across these song types.

7. There were environment sounds sometimes mashed in with the music, birds singing or water running.

# LMMS
I don't play an instrument and I don't have any music recording equipment. I needed a software package that could help me out.

When I was a kid I remember getting a demo on a CD of a software package for creating dance music called DanceEjay, this probably shows my age.  What you would do is grab little predefined music loops and place them on a timeline to make what you would then say is a song. I was hoping to find whatever the modern equivalent might be.

After some googling I found out that what I was looking for was a DAW (Digital Audio Workstation). This post is not going to go deep into DAW options (there are loads), I will just skip straight to what I used.

LMMS is a bit like the DanceEJay place blocks style production. One difference, you also write the blocks. Good on the one hand that the songs made will actually be original songs, but bad as I had no idea how to do that.

## Baby steps
Every night I have 1 hour free to do gamedev. Before trying to look for any guides I would use that hour to click around and see what things did. I quickly managed to get sounds playing, but the results were terrible, just random drumming and terrible piano sounds.

## Tutorials
I found a great [tutorial series](https://www.youtube.com/watch?v=TrMTlpeSw8Y&list=PLqazFFzUAPc4K1To5JTtR3cskcdRifM1M) I recommend. I now had the basics of how to compose music by placing notes and the basics of how the sounds could be manipulated by the addons.

All songs produced still sounded terrible.

## VSTs
I played around with LMMS for a while and it started to look like I wasn't going to achieve the sound I was hoping for. 

Every instrument I tried to play with just made me sound like I was making a euro dance song. Everything was thumping synth bass with synth melody over the top, a million miles away from the sounds of Croc and Crash. 

I was finally saved when I started playing with VST plugins. VST or Virtual Instrument are fancy ways to package presets which focus on creating types of sounds. For example you may have a VST which attempts to create guitar like sounds and some sound pretty darn good. 

Word of warning here. The sites that host these VSTs are like traveling back in time to virus ridden backwaters of the internet. 

Click with care!

# Deconstructing Croc
Next I attempted to deconstruct one of the tracks from Croc.

I put a simple click beat on and attempted to get the beats to match the tempo of the song by slowly adjusting the track tempo.

Next I simply tried to hear an instrument and copy what was going on.

Finally I experimented with VSTs to try and get a similar sound.

The result was a track that I would describe as: obviously supposed to be the same song, but some sort of slightly discordant deranged version.

I learnt a huge amount from doing this and was energised to continue to the next step.

# 20 Songs in 20 days
Next plan was to create 20 songs in 20 days. The idea was to challenge myself to quickly experiment with song creation and not to get bogged down focusing on one approach.

## Random approach
The first songs I attempted followed a very stab in the dark style. I would randomly add notes to a block, listen back and make adjustments that felt right.

By felt right, I noticed that when listening my mind would conjure certain expectations for what it thought the next notes should be. It probably sounds a bit strange but I relied heavily on this feeling and you may be just as surprised as I was that it's something that you will feel too.

## Planned approach
While making my daily trip to get a morning coffee I hummed little tunes into my phone. Tunes that reminded me of PS1 platformer styles.

I would then listen back and attempt to copy the notes into LMMS blocks. This was far harder than the random approach. Matching the tempo and tone of my humming proved to be much more time consuming and frustrating. However, the approach did produce some good songs.

## Scale approach
I was still watching LMMS tutorials during this time and a very useful feature came up. LMMS allows you to select a scale you want for the song. This highlighted all notes in that scale. 

For example, minor scale notes gave automatic uneasy sounds. Previously I was just using the black notes, but this new style allowed me to produce much better songs.

## Chord progression approach
I expanded to more music generic tutorials and not just LMMS focussed. While most of it was way over my head, one easy addition to my toolkit was using correct chord progression.

By following a simple technique outlined in this video LINK my basslines really improved.

## Which instrument to start with
One great way I found to keep each song really different was to select a different instrument to start with each time.

The effect was massive. Songs I started with choir instruments produced floaty songs, songs which I started with acoustic drums got an upbeat intense feel.

# Conclusion
I successfully created 20 songs in 20 days.

They varied hugely, both in style and quality.

I feel I was able to go from complete novice, to a place where I feel I now have the start of some tracks for my game ChaosTheDevil.

The hardest part was simply sitting down, learning the new bit of software and field.

I was surprised by the feeling my brain knew how these totally new songs should go. Magically having a sense which notes were wong and what should come next. 

Ultimately, I found the whole experience enjoyable and rewarding, and feel my understanding of gamedev strengthened greatly.

The songs I made are a first pass. I expect to improve them with time.