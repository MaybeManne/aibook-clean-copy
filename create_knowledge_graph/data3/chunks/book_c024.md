L08414: where $P(t)$ is the population (in billions) $t$ days after an initial observation at time $t=0$.
L08415: (a) Use a graphing utility to graph the function $P(t)$.
L08416: (b) In words, explain what happens to the population over time. Check your conclusion by finding $\lim _{t \rightarrow+\infty} P(t)$.
L08417: (c) In words, what happens to the rate of population growth over time? Check your conclusion by graphing $P^{\prime}(t)$.
L08419: 71-76 Find the limit by interpreting the expression as an appropriate derivative.
L08420: 71. $\lim _{x \rightarrow 0} \frac{e^{3 x}-1}{x}$
L08421: 72. $\lim _{x \rightarrow 0} \frac{\exp \left(x^{2}\right)-1}{x}$
L08422: 73. $\lim _{h \rightarrow 0} \frac{10^{h}-1}{h}$
L08423: 74. $\lim _{h \rightarrow 0} \frac{\tan ^{-1}(1+h)-\pi / 4}{h}$
L08424: 75. $\lim _{\Delta x \rightarrow 0} \frac{9\left[\sin ^{-1}\left(\frac{\sqrt{3}}{2}+\Delta x\right)\right]^{2}-\pi^{2}}{\Delta x}$
L08425: 76. $\lim _{w \rightarrow 2} \frac{3 \sec ^{-1} w-\pi}{w-2}$
L08426: 77. Writing Let $G$ denote the graph of an invertible function $f$ and consider $G$ as a fixed set of points in the plane. Suppose we relabel the coordinate axes so that the $x$-axis becomes the $y$-axis and vice versa. Carefully explain why now the same set of points $G$ becomes the graph of $f^{-1}$ (with the coordinate axes in a nonstandard position). Use this result to explain Formula (2).
L08427: 78. Writing Suppose that $f$ has an inverse function. Carefully explain the connection between Formula (2) and implicit differentiation of the equation $x=f(y)$.
L08429: ## QUICK CHECK ANSWERS 3.3
L08431: 1. $\frac{1}{5}$
L08432: 2. 
L08434: (a) yes
L08435: (b) no
L08436: (c) no
L08437: (d) yes
L08438: 3. (a) $e^{x}$
L08439: (b) $7^{x} \ln 7$
L08440: (c) $-e^{x} \sin \left(e^{x}+1\right)$
L08441: (d) $3 e^{3 x-2}$
L08442: 4. $f^{\prime}(x)=e^{x^{3}+x} \cdot\left(3 x^{2}+1\right)>0$ for all $x$
L08444: ### 3.4 RELATED RATES
L08446: In this section we will study related rates problems. In such problems one tries to find the rate at which some quantity is changing by relating the quantity to other quantities whose rates of change are known.
L08448: ## DIFFERENTIATING EQUATIONS TO RELATE RATES
L08450: Figure 3.4.1 shows a liquid draining through a conical filter. As the liquid drains, its volume $V$, height $h$, and radius $r$ are functions of the elapsed time $t$, and at each instant these variables are related by the equation
L08452: $$
L08453: V=\frac{\pi}{3} r^{2} h
L08454: $$
L08456: If we were interested in finding the rate of change of the volume $V$ with respect to the time $t$, we could begin by differentiating both sides of this equation with respect to $t$ to obtain
L08458: $$
L08459: \frac{d V}{d t}=\frac{\pi}{3}\left[r^{2} \frac{d h}{d t}+h\left(2 r \frac{d r}{d t}\right)\right]=\frac{\pi}{3}\left(r^{2} \frac{d h}{d t}+2 r h \frac{d r}{d t}\right)
L08460: $$
L08462: Thus, to find $d V / d t$ at a specific time $t$ from this equation we would need to have values for $r, h, d h / d t$, and $d r / d t$ at that time. This is called a related rates problem because the goal is to find an unknown rate of change by relating it to other variables whose values and whose rates of change at time $t$ are known or can be found in some way. Let us begin with a simple example.
L08464: - Figure 3.4.1
L08465: [FIGURE:1a107bdf01fb7cfb | The figure shows three inverted cones, each partially filled with a blue liquid, illustrating a liquid draining over time. The leftmost cone, representing an initial state, is labeled with $r$ for...]
L08467: Example 1 Suppose that $x$ and $y$ are differentiable functions of $t$ and are related by the equation $y=x^{3}$. Find $d y / d t$ at time $t=1$ if $x=2$ and $d x / d t=4$ at time $t=1$.
L08469: Solution. Using the chain rule to differentiate both sides of the equation $y=x^{3}$ with respect to $t$ yields
L08471: $$
L08472: \frac{d y}{d t}=\frac{d}{d t}\left[x^{3}\right]=3 x^{2} \frac{d x}{d t}
L08473: $$
L08475: Thus, the value of $d y / d t$ at time $t=1$ is
L08477: $$
L08478: \left.\frac{d y}{d t}\right|_{t=1}=\left.3(2)^{2} \frac{d x}{d t}\right|_{t=1}=12 \cdot 4=48
L08479: $$
L08481: [FIGURE:fd4a2d3bf6ed9793 | A photograph depicts a sandy beach heavily contaminated with irregular, dark, tar-like patches, indicative of an oil spill. The polluted sand extends towards the clear blue-green ocean under a partly...]
L08482: Arni Katz/Phototake
L08483: Oil spill from a ruptured tanker.
L08485: [FIGURE:afdfe05d247ee30d | A top-down diagram shows a boat within a light blue circular region labeled "Oil spill". A black dot on the boat marks a central point, from which an arrow labeled $r$ extends outwards to the edge of...]
L08486: A Figure 3.4.2
L08488: ## WARNING
L08490: We have italicized the word "After" in Step 5 because it is a common error to substitute numerical values before performing the differentiation. For instance, in Example 2 had we substituted the known value of $r=60$ in (1) before differentiating, we would have obtained $d A / d t=0$, which is obviously incorrect.
L08492: Example 2 Assume that oil spilled from a ruptured tanker spreads in a circular pattern whose radius increases at a constant rate of $2 \mathrm{ft} / \mathrm{s}$. How fast is the area of the spill increasing when the radius of the spill is 60 ft ?
L08494: Solution. Let
L08495: $t$ = number of seconds elapsed from the time of the spill
L08496: $r=$ radius of the spill in feet after $t$ seconds
L08497: $A=$ area of the spill in square feet after $t$ seconds
L08498: (Figure 3.4.2). We know the rate at which the radius is increasing, and we want to find the rate at which the area is increasing at the instant when $r=60$; that is, we want to find
L08500: $$
L08501: \left.\frac{d A}{d t}\right|_{r=60} \text { given that } \frac{d r}{d t}=2 \mathrm{ft} / \mathrm{s}
L08502: $$
L08504: This suggests that we look for an equation relating $A$ and $r$ that we can differentiate with respect to $t$ to produce a relationship between $d A / d t$ and $d r / d t$. But $A$ is the area of a circle of radius $r$, so
L08506: $$
L08507: \begin{equation*}
L08508: A=\pi r^{2} \tag{1}
L08509: \end{equation*}
L08510: $$
L08512: Differentiating both sides of (1) with respect to $t$ yields
L08514: $$
L08515: \begin{equation*}
L08516: \frac{d A}{d t}=2 \pi r \frac{d r}{d t} \tag{2}
L08517: \end{equation*}
L08518: $$
L08520: Thus, when $r=60$ the area of the spill is increasing at the rate of
L08522: $$
L08523: \left.\frac{d A}{d t}\right|_{r=60}=2 \pi(60)(2)=240 \pi \mathrm{ft}^{2} / \mathrm{s} \approx 754 \mathrm{ft}^{2} / \mathrm{s}
L08524: $$
L08526: With some minor variations, the method used in Example 2 can be used to solve a variety of related rates problems. We can break the method down into five steps.
L08528: ## A Strategy for Solving Related Rates Problems
L08530: Step 1. Assign letters to all quantities that vary with time and any others that seem relevant to the problem. Give a definition for each letter.
L08532: Step 2. Identify the rates of change that are known and the rate of change that is to be found. Interpret each rate as a derivative.
L08534: Step 3. Find an equation that relates the variables whose rates of change were identified in Step 2. To do this, it will often be helpful to draw an appropriately labeled figure that illustrates the relationship.
L08536: Step 4. Differentiate both sides of the equation obtained in Step 3 with respect to time to produce a relationship between the known rates of change and the unknown rate of change.
L08538: Step 5. After completing Step 4, substitute all known values for the rates of change and the variables, and then solve for the unknown rate of change.
L08540: [FIGURE:204be23982dbc64a | A diagram of a baseball diamond shows Home plate at the bottom, 1st base to the right, 2nd base at the top, and 3rd base to the left, forming a square. The distance between Home plate and 3rd base is...]
L08541: △ Figure 3.4.3
L08543: The quantity
L08545: $$
L08546: \left.\frac{d x}{d t}\right|_{x=20}
L08547: $$
L08549: is negative because $x$ is decreasing with respect to $t$.
L08551: [FIGURE:e802980f0c9905e1 | A diagram of a baseball diamond shows the four bases: 1st, 2nd, 3rd, and Home. A runner is depicted between 2nd and 3rd base, moving towards 3rd. The distance from the runner to 3rd base is labeled...]
L08552: \$ Figure 3.4.4
L08554: [FIGURE:cebaeda40ea4d0a6 | A right-angled triangle illustrates the relationship between a camera, a launching pad, and a rocket. The camera is at the bottom-left vertex, 3000 ft horizontally from the launching pad. A rocket is...]
L08555: △ Figure 3.4.5
L08557: - Example 3 A baseball diamond is a square whose sides are 90 ft long (Figure 3.4.3). Suppose that a player running from second base to third base has a speed of $30 \mathrm{ft} / \mathrm{s}$ at the instant when he is 20 ft from third base. At what rate is the player's distance from home plate changing at that instant?
L08559: Solution. We are given a constant speed with which the player is approaching third base, and we want to find the rate of change of the distance between the player and home plate at a particular instant. Thus, let
L08560: $t=$ number of seconds since the player left second base
L08561: $x=$ distance in feet from the player to third base
L08562: $y=$ distance in feet from the player to home plate
L08563: (Figure 3.4.4). Thus, we want to find
L08565: $$
L08566: \left.\frac{d y}{d t}\right|_{x=20} \text { given that }\left.\quad \frac{d x}{d t}\right|_{x=20}=-30 \mathrm{ft} / \mathrm{s}
L08567: $$
L08569: As suggested by Figure 3.4.4, an equation relating the variables $x$ and $y$ can be obtained using the Theorem of Pythagoras:
L08571: $$
L08572: \begin{equation*}
L08573: x^{2}+90^{2}=y^{2} \tag{3}
L08574: \end{equation*}
L08575: $$
L08577: Differentiating both sides of this equation with respect to $t$ yields
L08579: $$
L08580: 2 x \frac{d x}{d t}=2 y \frac{d y}{d t}
L08581: $$
L08583: from which we obtain
L08585: $$
L08586: \begin{equation*}
L08587: \frac{d y}{d t}=\frac{x}{y} \frac{d x}{d t} \tag{4}
L08588: \end{equation*}
L08589: $$
L08591: When $x=20$, it follows from (3) that
L08593: $$
L08594: y=\sqrt{20^{2}+90^{2}}=\sqrt{8500}=10 \sqrt{85}
L08595: $$
L08597: so that (4) yields
L08599: $$
L08600: \left.\frac{d y}{d t}\right|_{x=20}=\frac{20}{10 \sqrt{85}}(-30)=-\frac{60}{\sqrt{85}} \approx-6.51 \mathrm{ft} / \mathrm{s}
L08601: $$
L08603: The negative sign in the answer tells us that $y$ is decreasing, which makes sense physically from Figure 3.4.4. $\square$
L08605: Example 4 In Figure 3.4.5 we have shown a camera mounted at a point 3000 ft from the base of a rocket launching pad. If the rocket is rising vertically at $880 \mathrm{ft} / \mathrm{s}$ when it is 4000 ft above the launching pad, how fast must the camera elevation angle change at that instant to keep the camera aimed at the rocket?
L08607: Solution. Let
L08608: $t$ = number of seconds elapsed from the time of launch
L08609: $\phi=$ camera elevation angle in radians after $t$ seconds
L08610: $h=$ height of the rocket in feet after $t$ seconds
L08611: (Figure 3.4.6). At each instant the rate at which the camera elevation angle must change
L08613: [FIGURE:7c3146ef9b94c97f | A right-angled triangle illustrates the setup for a related rates problem. A camera is positioned at the bottom-left vertex, 3000 ft horizontally from the base of a rocket's vertical path. The rocket...]
L08614: △ Figure 3.4.6
L08616: [FIGURE:ad3bcbc4194a41cd | A right-angled triangle illustrates the geometry of a camera tracking a rocket. The horizontal side, representing the distance from the camera to the launching pad, is labeled 3000. The vertical...]
L08617: - Figure 3.4.7
L08619: [FIGURE:09a53f903a9cb654 | The figure presents two conical shapes. The left image shows a funnel containing a filter, labeled "Funnel to hold filter" and "Filter". The right image is a cross-section of a conical container...]
L08620: \$ Figure 3.4.8
L08622: [FIGURE:3172503feaf35d63 | The figure displays two identical inverted cones, each containing a blue cylindrical slice. The left cone shows a slice near the top, which is wide and has a small height, indicated by two horizontal...]
L08623: The same volume has drained, but the change in height is greater near the bottom than near the top.
L08625: - Figure 3.4.9
L08626: is $d \phi / d t$, and the rate at which the rocket is rising is $d h / d t$. We want to find
L08628: $$
L08629: \left.\frac{d \phi}{d t}\right|_{h=4000} \text { given that }\left.\quad \frac{d h}{d t}\right|_{h=4000}=880 \mathrm{ft} / \mathrm{s}
L08630: $$
L08632: From Figure 3.4.6 we see that
L08634: $$
L08635: \begin{equation*}
L08636: \tan \phi=\frac{h}{3000} \tag{5}
L08637: \end{equation*}
L08638: $$
L08640: Differentiating both sides of (5) with respect to $t$ yields
L08642: $$
L08643: \begin{equation*}
L08644: \left(\sec ^{2} \phi\right) \frac{d \phi}{d t}=\frac{1}{3000} \frac{d h}{d t} \tag{6}
L08645: \end{equation*}
L08646: $$
L08648: When $h=4000$, it follows that
L08650: $$
L08651: \left.(\sec \phi)\right|_{h=4000}=\frac{5000}{3000}=\frac{5}{3}
L08652: $$
L08654: (see Figure 3.4.7), so that from (6)
L08656: $$
L08657: \begin{aligned}
L08658: \left.\left(\frac{5}{3}\right)^{2} \frac{d \phi}{d t}\right|_{h=4000} & =\frac{1}{3000} \cdot 880=\frac{22}{75} \\
L08659: \left.\frac{d \phi}{d t}\right|_{h=4000} & =\frac{22}{75} \cdot \frac{9}{25}=\frac{66}{625} \approx 0.11 \mathrm{rad} / \mathrm{s} \approx 6.05 \mathrm{deg} / \mathrm{s}
L08660: \end{aligned}
L08661: $$
L08663: Example 5 Suppose that liquid is to be cleared of sediment by allowing it to drain through a conical filter that is 16 cm high and has a radius of 4 cm at the top (Figure 3.4.8). Suppose also that the liquid is forced out of the cone at a constant rate of $2 \mathrm{~cm}^{3} / \mathrm{min}$.
L08664: (a) Do you think that the depth of the liquid will decrease at a constant rate? Give a verbal argument that justifies your conclusion.
L08665: (b) Find a formula that expresses the rate at which the depth of the liquid is changing in terms of the depth, and use that formula to determine whether your conclusion in part (a) is correct.
L08666: (c) At what rate is the depth of the liquid changing at the instant when the liquid in the cone is 8 cm deep?
L08668: Solution (a). For the volume of liquid to decrease by a fixed amount, it requires a greater decrease in depth when the cone is close to empty than when it is almost full (Figure 3.4.9). This suggests that for the volume to decrease at a constant rate, the depth must decrease at an increasing rate.
L08670: ## Solution (b). Let
L08672: $$
L08673: \begin{aligned}
L08674: t & =\text { time elapsed from the initial observation (min) } \\
L08675: V & =\text { volume of liquid in the cone at time } t\left(\mathrm{~cm}^{3}\right) \\
L08676: y & =\text { depth of the liquid in the cone at time } t(\mathrm{~cm}) \\
L08677: r & =\text { radius of the liquid surface at time } t(\mathrm{~cm})
L08678: \end{aligned}
L08679: $$
L08681: (Figure 3.4.8). At each instant the rate at which the volume of liquid is changing is $d V / d t$, and the rate at which the depth is changing is $d y / d t$. We want to express $d y / d t$ in terms of $y$ given that $d V / d t$ has a constant value of $d V / d t=-2$. (We must use a minus sign here because $V$ decreases as $t$ increases.)
L08683: From the formula for the volume of a cone, the volume $V$, the radius $r$, and the depth $y$ are related by
L08685: $$
L08686: \begin{equation*}
L08687: V=\frac{1}{3} \pi r^{2} y \tag{7}
L08688: \end{equation*}
L08689: $$
L08691: If we differentiate both sides of (7) with respect to $t$, the right side will involve the quantity $d r / d t$. Since we have no direct information about $d r / d t$, it is desirable to eliminate $r$ from (7) before differentiating. This can be done using similar triangles. From Figure 3.4.8 we see that
L08693: $$
L08694: \frac{r}{y}=\frac{4}{16} \quad \text { or } \quad r=\frac{1}{4} y
L08695: $$
L08697: Substituting this expression in (7) gives
L08699: $$
L08700: \begin{equation*}
L08701: V=\frac{\pi}{48} y^{3} \tag{8}
L08702: \end{equation*}
L08703: $$
L08705: Differentiating both sides of (8) with respect to $t$ we obtain
L08707: $$
L08708: \frac{d V}{d t}=\frac{\pi}{48}\left(3 y^{2} \frac{d y}{d t}\right)
L08709: $$
L08711: or
L08713: $$
L08714: \begin{equation*}
L08715: \frac{d y}{d t}=\frac{16}{\pi y^{2}} \frac{d V}{d t}=\frac{16}{\pi y^{2}}(-2)=-\frac{32}{\pi y^{2}} \tag{9}
L08716: \end{equation*}
L08717: $$
L08719: which expresses $d y / d t$ in terms of $y$. The minus sign tells us that $y$ is decreasing with time, and
L08721: $$
L08722: \left|\frac{d y}{d t}\right|=\frac{32}{\pi y^{2}}
L08723: $$
L08725: tells us how fast $y$ is decreasing. From this formula we see that $|d y / d t|$ increases as $y$ decreases, which confirms our conjecture in part (a) that the depth of the liquid decreases more quickly as the liquid drains through the filter.
L08727: Solution (c). The rate at which the depth is changing when the depth is 8 cm can be obtained from (9) with $y=8$ :
L08729: $$
L08730: \left.\frac{d y}{d t}\right|_{y=8}=-\frac{32}{\pi\left(8^{2}\right)}=-\frac{1}{2 \pi} \approx-0.16 \mathrm{~cm} / \mathrm{min}
L08731: $$
L08733: ## QUICK CHECK EXERCISES 3.4 (See page 211 for answers.)
L08735: 1. If $A=x^{2}$ and $\frac{d x}{d t}=3$, find $\left.\frac{d A}{d t}\right|_{x=10}$.
L08736: 2. If $A=x^{2}$ and $\frac{d A}{d t}=3$, find $\left.\frac{d x}{d t}\right|_{x=10}$.
L08737: 3. A 10 -foot ladder stands on a horizontal floor and leans against a vertical wall. Use $x$ to denote the distance along the floor from the wall to the foot of the ladder, and use $y$ to denote the distance along the wall from the floor to the
L08738: top of the ladder. If the foot of the ladder is dragged away from the wall, find an equation that relates rates of change of $x$ and $y$ with respect to time.
L08739: 4. Suppose that a block of ice in the shape of a right circular cylinder melts so that it retains its cylindrical shape. Find an equation that relates the rates of change of the volume $(V)$, height $(h)$, and radius $(r)$ of the block of ice.
L08741: ## EXERCISE SET 3.4
L08743: 1-4 Both $x$ and $y$ denote functions of $t$ that are related by the given equation. Use this equation and the given derivative information to find the specified derivative.
L08745: 1. Equation: $y=3 x+5$.
L08746: (a) Given that $d x / d t=2$, find $d y / d t$ when $x=1$.
L08747: (b) Given that $d y / d t=-1$, find $d x / d t$ when $x=0$.
L08748: 2. Equation: $x+4 y=3$.
L08749: (a) Given that $d x / d t=1$, find $d y / d t$ when $x=2$.
L08750: (b) Given that $d y / d t=4$, find $d x / d t$ when $x=3$.
L08751: 3. Equation: $4 x^{2}+9 y^{2}=1$.
L08752: (a) Given that $d x / d t=3$, find $d y / d t$ when
L08753: $(x, y)=\left(\frac{1}{2 \sqrt{2}}, \frac{1}{3 \sqrt{2}}\right)$.
L08754: (b) Given that $d y / d t=8$, find $d x / d t$ when
L08756: $$
L08757: (x, y)=\left(\frac{1}{3},-\frac{\sqrt{5}}{9}\right) .
L08758: $$
L08760: 4. Equation: $x^{2}+y^{2}=2 x+4 y$.
L08761: (a) Given that $d x / d t=-5$, find $d y / d t$ when $(x, y)=(3,1)$.
L08762: (b) Given that $d y / d t=6$, find $d x / d t$ when $(x, y)=(1+\sqrt{2}, 2+\sqrt{3})$.
L08764: ## FOCUS ON CONCEPTS
L08766: 5. Let $A$ be the area of a square whose sides have length $x$, and assume that $x$ varies with the time $t$.
L08767: (a) Draw a picture of the square with the labels $A$ and $x$ placed appropriately.
L08768: (b) Write an equation that relates $A$ and $x$.
L08769: (c) Use the equation in part (b) to find an equation that relates $d A / d t$ and $d x / d t$.
L08770: (d) At a certain instant the sides are 3 ft long and increasing at a rate of $2 \mathrm{ft} / \mathrm{min}$. How fast is the area increasing at that instant?
L08771: 6. In parts (a)-(d), let $A$ be the area of a circle of radius $r$, and assume that $r$ increases with the time $t$.
L08772: (a) Draw a picture of the circle with the labels $A$ and $r$ placed appropriately.
L08773: (b) Write an equation that relates $A$ and $r$.
L08774: (c) Use the equation in part (b) to find an equation that relates $d A / d t$ and $d r / d t$.
L08775: (d) At a certain instant the radius is 5 cm and increasing at the rate of $2 \mathrm{~cm} / \mathrm{s}$. How fast is the area increasing at that instant?
L08776: 7. Let $V$ be the volume of a cylinder having height $h$ and radius $r$, and assume that $h$ and $r$ vary with time.
L08777: (a) How are $d V / d t, d h / d t$, and $d r / d t$ related?
L08778: (b) At a certain instant, the height is 6 in and increasing at $1 \mathrm{in} / \mathrm{s}$, while the radius is 10 in and decreasing at $1 \mathrm{in} / \mathrm{s}$. How fast is the volume changing at that instant? Is the volume increasing or decreasing at that instant?
L08779: 8. Let $l$ be the length of a diagonal of a rectangle whose sides have lengths $x$ and $y$, and assume that $x$ and $y$ vary with time.
L08780: (a) How are $d l / d t, d x / d t$, and $d y / d t$ related?
L08781: (b) If $x$ increases at a constant rate of $\frac{1}{2} \mathrm{ft} / \mathrm{s}$ and $y$ decreases at a constant rate of $\frac{1}{4} \mathrm{ft} / \mathrm{s}$, how fast is the size of the diagonal changing when $x=3 \mathrm{ft}$ and $y=4 \mathrm{ft}$ ? Is the diagonal increasing or decreasing at that instant?
L08782: 9. Let $\theta$ (in radians) be an acute angle in a right triangle, and let $x$ and $y$, respectively, be the lengths of the sides adjacent to and opposite $\theta$. Suppose also that $x$ and $y$ vary with time.
L08783: (a) How are $d \theta / d t, d x / d t$, and $d y / d t$ related?
L08784: (b) At a certain instant, $x=2$ units and is increasing at
L08786: 1 unit/s, while $y=2$ units and is decreasing at $\frac{1}{4}$ unit/s. How fast is $\theta$ changing at that instant? Is $\theta$ increasing or decreasing at that instant?
L08787: 10. Suppose that $z=x^{3} y^{2}$, where both $x$ and $y$ are changing with time. At a certain instant when $x=1$ and $y=2, x$ is decreasing at the rate of 2 units/s, and $y$ is increasing at the rate of 3 units/s. How fast is $z$ changing at this instant? Is $z$ increasing or decreasing?
L08788: 11. The minute hand of a certain clock is 4 in long. Starting from the moment when the hand is pointing straight up, how fast is the area of the sector that is swept out by the hand increasing at any instant during the next revolution of the hand?
L08789: 12. A stone dropped into a still pond sends out a circular ripple whose radius increases at a constant rate of $3 \mathrm{ft} / \mathrm{s}$. How rapidly is the area enclosed by the ripple increasing at the end of 10 s ?
L08790: 13. Oil spilled from a ruptured tanker spreads in a circle whose area increases at a constant rate of $6 \mathrm{mi}^{2} / \mathrm{h}$. How fast is the radius of the spill increasing when the area is $9 \mathrm{mi}^{2}$ ?
L08791: 14. A spherical balloon is inflated so that its volume is increasing at the rate of $3 \mathrm{ft}^{3} / \mathrm{min}$. How fast is the diameter of the balloon increasing when the radius is 1 ft ?
L08792: 15. A spherical balloon is to be deflated so that its radius decreases at a constant rate of $15 \mathrm{~cm} / \mathrm{min}$. At what rate must air be removed when the radius is 9 cm ?
L08793: 16. A 17 ft ladder is leaning against a wall. If the bottom of the ladder is pulled along the ground away from the wall at a constant rate of $5 \mathrm{ft} / \mathrm{s}$, how fast will the top of the ladder be moving down the wall when it is 8 ft above the ground?
L08794: 17. A 13 ft ladder is leaning against a wall. If the top of the ladder slips down the wall at a rate of $2 \mathrm{ft} / \mathrm{s}$, how fast will the foot be moving away from the wall when the top is 5 ft above the ground?
L08795: 18. A 10 ft plank is leaning against a wall. If at a certain instant the bottom of the plank is 2 ft from the wall and is being pushed toward the wall at the rate of $6 \mathrm{in} / \mathrm{s}$, how fast is the acute angle that the plank makes with the ground increasing?
L08796: 19. A softball diamond is a square whose sides are 60 ft long. Suppose that a player running from first to second base has a speed of $25 \mathrm{ft} / \mathrm{s}$ at the instant when she is 10 ft from second base. At what rate is the player's distance from home plate changing at that instant?
L08797: 20. A rocket, rising vertically, is tracked by a radar station that is on the ground 5 mi from the launchpad. How fast is the rocket rising when it is 4 mi high and its distance from the radar station is increasing at a rate of $2000 \mathrm{mi} / \mathrm{h}$ ?
L08798: 21. For the camera and rocket shown in Figure 3.4.5, at what rate is the camera-to-rocket distance changing when the rocket is 4000 ft up and rising vertically at $880 \mathrm{ft} / \mathrm{s}$ ?
L08799: 22. For the camera and rocket shown in Figure 3.4.5, at what rate is the rocket rising when the elevation angle is $\pi / 4$ radians and increasing at a rate of $0.2 \mathrm{rad} / \mathrm{s}$ ?
L08800: 23. A satellite is in an elliptical orbit around the Earth. Its distance $r$ (in miles) from the center of the Earth is given by
L08802: $$
L08803: r=\frac{4995}{1+0.12 \cos \theta}
L08804: $$
L08806: where $\theta$ is the angle measured from the point on the orbit nearest the Earth's surface (see the accompanying figure).
L08807: (a) Find the altitude of the satellite at perige (the point nearest the surface of the Earth) and at apogee (the point farthest from the surface of the Earth). Use 3960 mi as the radius of the Earth.
L08808: (b) At the instant when $\theta$ is $120^{\circ}$, the angle $\theta$ is increasing at the rate of $2.7^{\circ} / \mathrm{min}$. Find the altitude of the satellite and the rate at which the altitude is changing at this instant. Express the rate in units of mi/min.
L08810: [FIGURE:60065f129dc41fda | A diagram illustrates an elliptical orbit around a light blue Earth, which is positioned at one focus. A small orange object on the orbit is shown with its radial distance $r$ from the Earth's center...]
L08811: \& Figure Ex-23
L08813: 24. An aircraft is flying horizontally at a constant height of 4000 ft above a fixed observation point (see the accompanying figure). At a certain instant the angle of elevation $\theta$ is $30^{\circ}$ and decreasing, and the speed of the aircraft is $300 \mathrm{mi} / \mathrm{h}$.
L08814: (a) How fast is $\theta$ decreasing at this instant? Express the result in units of deg/s.
L08815: (b) How fast is the distance between the aircraft and the observation point changing at this instant? Express the result in units of ft/s. Use $1 \mathrm{mi}=5280 \mathrm{ft}$.
L08817: [FIGURE:ef0c80d5c0104521 | A diagram illustrates a person observing an airplane. A right triangle is formed by the person's eye, a point directly below the airplane at the person's eye level, and the airplane itself. The...]
L08818: < Figure Ex-24
L08820: 25. A conical water tank with vertex down has a radius of 10 ft at the top and is 24 ft high. If water flows into the tank at a rate of $20 \mathrm{ft}^{3} / \mathrm{min}$, how fast is the depth of the water increasing when the water is 16 ft deep?
L08821: 26. Grain pouring from a chute at the rate of $8 \mathrm{ft}^{3} / \mathrm{min}$ forms a conical pile whose height is always twice its radius. How fast is the height of the pile increasing at the instant when the pile is 6 ft high?
L08822: 27. Sand pouring from a chute forms a conical pile whose height is always equal to the diameter. If the height increases at a
L08823: constant rate of $5 \mathrm{ft} / \mathrm{min}$, at what rate is sand pouring from the chute when the pile is 10 ft high?
L08824: 28. Wheat is poured through a chute at the rate of $10 \mathrm{ft}^{3} / \mathrm{min}$ and falls in a conical pile whose bottom radius is always half the altitude. How fast will the circumference of the base be increasing when the pile is 8 ft high?
L08825: 29. An aircraft is climbing at a $30^{\circ}$ angle to the horizontal. How fast is the aircraft gaining altitude if its speed is $500 \mathrm{mi} / \mathrm{h}$ ?
L08826: 30. A boat is pulled into a dock by means of a rope attached to a pulley on the dock (see the accompanying figure). The rope is attached to the bow of the boat at a point 10 ft below the pulley. If the rope is pulled through the pulley at a rate of $20 \mathrm{ft} / \mathrm{min}$, at what rate will the boat be approaching the dock when 125 ft of rope is out?
L08828: [FIGURE:52af8c50b901d2cf | A diagram illustrates a boat being pulled towards a dock. A dock extends horizontally over water, with a pulley mounted on its edge. A rope extends from the boat in the water, over the pulley...]
L08829: -Figure Ex-30
L08831: 31. For the boat in Exercise 30, how fast must the rope be pulled if we want the boat to approach the dock at a rate of $12 \mathrm{ft} / \mathrm{min}$ at the instant when 125 ft of rope is out?
L08832: 32. A man 6 ft tall is walking at the rate of $3 \mathrm{ft} / \mathrm{s}$ toward a streetlight 18 ft high (see the accompanying figure).
L08833: (a) At what rate is his shadow length changing?
L08834: (b) How fast is the tip of his shadow moving?
L08836: [FIGURE:58249cd4ef0a25fa | A diagram illustrates a person walking away from a street light, casting a shadow. Blue lines represent the light rays, forming two similar right triangles: one defined by the street light's height...]
L08837: <Figure Ex-32
L08839: 33. A beacon that makes one revolution every 10 s is located on a ship anchored 4 kilometers from a straight shoreline. How fast is the beam moving along the shoreline when it makes an angle of $45^{\circ}$ with the shore?
L08840: 34. An aircraft is flying at a constant altitude with a constant speed of $600 \mathrm{mi} / \mathrm{h}$. An antiaircraft missile is fired on a straight line perpendicular to the flight path of the aircraft so that it will hit the aircraft at a point $P$ (see the accompanying figure). At the instant the aircraft is 2 mi from the impact point $P$ the missile is 4 mi from $P$ and flying at 1200 $\mathrm{mi} / \mathrm{h}$. At that instant, how rapidly is the distance between missile and aircraft decreasing?
L08842: [FIGURE:756791934374c620 | A diagram illustrates a yellow rocket on the left and a blue airplane on the right. Both are connected by blue line segments to a central point labeled $P$. The line segments meet at point $P$ at a...]
L08843: <Figure Ex-34
L08845: 35. Solve Exercise 34 under the assumption that the angle between the flight paths is $120^{\circ}$ instead of the assumption that the paths are perpendicular. [Hint: Use the law of cosines.]
L08846: 36. A police helicopter is flying due north at $100 \mathrm{mi} / \mathrm{h}$ and at a constant altitude of $\frac{1}{2} \mathrm{mi}$. Below, a car is traveling west on a highway at $75 \mathrm{mi} / \mathrm{h}$. At the moment the helicopter crosses over the highway the car is 2 mi east of the helicopter.
L08847: (a) How fast is the distance between the car and helicopter changing at the moment the helicopter crosses the highway?
L08848: (b) Is the distance between the car and helicopter increasing or decreasing at that moment?
L08849: 37. A particle is moving along the curve whose equation is
L08851: $$
L08852: \frac{x y^{3}}{1+y^{2}}=\frac{8}{5}
L08853: $$
L08855: Assume that the $x$-coordinate is increasing at the rate of 6 units/s when the particle is at the point $(1,2)$.
L08856: (a) At what rate is the $y$-coordinate of the point changing at that instant?
L08857: (b) Is the particle rising or falling at that instant?
L08858: 38. A point $P$ is moving along the curve whose equation is $y=\sqrt{x^{3}+17}$. When $P$ is at $(2,5), y$ is increasing at the rate of 2 units/s. How fast is $x$ changing?
L08859: 39. A point $P$ is moving along the line whose equation is $y=2 x$. How fast is the distance between $P$ and the point $(3,0)$ changing at the instant when $P$ is at $(3,6)$ if $x$ is decreasing at the rate of 2 units/s at that instant?
L08860: 40. A point $P$ is moving along the curve whose equation is $y=\sqrt{x}$. Suppose that $x$ is increasing at the rate of 4 units/s when $x=3$.
L08861: (a) How fast is the distance between $P$ and the point $(2,0)$ changing at this instant?
L08862: (b) How fast is the angle of inclination of the line segment from $P$ to $(2,0)$ changing at this instant?
L08863: 41. A particle is moving along the curve $y=x /\left(x^{2}+1\right)$. Find all values of $x$ at which the rate of change of $x$ with respect to time is three times that of $y$. [Assume that $d x / d t$ is never zero.]
L08864: 42. A particle is moving along the curve $16 x^{2}+9 y^{2}=144$. Find all points $(x, y)$ at which the rates of change of $x$ and $y$ with respect to time are equal. [Assume that $d x / d t$ and $d y / d t$ are never both zero at the same point.]
L08865: 43. The thin lens equation in physics is
L08867: $$
L08868: \frac{1}{s}+\frac{1}{S}=\frac{1}{f}
L08869: $$
L08871: where $s$ is the object distance from the lens, $S$ is the image distance from the lens, and $f$ is the focal length of the lens. Suppose that a certain lens has a focal length of 6 cm and that an object is moving toward the lens at the rate of $2 \mathrm{~cm} / \mathrm{s}$. How fast is the image distance changing at the instant when the object is 10 cm from the lens? Is the image moving away from the lens or toward the lens?
L08872: 44. Water is stored in a cone-shaped reservoir (vertex down). Assuming the water evaporates at a rate proportional to the surface area exposed to the air, show that the depth of the water will decrease at a constant rate that does not depend on the dimensions of the reservoir.
L08873: 45. A meteor enters the Earth's atmosphere and burns up at a rate that, at each instant, is proportional to its surface area. Assuming that the meteor is always spherical, show that the radius decreases at a constant rate.
L08874: 46. On a certain clock the minute hand is 4 in long and the hour hand is 3 in long. How fast is the distance between the tips of the hands changing at 9 o'clock?
L08875: 47. Coffee is poured at a uniform rate of $20 \mathrm{~cm}^{3} / \mathrm{s}$ into a cup whose inside is shaped like a truncated cone (see the accompanying figure). If the upper and lower radii of the cup are 4 cm and 2 cm and the height of the cup is 6 cm , how fast will the coffee level be rising when the coffee is halfway up? [Hint: Extend the cup downward to form a cone.]
L08877: [FIGURE:27864f195c03ea8d | A stylized drawing of a white cup with a gray outline and handle, filled approximately halfway with a brown liquid. This image appears to be decorative and does not directly relate to the surrounding...]
L08878: -Figure Ex-47
