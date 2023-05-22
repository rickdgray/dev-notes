---
title: Software Engineering
author: Rick Gray
year: 2023
---
# The Mythical Man-Month
## The Mythical Man-Month
Also known as [Brooks's law](https://en.wikipedia.org/wiki/Brooks%27s_law).
Reasons why the man-month doesn't work:
* Ramp up time for a new employee pulls time away from existing developers.
* Communication overhead is [combinatorially explosive](https://en.wikipedia.org/wiki/Combinatorial_explosion#Communication)
* Not all work is divisible; [too many cooks](https://en.wiktionary.org/wiki/too_many_cooks_spoil_the_broth); nine women can't make a baby in one month
## Second-System Effect
"The tendency of small, elegant, and successful systems to be succeeded by over-engineered, bloated systems, due to inflated expectations and overconfidence." See [more](https://en.wikipedia.org/wiki/Second-system_effect)
## Irreducible number of errors
"The observation that in a suitably complex system there is a certain irreducible number of errors. Any attempt to fix observed errors tends to result in the introduction of other errors."
## Progress Tracking
"'Question: How does a large software project get to be one year late? Answer: One day at a time!' Incremental slippages on many fronts eventually accumulate to produce a large overall delay. Continued attention to meeting small individual milestones is required at each level of management."
## Conceptual integrity
To make a user-friendly system, the system must have conceptual integrity, which can only be achieved by separating architecture from implementation. A single chief architect (or a small number of architects), acting on the user's behalf, decides what goes in the system and what stays out. The architect or team of architects should develop an idea of what the system should do and make sure that this vision is understood by the rest of the team. A novel idea by someone may not be included if it does not fit seamlessly with the overall system design. In fact, to ensure a user-friendly system, a system may deliberately provide _fewer_ features than it is capable of. The point being, if a system is too complicated to use, many features will go unused because no one has time to learn them.
## The manual
The chief architect produces a manual of system specifications. It should describe the external specifications of the system in detail, that is everything that the user sees. The manual should be altered as feedback comes in from the implementation teams and the users.
## The pilot system
When designing a new kind of system, a team _will_ design a throw-away system (whether it intends to or not). This system acts as a "pilot plan" that reveals techniques that will subsequently cause a complete redesign of the system. This second, _smarter_ system should be the one delivered to the customer, since delivery of the pilot system would cause nothing but agony to the customer, and possibly ruin the system's reputation and maybe even the company.
## Formal documents
Every project manager should create a small core set of formal documents defining the project objectives, how they are to be achieved, who is going to achieve them, when they are going to be achieved, and how much they are going to cost. These documents may also reveal inconsistencies that are otherwise hard to see.
## Project estimation
When estimating project times, it should be remembered that programming products (which can be sold to paying customers) and programming systems are both three times as hard to write as simple independent in-house programs. It should be kept in mind how much of the work week will actually be spent on technical issues, as opposed to administrative or other non-technical tasks, such as meetings, and especially "stand-up" or "all-hands" meetings.
## Communication
To avoid disaster, all the teams working on a project should remain in contact with each other in as many ways as possible (e-mail, phone, meetings, memos, etc.). Instead of assuming something, implementers should ask the architect(s) to clarify their intent on a feature they are implementing, before proceeding with an assumption that might very well be completely incorrect. The architect(s) are responsible for formulating a group picture of the project and communicating it to others.
## The surgical team
Much as a surgical team during surgery is led by one surgeon performing the most critical work, while directing the team to assist with less critical parts, it seems reasonable to have a "good" programmer develop critical system components while the rest of a team provides what is needed at the right time. Additionally, Brooks muses that "good" programmers are generally five to ten times as productive as mediocre ones.
## Code freeze and system versioning
Software is invisible. Therefore, many things only become apparent once a certain amount of work has been done on a new system, allowing a user to experience it. This experience will yield insights, which will change a user's needs or the perception of the user's needs. The system should, therefore, be changed to fulfill the changed requirements of the user. This can only occur up to a certain point, otherwise the system may never be completed. At a certain date, no more changes should be allowed to the system and the code should be frozen. All requests for changes should be delayed until the _next_ version of the system.
## Specialized tools
Instead of every programmer having their own special set of tools, each team should have a designated tool-maker who may create tools that are highly customized for the job that team is doing (e.g. a code generator tool that creates code based on a specification). In addition, system-wide tools should be built by a common tools team, overseen by the project manager.
## Lowering software development costs
There are two techniques for lowering software development costs that Brooks writes about:
- Implementers may be hired only after the architecture of the system has been completed (a step that may take several months, during which time prematurely hired implementers may have nothing to do).
- Another technique Brooks mentions is not to develop software at all, but simply to buy it "off the shelf when possible.
# Object Oriented Programming
>[!Inheritance Sucks]
>Composition is better than inheritance
<iframe src="https://www.youtube.com/embed/QM1iUe6IofM"></iframe>

# Backend for Frontend (BFF)
https://learn.microsoft.com/en-us/azure/architecture/patterns/backends-for-frontends
# Principal of Least Astonishment
