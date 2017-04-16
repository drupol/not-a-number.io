---
layout: post
category: git
title: "Prenez un chewing-gum Emile"
tags : [git, rebase, work, github]
schema: BlogPosting
image: 6333984637_7d08596f9e_b.jpg
image_copyrights: 'Image by <a href="https://www.flickr.com/photos/loughboroughuniversitylibrary/">Loughborough University Library</a>.'
---
{% include JB/setup %}

Lately, I’ve been working with my colleague on a project hosted on Github.

We were working on a specific part, which is a component composed of sub components.

During the development, the parent branch “**master**”, where the feature branch “**feature/feature-198**” is originating from has evolved on its own. Some small bugs were discovered, fixed and merged.

However, you guessed it, some of these commits were needed in the feature branch.

<!--break-->

As always, I try to keep all my branches clean. It means that I try to avoid useless commit logs.

Note, to keep your code and commit log clean, you might have a look at [GrumPHP](https://github.com/phpro/grumphp), thanks to [@netlooker](https://github.com/netlooker) for discovering it, I love it, I use it everywhere now !

And here, I didn’t want to have a pull request polluted with merge commits.

I’ve decided to rebase the feature branch, knowing that we were two working on it.

Here’s what I did:

```
$ git fetch --all
$ git checkout feature/feature-198
$ git rebase origin/master
$ git push origin feature/feature-198 --force
```

Then, my colleague has to commit/push its work.

Unfortunately Git was unable to push the commits because history has diverged and a ```git pull``` was needed to fix the situation.

They did it and so far so good, everything was fine.

Except that we ended up with merge commits and even worse, most of the previous commits were duplicated.

I’ve decided to let it go for this time, knowing that in the end, we would squash everything into a single commit during the merge.

But… we continued to work on that same feature branch the whole day and during the day, the same situation happened.
The parent branch evolved and I needed some of the commits in the feature branch.

I did the same commands as the first time, but this time, I went to my colleague’s computer and issued the following commands:

```
$ git fetch
$ git stash
$ git pull origin/master --rebase
$ git stash pop
```

After playing these commands, I carefully checked with my colleagues if his current uncommitted work was back, and he confirmed that everything was there. The git-stashing worked perfectly.

I was quite confident with these commands until later in the day, my colleague called me in emergency, saying that we shouldn’t work on the same branch next time, and never ever do a rebase either because some of its work was lost.

I felt guilty at first.

I know that doing a rebase on a branch where multiple people is working on is not a good practice, but still, we are developpers and we need to deal with such situations. Git is THE tool that we need to use and understand in order to ensure that what we do is kept somewhere safe.

On the other, even if we shouldn’t do that, we have to learn how to prevent data loss and how to handle that.

This is where the idea of writing a blog post explaining the situation came to my mind to, first get some feedback on what I did, secondly, to share the experience with other colleagues and lastly, to remember how to avoid these errors in the future.

For every good or bad situation we should draw conclusions, and here is what I concluded.

**First**, rebase at the very end, just before merging the feature branch.
If you have to include commits from the parent branch, do one or multiple merges of the parent branch back into the feature branch. It’s ugly, it’s noisy but it’s perfectly safe and sound for everyone.

**Second**, prior doing any commit and push, make sure to do a ```git pull``` first.

**Third**, commit often in order to make sure that your work is saved.
If you start the day at 9am, then, commit every hour or so, then, once or twice per day, push your work.

**Four**, do not be afraid on being many people working on the same branch, Git is a very stable software and it has our back, we can rely on it for keeping our beloved ordered suite of random characters in a safe place.
