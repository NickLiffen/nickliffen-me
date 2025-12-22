---
slug: "building-a-simple-website"
title: "Nick Liffen's Blog | Building a Simple Website | Blog Post"
headline: "Building a simple website"
description: "Nick Liffen's Blog | The importance of building a simple but effective website | Blog Post"
date: "2021-01-21"
modified: "2021-01-31"
keywords:
  - Websites
  - Simple
  - Accessibility
  - Performance
  - Best Practise
image: "https://nickliffen.dev/img/tech.jpg"
sections:
  - Context
  - What I used
  - What I learned from this experience
articleBody: "This dates back to December 2020 over the Christmas break ..."
hasYouTube: false
draft: false
---

## Context

This dates back to December 2020 over the Christmas break when I decided it would be a good idea to start my own technology blog. It is something I have been doing myself for the last few years, but never published publicly. I am lucky enough to work for a company and a role, that gives me opportunities to work with diverse teams (from a technology perspective), meaning I am in a unique position where I see a broad range of technologies and how technology is applied/adopted. My role is leading DevOps & Developer Experience globally for a company called [Lilly](https://www.lilly.com/). Most of my day-to-day tasks involve improving developer momentum and building a community for developers to be successful. This blog represents my thoughts only, and no way represents the company's thoughts that I work for.

This leads me to this website, and the importance of this article's title, building a simple website.

## What I used

"What I used" is somewhat the most crucial section, as it walks through the journey that I went on for building this website and why building "simple" is so important.

JavaScript is by far my most comfortable language, and [VueJS](https://vuejs.org/) being my go-to front end framework. So naturally, I started there. It didn't take me long to have a simple blueprint in place.

I started by using the [VueJS Enterprise Boilerplate](https://github.com/chrisvfritz/vue-enterprise-boilerplate), that comes with some great tools and utils out of the box, and a stable build process with [Nuxt](https://nuxtjs.org/). I built on-top of this blueprint, adding some simple components and style that made my application look like a blog. I was getting ready to publish when my DevOps side came out and thought I should run my blog through [lighthouse](https://developers.google.com/web/tools/lighthouse) to check performance, accessibility and best practice. The results were poor:

- Accessibility was at 65%.
- Performance was at 71%.
- Best Practise was 73%.

The scores above came down to the application having so much going on. Specifically, the performance score was low for a few reasons. A few being: The network payload was 12,210kb, the JavaScript execution time was 1.9 seconds, and the DOM contained 210 elements! I spent a few hours fine-tuning the bundle, reducing a lot of JavaScript "bloat" that wasn't needed, and that did help improve the score, but that made me pause, take a step back, and think, why am I doing this. Why am I spending time fine-tuning an application, with so much bloat, that just shouldn't be needed for my use case? I wanted to build a site where I can share my experiences with others in a comfortable and consumable way. I was overcomplicating the simple. Taking a look at my code base, it already had over 40 files (a lot of these being configuration files, obviously), and the total LOC came over 3000 lines (ignoring the package-lock file). I only had 1 blog post.

This was when I decided to go back to basics and go "old school" with a simple, static HTML and CSS site. Fast forward 55 minutes, I had a simple website built, that meet my use case. The only technologies I used was HTML & CSS, I had no JS, as it just wasn't needed. When running it through lighthouse again, the difference was insane:

- Accessibility was at 95%.
- Performance was at 100%.
- Best Practise was 100%.

The network payload was under 1,000kb, the JavaScript execution time went down to 0.4 seconds, and the DOM size was minimal. In all, there was just so much less pressure on the browser. The number of files totalled 19, and my overall LOC come out under 500 lines. I spent about 20 minutes fine-tuning, but that it.

## What I learned from this experience

What have I learnt from this? In a few words, simplicity is vital. Always think about your use case and what you need to build. Ask yourself, what is the most straightforward path I can take to achieve success. Now, I agree that nowadays, personalised experiences are vital, and dynamic content is the norm. This naturally means front end frameworks like VueJS, React, etc. are the standard and the "go-to". This theory showed as my "go-to" for building this website was VueJS. I didn't even think of anything else, mostly plain HTML. But this isn't, and shouldn't always be the case. I recognise that instead of thinking about the product I was building, my focus went straight to the technology and what I was going to use.

To conclude, building this website has actually been fun. It has made me go back to my roots and write some vanilla HTML. It has made me realise I rely too heavily on third-party frameworks. Finally, it has made me realise that building a performant and optimal website is made easy by starting simple. If this blog expands, moving to a more progressive & dynamic application may be needed, but for now, my simple design meets what I needed to build.
