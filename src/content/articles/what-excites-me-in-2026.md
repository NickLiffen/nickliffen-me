---
slug: "what-excites-me-in-2026"
title: "Nick Liffen's Blog | What am I most excited about going into 2026 when it come to AI in Software Development? | Blog Post"
headline: "What am I most excited about going into 2026 when it come to AI in Software Development?"
description: "Nick Liffen's Blog | What am I most excited about going into 2026 when it come to AI in Software Development? | Blog Post"
date: "2026-01-09"
modified: "2026-01-09"
keywords:
  - Nick
  - Liffen
  - AI
  - Copilot
  - Software Development
image: "https://nickliffen.dev/img/ghas.jpg"
sections:
  - Introduction
  - AI moves upstream. Planning and brainstorming become first class to writing software
  - Agents operate at repo, service, and system level
  - Reusable expertise through custom agents & skills 
  - AI becomes more of a continuous presence across the SDLC
  - Orchestration/Experiences around agents/skills becomes a core developer driver
  - Conclusion
articleBody: "2025 was another year of change for us who work in software development. New tools, new ideas, a lot of opinions, and no shortage of skepticism along the way! (It felt like everyone had a take, which personally, I love, it shows people care, and have thoughts they want to share). 2026 will probably look similar in that sense. But I also think it’s shaping up to be a year of opportunity. Not just to move faster, but to do things better. Now, looking ahead 6 or 12 months in this space is always risky (and bit of fun!). Things move quickly, new capabilities come to light, and by the end of the year some of this might look massively optimistic, or completely wrong, that’s part of the fun. Even with that, I wanted to put a few thoughts down on what I’m most excited about as we head into 2026. These aren’t predictions or a grand vision of the future. Just five areas where I think things could get interesting, and where I’m personally excited to see how AI continues to shape how we build software."
hasYouTube: false
draft: false
---

## Introduction

2025 was another year of change for us who work in software development. New tools, new ideas, a lot of opinions, and no shortage of skepticism along the way! (It felt like everyone had a take, which personally, I love, it shows people care, and have thoughts they want to share). 2026 will probably look similar in that sense. But I also think it’s shaping up to be a year of opportunity. Not just to move faster, but to do things better. Now, looking ahead 6 or 12 months in this space is always risky (and bit of fun!). Things move quickly, new capabilities come to light, and by the end of the year some of this might look massively optimistic, or completely wrong, that’s part of the fun. Even with that, I wanted to put a few thoughts down on what I’m most excited about as we head into 2026. These aren’t predictions or a grand vision of the future. Just five areas where I think things could get interesting, and where I’m personally excited to see how AI continues to shape how we build software :) 

And to tease you into reading all of them, number five is the one that I am most looking forward to this year :) 

## AI moves upstream. Planning and brainstorming become first class to writing software

One of the areas I’m most excited about is AI moving earlier in the SDLC, specifically around brainstorming (aka researching) solutions, and then turning that thinking into a plan (or a spec). I see these as two problems to solve, not one. They need different experiences, but when they’re done well, they improve everything downstream, especially coding. 

In 2025, we started to see some of this. VS Code introduced plan mode, Claude added support for planning, and we saw the rise of spec driven development. All of that feels like the right direction. But In 2026, I think this goes further. 

One of the reasons agent mode in the IDE and coding agents still struggle to land is that we often interact with them as if the plan already exists, or as if it’s already obvious to the agent. We assume it understands the right approach and that the solution we’ve hinted at is the correct one. The reality is, we’re just not quite there yet from a technology standpoint.

A prompt to an agent might look something like this: 

“I’ve been given a task to add a search experience to this application. This is the file where search needs to live. Update the right files to include search.” 

The agent goes off and does its thing. It usually gets you 40% of the way there. Then comes the back and forth to get it to 60%, 80%, and beyond. What’s missing here isn’t better code generation. It’s everything before that. Framing up the right context upfront. And with that, from what I see, there are two gaps that will improve in 2026:

- First, in the example above, what’s actually the right way to implement search in this application? Has search already been solved somewhere else in the organisation? Is there existing functionality in this codebase we should be building on? Developers should be able to research and brainstorm together, with AI as part of that conversation. That means pulling in context from other repositories across the organisation, best practices from the web, and any custom instructions or constraints that matter. All of that combined helps arrive at a solution that’s more data driven and far more likely to be the right one. This isn’t about jumping straight to a spec. It’s about having a shared space to think, explore options, and pressure test ideas, so the team can land on the right solution the first time around.

