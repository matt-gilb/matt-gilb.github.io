---
title: 'Building my own stealthy eBike'
subtitle: 'How I built my dream eBike from scratch'
layout: "project"
date: 2018-03-30
description: "I've built a super-stealthy, ultralight, single-speed ebike."
featured_image: "/images/projects/ssebike/ssebike-20-leader.jpg"
---

# Building an ultralight, clean, single-speed ebike

If you've checked out my other project articles, you'll know that I have built an ebike before. That bike, was a big, heavy, powerful, and fast ebike. I also [bought an ebike](/electric-bikes/new-ebike/) from Raleigh—which was generally a nice commuter bike—but it wasn't really cutting it for me. It was a little under-powered for how heavy it was. I also made the mistake of getting a frame that was much too big for me. I ended up selling the Raleigh to someone it was better suited for. That left me with the bike I originally built, which I lovingly call "the bull". However the bull wasn't what I really wanted for a daily ride. I wanted something that was as light as possible, had modest power to help up the hills, and that you couldn't really tell it was an ebike.

To give you an idea of what I wanted to build, I was looking at bikes like the [Desiknio Single Speed Urban](https://electricbikereview.com/desiknio/single-speed-urban/) and the [Coboc ONE Soho](https://electricbikereview.com/coboc/one-soho/) which I had learned about over on [Electric Bike Review](https://electricbikereview.com). The problem with these bike were: too expensive, too under-powered, mostly Europe only. I knew I could build something close for much less money. Thus began my build of the "stealth bike".

For this build I had three main criteria:

1. It had to be as light as possible
2. It should be as clean as possible (hiding the fact it had electric assist)
3. It had to be reasonably powerful

---

In order to build a light ebike, you need to start with a light regular bike. I chose to get the "Track" model bike from [6KU](https://www.6ku.com), which I found on [Amazon]( https://www.amazon.com/dp/B018NVR8Q6/ref=cm_sw_em_r_mt_dp_U_yBz.CbPNJ9N7V) for a decent price. As a complete bike, its okay, but not great, but I knew I'd really only be using the frame and a couple other components anyway. So it wasn't a huge deal for me if some of the components were cheap and needed replacing.
__Spoiler:__ I ended up replacing the handlebars, complete front wheel, tires, pedals, and brakes. The rear wheel was also replaced, but because I was installing a rear hub motor. The frame is rock-solid though, and the looks can't be beat.

In keeping with the ultra-light goal, I decided to power this bike with a very small and light(ish) rear hub motor. I ended up going with the now discontinued YT-06 from Xiongda. This motor certainly has it's limitations, but for how small and light it is, it's quite an impressive little motor. The big selling point for me with this motor though was that the manufacturer was willing to make a custom axle for me to fit the 120mm dropout width of my single-speed frame. The manufacturer rates this motor as a 250W motor, but since I was building my own bike just how I wanted, I decided to ignore that. I'm actually running this motor at a variable wattage of between 340W and up to 1000W in short bursts. I typically run it at about 340W, with 930W for the hills, and only tap into the 1000W for the really steep stuff. Now, 930W may sound like a ton of power, but honestly this little motor doesn't pull that hard, and I still have to put a lot of my own effort in when I'm climbing any hills. I'll tell you more about the ride experience below.

A motor is only as good as the controller that feeds power to it, and for this I decided to not cut any corners. To power this motor, I wanted a controller that was powerful, lightweight, small, and waterproof. There was only one controller that checked off all the boxes on my list—that was the [Phaserunner](https://www.ebikes.ca/product-info/phaserunner.html), from Grin Technologies. I won't put you to sleep spouting all of the technical details about this controller here (you can follow the link if you want that), but I'll say that this is a user-programmable controller that uses the very latest in motor control technologies.

To power all of this I needed a battery. I knew I wanted to go with a 48V battery since it was a good compromise on size and power. Unfortunately there aren't any factory-built batteries that are as stealthy as I wanted. So I decided to build my own battery using 18650 cells and a BMS to keep them from overcharging and under-discharging. The battery build was probably the most challenging part of this entire build, but it was really rewarding to have built a battery all my own that was exactly what I needed.

One other challenge I ran into was the throttle for the bike. I initially wanted to use a torque-sensing bottom-bracket, so that I wouldn't need any throttle at all, but these sensors require a bit of compute power, and so rely on a handlebar-mounted display unit. I didn't want that on my bars, so I decided to build a minimalistic button throttle instead. This was a unique challenge because it involved figuring out the voltage input range of the controller, then designing a resister-based button configuration that would supply the correct voltage to the controller for what I wanted the bike to do. I have pics below of how that worked out.

---

## Build images

I know you want to see more pics of the bike and build, so without further ado, here are a bunch of pics of the build process and finished bike.

<div class="gallery" data-columns="3">
	<img src="/images/projects/ssebike/ssebike-1.jpg">
	<img src="/images/projects/ssebike/ssebike-2.jpg">
	<img src="/images/projects/ssebike/ssebike-3.jpg">
	<img src="/images/projects/ssebike/ssebike-4.jpg">
  <img src="/images/projects/ssebike/ssebike-5.jpg">
  <img src="/images/projects/ssebike/ssebike-6.jpg">
  <img src="/images/projects/ssebike/ssebike-7.jpg">
  <img src="/images/projects/ssebike/ssebike-8.jpg">
  <img src="/images/projects/ssebike/ssebike-9.jpg">
  <img src="/images/projects/ssebike/ssebike-10.jpg">
  <img src="/images/projects/ssebike/ssebike-11.jpg">
  <img src="/images/projects/ssebike/ssebike-12.jpg">
  <img src="/images/projects/ssebike/ssebike-13.jpg">
  <img src="/images/projects/ssebike/ssebike-14.jpg">
  <img src="/images/projects/ssebike/ssebike-15.jpg">
  <img src="/images/projects/ssebike/ssebike-16.jpg">
  <img src="/images/projects/ssebike/ssebike-17.jpg">
  <img src="/images/projects/ssebike/ssebike-18.jpg">
  <img src="/images/projects/ssebike/ssebike-19.jpg">
  <img src="/images/projects/ssebike/ssebike-20.jpg">
</div>

## The ride experience

So I'll start right off by saying that this is not a comfortable ride. The posture is very aggressive; you have a lot of weight on your arms and hands. With the skinny 700c x 25c tires you feel every crack and bump in the road. _But_ this is one hell of a fun ride! The bike is light and agile, and it is super responsive. It also balances well, which is all very handy for a dense urban environment. I like the bullhorn bars; they provide a nice blend of hand positions when I don't need the electric assist. But what about the electric stuff? Let's get into that.

The motor is okay overall for what it is. Ultimately I'd like something with a bit more torque—especially from a dead-stop on a hill. If you have momentum, then the motor will help you up a steep hill, but from a stop it only provides modest assist. That being said, its a wonder on flat courses. I guess I'd equate this to a non-ebike that had a good gear range. So I get the looks and simplicity of a single-speed bike with the convenience of a bike that had a full range of gears.

Overall, I am very happy with this build. I love the looks, and how light it is. If I could do it over again, I think I'd do it all the same, but use a slightly more powerful motor. Perhaps that will be in a blog post to come.
