L12367: [FIGURE:e1c4e7f033a90ffa | The figure displays a two-dimensional Cartesian coordinate system with a horizontal $x$-axis and a vertical $y$-axis. A blue curve, representing the path of a fly, is drawn, starting in the second...]
L12368: Figure Ex-54
L12370: 55. Let $f(x)=a x^{2}+b x+c$, where $a>0$. Prove that $f(x) \geq 0$ for all $x$ if and only if $b^{2}-4 a c \leq 0$. [Hint: Find the minimum of $f(x)$.]
L12371: 56. Prove Theorem 4.4.3 in the case where the extreme value is a minimum.
L12372: 57. Writing Suppose that $f$ is continuous and positive-valued everywhere and that the $x$-axis is an asymptote for the graph of $f$, both as $x \rightarrow-\infty$ and as $x \rightarrow+\infty$. Explain why $f$
L12373: cannot have an absolute minimum but may have a relative minimum.
L12374: 58. Writing Explain the difference between a relative maximum and an absolute maximum. Sketch a graph that illustrates a function with a relative maximum that is not an absolute maximum, and sketch another graph illustrating an absolute maximum that is not a relative maximum. Explain how these graphs satisfy the given conditions.
L12376: ## QUICK CHECK ANSWERS 4.4
L12378: 1. There is a relative minimum at $x=3$, a relative maximum at $x=1$, an absolute minimum at $x=3$, and an absolute maximum at $x=6$. 2. (a) max, 6064; $\min , 2293$ (b) max, $2400 ; \min , 0$ (c) max, $6064 ; \min ,-1333$ (d) no max; min, -1333
L12379: 2. (a) max, $f(0)=25$; min, $f(3)=-2$ (b) max, $f(-1)=30$; min, $f(3)=-2$ (c) max, $f(-1)=30$; min, $f(-4)=-51$
L12380: (d) $\max , f(10)=635 ; \min , f(-5)=-130(\mathrm{e}) \max , f(-1)=30 ;$ no min
L12382: ### 4.5 APPLIED MAXIMUM AND MIMIMUM PROBLEMS
L12384: In this section we will show how the methods discussed in the last section can be used to solve various applied optimization problems.
L12386: ## CLASSIFICATION OF OPTIMIZATION PROBLEMS
L12388: The applied optimization problems that we will consider in this section fall into the following two categories:
L12390: - Problems that reduce to maximizing or minimizing a continuous function over a finite closed interval.
L12391: - Problems that reduce to maximizing or minimizing a continuous function over an infinite interval or a finite interval that is not closed.
L12393: For problems of the first type the Extreme-Value Theorem (4.4.2) guarantees that the problem has a solution, and we know that the solution can be obtained by examining the values of the function at the critical points and at the endpoints. However, for problems of the second type there may or may not be a solution. If the function is continuous and has exactly one relative extremum of the appropriate type on the interval, then Theorem 4.4.4 guarantees the existence of a solution and provides a method for finding it. In cases where this theorem is not applicable some ingenuity may be required to solve the problem.
L12395: ## PROBLEMS INVOLVING FINITE CLOSED INTERVALS
L12397: In his On a Method for the Evaluation of Maxima and Minima, the seventeenth century French mathematician Pierre de Fermat solved an optimization problem very similar to the one posed in our first example. Fermat's work on such optimization problems prompted the French mathematician Laplace to proclaim Fermat the "true inventor of the differential calculus." Although this honor must still reside with Newton and Leibniz, it is the case that Fermat developed procedures that anticipated parts of differential calculus.
L12399: - Example 1 A garden is to be laid out in a rectangular area and protected by a chicken wire fence. What is the largest possible area of the garden if only 100 running feet of chicken wire is available for the fence?
L12401: Solution. Let
L12403: $$
L12404: \begin{aligned}
L12405: x & =\text { length of the rectangle }(\mathrm{ft}) \\
L12406: y & =\text { width of the rectangle }(\mathrm{ft}) \\
L12407: A & =\text { area of the rectangle }\left(\mathrm{ft}^{2}\right)
L12408: \end{aligned}
L12409: $$
L12411: Then
L12413: $$
L12414: \begin{equation*}
L12415: A=x y \tag{1}
L12416: \end{equation*}
L12417: $$
L12419: [FIGURE:7f73518f6750300c | A diagram of a rectangle is shown, with the top and bottom sides labeled $x$ and the left and right sides labeled $y$. Below the rectangle, a box contains the text "Perimeter" and the equation $2x +...]
L12420: △ Figure 4.5.1
L12422: Since the perimeter of the rectangle is 100 ft , the variables $x$ and $y$ are related by the equation
L12424: $$
L12425: \begin{equation*}
L12426: 2 x+2 y=100 \text { or } y=50-x \tag{2}
L12427: \end{equation*}
L12428: $$
L12430: (See Figure 4.5.1.) Substituting (2) in (1) yields
L12432: $$
L12433: \begin{equation*}
L12434: A=x(50-x)=50 x-x^{2} \tag{3}
L12435: \end{equation*}
L12436: $$
L12438: Because $x$ represents a length, it cannot be negative, and because the two sides of length $x$ cannot have a combined length exceeding the total perimeter of 100 ft , the variable $x$ must satisfy
L12440: $$
L12441: \begin{equation*}
L12442: 0 \leq x \leq 50 \tag{4}
L12443: \end{equation*}
L12444: $$
L12446: Thus, we have reduced the problem to that of finding the value (or values) of $x$ in $[0,50]$, for which $A$ is maximum. Since $A$ is a polynomial in $x$, it is continuous on [0,50], and so the maximum must occur at an endpoint of this interval or at a critical point.
L12448: From (3) we obtain
L12450: $$
L12451: \frac{d A}{d x}=50-2 x
L12452: $$
L12454: Setting $d A / d x=0$ we obtain
L12456: $$
L12457: 50-2 x=0
L12458: $$
L12460: Pierre de Fermat (1601-1665) Fermat, the son of a successful French leather merchant, was a lawyer who practiced mathematics as a hobby. He received a Bachelor of Civil Laws degree from the University of Orleans in 1631 and subsequently held various government positions, including a post as councillor to the Toulouse parliament. Although he was apparently financially successful, confidential documents of that time suggest that his performance in office and as a lawyer was poor, perhaps because he devoted so much time to mathematics. Throughout his life, Fermat fought all efforts to have his mathematical results published. He had the unfortunate habit of scribbling his work in the margins of books and often sent his results to friends without keeping copies for himself. As a result, he never received credit for many major achievements until his name was raised from obscurity in the mid-nineteenth century. It is now known that Fermat, simultaneously and independently of Descartes, developed analytic geometry. Unfortunately, Descartes and Fermat argued bitterly over various problems so that there was never any real cooperation between these two great geniuses.
L12462: Fermat solved many fundamental calculus problems. He obtained the first procedure for differentiating polynomials, and solved many important maximization, minimization, area, and tangent problems. His work served to inspire Isaac Newton. Fermat is best known for his work in number theory, the study of properties of and relationships between whole numbers. He was the first
L12463: mathematician to make substantial contributions to this field after the ancient Greek mathematician Diophantus. Unfortunately, none of Fermat's contemporaries appreciated his work in this area, a fact that eventually pushed Fermat into isolation and obscurity in later life. In addition to his work in calculus and number theory, Fermat was one of the founders of probability theory and made major contributions to the theory of optics. Outside mathematics, Fermat was a classical scholar of some note, was fluent in French, Italian, Spanish, Latin, and Greek, and he composed a considerable amount of Latin poetry.
L12465: One of the great mysteries of mathematics is shrouded in Fermat's work in number theory. In the margin of a book by Diophantus, Fermat scribbled that for integer values of $n$ greater than 2 , the equation $x^{n}+y^{n}=z^{n}$ has no nonzero integer solutions for $x, y$, and $z$. He stated, "I have discovered a truly marvelous proof of this, which however the margin is not large enough to contain." This result, which became known as "Fermat's last theorem," appeared to be true, but its proof evaded the greatest mathematical geniuses for 300 years until Professor Andrew Wiles of Princeton University presented a proof in June 1993 in a dramatic series of three lectures that drew international media attention (see New York Times, June 27, 1993). As it turned out, that proof had a serious gap that Wiles and Richard Taylor fixed and published in 1995. A prize of 100,000 German marks was offered in 1908 for the solution, but it is worthless today because of inflation.
L12467: Table 4.5.1
L12468: | $x$ | 0 | 25 | 50 |
L12469: | ---: | ---: | ---: | ---: |
L12470: | $A$ | 0 | 625 | 0 |
L12473: [FIGURE:2a2d17e19e684426 | A graph displays a downward-opening parabolic curve in the first quadrant, representing an area function $A(x)$ in square feet versus a dimension $x$ in feet. The x-axis is labeled "$x$ (ft)" and...]
L12474: \$ Figure 4.5.2
L12476: In Example 1 we included $x=0$ and $x=50$ as possible values of $x$, even though these correspond to rectangles with two sides of length zero. If we view this as a purely mathematical problem, then there is nothing wrong with this. However, if we view this as an applied problem in which the rectangle will be formed from physical material, then it would make sense to exclude these values.
L12477: or $x=25$. Thus, the maximum occurs at one of the values
L12479: $$
L12480: x=0, \quad x=25, \quad x=50
L12481: $$
L12483: Substituting these values in (3) yields Table 4.5.1, which tells us that the maximum area of $625 \mathrm{ft}^{2}$ occurs at $x=25$, which is consistent with the graph of (3) in Figure 4.5.2. From (2) the corresponding value of $y$ is 25 , so the rectangle of perimeter 100 ft with greatest area is a square with sides of length 25 ft .
L12485: Example 1 illustrates the following five-step procedure that can be used for solving many applied maximum and minimum problems.
L12487: ## A Procedure for Solving Applied Maximum and Minimum Problems
L12489: Step 1. Draw an appropriate figure and label the quantities relevant to the problem.
L12490: Step 2. Find a formula for the quantity to be maximized or minimized.
L12491: Step 3. Using the conditions stated in the problem to eliminate variables, express the quantity to be maximized or minimized as a function of one variable.
L12493: Step 4. Find the interval of possible values for this variable from the physical restrictions in the problem.
L12495: Step 5. If applicable, use the techniques of the preceding section to obtain the maximum or minimum.
L12497: Example 2 An open box is to be made from a 16 -inch by 30 -inch piece of cardboard by cutting out squares of equal size from the four corners and bending up the sides (Figure 4.5.3). What size should the squares be to obtain a box with the largest volume?
L12498: [FIGURE:d24d12b5fdde612c | The figure shows two diagrams illustrating the construction of an open-top box from a rectangular sheet. Diagram (a) depicts a flat rectangular sheet, 16 inches by 30 inches, with squares of side...]
L12500: Solution. For emphasis, we explicitly list the steps of the five-step problem-solving procedure given above as an outline for the solution of this problem. (In later examples we will follow these guidelines without listing the steps.)
L12502: - Step 1: Figure 4.5.3a illustrates the cardboard piece with squares removed from its corners. Let
L12504: $$
L12505: \begin{aligned}
L12506: x & =\text { length (in inches) of the sides of the squares to be cut out } \\
L12507: V & =\text { volume (in cubic inches) of the resulting box }
L12508: \end{aligned}
L12509: $$
L12511: - Step 2: Because we are removing a square of side $x$ from each corner, the resulting box will have dimensions $16-2 x$ by $30-2 x$ by $x$ (Figure 4.5.3b). Since the volume of a box is the product of its dimensions, we have
L12513: $$
L12514: \begin{equation*}
L12515: V=(16-2 x)(30-2 x) x=480 x-92 x^{2}+4 x^{3} \tag{5}
L12516: \end{equation*}
L12517: $$
L12519: Table 4.5.2
L12520: | $x$ | 0 | $\frac{10}{3}$ | 8 |
L12521: | :--- | :--- | :---: | :--- |
L12522: | $V$ | 0 | $\frac{19,600}{27} \approx 726$ | 0 |
L12525: [FIGURE:e3712da2f3b8e758 | A graph plots the volume $V$ (in$^2$) on the vertical axis against the length $x$ (in) on the horizontal axis. A blue curve, representing the volume of a box as a function of $x$, starts at $(0,0)$...]
L12526: Figure 4.5.4
L12528: [FIGURE:a8f35cf21ad2f426 | A diagram illustrates an offshore oil rig, labeled W, positioned 5 km directly above point A on the seabed. A horizontal line on the seabed extends from A to B, with a total length of 8 km. An...]
L12529: △ Figure 4.5.5
L12531: - Step 3: Note that our volume expression is already in terms of the single variable $x$.
L12532: - Step 4: The variable $x$ in (5) is subject to certain restrictions. Because $x$ represents a length, it cannot be negative, and because the width of the cardboard is 16 inches, we cannot cut out squares whose sides are more than 8 inches long. Thus, the variable $x$ in (5) must satisfy
L12534: $$
L12535: 0 \leq x \leq 8
L12536: $$
L12538: and hence we have reduced our problem to finding the value (or values) of $x$ in the interval $[0,8]$ for which (5) is a maximum.
L12540: - Step 5: From (5) we obtain
L12542: $$
L12543: \begin{aligned}
L12544: \frac{d V}{d x} & =480-184 x+12 x^{2}=4\left(120-46 x+3 x^{2}\right) \\
L12545: & =4(x-12)(3 x-10)
L12546: \end{aligned}
L12547: $$
L12549: Setting $d V / d x=0$ yields
L12551: $$
L12552: x=\frac{10}{3} \quad \text { and } \quad x=12
L12553: $$
L12555: Since $x=12$ falls outside the interval $[0,8]$, the maximum value of $V$ occurs either at the critical point $x=\frac{10}{3}$ or at the endpoints $x=0, x=8$. Substituting these values into (5) yields Table 4.5.2, which tells us that the greatest possible volume $V=\frac{19,600}{27}$ in $^{3} \approx 726$ in $^{3}$ occurs when we cut out squares whose sides have length $\frac{10}{3}$ inches. This is consistent with the graph of (5) shown in Figure 4.5.4.
L12557: Example 3 Figure 4.5.5 shows an offshore oil well located at a point $W$ that is 5 km from the closest point $A$ on a straight shoreline. Oil is to be piped from $W$ to a shore point $B$ that is 8 km from $A$ by piping it on a straight line under water from $W$ to some shore point $P$ between $A$ and $B$ and then on to $B$ via pipe along the shoreline. If the cost of laying pipe is $\$ 1,000,000 / \mathrm{km}$ under water and $\$ 500,000 / \mathrm{km}$ over land, where should the point $P$ be located to minimize the cost of laying the pipe?
L12559: Solution. Let
L12561: $$
L12562: \begin{aligned}
L12563: & x=\text { distance (in kilometers) between } A \text { and } P \\
L12564: & c=\text { cost (in millions of dollars) for the entire pipeline }
L12565: \end{aligned}
L12566: $$
L12568: From Figure 4.5.5 the length of pipe under water is the distance between $W$ and $P$. By the Theorem of Pythagoras that length is
L12570: $$
L12571: \begin{equation*}
L12572: \sqrt{x^{2}+25} \tag{6}
L12573: \end{equation*}
L12574: $$
L12576: Also from Figure 4.5.5, the length of pipe over land is the distance between $P$ and $B$, which is
L12578: $$
L12579: \begin{equation*}
L12580: 8-x \tag{7}
L12581: \end{equation*}
L12582: $$
L12584: From (6) and (7) it follows that the total cost $c$ (in millions of dollars) for the pipeline is
L12586: $$
L12587: \begin{equation*}
L12588: c=1\left(\sqrt{x^{2}+25}\right)+\frac{1}{2}(8-x)=\sqrt{x^{2}+25}+\frac{1}{2}(8-x) \tag{8}
L12589: \end{equation*}
L12590: $$
L12592: Because the distance between $A$ and $B$ is 8 km , the distance $x$ between $A$ and $P$ must satisfy
L12594: $$
L12595: 0 \leq x \leq 8
L12596: $$
L12598: We have thus reduced our problem to finding the value (or values) of $x$ in the interval $[0,8]$ for which $c$ is a minimum. Since $c$ is a continuous function of $x$ on the closed interval $[0,8]$, we can use the methods developed in the preceding section to find the minimum.
L12600: ## TECHNOLOGY MASTERY
L12602: If you have a CAS, use it to check all of the computations in Example 3. Specifically, differentiate $c$ with respect to $x$, solve the equation $d c / d x=0$, and perform all of the numerical calculations.
L12604: From (8) we obtain
L12606: $$
L12607: \frac{d c}{d x}=\frac{x}{\sqrt{x^{2}+25}}-\frac{1}{2}
L12608: $$
L12610: Setting $d c / d x=0$ and solving for $x$ yields
L12612: $$
L12613: \begin{align*}
L12614: \frac{x}{\sqrt{x^{2}+25}} & =\frac{1}{2}  \tag{9}\\
L12615: x^{2} & =\frac{1}{4}\left(x^{2}+25\right) \\
L12616: x & = \pm \frac{5}{\sqrt{3}}
L12617: \end{align*}
L12618: $$
L12620: The number $-5 / \sqrt{3}$ is not a solution of (9) and must be discarded, leaving $x=5 / \sqrt{3}$ as the only critical point. Since this point lies in the interval [0,8], the minimum must occur at one of the values
L12622: $$
L12623: x=0, \quad x=5 / \sqrt{3}, \quad x=8
L12624: $$
L12626: Substituting these values into (8) yields Table 4.5.3, which tells us that the least possible cost of the pipeline (to the nearest dollar) is $c=\$ 8,330,127$, and this occurs when the point $P$ is located at a distance of $5 / \sqrt{3} \approx 2.89 \mathrm{~km}$ from $A$.
L12628: Table 4.5.3
L12629: | $x$ | 0 | $\frac{5}{\sqrt{3}}$ | 8 |
L12630: | :--- | :--- | :---: | :---: |
L12631: | $c$ | 9 | $\frac{10}{\sqrt{3}}+\left(4-\frac{5}{2 \sqrt{3}}\right) \approx 8.330127$ | $\sqrt{89} \approx 9.433981$ |
L12634: [FIGURE:17904309f1a92b91 | The figure illustrates a right circular cone with an inscribed right circular cylinder, setting up a geometric optimization problem. Part (a) shows a 3D view of the cone, which has a total height of...]
L12635: △ Figure 4.5.6
L12637: Example 4 Find the radius and height of the right circular cylinder of largest volume that can be inscribed in a right circular cone with radius 6 inches and height 10 inches (Figure 4.5.6a).
L12639: ## Solution. Let
L12641: $$
L12642: \begin{aligned}
L12643: r & =\text { radius (in inches) of the cylinder } \\
L12644: h & =\text { height (in inches) of the cylinder } \\
L12645: V & =\text { volume (in cubic inches) of the cylinder }
L12646: \end{aligned}
L12647: $$
L12649: The formula for the volume of the inscribed cylinder is
L12651: $$
L12652: \begin{equation*}
L12653: V=\pi r^{2} h \tag{10}
L12654: \end{equation*}
L12655: $$
L12657: To eliminate one of the variables in (10) we need a relationship between $r$ and $h$. Using similar triangles (Figure 4.5.6b) we obtain
L12659: $$
L12660: \begin{equation*}
L12661: \frac{10-h}{r}=\frac{10}{6} \quad \text { or } \quad h=10-\frac{5}{3} r \tag{11}
L12662: \end{equation*}
L12663: $$
L12665: Substituting (11) into (10) we obtain
L12667: $$
L12668: \begin{equation*}
L12669: V=\pi r^{2}\left(10-\frac{5}{3} r\right)=10 \pi r^{2}-\frac{5}{3} \pi r^{3} \tag{12}
L12670: \end{equation*}
L12671: $$
L12673: which expresses $V$ in terms of $r$ alone. Because $r$ represents a radius, it cannot be negative, and because the radius of the inscribed cylinder cannot exceed the radius of the cone, the variable $r$ must satisfy
L12675: $$
L12676: 0 \leq r \leq 6
L12677: $$
L12679: Thus, we have reduced the problem to that of finding the value (or values) of $r$ in $[0,6]$ for which (12) is a maximum. Since $V$ is a continuous function of $r$ on $[0,6]$, the methods developed in the preceding section apply.
L12681: From (12) we obtain
L12683: $$
L12684: \frac{d V}{d r}=20 \pi r-5 \pi r^{2}=5 \pi r(4-r)
L12685: $$
L12687: Setting $d V / d r=0$ gives
L12689: $$
L12690: 5 \pi r(4-r)=0
L12691: $$
L12693: so $r=0$ and $r=4$ are critical points. Since these lie in the interval [ 0,6$]$, the maximum must occur at one of the values
L12695: $$
L12696: r=0, \quad r=4, \quad r=6
L12697: $$
L12699: Table 4.5.4
L12700: | $r$ | 0 | 4 | 6 |
L12701: | :---: | :---: | :---: | :---: |
L12702: | $V$ | 0 | $\frac{160}{3} \pi$ | 0 |
L12705: Substituting these values into (12) yields Table 4.5.4, which tells us that the maximum volume $V=\frac{160}{3} \pi \approx 168 \mathrm{in}^{3}$ occurs when the inscribed cylinder has radius 4 in . When $r=4$ it follows from (11) that $h=\frac{10}{3}$. Thus, the inscribed cylinder of largest volume has radius $r=4$ in and height $h=\frac{10}{3}$ in.
L12707: ## PROBLEMS INVOLVING INTERVALS THAT ARE NOT BOTH FINITE AND CLOSED
L12709: Example 5 A closed cylindrical can is to hold 1 liter $\left(1000 \mathrm{~cm}^{3}\right)$ of liquid. How should we choose the height and radius to minimize the amount of material needed to manufacture the can?
L12711: Solution. Let
L12713: $$
L12714: \begin{aligned}
L12715: h & =\text { height (in } \mathrm{cm} \text { ) of the can } \\
L12716: r & =\text { radius (in } \mathrm{cm} \text { ) of the can } \\
L12717: S & =\text { surface area (in } \mathrm{cm}^{2} \text { ) of the can }
L12718: \end{aligned}
L12719: $$
L12721: Assuming there is no waste or overlap, the amount of material needed for manufacture will be the same as the surface area of the can. Since the can consists of two circular disks of radius $r$ and a rectangular sheet with dimensions $h$ by $2 \pi r$ (Figure 4.5.7), the surface area will be
L12723: $$
L12724: \begin{equation*}
L12725: S=2 \pi r^{2}+2 \pi r h \tag{13}
L12726: \end{equation*}
L12727: $$
L12729: Since $S$ depends on two variables, $r$ and $h$, we will look for some condition in the problem that will allow us to express one of these variables in terms of the other. For this purpose,
L12731: [FIGURE:8b6dab1d267537fa | The diagram illustrates the components of a cylinder's surface area. The leftmost image shows a cylinder with radius $r$ and height $h$. The middle image depicts the two circular bases, each with...]
L12732: △ Figure 4.5.7
L12734: observe that the volume of the can is $1000 \mathrm{~cm}^{3}$, so it follows from the formula $V=\pi r^{2} h$ for the volume of a cylinder that
L12736: $$
L12737: \begin{equation*}
L12738: 1000=\pi r^{2} h \quad \text { or } \quad h=\frac{1000}{\pi r^{2}} \tag{14-15}
L12739: \end{equation*}
L12740: $$
L12742: Substituting (15) in (13) yields
L12744: $$
L12745: \begin{equation*}
L12746: S=2 \pi r^{2}+\frac{2000}{r} \tag{16}
L12747: \end{equation*}
L12748: $$
L12750: Thus, we have reduced the problem to finding a value of $r$ in the interval ( $0,+\infty$ ) for which $S$ is minimum. Since $S$ is a continuous function of $r$ on the interval ( $0,+\infty$ ) and
L12752: $$
L12753: \lim _{r \rightarrow 0^{+}}\left(2 \pi r^{2}+\frac{2000}{r}\right)=+\infty \quad \text { and } \quad \lim _{r \rightarrow+\infty}\left(2 \pi r^{2}+\frac{2000}{r}\right)=+\infty
L12754: $$
L12756: the analysis in Table 4.4.3 implies that $S$ does have a minimum on the interval $(0,+\infty)$. Since this minimum must occur at a critical point, we calculate
L12758: $$
L12759: \begin{equation*}
L12760: \frac{d S}{d r}=4 \pi r-\frac{2000}{r^{2}} \tag{17}
L12761: \end{equation*}
L12762: $$
L12764: Setting $d S / d r=0$ gives
L12766: $$
L12767: \begin{equation*}
L12768: r=\frac{10}{\sqrt[3]{2 \pi}} \approx 5.4 \tag{18}
L12769: \end{equation*}
L12770: $$
L12772: Since (18) is the only critical point in the interval ( $0,+\infty$ ), this value of $r$ yields the minimum value of $S$. From (15) the value of $h$ corresponding to this $r$ is
L12774: $$
L12775: h=\frac{1000}{\pi(10 / \sqrt[3]{2 \pi})^{2}}=\frac{20}{\sqrt[3]{2 \pi}}=2 r
L12776: $$
L12778: It is not an accident here that the minimum occurs when the height of the can is equal to the diameter of its base (Exercise 29).
L12780: Second Solution. The conclusion that a minimum occurs at the value of $r$ in (18) can be deduced from Theorem 4.4.4 and the second derivative test by noting that
L12782: $$
L12783: \frac{d^{2} S}{d r^{2}}=4 \pi+\frac{4000}{r^{3}}
L12784: $$
L12786: is positive if $r>0$ and hence is positive if $r=10 / \sqrt[3]{2 \pi}$. This implies that a relative minimum, and therefore a minimum, occurs at the critical point $r=10 / \sqrt[3]{2 \pi}$.
L12788: Third Solution. An alternative justification that the critical point $r=10 / \sqrt[3]{2 \pi}$ corresponds to a minimum for $S$ is to view the graph of $S$ versus $r$ (Figure 4.5.8).
L12790: In Example 5, the surface area $S$ has no absolute maximum, since $S$ increases without bound as the radius $r$ approaches 0 (Figure 4.5.8). Thus, had we asked for the dimensions of the can requiring the maximum amount of material for its manufacture, there would have been no solution to the problem. Optimization problems with no solution are sometimes called ill posed.
L12792: [FIGURE:29beb8ec30c70d20 | This graph plots the function $S = 2\pi r^2 + \frac{2000}{r}$ with $r$ on the horizontal axis and $S$ on the vertical axis. The curve starts high on the left, decreases to a minimum, and then...]
L12793: △ Figure 4.5.8
L12795: - Example 6 Find a point on the curve $y=x^{2}$ that is closest to the point $(18,0)$.
L12797: Solution. The distance $L$ between $(18,0)$ and an arbitrary point $(x, y)$ on the curve $y=x^{2}$ (Figure 4.5.9) is given by
L12799: $$
L12800: L=\sqrt{(x-18)^{2}+(y-0)^{2}}
L12801: $$
L12803: Since $(x, y)$ lies on the curve, $x$ and $y$ satisfy $y=x^{2}$; thus,
L12805: $$
L12806: \begin{equation*}
L12807: L=\sqrt{(x-18)^{2}+x^{4}} \tag{19}
L12808: \end{equation*}
L12809: $$
L12811: Because there are no restrictions on $x$, the problem reduces to finding a value of $x$ in $(-\infty,+\infty)$ for which (19) is a minimum. The distance $L$ and the square of the distance $L^{2}$
L12813: [FIGURE:e57b1c8241dbf2f3 | The graph displays the parabola $y=x^2$ in a Cartesian coordinate system with labeled $x$ and $y$ axes. A point $(x, y)$ is marked on the parabola in the first quadrant, and a dashed line segment...]
L12814: △ Figure 4.5.9
L12816: are minimized at the same value (see Exercise 66). Thus, the minimum value of $L$ in (19) and the minimum value of
L12818: $$
L12819: \begin{equation*}
L12820: S=L^{2}=(x-18)^{2}+x^{4} \tag{20}
L12821: \end{equation*}
L12822: $$
L12824: occur at the same $x$-value.
L12825: From (20),
L12827: $$
L12828: \begin{equation*}
L12829: \frac{d S}{d x}=2(x-18)+4 x^{3}=4 x^{3}+2 x-36 \tag{21}
L12830: \end{equation*}
L12831: $$
L12833: so the critical points satisfy $4 x^{3}+2 x-36=0$ or, equivalently,
L12835: $$
L12836: \begin{equation*}
L12837: 2 x^{3}+x-18=0 \tag{22}
L12838: \end{equation*}
L12839: $$
L12841: To solve for $x$ we will begin by checking the divisors of -18 to see whether the polynomial on the left side has any integer roots (see Appendix C). These divisors are $\pm 1, \pm 2, \pm 3, \pm 6$, $\pm 9$, and $\pm 18$. A check of these values shows that $x=2$ is a root, so $x-2$ is a factor of the polynomial. After dividing the polynomial by this factor we can rewrite (22) as
L12843: $$
L12844: (x-2)\left(2 x^{2}+4 x+9\right)=0
L12845: $$
L12847: Thus, the remaining solutions of (22) satisfy the quadratic equation
L12849: $$
L12850: 2 x^{2}+4 x+9=0
L12851: $$
L12853: But this equation has no real solutions (using the quadratic formula), so $x=2$ is the only critical point of $S$. To determine the nature of this critical point we will use the second derivative test. From (21),
L12855: $$
L12856: \frac{d^{2} S}{d x^{2}}=12 x^{2}+2, \quad \text { so }\left.\quad \frac{d^{2} S}{d x^{2}}\right|_{x=2}=50>0
L12857: $$
L12859: which shows that a relative minimum occurs at $x=2$. Since $x=2$ yields the only relative extremum for $L$, it follows from Theorem 4.4.4 that an absolute minimum value of $L$ also occurs at $x=2$. Thus, the point on the curve $y=x^{2}$ closest to $(18,0)$ is
L12861: $$
L12862: (x, y)=\left(x, x^{2}\right)=(2,4)
L12863: $$