- Second, once you’ve landed on the right solution, you need to break it down. Turn it into stages, steps, and a plan. A spec, effectively. Something explicit enough that an agent can actually follow. That could mean a parent issue that lays out the full approach, with a set of smaller sub issues underneath it. Each sub issue focuses on one clear piece of work, written in a very single purpose way. In a realistic example, that spec might result in seven issues, all rolled up under one parent. That then kicks off seven separate coding agent runs. Each agent understands the bigger picture, but is hyper focused on solving one specific part of the plan. At the same time, it can take context from the other issues, so it’s aware of what else is happening around it. We already know agents are better when they can obsess over one thing and do it well. This approach lets them do exactly that, without losing sight of the wider system they’re contributing to.

Yes, this adds time upfront. But that time pays for itself. It helps ensure the problem is being solved in the right way, and it gives agents the structure they need to do better work. Instead of getting to 40% on the first pass, you’re starting closer to 80% or 90%. Will it ever be 100%? Probably not in 2026. But it’s an improvement over where we are today. 

Because of this, I expect to see more use of AI upstream in 2026, especially around brainstorming and planning. And I’m excited to see how much that improves everything that comes after it in the SDLC :) 

A quick side note. Do I think planning and brainstorming stay this important forever? Hard to say. Looking ahead to 2027 or 2028 feels a bit wild. But as coding agents get better, gain more context, and handle more complexity, some of this might become less important. That said, I don’t think planning and brainstorming ever go away completely. At least for the next few years, they feel like the key to unlocking much better outcomes from agents.

## Agents operate at repo, service, and system level

Leading on from that, I think 2026 is the year coding agents start to work at scale, especially in codebases that already exist. 

2025 was the year coding agents came to market!! We saw some product market fit emerge, along with some useful workflows. Agents could take on larger problems than agent mode in the IDE, and in the right scenarios, they worked well. That “right scenario” today is mostly greenfield work. New applications, new services, or relatively small and clean repositories. That’s still valuable, we shouldn’t shy away from that, but it’s not how most software actually looks, right?. Most codebases are brownfield. They’ve been around for years. They’ve evolved. They carry decisions, trade offs, and more than a little historical knowledge and information. This is where coding agents today can struggle. They work, but not consistently. They’re great at solving parts of the problem, but lack the ability to go deep on a complex issue. 

I think that starts to change in 2026. Over the next year, I expect coding agents to get better at working inside long lived, complex projects. Better at understanding structure, better at respecting existing patterns, and better at knowing what not to touch. I also expect them to lean more heavily on quality signals in real time, using tests, checks, and feedback loops to course correct as they go, rather than after the fact. Yes, better integration layers will help. Yes, access to more context and richer signals will matter. When coding agents can operate confidently at repo, service, and even system level in brownfield codebases, that’s when they stop feeling like an experiment and start feeling genuinely valuable. 2026 is going to take a big step in that direction. I don’t think they will be perfect, but a good improvement. 

## Reusable expertise through custom agents & skills

2025 was very much the year of agents. Or maybe more accurately, the year of agentic experiences. In 2026, what I’m most excited about is what happens when those agents become easier to extend, customise, and reuse.

It’s great that first party agents exist and cover a lot of common use cases out of the box. But where things get really interesting is when teams can create smaller, more focused agents or skills that solve one specific problem, but really really well. Things like a migration helper, a refactor specialist, or a release checklist assistant. Narrow in scope, opinionated by design, and built to be reused easily.

What excites me most here is the idea of building expertise once, and then benefiting from it repeatedly. Anyone who’s spent time writing prompts, detailed instructions, wiring up integrations with MCP, or figuring out the right way to guide an agent knows this takes effort. Doing it well isn’t easy. But once that work is done, and done well, the value is there.

That upfront investment shouldn’t be lost every time someone starts from scratch. Being able to package that knowledge into a reusable skill or custom agent, and then share it across a team or an organisation, feels like a big value add. On top of that, add a marketplace style experience, where people can discover, reuse, and build on each other’s work, and it starts to scale in a powerful way.

For me, 2026 feels like the year where we shift away from giant, do everything agents, and toward smaller building blocks that can be composed together. When it becomes easier to get started with these reusable components, and easier to extend them over time, I think we’ll see a lot more meaningful adoption. Less friction, more leverage, and far more consistency in how teams apply their expertise.

