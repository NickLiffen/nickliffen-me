---
slug: "review-ghas-code-scanning-enterprise"
title: "Nick Liffen's Blog | Review of GitHub Code Scanning | Blog Post"
headline: "Review of GitHub Advanced Security Code Scanning in an Enterprise (Part 1)"
description: "Nick Liffen's Blog | Review of GitHub Advanced Security Code Scanning in an Enterprise | Blog Post"
date: "2021-01-30"
modified: "2021-02-01"
keywords:
  - GHAS
  - GitHub Advanced Security
  - Code Scanning
  - Enterprise
  - Nick Liffen
image: "https://nickliffen.dev/img/ghas.jpg"
sections:
  - Context
  - What's Good
  - What's Missing
  - Concluding Thoughts
articleBody: "GitHub recently introduced a suite of new products under an overarching service called GitHub Advanced Security (GHAS). There are three core features as part of GHAS: Code Scanning, Secret Scanning and Dependency Review. In this article, I want to focus on what I would consider the core capability, Code Scanning. Code Scanning is a tool that allows developers to search for potential security vulnerabilities and coding errors in their code."
hasYouTube: false
draft: false
---

## Context

GitHub recently introduced a suite of new products under an overarching service called [GitHub Advanced Security (GHAS)](https://github.com/features/security). There are three core features as part of GHAS: [Code Scanning](https://docs.github.com/en/github/finding-security-vulnerabilities-and-errors-in-your-code/about-code-scanning), [Secret Scanning](https://docs.github.com/en/github/administering-a-repository/about-secret-scanning) and [Dependency Review](https://docs.github.com/en/github/administering-a-repository/about-dependabot-version-updates). In this article, I want to focus on what I would consider the core capability, Code Scanning.

Code Scanning is a tool that allows developers to search for potential security vulnerabilities and coding errors in their code. People may compare this to static application security testing (SAST), or static analysis.

This article assumes some background knowledge of GHAS Code Scanning. The core two sections will focus on what makes Code Scanning stand out amongst similar products and the challenges found so far within an enterprise. Meaning it's recommended reading the following links to get a brief understanding if you are unfamiliar:

- [Securing software, together](https://github.com/features/security)
- [GitHub Code Scanning - your automated security PR review](https://www.youtube.com/watch?v=z0wvGf3O69E)

## What's good?

Critical features when enabling new tools and services within an enterprise are ease of use, and how simple it is for teams to get up and running. This is even more important when introducing new capabilities within the developer ecosystem. It needs to be seamlessly integrated into the developer workflow and configurable via code, not clicks.

GHAS Code Scanning shines here, as all developers have to do is head to the security tab within a repository, click Setup this Workflow within the CodeQL card, and GitHub will auto-create a `codeql-analysis.yml` file. This file contains the process of running Code Scanning within your repository. The setup time per repository on average was 55 seconds.

Furthermore, where GHAS Code Scanning starts to come into its element is its flexibility in configuration. As mentioned above, GitHub will auto-create a `code-analysis.yml` template, with GitHub being smart enough to detect repository languages and core branches (main, dev, etc.) and put these into the template automatically. However, the development team have complete control over how Code Scanning runs, meaning they can change the `code-analysis.yml` to meet their needs. A few examples being:

- **Triggers:** Teams can decide what [events](https://docs.github.com/en/github/finding-security-vulnerabilities-and-errors-in-your-code/configuring-code-scanning#configuring-frequency) Code Scanning triggers on. E.G. Pull Request, Tags, Branches, and even cron jobs. A good tip is to configure Code Scanning to run on all pull requests, and then have a cron job running nightly on the default branch (which usually is your production build). Doing this means if any new security queriers get added to the CodeQL pack running on your repository, but you didn't make any commits to your default branch, the cron job will ensure you are kept updated with any new security vulnerabilities.
- **Auto Build Process:** The way Code Scanning works is to auto-build your application (for compiled languages) automatically following standard build processes. This build process is all handled and abstracted for you using the [GitHub Action - Auto Build](https://github.com/github/codeql-action). However, suppose your repository has some crazy build process which is entirely un-standard (yes, we all know a few of these applications). In that case, you can specify your application build process, and Code Scanning will honour it. Something that other security tools struggle with.
- **Configure the type of scan that suits you:** This is one key feature which I believe goes under the radar. Different types of applications require different levels of acceptance of false positives. For example, if your application is lower risk, you only really want your security tooling to return vulnerabilities that are near 100% accurate. On the other hand, if your application is higher risk, your toleration of possible false positives is higher. GHAS Code Scanning allows you to tailor different "suites" of queries, dependent on your toleration level. If you don't specify a pack, the standard one will be run, which will only return high accuracy vulnerabilities. More information can be found in the following article: [Running additional queries](https://docs.github.com/en/github/finding-security-vulnerabilities-and-errors-in-your-code/configuring-code-scanning#running-additional-queries). The value is enterprises has such a varied range of risk. Most security tools don't have a built-in feature that allows you to configure the type of scan to the application risk acceptance. GHAS Code Scanning changes the game in this aspect.

It isn't just configuration flexibility that makes GHAS Code Scanning an excellent tool; it's the scans' speed. One of the problems seen previously is that scans could take 20-25 minutes when you had a polyglot repository. We found a dual language repository (JavaScript and Python) has an average scan time of 2 minutes and 11 seconds. As applications move to the cloud, and multi-language support becomes the norm, having a security tool that runs at a speed that falls in line with other CI/CD tools will be essential.

The final point to touch on is the fact; it's GitHub. GitHub has built up such a good brand of delivering tooling that focuses on the developer, and we can't ignore that. Security tooling mostly has been very much focused on security, with the comprise of developer experience. GHAS Code Scanning so far has demonstrated that shouldn't be the case and doesn't have to be. There is a happy medium between developer autonomy and enabling a self-service nature, with security policies, processes and rigour.

## What's missing?

If you are reading this and thinking Code Scanning sounds like the tool for you, keep in mind that it's still a maturing tool with feature gaps. Some of the critical problems found so far are:

- **GitHub Contents API (No Support):** One of the areas you may want to explore, to help teams adopt GHAS Code Scanning is building a tool that automatically creates a pull request on every repository with a template `code-analysis.yml` file. Doing this would enable two things, 1) reduce the time for teams to get up and running, as there is a template to get started with 2) encourage more teams to adopt GHAS, as there is an open pull request on their repository needed to be actioned. Both these areas lead to a better experience for application teams and a better security stance for the enterprise. The best way of doing this would be to use the [GitHub Contents API](https://docs.github.com/en/rest/reference/repos#contents) to commit the template file. However, the `.github/workflows` directory (where the template needs to live) is protected from the Contents API, meaning it wouldn't work. GitHub says you need to use a native git client to perform any commits into the `.github/workflow` directory. The annoyance here is if you want to run this serverless, or without an underlying O.S., you can't. If you wanted to run this on AWS Lambda, you would need to do something like [Containers and Lambda](https://aws.amazon.com/blogs/aws/new-for-aws-lambda-container-image-support/). Although this isn't architecturally a poor design, it's simpler to be consistent and use API commands only, versus having to use API calls and bash commands. When you think about unit testing, linting, etc., the moment you start writing bash, it becomes problematic. We overcame this by using the [Child Process Module](https://nodejs.org/api/child_process.html). Overall, if this sounds like something you would be interested in, a tool has been built, and we are in the process of open-sourcing the codebase; I'll post back here when the repository is open.
- **Language Support:** The [languages](https://docs.github.com/en/github/finding-security-vulnerabilities-and-errors-in-your-code/configuring-code-scanning#changing-the-languages-that-are-analyzed) that GitHub support today are the most common, and when they support a language, it is thorough. However, key languages are missing that I would consider critical to support enterprises that likely has a diverse range of languages used. Examples being R, Swift, Kotlin and Rust. R is being used extensively across the statistical analysis and machine learning application world, so I expect to see GitHub support R in the next few languages released. I also hope to see Swift & Kotlin support soon. Mobile apps are still essential, so interested to see support for mobile soon.
- **Permission Model:** GitHub has to change the way permissions are currently handled with GHAS Code Scanning. Most enterprises need a way to add certain security personnel to repositories to monitor, action and closeout vulnerabilities found. Right now, to achieve this, they would have to be given some form of administrative access, which shouldn't be required. Creating a dedicated permission, focused purely on the security section, would allow that de-coupled responsibility away from other features, such as committing, maintaining, etc.
- **Connecting to the rest of the GitHub Ecosystem:** GHAS Code Scanning still has minimal support when you think about how it connects with the wider GitHub Ecosystem. For example, the API support is minimal. There are no webhooks, so for large organisations with loads of repositories, this means lots of clicks. Additionally, there is no in-built way to reference vulnerabilities within GitHub Issues as you can with Pull Requests. I imagine a world where a vulnerability is found; a GitHub Issue is opened, and a conversation sparks between developers and security discussing vulnerability thoughts.

These are the essential items, there are a few more, but if thinking about enabling GHAS, keep in mind the above gaps.

## Concluding Thoughts

I genuinely believe GHAS Code Scanning has the foundation and vision to become a leader within the security space, whilst ensuring developer experience stays a core principle. Code Scanning is built directly into GitHub, which means developers find it easy to locate results and therefore action them. This is a primary behaviour any enterprise wants when introducing a new security tool. I am excited to see Code Scanning mature over the coming months and years. I believe the roadmap is strong. To conclude, GHAS Code Scanning can disrupt the developer ecosystem's security tooling space with the right push from the open-source and enterprise community's. Watch this space!

*I plan to update this blog as new features come out, and the service grows. Part 2 and Part 3 will come in the coming months focused on Secret Scanning & Dependency Reviews.*
