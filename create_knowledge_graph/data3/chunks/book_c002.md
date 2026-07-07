L00408: [FIGURE:dbb0c3f7837c6bb7 | A graph of a function $y=f(x)$ on an $xy$-coordinate system. The function is composed of two line segments that meet at an open circle at the point $(a, 2)$. A dashed vertical line extends from $x=a$...]
L00409: - Figure 1.1.14
L00411: [FIGURE:8713e2c8a0c149ec | A graph in the $xy$-plane shows a V-shaped curve representing the function $y=f(x)$. The curve starts at the origin, rises linearly to a peak at $x=a$ where $y=2$, and then descends linearly...]
L00412: - Figure 1.1.14
L00414: ## INFINITE LIMITS
L00416: Sometimes one-sided or two-sided limits fail to exist because the values of the function increase or decrease without bound. For example, consider the behavior of $f(x)=1 / x$ for values of $x$ near 0 . It is evident from the table and graph in Figure 1.1.15 that as $x$-values are taken closer and closer to 0 from the right, the values of $f(x)=1 / x$ are positive and increase without bound; and as $x$-values are taken closer and closer to 0 from the left, the values of $f(x)=1 / x$ are negative and decrease without bound. We describe these limiting behaviors by writing
L00418: $$
L00419: \lim _{x \rightarrow 0^{+}} \frac{1}{x}=+\infty \quad \text { and } \quad \lim _{x \rightarrow 0^{-}} \frac{1}{x}=-\infty
L00420: $$
L00422: [FIGURE:6e85ec3169bbfaaa | A graph shows the function $y = 1/x$ in a Cartesian coordinate system with labeled $x$ and $y$ axes. The curve has two branches, one in the first quadrant and one in the third. An arrow on the...]
L00423: [FIGURE:0246ec02801a2ce0 | A graph in a Cartesian coordinate system displays the function $y = 1/x$. The curve consists of two branches: one in the first quadrant and one in the third, both approaching the x and y axes...]
L00425: | $x$ | -1 | -0.1 | -0.01 | -0.001 | -0.0001 | 0 | 0.0001 | 0.001 | 0.01 | 0.1 | 1 |
L00426: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
L00427: | $\frac{1}{x}$ | -1 | -10 | -100 | -1000 | -10,000 |  | 10,000 | 1000 | 100 | 10 | 1 |
L00428: |  |  |  |  |  |  | Right side |  |  |  |  |  |
L00430: Figure 1.1.15
L00432: ### 1.1.4 INFINITE LIMITS (AN INFORMAL VIEW) The expressions
L00434: $$
L00435: \lim _{x \rightarrow a^{-}} f(x)=+\infty \quad \text { and } \quad \lim _{x \rightarrow a^{+}} f(x)=+\infty
L00436: $$
L00438: denote that $f(x)$ increases without bound as $x$ approaches $a$ from the left and from the right, respectively. If both are true, then we write
L00440: $$
L00441: \lim _{x \rightarrow a} f(x)=+\infty
L00442: $$
L00444: Similarly, the expressions
L00446: $$
L00447: \lim _{x \rightarrow a^{-}} f(x)=-\infty \quad \text { and } \quad \lim _{x \rightarrow a^{+}} f(x)=-\infty
L00448: $$
L00450: denote that $f(x)$ decreases without bound as $x$ approaches $a$ from the left and from the right, respectively. If both are true, then we write
L00452: $$
L00453: \lim _{x \rightarrow a} f(x)=-\infty
L00454: $$
L00456: - Example 7 For the functions in Figure 1.1.16, describe the limits at $x=a$ in appropriate limit notation.
L00458: Solution (a). In Figure 1.1.16a, the function increases without bound as $x$ approaches $a$ from the right and decreases without bound as $x$ approaches $a$ from the left. Thus,
L00460: $$
L00461: \lim _{x \rightarrow a^{+}} \frac{1}{x-a}=+\infty \quad \text { and } \quad \lim _{x \rightarrow a^{-}} \frac{1}{x-a}=-\infty
L00462: $$
L00464: Solution (b). In Figure 1.1.16b, the function increases without bound as $x$ approaches $a$ from both the left and right. Thus,
L00466: $$
L00467: \lim _{x \rightarrow a} \frac{1}{(x-a)^{2}}=\lim _{x \rightarrow a^{+}} \frac{1}{(x-a)^{2}}=\lim _{x \rightarrow a^{-}} \frac{1}{(x-a)^{2}}=+\infty
L00468: $$
L00470: Solution (c). In Figure 1.1.16c, the function decreases without bound as $x$ approaches $a$ from the right and increases without bound as $x$ approaches $a$ from the left. Thus,
L00472: $$
L00473: \lim _{x \rightarrow a^{+}} \frac{-1}{x-a}=-\infty \quad \text { and } \quad \lim _{x \rightarrow a^{-}} \frac{-1}{x-a}=+\infty
L00474: $$
L00476: Solution (d). In Figure 1.1.16d, the function decreases without bound as $x$ approaches $a$ from both the left and right. Thus,
L00478: $$
L00479: \lim _{x \rightarrow a} \frac{-1}{(x-a)^{2}}=\lim _{x \rightarrow a^{+}} \frac{-1}{(x-a)^{2}}=\lim _{x \rightarrow a^{-}} \frac{-1}{(x-a)^{2}}=-\infty
L00480: $$
L00482: [FIGURE:ca5bba8612e69675 | This figure presents four graphs, each demonstrating a different infinite limit behavior as $x$ approaches $a$, where $x=a$ is a vertical asymptote. Graph (a) for $f(x) = \frac{1}{x-a}$ and (c) for...]
L00483: △ Figure 1.1.16
L00485: ## VERTICAL ASYMPTOTES
L00487: Figure 1.1.17 illustrates geometrically what happens when any of the following situations occur:
L00489: $$
L00490: \lim _{x \rightarrow a^{-}} f(x)=+\infty, \quad \lim _{x \rightarrow a^{+}} f(x)=+\infty, \quad \lim _{x \rightarrow a^{-}} f(x)=-\infty, \quad \lim _{x \rightarrow a^{+}} f(x)=-\infty
L00491: $$
L00493: In each case the graph of $y=f(x)$ either rises or falls without bound, squeezing closer and closer to the vertical line $x=a$ as $x$ approaches $a$ from the side indicated in the limit. The line $x=a$ is called a vertical asymptote of the curve $y=f(x)$ (from the Greek word asymptotos, meaning "nonintersecting").
L00495: [FIGURE:c7d001e05cb74c38 | The figure displays four separate graphs, each illustrating a different case of a one-sided limit approaching infinity, which indicates a vertical asymptote at $x=a$. The first graph shows $f(x)$...]
L00496: - Figure 1.1.17
L00498: For the function in (16), find expressions for the left- and right-hand limits at each asymptote.
L00500: Example 8 Referring to Figure 0.5.7 we see that the $y$-axis is a vertical asymptote for $y=\log _{b} x$ if $b>1$ since
L00502: $$
L00503: \lim _{x \rightarrow 0^{+}} \log _{b} x=-\infty
L00504: $$
L00506: and referring to Figure 0.3.11 we see that $x=-1$ and $x=1$ are vertical asymptotes of the graph of
L00508: $$
L00509: \begin{equation*}
L00510: f(x)=\frac{x^{2}+2 x}{x^{2}-1} \tag{16}
L00511: \end{equation*}
L00512: $$
L00514: ## QUICK CHECK EXERCISES 1.1 (See page 80 for answers.)
L00516: 1. We write $\lim _{x \rightarrow a} f(x)=L$ provided the values of
L00517: $\_\_\_\_$ can be made as close to $\_\_\_\_$ as desired, by taking values of $\_\_\_\_$ sufficiently close to $\_\_\_\_$ but not $\_\_\_\_$ .
L00518: 2. We write $\lim _{x \rightarrow a^{-}} f(x)=+\infty$ provided $\_\_\_\_$ increases without bound, as $\_\_\_\_$ approaches $\_\_\_\_$ from the left.
L00519: 3. State what must be true about
L00521: $$
L00522: \lim _{x \rightarrow a^{-}} f(x) \quad \text { and } \quad \lim _{x \rightarrow a^{+}} f(x)
L00523: $$
L00525: in order for it to be the case that
L00527: $$
L00528: \lim _{x \rightarrow a} f(x)=L
L00529: $$
L00531: 4. Use the accompanying graph of $y=f(x)(-\infty<x<3)$ to determine the limits.
L00532: (a) $\lim _{x \rightarrow 0} f(x)=$ $\_\_\_\_$
L00533: (b) $\lim _{x \rightarrow 2^{-}} f(x)=$ $\_\_\_\_$
L00534: (c) $\lim _{x \rightarrow 2^{+}} f(x)=$ $\_\_\_\_$
L00535: (d) $\lim _{x \rightarrow 3^{-}} f(x)=$ $\_\_\_\_$
L00537: [FIGURE:bf9123c4395af280 | The graph of a piecewise function $y=f(x)$ is shown on a Cartesian coordinate system with labeled $x$ and $y$ axes. The function consists of a line segment from $(-2, 2)$ to $(0, 0)$, another segment...]
L00538: \& Figure Ex-4
L00540: 5. The slope of the secant line through $P(2,4)$ and $Q\left(x, x^{2}\right)$ on the parabola $y=x^{2}$ is $m_{\text {sec }}=x+2$. It follows that the slope of the tangent line to this parabola at the point $P$ is
L00541: $\_\_\_\_$ .
L00543: 1-10 In these exercises, make reasonable assumptions about the graph of the indicated function outside of the region depicted. $\square$
L00545: 1. For the function $g$ graphed in the accompanying figure, find
L00546: (a) $\lim _{x \rightarrow 0^{-}} g(x)$
L00547: (b) $\lim _{x \rightarrow 0^{+}} g(x)$
L00548: (c) $\lim _{x \rightarrow 0} g(x)$
L00549: (d) $g(0)$.
L00550: [FIGURE:a9d60be64a30a71c | A graph displays the function $y=g(x)$ on a coordinate plane with a grid. The x-axis is labeled 'x' and has a tick mark at 9; the y-axis is labeled 'y' and has a tick mark at 4. The curve $y=g(x)$ is...]
L00552: Figure Ex-1
L00553: 2. For the function $G$ graphed in the accompanying figure, find
L00554: (a) $\lim _{x \rightarrow 0^{-}} G(x)$
L00555: (b) $\lim _{x \rightarrow 0^{+}} G(x)$
L00556: (c) $\lim _{x \rightarrow 0} G(x)$
L00557: (d) $G(0)$.
L00558: [FIGURE:600fc73f9b5b2267 | A graph displays the function $y=G(x)$ as a periodic wave on a coordinate plane with a grid. The x-axis and y-axis are labeled, with a tick mark at $y=2$ and $x=5$. The wave oscillates between $y=-2$...]
L00560: Figure Ex-2
L00561: 3. For the function $f$ graphed in the accompanying figure, find
L00562: (a) $\lim _{x \rightarrow 3^{-}} f(x)$
L00563: (b) $\lim _{x \rightarrow 3^{+}} f(x)$
L00564: (c) $\lim _{x \rightarrow 3} f(x)$
L00565: (d) $f(3)$.
L00566: [FIGURE:cf37fbcc97c1990a | A graph of the function $y=f(x)$ is shown on a Cartesian coordinate system with an x-axis labeled 'x' and a y-axis labeled 'y', overlaid on a grid. The function is defined piecewise: for $x < 3$...]
L00568: Figure Ex-3
L00569: 4. For the function $f$ graphed in the accompanying figure, find
L00570: (a) $\lim _{x \rightarrow 2^{-}} f(x)$
L00571: (b) $\lim _{x \rightarrow 2^{+}} f(x)$
L00572: (c) $\lim _{x \rightarrow 2} f(x)$
L00573: (d) $f(2)$.
L00574: [FIGURE:88f66145727fb5a4 | A graph displays the function $y=f(x)$ on a coordinate plane with a grid. The x-axis and y-axis are labeled, with major tick marks at integer values. The function $f(x)$ is continuous everywhere...]
L00576: Figure Ex-4
L00577: 5. For the function $F$ graphed in the accompanying figure, find
L00578: (a) $\lim _{x \rightarrow-2^{-}} F(x)$
L00579: (b) $\lim _{x \rightarrow-2^{+}} F(x)$
L00580: (c) $\lim _{x \rightarrow-2} F(x)$
L00581: (d) $F(-2)$.
L00583: [FIGURE:101cc2c78974b5f4 | A graph on an x-y coordinate plane displays the function $y = F(x)$. The function consists of two line segments forming a V-shape, with an open circle at $(-2, 0)$ indicating a removable...]
L00584: Figure Ex-5
L00586: 6. For the function $G$ graphed in the accompanying figure, find
L00587: (a) $\lim _{x \rightarrow 0^{-}} G(x)$
L00588: (b) $\lim _{x \rightarrow 0^{+}} G(x)$
L00589: (c) $\lim _{x \rightarrow 0} G(x)$
L00590: (d) $G(0)$.
L00592: [FIGURE:f2e6f619e44b3213 | A graph of the function $y = G(x)$ on a coordinate plane with x-axis labeled from -3 to 3 and y-axis labeled from -2 to 2. The curve is continuous everywhere except at $x=0$. As $x$ approaches 0 from...]
L00593: -Figure Ex-6
L00595: 7. For the function $f$ graphed in the accompanying figure, find
L00596: (a) $\lim _{x \rightarrow 3^{-}} f(x)$
L00597: (b) $\lim _{x \rightarrow 3^{+}} f(x)$
L00598: (c) $\lim _{x \rightarrow 3} f(x)$
L00599: (d) $f(3)$.
L00601: [FIGURE:53ed52a235f5ce86 | A graph of the function $y = f(x)$ is shown on a coordinate plane with a grid. The curve approaches negative infinity as $x$ approaches 3 from both the left and the right, indicating a vertical...]
L00602: Figure Ex-7
L00604: 8. For the function $\phi$ graphed in the accompanying figure, find
L00605: (a) $\lim _{x \rightarrow 4^{-}} \phi(x)$
L00606: (b) $\lim _{x \rightarrow 4^{+}} \phi(x)$
L00607: (c) $\lim _{x \rightarrow 4} \phi(x)$
L00608: (d) $\phi(4)$.
L00610: [FIGURE:eaebff48e0fabb9a | A graph shows the function $y = \phi(x)$ on a coordinate plane with a grid. The curve has a vertical asymptote at $x=4$, approaching positive infinity as $x$ approaches 4 from the left, and negative...]
L00611: Figure Ex-8
L00613: 9. For the function $f$ graphed in the accompanying figure on the next page, find
L00614: (a) $\lim _{x \rightarrow 0^{-}} f(x)$
L00615: (b) $\lim _{x \rightarrow 0^{+}} f(x)$
L00616: (c) $\lim _{x \rightarrow 0} f(x)$
L00617: (d) $f(0)$.
L00619: [FIGURE:420edf75ebab5eb8 | A graph displays a function $y=f(x)$ on a Cartesian coordinate system with x and y axes. The function is piecewise: for $x < 0$, it is a line segment approaching an open circle at $(0, 1)$; for $x...]
L00620: \& Figure Ex-9
L00622: 10. For the function $g$ graphed in the accompanying figure, find
L00623: (a) $\lim _{x \rightarrow 1^{-}} g(x)$
L00624: (b) $\lim _{x \rightarrow 1^{+}} g(x)$
L00625: (c) $\lim _{x \rightarrow 1} g(x)$
L00626: (d) $g(1)$.
L00628: [FIGURE:7c8e250a4198c734 | A graph displays the function $y=g(x)$ on a Cartesian coordinate system with $x$ and $y$ axes. For $x < 1$, the curve is increasing, passing through $(0,1)$ and approaching $y=3$ as $x$ approaches...]
L00629: Figure Ex-10
L00631: 口 11-12 (i) Complete the table and make a guess about the limit indicated. (ii) Confirm your conclusions about the limit by graphing a function over an appropriate interval. [Note: For the inverse trigonometric function, be sure to put your calculating and graphing utilities in radian mode.]
L00632: 11. $f(x)=\frac{e^{x}-1}{x} ; \lim _{x \rightarrow 0} f(x)$
L00634: | $x$ | -0.01 | -0.001 | -0.0001 | 0.0001 | 0.001 | 0.01 |
L00635: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
L00636: | $f(x)$ |  |  |  |  |  |  |
L00638: ## - Table Ex-11
L00640: 12. $f(x)=\frac{\sin ^{-1} 2 x}{x} ; \lim _{x \rightarrow 0} f(x)$
L00642: | $x$ | -0.1 | -0.01 | -0.001 | 0.001 | 0.01 | 0.1 |
L00643: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
L00644: | $f(x)$ |  |  |  |  |  |  |
L00646: - Table Ex-12
L00648: C 13-16 (i) Make a guess at the limit (if it exists) by evaluating the function at the specified $x$-values. (ii) Confirm your conclusions about the limit by graphing the function over an appropriate interval. (iii) If you have a CAS, then use it to find the limit. [Note: For the trigonometric functions, be sure to put your calculating and graphing utilities in radian mode.]
L00649: 13. (a) $\lim _{x \rightarrow 1} \frac{x-1}{x^{3}-1} ; x=2,1.5,1.1,1.01,1.001,0,0.5,0.9$, 0.99, 0.999
L00650: (b) $\lim _{x \rightarrow 1^{+}} \frac{x+1}{x^{3}-1} ; x=2,1.5,1.1,1.01,1.001,1.0001$
L00651: (c) $\lim _{x \rightarrow 1^{-}} \frac{x+1}{x^{3}-1} ; x=0,0.5,0.9,0.99,0.999,0.9999$
L00652: 14. (a) $\lim _{x \rightarrow 0} \frac{\sqrt{x+1}-1}{x} ; x= \pm 0.25, \pm 0.1, \pm 0.001$, $\pm 0.0001$
L00653: (b) $\lim _{x \rightarrow 0^{+}} \frac{\sqrt{x+1}+1}{x} ; x=0.25,0.1,0.001,0.0001$
L00654: (c) $\lim _{x \rightarrow 0^{-}} \frac{\sqrt{x+1}+1}{x} ; x=-0.25,-0.1,-0.001$, -0.0001
L00655: 15. (a) $\lim _{x \rightarrow 0} \frac{\sin 3 x}{x} ; x= \pm 0.25, \pm 0.1, \pm 0.001, \pm 0.0001$
L00656: (b) $\lim _{x \rightarrow-1} \frac{\cos x}{x+1} ; x=0,-0.5,-0.9,-0.99,-0.999$, $-1.5,-1.1,-1.01,-1.001$
L00657: 16. (a) $\lim _{x \rightarrow-1} \frac{\tan (x+1)}{x+1} ; x=0,-0.5,-0.9,-0.99,-0.999$, $-1.5,-1.1,-1.01,-1.001$
L00658: (b) $\lim _{x \rightarrow 0} \frac{\sin (5 x)}{\sin (2 x)} ; x= \pm 0.25, \pm 0.1, \pm 0.001, \pm 0.0001$
L00660: 17-20 True-False Determine whether the statement is true or false. Explain your answer.
L00661: 17. If $f(a)=L$, then $\lim _{x \rightarrow a} f(x)=L$.
L00662: 18. If $\lim _{x \rightarrow a} f(x)$ exists, then so do $\lim _{x \rightarrow a^{-}} f(x)$ and $\lim _{x \rightarrow a^{+}} f(x)$.
L00663: 19. If $\lim _{x \rightarrow a^{-}} f(x)$ and $\lim _{x \rightarrow a^{+}} f(x)$ exist, then so does $\lim _{x \rightarrow a} f(x)$.
L00664: 20. If $\lim _{x \rightarrow a^{+}} f(x)=+\infty$, then $f(a)$ is undefined.
L00666: 21-26 Sketch a possible graph for a function $f$ with the specified properties. (Many different solutions are possible.)
L00667: 21. (i) the domain of $f$ is $[-1,1]$
L00668: (ii) $f(-1)=f(0)=f(1)=0$
L00669: (iii) $\lim _{x \rightarrow-1^{+}} f(x)=\lim _{x \rightarrow 0} f(x)=\lim _{x \rightarrow 1^{-}} f(x)=1$
L00670: 22. (i) the domain of $f$ is $[-2,1]$
L00671: (ii) $f(-2)=f(0)=f(1)=0$
L00672: (iii) $\lim _{x \rightarrow-2^{+}} f(x)=2, \lim _{x \rightarrow 0} f(x)=0$, and $\lim _{x \rightarrow 1^{-}} f(x)=1$
L00673: 23. (i) the domain of $f$ is $(-\infty, 0]$
L00674: (ii) $f(-2)=f(0)=1$
L00675: (iii) $\lim _{x \rightarrow-2} f(x)=+\infty$
L00676: 24. (i) the domain of $f$ is ( $0,+\infty$ )
L00677: (ii) $f(1)=0$
L00678: (iii) the $y$-axis is a vertical asymptote for the graph of $f$
L00679: (iv) $f(x)<0$ if $0<x<1$
L00680: 25. (i) $f(-3)=f(0)=f(2)=0$
L00681: (ii) $\lim _{x \rightarrow-2^{-}} f(x)=+\infty$ and $\lim _{x \rightarrow-2^{+}} f(x)=-\infty$
L00682: (iii) $\lim _{x \rightarrow 1} f(x)=+\infty$
L00683: 26. (i) $f(-1)=0, f(0)=1, f(1)=0$
L00684: (ii) $\lim _{x \rightarrow-1^{-}} f(x)=0$ and $\lim _{x \rightarrow-1^{+}} f(x)=+\infty$
L00685: (iii) $\lim _{x \rightarrow 1^{-}} f(x)=1$ and $\lim _{x \rightarrow 1^{+}} f(x)=+\infty$
L00687: 27-30 Modify the argument of Example 1 to find the equation of the tangent line to the specified graph at the point given.
L00688: 27. the graph of $y=x^{2}$ at $(-1,1)$
L00689: 28. the graph of $y=x^{2}$ at $(0,0)$
L00690: 29. the graph of $y=x^{4}$ at $(1,1)$
L00691: 30. the graph of $y=x^{4}$ at $(-1,1)$
L00693: ## FOCUS ON CONCEPTS
L00695: 31. In the special theory of relativity the length $l$ of a narrow rod moving longitudinally is a function $l=l(v)$ of the rod's speed $v$. The accompanying figure, in which $c$ denotes the speed of light, displays some of the qualitative features of this function.
L00696: (a) What is the physical interpretation of $l_{0}$ ?
L00697: (b) What is $\lim _{v \rightarrow c^{-}} l(v)$ ? What is the physical significance of this limit?
L00699: [FIGURE:fa7cffc0c5f1b1ae | A two-dimensional graph shows length $l$ as a function of speed $v$. The horizontal axis is labeled "Speed" ($v$), and the vertical axis is labeled "Length" ($l$). A blue curve, labeled $l = l(v)$...]
L00700: Figure Ex-31
L00702: 32. In the special theory of relativity the mass $m$ of a moving object is a function $m=m(v)$ of the object's speed $v$. The accompanying figure, in which $c$ denotes the speed of light, displays some of the qualitative features of this function.
L00703: (a) What is the physical interpretation of $m_{0}$ ?
L00704: (b) What is $\lim _{v \rightarrow c^{-}} m(v)$ ? What is the physical significance of this limit?
L00706: [FIGURE:bcb0682534c4e818 | A 2D graph plots Mass ($m$) on the y-axis against Speed ($v$) on the x-axis. A blue curve, labeled $m = m(v)$, starts at $(0, m_0)$ and shows that mass increases with speed. The curve is relatively...]
L00707: Figure Ex-32
L00709: 33. What do the graphs in Figure 0.5.4 imply about the value of
L00711: $$
L00712: \lim _{x \rightarrow 0} \frac{e^{x}-1}{x}
L00713: $$
L00715: Explain your answer.
L00716: (c) 34. Let
L00718: $$
L00719: f(x)=\frac{x-\sin x}{x^{3}}
L00720: $$
L00722: (a) Make a conjecture about the limit of $f$ as $x \rightarrow 0^{+}$by completing the table.
L00724: | $x$ | 0.5 | 0.1 | 0.05 | 0.01 |
L00725: | :---: | :---: | :---: | :---: | :---: |
L00726: | $f(x)$ |  |  |  |  |
L00728: (b) Make another conjecture about the limit of $f$ as $x \rightarrow 0^{+}$ by evaluating $f(x)$ at $x=0.0001,0.00001,0.000001$, 0.0000001, $0.00000001,0.000000001$.
L00729: (c) The phenomenon exhibited in part (b) is called catastrophic subtraction. What do you think causes catastrophic subtraction? How does it put restrictions on the use of numerical evidence to make conjectures about limits?
L00730: (d) If you have a CAS, use it to show that the exact value of the limit is $\frac{1}{6}$.
L00731: 35. Let
L00733: $$
L00734: f(x)=\left(1+x^{2}\right)^{1.1 / x^{2}}
L00735: $$
L00737: (a) Graph $f$ in the window
L00739: $$
L00740: [-1,1] \times[2.5,3.5]
L00741: $$
L00743: and use the calculator's trace feature to make a conjecture about the limit of $f(x)$ as $x \rightarrow 0$.
L00744: (b) Graph $f$ in the window
L00746: $$
L00747: [-0.001,0.001] \times[2.5,3.5]
L00748: $$
L00750: and use the calculator's trace feature to make a conjecture about the limit of $f(x)$ as $x \rightarrow 0$.
L00751: (c) Graph $f$ in the window
L00753: $$
L00754: [-0.000001,0.000001] \times[2.5,3.5]
L00755: $$
L00757: and use the calculator's trace feature to make a conjecture about the limit of $f(x)$ as $x \rightarrow 0$.
L00758: (d) Later we will be able to show that
L00760: $$
L00761: \lim _{x \rightarrow 0}\left(1+x^{2}\right)^{1.1 / x^{2}} \approx 3.00416602
L00762: $$
L00764: What flaw do your graphs reveal about using numerical evidence (as revealed by the graphs you obtained) to make conjectures about limits?
L00765: 36. Writing Two students are discussing the limit of $\sqrt{x}$ as $x$ approaches 0 . One student maintains that the limit is 0 , while the other claims that the limit does not exist. Write a short paragraph that discusses the pros and cons of each student's position.
L00766: 37. Writing Given a function $f$ and a real number $a$, explain informally why
L00768: $$
L00769: \lim _{x \rightarrow 0} f(x+a)=\lim _{x \rightarrow a} f(x)
L00770: $$
L00772: (Here "equality" means that either both limits exist and are equal or that both limits fail to exist.)
L00774: ## QUICK CHECK ANSWERS 1.1
L00776: 1. $f(x) ; L ; x ; a$
L00777: 2. $f(x) ; x ; a$
L00778: 3. Both one-sided limits must exist and equal $L$.
L00779: 4. (a) 0 (b) 1
L00780: (c) $+\infty$
L00781: (d) $-\infty$
L00782: 5. 4
