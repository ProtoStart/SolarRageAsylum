# SolarRageAsylum
JavaScript arcade style game - Can you escape the Asylum?
- A technologically simple web based game, with 2D graphics and (initially at least) single player arcadey gameplay, and a bit of story between levels.
- Anyone can join the development team, and this project was chosen to be easy for rookies to get into. A limited amount of mentoring is available plus I'm using an extensive amount of comments to explain what everything does, and will be writing documentation and maybe making videos to help explain how it works and the design choices I make. Mentoring limited by time and skill - I'm learning game dev myself through this project, applying what I know from other kinds of projects I've worked on.
- Game mechanics and levels will be added over time by the community (including the project owner). This project is one of a few projects that Phil leads.
- Project beta area http://solarrageasylumbeta.protostart.net/ 
 -- Contains a hidden alpha testing page - use "letmein" for access
 --- Intentionally not a secure testing area. I've done it like this so it's running on our hosting with fairly normal internet conditions, available on any web enabled device, yet not somewhere someone might start using stuff that's still in early development without realising it. Curious people can find their way in if they want, but they will at least know not to judge the game on the state of it at that point.
 -- It gets regular updates, with the most recent commit of our main branch, whenever our project leader is working on it. (I like to commit and check online quite frequently while I'm working)
 -- The landing page has a rough development roadmap, links to our reddit and our github and a bit of info about the game plus the access code box (which also has some pop culture references thrown in there for fun)

Initial reddit post about this project:
https://www.reddit.com/r/ProtoStart/comments/n36s4n/perfect_for_beginners_lets_build_a_simple_web/


- The story isn't fixed from the start of development, but generally it's about escaping an Asylum. I'm not expecting a complex storyline with an immersive world, but a bit of a story to add intrigue and make players care about the main character a bit would be cool.

- Project owner is Phil Ganney (PhilGanney on github, PGDesign on reddit)
- Languages - HTML, CSS & JavaScript - maybe some common JS libraries such as JQuery if they seem to be incredibly useful for some aspect. (Intention is to keep the tech stack similar to regular web coding to keep skills gained transferable between ProtoStart projects). React might well be helpful, but I'm not experienced enough with it yet to be teaching others or making quick progress with it. Maybe after once this has a bunch of levels I can rewrite a chunk of it in React and see if it makes the codebase easier to work with and explain to rookie coders. I'm also thinking that a comparison of the same project built in pure JavaScript VS the same result in React can be a good way of explaining key differences, and be a useful tutorial.

The game name conjures up an image of an arcade style game in my mind, perhaps a bit like pac-man, where in some levels you're avoiding being caught by guards and maybe also having to manage how long the character is in a sunlight provoked rage. In other levels you would have to avoid being seen by the guards at all, and as the game progresses, maybe they'd get better at detecting you, and your rage would make it harder to stay unnoticed and less easy to control.

I'm also considering doing a crowdfunding campaign to cover 
1) getting a domain specifically for it
2) more time for me to work on the game (ie take it beyond a community hobby project for me)
3) more time for me to work on this as a way of teaching people how to code and get into projects. - Have more time to mentor people, make lots of tutorial material, organise it into different tracks for people coming from different places and aiming for different things.

Big thanks to fantasynamegenerators.com - I used their video game name generator to inspire a name. I didn't directly take the name verbatim from them, but "Solar Asylum" for a simple web based game, was enough to make me think up quite a bit of the vision for this.


CODE STRUCTURE - and overview of how I think it will work. (I'll update this once more is in place)
This may change at some point, if we learn a reason to do it differently. 
The idea of this section of the readme is: 
a) once someone reads this, they'll have a good sense of where to add code and where to find specific parts of the code when they want to improve it, debug it, or just see how it works. It should make it easier for newcomers to dive in and for everyone to keep the codebase organised and easy to work with.
b) it will help me set up a good structure for the needs of this project, and make it easier for people to spot potential improvements.

It often makes sense in web based projects to separate the JavaScript, CSS and HTML, so that files don't mix and match between languages much if at all. This makes it easier for us to understand, which means that once there's lots of code involved in the project, it's quicker to improve compared with if everything was jumbled together. 
Often on websites each .html file is the basis of an individual page, but you can also have a main page with an area that you load other .html files into. For this game project it means we can have a single main page that has any menus or other things that you'd always want on screen, keep that there at all times, and just load individual level content as players get to them. That also seems easiest to create levels for. That would mean levels created as html 

We can also use JavaScript to generate and change CSS and HTML. 


I think it makes sense to separate out:

 - levels from the core engine
 - levels from each other 
 - individual game mechanics from each other 
 
 Individual levels will have to be dependant on game mechanics they choose to use, while game mechanics will be reused in multiple levels. 
 
 Ideally when someone creates a level, we want them to just think of how the level will look and what game mechanics it uses, and how basics of how it fits into the game - what has just happened, what happens next. It would also be really handy if people could easily make altered versions of existing levels by making a copy and then altering as wanted.

 
 Maybe have:
Root
	index.html (effectively the home screen for the game)
	mainStyles.css (Styles that are used everywhere in the game or are part of the basic template of the game)
	mainCodeXYZ.js where XYZ = version number