This is very much the case in organisations or enterprises. 

## AI becomes more of a continuous presence across the SDLC

Building on the theme in section 1, one of the things I’m most excited about in 2026 is AI becoming more native across the rest of the SDLC, not just in the “write code” part.

AI has already been a force multiplier for coding. Tools like Copilot, Claude, and Cursor make it easier to produce code faster, and for many developers that’s been a change in productivity. But there’s a knock on effect, right? More code doesn’t just mean more output. It also means more planning, more to review, more to test, more to secure, and more to operate. You don’t get to skip the rest of the SDLC just because the first bit got faster.

This is where the enterprise angle gets real. For an individual developer working on a small project, “more code, faster” can be the whole story. But inside larger teams, getting code to production still means following the SDLC. Reviews still matter. Security still matters. Release processes still matter. Ops still matters. If anything, AI accelerating code creation makes the later steps feel even more important, because they’re the part that can become the bottleneck.

So with all that said, what I’m excited about in 2026 is AI starting to show up more naturally in those downstream areas. Helping with review, security, and operations in a way that feels integrated. We got early signals of this in 2025 with AI code review experiences starting to hit the market. I expect and hope that expands, with AI becoming more useful in other areas like validating changes, surfacing risk earlier, explaining trade offs, and helping teams move changes through the pipeline with less friction.

For me, the big value add isn’t just “AI helps me write code.” It’s “AI helps me ship software.” AI working across the SDLC end to end, that’s when we start to see the real value for developers and teams.

## Orchestration/Experiences around agents/skills becomes a core developer driver

With all of that said, if more agents show up, skills become more common, and AI is present across the SDLC, what’s left?

For me, this is where 2026 gets really interesting, the experience that enables developers to actually thrive with all of this.

Humour me for a second and assume the previous sections come true. AI helps with planning and brainstorming. Coding agents get better and start working confidently in larger, more complex codebases. Developers are using more skills, and AI shows up across every stage of the SDLC. On paper, that all sounds great.

In practice, it also sounds, chaotic.

Developers could be brainstorming three different solutions in one place, planning multiple approaches in another, kicking off dozens of coding agent runs, writing code in their IDE for the parts they care most about, reviewing a pile of pull requests, fixing vulnerabilities, and still trying to ship features and bug fixes on time. That’s a lot to juggle, and it’s very easy for it to turn messy.

Where is a task actually in its journey to production? Is it still being planned? Is it in review? Is an agent working on it asynchronously, or does it need a developer decision right now? And out of everything in flight, what actually needs the developer’s attention now?

This is why I think, again, just personal thoughts, 2026 becomes a year where we focus much more on orchestration and experiences of these agents/skills. 2026 won’t just be about releasing more agents or more skills, but building the glue that makes them work together, makes them more usable. Experiences that help developers and teams coordinate work across humans and agents, without losing track of what’s happening or who’s responsible for what.

What excites me is the idea of experiences where a developer can spin up a piece of work, pull in teammates, bring in the right agents or skills, and then move smoothly through brainstorming, planning, and execution. Brainstorming feeds naturally into a plan. A plan kicks off multiple coding tasks. Some run asynchronously with agents, others are handled directly by developers. From there it goes into reviewing, securing, and quality checks, then naturally into production. Everything stays connected, visible, and understandable.

Right now, I think the industry does a decent job of giving developers choice. Lots of tools, lots of agents, and lots of capabilities. What we don’t do well yet is coordination. Moving from one stage to the next isn’t easy. Knowing when you’re needed isn’t always obvious. Understanding what’s happening across all your in flight work can be harder than it should be.

Is the industry going to get this perfect in 2026? Definitely not. But I do think we’ll see a shift toward lowering friction and improving the experiences that sit around agents and skills. And when that starts to come together, that’s when all of this really begins to feel powerful, not overwhelming.

That’s the part I’m most excited about :) 

## Conclusion

Looking 12 months ahead in this space is always a bit of a shot in the dark :) Things move fast, ideas evolve, and what feels obvious today can look very different tomorrow. That said, 2025 felt like a step forward, and 2026 has the potential to be even more interesting. What excites me most is not any single tool or capability, but the direction we’re heading as an industry. AI is starting to show up in more thoughtful, more useful ways, and we’re beginning to focus on experiences that actually help developers do their best work. Some of this will land, some of it won’t, and that’s okay. But if even a few of these areas move in the direction I’m hoping for, 2026 is going to be a fun year to be building software :) 
