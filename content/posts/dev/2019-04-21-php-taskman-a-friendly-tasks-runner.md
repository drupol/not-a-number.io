---
date: 2019-04-21
images: 
  - /images/IMG_20190318_122301-01.jpeg
image_copyrights: Image from Pol Dellaiera
tags:
  - php
  - task runner
  - console
title: Taskman, a friendly tasks runner
---
It's been 2 months now that I left aside my regular work with Drupal 8 and switched back to [Atomium development]({{< ref "2017-07-10-a-word-about-atomium" >}}) for Drupal 7.

I will soon publish another post on all the new stuff that has been made there, but for now, I will focus on a side project I've been doing.

Started as a proof-of-concept a couple of weeks ago, Taskman is tasks runner based on [Robo](https://robo.li/), extendable at will through YAML files.

It has been inspired by what's already existing so far, but not tied to Drupal or whatsoever.

<!--break-->

## History

[Taskman](https://packagist.org/packages/phptaskman/core) is a tasks runner written in PHP, for PHP. It's based on Robo, a PHP framework widely used in many communities.

Robo is a console application that list all the available commands that a user can run. Those commands contains tasks that are executed one after the other.

When shipping a `Robofile.php` file in your projects, Robo will provide new commands based on what's inside it.

I invite you to read [the documentation](https://robo.li/extending/) if you want to know more on how to extend it or use it as a framework, just like Taskman does.

The only downside of Robo is that you need to code if you want to provides commands and tasks.

The goal of Taskman is to remove this annoyance and let user defines custom commands in YAML.

Of course, as Taskman is based on Robo, custom commands using PHP could still be created and used.

As YAML is quite friendly, it's rather convenient to define new commands, it's fast and easy.

## Usage

To use Taskman in your project today, two steps are required:

```bash
composer require phptaskman/core --dev
```

Then, create a file `taskman.yml.dist` that contains your custom commands:

```yaml
commands:
  hello-world:
    - ls -la
    - touch example.md
    - ls -la
    - rm example.md
    - ls -la
```

Now, when you run:

```bash
./vendor/bin/taskman
```

Your custom command should be available:

```bash
Taskman dev-master

Usage:
  command [options] [arguments]

Options:
  -h, --help                           Display this help message
  -q, --quiet                          Do not output any message
  -V, --version                        Display this application version
      --ansi                           Force ANSI output
      --no-ansi                        Disable ANSI output
  -n, --no-interaction                 Do not ask any interactive question
      --simulate                       Run in simulated mode (show what would have happened).
      --progress-delay=PROGRESS-DELAY  Number of seconds before progress bar is displayed in long-running task collections. Default: 2s. [default: 2]
  -D, --define=DEFINE                  Define a configuration item value. (multiple values allowed)
      --working-dir=WORKING-DIR        Working directory, defaults to current working directory. [default: "/home/pol/dev/git/taskman/core"]
  -v|vv|vvv, --verbose                 Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug

Available commands:
  hello-world               Run a task.
  help                      Displays help for a command
  list                      Lists commands
```

Taskman includes a mechanism to automatically detects configuration files in the dependencies of your project.

That means that you could have a PHP package that contains only a YAML file with your custom commands, Taskman will find it _automagically_.

## (Almost) real life example

Let's say that your project ship with a file: `taskman.yml.dist` containing:

```yaml
directories:
  build: "build"
  tests: "tests"
  log: "logs"

commands:
  create-directories:
    - mkdir -p ${directories.build}
    - mkdir -p ${directories.tests}
    - mkdir -p ${directories.log}
```

This YAML files provides a single command that contains variables.

If for some reason those variables are not the one you expect, you can still override them manually.

To override manually those variables, you have to create a file `taskman.yml` which should not be committed to your project and ideally added to `.gitignore`.

That file could be:

```yaml
directories:
  tests: "${directories.build}/tests"
  log: "${directories.build}/logs"
```

It's also possible to define more advanced commands, but the documentation is not yet ready.

## Testing framework

I've always been using PHPSpec for unit testing, here Taskman is a kind of plugin for Robo, so I've decided to use [Codeception](https://codeception.com/), mostly for functional tests.

As I don't want to do tests for the Robo plugin stuff (_it's already done in Robo_), simple and functional tests using Codeception was a good choice, I really enjoyed doing it.

I really liked the ease of testing console application, see it by yourself:

```php
<?php

declare(strict_types = 1);

$I = new FunctionalTester($scenario);
$I->wantTo('Check if the executable is found.');
$I->amInPath(\realpath(__DIR__ . '/fixtures/test0'));
$I->runShellCommand('composer install --ansi -n --no-progress --no-scripts --no-dev --no-suggest');
$I->canSeeFileFound('../../../_output/vendor/bin/taskman');
$I->runShellCommand('../../../_output/vendor/bin/taskman');
```

During the making of these, I also noticed that [Composer doesn't allow you to symlink the package source inside it](https://github.com/composer/composer/commit/f85a4a2f5135d813a14c8042ff7bcf1261de11fc).

While trying to get around this by writing my own composer plugin, I found this [socialengine/composer-symlinker](https://packagist.org/packages/socialengine/composer-symlinker) which is exactly doing what I was looking for, this really helped me for the tests.

## Future development

I have quite a few ideas to improve Taskman, but as they are not yet mature, I cannot really implement them.

One of the first idea was to get rid of the Taskman executable (`./vendor/bin/taskman`) and use exclusively the Robo executable (`./vendor/bin/robo`).

After some discussions with [Greg Anderson](https://github.com/greg-1-anderson), it would be possible to do it using [CGR](https://github.com/consolidation/cgr), but I still need to look deeper into it.
