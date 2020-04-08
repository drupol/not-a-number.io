---
date: 2012-07-02
images: 
  - /images/losing_money.jpg
image_copyrights: Image from [buzzghana.com](http://buzzghana.com/50-foolish-ways-lose-money-daily-ghana/).
subtitle: It doesn't means that Drupal is not ready for companies ;-)
tags:
  - drupal
  - work
title: Why companies are not ready for Drupal?
---
I have been working for more than five years now, as a consultant in Belgium.

I'm sailing from company to company, from building to building, and my clients are mainly large companies with 1500+ people, some others are smaller.

Usually hired as a senior developer or project manager, I'm helping those companies to have a successful Drupal experience.

<!--break-->

Sometimes my work consists of guiding a team and giving them the best practices around web development and Drupal, sometimes it consists of creating customs modules to fulfill their needs.

Most of the time, I enjoy my work. I enjoy meeting people, having a talk with people in the business is always a two ways interesting exchange. I enjoy being in the loop and use the latest right technologies on my projects.

As long as I learn new stuff everyday and I as long as I can share it with people and make them happy, I'm happy.

Working in the web and especially Drupal requires a couple of skills. You have to be able to work on Linux, setup a webserver and understand how it works, understanding PHP and managing databases and how they works and if you're lazy, you'll use extensively a tool called Drush.

Working with all those technologies requires the knowledge of other sub tools like SSH, Bash, a command line editor, an IDE, etc etc... 

When you work alone, on your own server, all those tasks are done by yourself.

From changing directory rights to create backup and editing your content, all those tasks are done by you, only you.

You don't have to wait to have the permission from someone nor explain to some other guys who doesn't understand Drupal, why you're doing that. In short, you don't lose time.

I've tried to list the pro and cons of working alone, here they are...

The cons are:

- You're alone, on your own. 

The pros are:

- No need to delegate the task to others.people. 
- No need to waste time filling out useless paper. 
- No need to count on someone else to do it. 
- No need to ask someone to make the task a priority. 
- There's nobody else to blame if something fails. 
- Almost no need to document what you do even if it's strongly advised. 

When you work in team, it's totally different, and when you work in big companies, you can be seriously disappointed by your job, you better have shoulders and strong backs.

First of all, large companies are often structured. It means that every part of your development workflow is handled by someone different, who doesn't do always the same stuff and who has a priority list to respect, which can be different from yours.

Of course, this experience is from my personal point of view, and all it doesn’t means that all companies are working like that, fortunately for me, and for them !

Working with Drupal doesn't help, it requires several types of knowledge. This knowledge is arising because of the different most commonly used softwares needed to run Drupal, like Apache, PHP and MySQL.

When working alone, these softwares are often installed on a single machine and you have complete control over but when working with others, that stack is splitted on different servers and taken care by different teams of people.

Well of course, to top it off, you have access to none of these servers and being admin (uid 1) on Drupal's sites is disallowed, it’s another ‘middleware’ team who have those access and they don’t know how to use Drupal, and of course, no PHPMyAdmin or equivalent, which make sense on production servers, but not on development’s.

If you want to run a version of the website you are developing on the staging server, these are the steps, simplified:

1. Provide Team A a compressed archive with all the Drupal's related files. 
2. Provide Team A a tutorial on how to install it. 
3. Ask Team B to create a database and send credentials to team A. 
4. Ask Team C to create DNS entries, with two different address for frontend and backend. 
5. Ask Team D to create content. 
6. Ask Team E to run a full battery of tests.

Be aware that if Team A is using an multisite infrastructure, you have to provide a full explanation on how to install it... and don't forget the custom SQL queries to Team B, to change the path of files and modules !

Core and modules updates are also something to think. If you work in large companies, you won't be granted access to staging and production server. It means that you'll be unable to run your beloved drush up command to update core and modules.

More than that, every module or core update must be reviewed and approved by someone from another team.

You will also have to export your configuration into features, and non exportables stuff must be created manually using a module update.

And if, by any chance, you have access to it, the server doesn't have any access to the Internet, or worst, it’s behind a proxy with authentication… Bummer !

In summary, the cons are:

- Wasting time filling out useless administrative papers. 
- You need someone else to make your task a priority because you can't do it yourself. 
- No access to Apache server. 
- No access to DB server. 
- No access to Drupal as an admin. 

The pros are:

- There's always someone else to blame if something fails, it's never you. 
- You can always count on someone else to do the job, right or wrong. 

All those constraints can lead to a bad work experience and changing people’s mind and old habits is complicated or impossible.

Drupal, as most other Open Source softwares, is flexible, as the software required to get it working, companies must take that in account in order to avoid complicating the developer’s life.

Those companies needs to understand that Drupal is not bundled as something that we can call “Enterprise ready”. It doesn’t means that it’s not ready for Enterprise, it just doesn’t means that it has to be handled and managed in a different way.

In the interest of the company, people needs to be trained to that, and managers too !

The lack of knowledge can lead to many problems, the slow execution of the task, the bad atmosphere between colleagues, people shooting in other people’s legs... and many more.

Being myself an active contributor in the Drupal’s community, I do not pretend knowing the solution, all I know is that large companies have problems managing teams and they should change their habits.

I think that with the release of Drupal 8 and the way configuration is handled in it, that it can be exported and VCS’ized (under Version Control System), it will be much better and will hopefully help a lot of people and companies.

A new way to solve those problems would be to reduce the number of people working on a single project.

This, an example of all the people working in a Drupal team:

- Themer: Take care of the design of the whole website, creating the theme from the start 
- Site Builder: Create the views, the whole configuration of the website. They should also take care of the test content used in the site. 
- Site Configurator: In charge to export the whole configuration of the website into files to get them under versioning. 
- Content team: Create the main content into the website. 

What would be the best number of people working on a Drupal project according to you ?

Another idea would be to use the already famous and scary: cloud. I recently started to use for the first time a very well known Drupal cloud service and I think it might be a good solution when working in team on a Drupal project. You can create user accounts, it automatically provides you the git access and also multiple environments.

Unfortunately, most companies are afraid of the cloud and for some institutions, it’s often unthinkable to host their source somewhere else.

_This blog post has been written in 2012 and [posted on Twitter](https://twitter.com/drupol/status/539729501518057472) 2 years later._
