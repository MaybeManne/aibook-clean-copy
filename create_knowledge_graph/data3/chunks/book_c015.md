L04865: In general, we will say that $f$ is differentiable on an interval of the form $[a, b],[a,+\infty)$, $(-\infty, b],[a, b)$, or $(a, b]$ if it is differentiable at all points inside the interval and the appropriate one-sided derivative exists at each included endpoint.
L04867: It can be proved that a function $f$ is continuous from the left at those points where the left-hand derivative exists and is continuous from the right at those points where the right-hand derivative exists.
L04869: ## OTHER DERIVATIVE NOTATIONS
L04871: The process of finding a derivative is called differentiation. You can think of differentiation as an operation on functions that associates a function $f^{\prime}$ with a function $f$. When the independent variable is $x$, the differentiation operation is also commonly denoted by
L04873: $$
L04874: f^{\prime}(x)=\frac{d}{d x}[f(x)] \quad \text { or } \quad f^{\prime}(x)=D_{x}[f(x)]
L04875: $$
L04877: In the case where there is a dependent variable $y=f(x)$, the derivative is also commonly denoted by
L04879: $$
L04880: f^{\prime}(x)=y^{\prime}(x) \quad \text { or } \quad f^{\prime}(x)=\frac{d y}{d x}
L04881: $$
L04883: With the above notations, the value of the derivative at a point $x_{0}$ can be expressed as
L04885: $$
L04886: f^{\prime}\left(x_{0}\right)=\left.\frac{d}{d x}[f(x)]\right|_{x=x_{0}}, \quad f^{\prime}\left(x_{0}\right)=\left.D_{x}[f(x)]\right|_{x=x_{0}}, \quad f^{\prime}\left(x_{0}\right)=y^{\prime}\left(x_{0}\right), \quad f^{\prime}\left(x_{0}\right)=\left.\frac{d y}{d x}\right|_{x=x_{0}}
L04887: $$
L04889: If a variable $w$ changes from some initial value $w_{0}$ to some final value $w_{1}$, then the final value minus the initial value is called an increment in $w$ and is denoted by
L04891: $$
L04892: \begin{equation*}
L04893: \Delta w=w_{1}-w_{0} \tag{8}
L04894: \end{equation*}
L04895: $$
L04897: Increments can be positive or negative, depending on whether the final value is larger or smaller than the initial value. The increment symbol in (8) should not be interpreted as a product; rather, $\Delta w$ should be regarded as a single symbol representing the change in the value of $w$.
L04899: It is common to regard the variable $h$ in the derivative formula
L04901: $$
L04902: \begin{equation*}
L04903: f^{\prime}(x)=\lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h} \tag{9}
L04904: \end{equation*}
L04905: $$
L04907: as an increment $\Delta x$ in $x$ and write (9) as
L04909: $$
L04910: \begin{equation*}
L04911: f^{\prime}(x)=\lim _{\Delta x \rightarrow 0} \frac{f(x+\Delta x)-f(x)}{\Delta x} \tag{10}
L04912: \end{equation*}
L04913: $$
L04915: Moreover, if $y=f(x)$, then the numerator in (10) can be regarded as the increment
L04917: $$
L04918: \begin{equation*}
L04919: \Delta y=f(x+\Delta x)-f(x) \tag{11}
L04920: \end{equation*}
L04921: $$
L04923: in which case
L04925: $$
L04926: \begin{equation*}
L04927: \frac{d y}{d x}=\lim _{\Delta x \rightarrow 0} \frac{\Delta y}{\Delta x}=\lim _{\Delta x \rightarrow 0} \frac{f(x+\Delta x)-f(x)}{\Delta x} \tag{12}
L04928: \end{equation*}
L04929: $$
L04931: The geometric interpretations of $\Delta x$ and $\Delta y$ are shown in Figure 2.2.14.
L04932: Sometimes it is desirable to express derivatives in a form that does not use increments at all. For example, if we let $w=x+h$ in Formula (9), then $w \rightarrow x$ as $h \rightarrow 0$, so we can rewrite that formula as
L04934: $$
L04935: \begin{equation*}
L04936: f^{\prime}(x)=\lim _{w \rightarrow x} \frac{f(w)-f(x)}{w-x} \tag{13}
L04937: \end{equation*}
L04938: $$
L04940: (Compare Figures 2.2.14 and 2.2.15.)
L04942: [FIGURE:b666b2157231aca2 | The graph illustrates the geometric interpretation of the derivative. A curve $y=f(x)$ is shown with two points, $P$ at $(x, f(x))$ and $Q$ at $(x+\Delta x, f(x+\Delta x))$. The horizontal distance...]
L04943: - Figure 2.2.14
L04945: [FIGURE:067e7efe3f5e8b57 | The figure displays a graph of a function $y=f(x)$ with two points $P=(x, f(x))$ and $Q=(w, f(w))$. A secant line connects $P$ and $Q$, with the horizontal distance between them labeled $w-x$ and the...]
L04946: - Figure 2.2.15
L04948: When letters other than $x$ and $y$ are used for the independent and dependent variables, the derivative notations must be adjusted accordingly. Thus, for example, if $s=f(t)$ is the position function for a particle in rectilinear motion, then the velocity function $v(t)$ in (4) can be expressed as
L04950: $$
L04951: \begin{equation*}
L04952: v(t)=\frac{d s}{d t}=\lim _{\Delta t \rightarrow 0} \frac{\Delta s}{\Delta t}=\lim _{\Delta t \rightarrow 0} \frac{f(t+\Delta t)-f(t)}{\Delta t} \tag{14}
L04953: \end{equation*}
L04954: $$
L04956: ## QUICK CHECK EXERCISES 2.2 (See page 155 for answers.)
L04958: 1. The function $f^{\prime}(x)$ is defined by the formula
L04960: $$
L04961: f^{\prime}(x)=\lim _{h \rightarrow 0}
L04962: $$
L04964: 2. (a) The derivative of $f(x)=x^{2}$ is $f^{\prime}(x)=$ $\_\_\_\_$ .
L04965: (b) The derivative of $f(x)=\sqrt{x}$ is $f^{\prime}(x)=$ $\_\_\_\_$ .
L04966: 3. Suppose that the line $2 x+3 y=5$ is tangent to the graph of $y=f(x)$ at $x=1$. The value of $f(1)$ is $\_\_\_\_$ and the value of $f^{\prime}(1)$ is $\_\_\_\_$ .
L04967: 4. Which theorem guarantees us that if
L04969: $$
L04970: \lim _{h \rightarrow 0} \frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h}
L04971: $$
L04973: exists, then $\lim _{x \rightarrow x_{0}} f(x)=f\left(x_{0}\right)$ ?
L04975: 1. Use the graph of $y=f(x)$ in the accompanying figure to estimate the value of $f^{\prime}(1), f^{\prime}(3), f^{\prime}(5)$, and $f^{\prime}(6)$.
L04977: [FIGURE:97d566485e44660f | A graph displays a curve $y=f(x)$ on an x-y coordinate plane, with grid lines and labeled axes. Tangent lines are drawn at four points on the curve: at $x=1$, $x=3$, $x=5$, and $x=6$, to illustrate...]
L04978: Figure Ex-1
L04980: 2. For the function graphed in the accompanying figure, arrange the numbers $0, f^{\prime}(-3), f^{\prime}(0), f^{\prime}(2)$, and $f^{\prime}(4)$ in increasing order.
L04982: [FIGURE:aeafd814e2892f49 | The graph of a function $y=f(x)$ is plotted on a Cartesian coordinate system with x and y axes ranging from -5 to 5. The curve starts at approximately $(-5, -1)$, increases to a local maximum around...]
L04983: Figure Ex-2
L04985: ## FOCUS ON CONCEPTS
L04987: 3. (a) If you are given an equation for the tangent line at the point ( $a, f(a)$ ) on a curve $y=f(x)$, how would you go about finding $f^{\prime}(a)$ ?
L04988: (b) Given that the tangent line to the graph of $y=f(x)$ at the point $(2,5)$ has the equation $y=3 x-1$, find $f^{\prime}(2)$.
L04989: (c) For the function $y=f(x)$ in part (b), what is the instantaneous rate of change of $y$ with respect to $x$ at $x=2$ ?
L04990: 4. Given that the tangent line to $y=f(x)$ at the point $(1,2)$ passes through the point $(-1,-1)$, find $f^{\prime}(1)$.
L04991: 5. Sketch the graph of a function $f$ for which $f(0)=-1$, $f^{\prime}(0)=0, f^{\prime}(x)<0$ if $x<0$, and $f^{\prime}(x)>0$ if $x>0$.
L04992: 6. Sketch the graph of a function $f$ for which $f(0)=0$, $f^{\prime}(0)=0$, and $f^{\prime}(x)>0$ if $x<0$ or $x>0$.
L04993: 7. Given that $f(3)=-1$ and $f^{\prime}(3)=5$, find an equation for the tangent line to the graph of $y=f(x)$ at $x=3$.
L04994: 8. Given that $f(-2)=3$ and $f^{\prime}(-2)=-4$, find an equation for the tangent line to the graph of $y=f(x)$ at $x=-2$.
L04996: 9-14 Use Definition 2.2.1 to find $f^{\prime}(x)$, and then find the tangent line to the graph of $y=f(x)$ at $x=a$.
L04997: 9. $f(x)=2 x^{2} ; a=1$
L04998: 10. $f(x)=1 / x^{2} ; a=-1$
L04999: 11. $f(x)=x^{3} ; a=0$
L05000: 12. $f(x)=2 x^{3}+1 ; a=-1$
L05001: 13. $f(x)=\sqrt{x+1} ; a=8$
L05002: 14. $f(x)=\sqrt{2 x+1} ; a=4$
L05004: 15-20 Use Formula (12) to find $d y / d x$.
L05005: 15. $y=\frac{1}{x}$
L05006: 16. $y=\frac{1}{x+1}$
L05007: 17. $y=x^{2}-x$
L05008: 18. $y=x^{4}$
L05009: 19. $y=\frac{1}{\sqrt{x}}$
L05010: 20. $y=\frac{1}{\sqrt{x-1}}$
L05012: 21-22 Use Definition 2.2.1 (with appropriate change in notation) to obtain the derivative requested.
L05013: 21. Find $f^{\prime}(t)$ if $f(t)=4 t^{2}+t$.
L05014: 22. Find $d V / d r$ if $V=\frac{4}{3} \pi r^{3}$.
L05016: ## FOCUS ON CONCEPTS
L05018: 23. Match the graphs of the functions shown in (a)-(f) with the graphs of their derivatives in (A)-(F).
L05020: (a)
L05021: [FIGURE:c85ce8fa5807a03f | A graph shows a piecewise linear function. For $x < 0$, the function is a straight line with a positive slope, extending from the third quadrant towards the origin. At $x = 0$, the function...]
L05023: (b)
L05024: [FIGURE:d55ba0dbb267aad0 | A graph on an x-y coordinate system displays a continuous, piecewise linear function that is symmetric about the y-axis. The function forms a series of 'V' shapes, touching the x-axis at the origin...]
L05026: (c)
L05027: [FIGURE:f5a296646d2a2b19 | A coordinate plane displays a smooth, bell-shaped curve, symmetric about the y-axis, with a local maximum on the positive y-axis. The curve is concave down near its peak and concave up on its sides...]
L05029: (d)
L05030: [FIGURE:2ca535a47076a7aa | A graph shows a blue curve in an x-y coordinate system. The curve is symmetric about the y-axis, has a global minimum on the negative y-axis, and increases as $|x|$ increases. It approaches a...]
L05032: (e)
L05033: [FIGURE:24e2cd91b6ddc61a | A graph displays a Cartesian coordinate system with a horizontal x-axis and a vertical y-axis. A blue S-shaped curve passes through the origin, increasing monotonically. The curve approaches a...]
L05035: (f)
L05036: [FIGURE:09d94e5c7a9c87bb | The graph displays a blue curve in a Cartesian coordinate system with x and y axes. The curve is the upper semicircle, centered at the origin, extending from the negative x-axis to the positive...]
L05038: (A)
L05039: [FIGURE:ef6e88b26cb5aa6e | A two-dimensional Cartesian coordinate system shows a blue curve. The curve is symmetric about the y-axis, peaks at a positive y-value near the origin, and then decreases smoothly to the left and...]
L05041: (B)
L05042: [FIGURE:818f45bfc5f27ece | The graph displays a smooth, continuous curve in an $xy$-coordinate system. The curve starts above the $x$-axis on the left, decreases to cross the $x$-axis at the origin, then continues below the...]
L05044: (C)
L05046: (B)
L05047: [FIGURE:c4ff1956b8a2d1a8 | A graph in the Cartesian coordinate system shows two hyperbolic curves, one in the first quadrant and one in the third quadrant. The curve in the first quadrant starts near the positive $y$-axis and...]
L05049: (D)
L05050: [FIGURE:8b0e478b13ad6188 | The figure displays a graph on a Cartesian coordinate system with labeled $x$ and $y$ axes. The graph shows a function that is zero for all $x \neq 0$. Specifically, a horizontal line segment extends...]
L05052: (E)
L05053: [FIGURE:c648bc58359be16d | A graph shows a blue curve on an $xy$-coordinate system. The curve passes through the origin $(0,0)$ and is strictly decreasing. It approaches a vertical dashed line to the left of the $y$-axis as...]
L05055: (F)
L05057: (E)
L05058: [FIGURE:9de9417b5fb203fd | A Cartesian coordinate system displays six pairs of small, open circles, each pair connected by a short horizontal line segment. Three pairs are positioned in the upper half-plane, symmetrically...]
L05060: 24. Let $f(x)=\sqrt{1-x^{2}}$. Use a geometric argument to find $f^{\prime}(\sqrt{2} / 2)$.
L05062: 25-26 Sketch the graph of the derivative of the function whose graph is shown.
L05063: 25.
L05065: (a)
L05066: [FIGURE:3165d21ceaefb4ce | A Cartesian coordinate system displays a horizontal blue line situated above the x-axis, representing a constant function $y=c$ for some $c > 0$. The x-axis is labeled 'x' and the y-axis is labeled...]
L05068: (b)
L05069: [FIGURE:76489b6e4a0002a4 | A coordinate plane with a horizontal x-axis and a vertical y-axis shows a V-shaped graph. A straight blue line segment passes through the origin, extending into the second and fourth quadrants. In...]
L05071: (c)
L05072: [FIGURE:442e842d8c3064fe | A graph shows a blue curve in an $xy$-coordinate system. The curve is symmetric about the $y$-axis, resembling a 'W' shape. It touches the $x$-axis at local minima at $x=-1$ and $x=1$, and has a...]
L05074: 26. 
L05076: (a)
L05077: [FIGURE:0b36b92d19400737 | A Cartesian coordinate system with x and y axes displays the graph of a piecewise function. For $x \le 0$, the function is a horizontal line segment at $y=1$, including the point $(0,1)$. For $x >...]
L05079: (b)
L05080: [FIGURE:a568cd7db7dc2ed7 | A graph in a Cartesian coordinate system shows a smooth, monotonically increasing blue curve. The curve passes through the origin $(0,0)$, is concave down for negative $x$ values, and concave up for...]
L05082: (c)
L05083: [FIGURE:1c9a3e6f6e4f5260 | A graph displays a blue curve in a Cartesian coordinate system with $x$ and $y$ axes. The curve is symmetric about the $y$-axis, featuring a sharp upward-pointing cusp at the origin $(0,0)$, and...]
L05085: 27-30 True-False Determine whether the statement is true or false. Explain your answer.
L05086: 27. If a curve $y=f(x)$ has a horizontal tangent line at $x=a$, then $f^{\prime}(a)$ is not defined.
L05087: 28. If the tangent line to the graph of $y=f(x)$ at $x=-2$ has negative slope, then $f^{\prime}(-2)<0$.
L05088: 29. If a function $f$ is continuous at $x=0$, then $f$ is differentiable at $x=0$.
L05089: 30. If a function $f$ is differentiable at $x=0$, then $f$ is continuous at $x=0$.
L05091: 31-32 The given limit represents $f^{\prime}(a)$ for some function $f$ and some number $a$. Find $f(x)$ and $a$ in each case.
L05092: 31.
L05093: (a) $\lim _{\Delta x \rightarrow 0} \frac{\sqrt{1+\Delta x}-1}{\Delta x} \quad$ (b) $\lim _{x_{1} \rightarrow 3} \frac{x_{1}^{2}-9}{x_{1}-3}$
L05094: 32.
L05095: (a) $\lim _{h \rightarrow 0} \frac{\cos (\pi+h)+1}{h}$
L05096: (b) $\lim _{x \rightarrow 1} \frac{x^{7}-1}{x-1}$
L05097: 33. Find $d y /\left.d x\right|_{x=1}$, given that $y=1-x^{2}$.
L05098: 34. Find $d y /\left.d x\right|_{x=-2}$, given that $y=(x+2) / x$.
L05099: 35. Find an equation for the line that is tangent to the curve $y=x^{3}-2 x+1$ at the point $(0,1)$, and use a graphing utility to graph the curve and its tangent line on the same screen.
L05100: 36. Use a graphing utility to graph the following on the same screen: the curve $y=x^{2} / 4$, the tangent line to this curve at $x=1$, and the secant line joining the points $(0,0)$ and $(2,1)$ on this curve.
L05101: 37. Let $f(x)=2^{x}$. Estimate $f^{\prime}(1)$ by
L05102: (a) using a graphing utility to zoom in at an appropriate point until the graph looks like a straight line, and then estimating the slope
L05103: (b) using a calculating utility to estimate the limit in Formula (13) by making a table of values for a succession of values of $w$ approaching 1 .
L05104: 38. Let $f(x)=\sin x$. Estimate $f^{\prime}(\pi / 4)$ by
L05105: (a) using a graphing utility to zoom in at an appropriate point until the graph looks like a straight line, and then estimating the slope
L05106: (b) using a calculating utility to estimate the limit in Formula (13) by making a table of values for a succession of values of $w$ approaching $\pi / 4$.
L05108: 39-40 The function $f$ whose graph is shown below has values as given in the accompanying table.
L05109: [FIGURE:8fb7e8a050dd8a1b | The graph displays a curve $y=f(x)$ on a Cartesian coordinate system with x and y axes. The x-axis is marked at -1, 1, 2, and 3, while the y-axis is marked at 1, 2, and 3. The curve is marked with...]
L05111: | $x$ | -1 | 0 | 1 | 2 | 3 |
L05112: | :---: | :---: | :---: | :---: | :---: | :---: |
L05113: | $f(x)$ | 1.56 | 0.58 | 2.12 | 2.34 | 2.2 |
L05115: 39. (a) Use data from the table to calculate the difference quotients
L05117: $$
L05118: \frac{f(3)-f(1)}{3-1}, \quad \frac{f(2)-f(1)}{2-1}, \quad \frac{f(2)-f(0)}{2-0}
L05119: $$
L05121: (b) Using the graph of $y=f(x)$, indicate which difference quotient in part (a) best approximates $f^{\prime}(1)$ and which difference quotient gives the worst approximation to $f^{\prime}(1)$.
L05122: 40. Use data from the table to approximate the derivative values.
L05123: (a) $f^{\prime}(0.5)$
L05124: (b) $f^{\prime}(2.5)$
L05126: ## FOCUS ON CONCEPTS
L05128: 41. Suppose that the cost of drilling $x$ feet for an oil well is $C=f(x)$ dollars.
L05129: (a) What are the units of $f^{\prime}(x)$ ?
L05130: (b) In practical terms, what does $f^{\prime}(x)$ mean in this case?
L05131: (c) What can you say about the sign of $f^{\prime}(x)$ ?
L05132: (d) Estimate the cost of drilling an additional foot, starting at a depth of 300 ft , given that $f^{\prime}(300)=1000$.
L05133: 42. A paint manufacturing company estimates that it can sell $g=f(p)$ gallons of paint at a price of $p$ dollars per gallon.
L05134: (a) What are the units of $d g / d p$ ?
L05135: (b) In practical terms, what does $d g / d p$ mean in this case?
L05136: (c) What can you say about the sign of $d g / d p$ ?
L05137: (d) Given that $d g /\left.d p\right|_{p=10}=-100$, what can you say about the effect of increasing the price from $\$ 10$ per gallon to $\$ 11$ per gallon?
L05138: 43. It is a fact that when a flexible rope is wrapped around a rough cylinder, a small force of magnitude $F_{0}$ at one end can resist a large force of magnitude $F$ at the other end. The size of $F$ depends on the angle $\theta$ through which the rope is wrapped around the cylinder (see the
L05139: accompanying figure). The figure shows the graph of $F$ (in pounds) versus $\theta$ (in radians), where $F$ is the magnitude of the force that can be resisted by a force with magnitude $F_{0}=10 \mathrm{lb}$ for a certain rope and cylinder.
L05140: (a) Estimate the values of $F$ and $d F / d \theta$ when the angle $\theta=10$ radians.
L05141: (b) It can be shown that the force $F$ satisfies the equation $d F / d \theta=\mu F$, where the constant $\mu$ is called the coefficient of friction. Use the results in part (a) to estimate the value of $\mu$.
L05143: [FIGURE:bef7c11333e0e9e8 | The figure displays two diagrams illustrating a rope wrapped around a cylinder, alongside a graph depicting the relationship between force and angle. The top diagram shows a 3D view of a rope wrapped...]
L05144: - Figure Ex-43
L05146: 44. The accompanying figure shows the velocity versus time curve for a rocket in outer space where the only significant force on the rocket is from its engines. It can be shown that the mass $M(t)$ (in slugs) of the rocket at time $t$ seconds satisfies the equation
L05148: $$
L05149: M(t)=\frac{T}{d v / d t}
L05150: $$
L05152: where $T$ is the thrust (in lb ) of the rocket's engines and $v$ is the velocity (in $\mathrm{ft} / \mathrm{s}$ ) of the rocket. The thrust of the first stage of a Saturn V rocket is $T=7,680,982 \mathrm{lb}$. Use this value of $T$ and the line segment in the figure to estimate the mass of the rocket at time $t=100$.
L05154: [FIGURE:b0b16225e575f23f | A graph plots Velocity $v$ (ft/s) on the y-axis against Time $t$ (s) on the x-axis. A thick black curve, representing velocity over time, starts near the origin and increases, showing a concave-up...]
L05155: \& Figure Ex-44
L05157: 45. According to Newton's Law of Cooling, the rate of change of an object's temperature is proportional to the difference between the temperature of the object and that of the surrounding medium. The accompanying figure shows the graph of the temperature $T$ (in degrees Fahrenheit) versus time $t$ (in minutes) for a cup of coffee, initially with a temperature of $200^{\circ} \mathrm{F}$, that is allowed to cool in a room with a constant temperature of $75^{\circ} \mathrm{F}$. (a) Estimate $T$ and $d T / d t$ when $t=10 \mathrm{~min}$.
L05158: (b) Newton's Law of Cooling can be expressed as
L05160: $$
L05161: \frac{d T}{d t}=k\left(T-T_{0}\right)
L05162: $$
L05164: where $k$ is the constant of proportionality and $T_{0}$ is the temperature (assumed constant) of the surrounding medium. Use the results in part (a) to estimate the value of $k$.
L05166: [FIGURE:138aad1b81ce663e | A graph shows Temperature $T$ in degrees Fahrenheit on the y-axis versus Time $t$ in minutes on the x-axis. A black curve, representing the temperature of an object, decreases from approximately...]
L05167: Figure Ex-45
L05169: 46. Show that $f(x)$ is continuous but not differentiable at the indicated point. Sketch the graph of $f$.
L05170: (a) $f(x)=\sqrt[3]{x}, x=0$
L05171: (b) $f(x)=\sqrt[3]{(x-2)^{2}}, x=2$
L05172: 47. Show that
L05174: $$
L05175: f(x)= \begin{cases}x^{2}+1, & x \leq 1 \\ 2 x, & x>1\end{cases}
L05176: $$
L05178: is continuous and differentiable at $x=1$. Sketch the graph of $f$.
L05179: 48. Show that
L05181: $$
L05182: f(x)= \begin{cases}x^{2}+2, & x \leq 1 \\ x+2, & x>1\end{cases}
L05183: $$
L05185: is continuous but not differentiable at $x=1$. Sketch the graph of $f$.
L05186: 49. Show that
L05188: $$
L05189: f(x)= \begin{cases}x \sin (1 / x), & x \neq 0 \\ 0, & x=0\end{cases}
L05190: $$
L05192: is continuous but not differentiable at $x=0$. Sketch the graph of $f$ near $x=0$. (See Figure 1.6.6 and the remark following Example 5 in Section 1.6.)
L05193: 50. Show that
L05195: $$
L05196: f(x)= \begin{cases}x^{2} \sin (1 / x), & x \neq 0 \\ 0, & x=0\end{cases}
L05197: $$
L05199: is continuous and differentiable at $x=0$. Sketch the graph of $f$ near $x=0$.
L05201: ## FOCUS ON CONCEPTS
L05203: 51. Suppose that a function $f$ is differentiable at $x_{0}$ and that $f^{\prime}\left(x_{0}\right)>0$. Prove that there exists an open interval containing $x_{0}$ such that if $x_{1}$ and $x_{2}$ are any two points in this interval with $x_{1}<x_{0}<x_{2}$, then $f\left(x_{1}\right)<f\left(x_{0}\right)<f\left(x_{2}\right)$.
L05204: 52. Suppose that a function $f$ is differentiable at $x_{0}$ and define $g(x)=f(m x+b)$, where $m$ and $b$ are constants. Prove that if $x_{1}$ is a point at which $m x_{1}+b=x_{0}$, then $g(x)$ is differentiable at $x_{1}$ and $g^{\prime}\left(x_{1}\right)=m f^{\prime}\left(x_{0}\right)$.
L05205: 53. Suppose that a function $f$ is differentiable at $x=0$ with $f(0)=f^{\prime}(0)=0$, and let $y=m x, m \neq 0$, denote any line of nonzero slope through the origin.
L05206: (a) Prove that there exists an open interval containing 0 such that for all nonzero $x$ in this interval $|f(x)|<\left|\frac{1}{2} m x\right|$. [Hint: Let $\epsilon=\frac{1}{2}|m|$ and apply Definition 1.4.1 to (5) with $x_{0}=0$.]
L05207: (b) Conclude from part (a) and the triangle inequality that there exists an open interval containing 0 such that $|f(x)|<|f(x)-m x|$ for all $x$ in this interval.
L05208: (c) Explain why the result obtained in part (b) may be interpreted to mean that the tangent line to the graph
L05209: of $f$ at the origin is the best linear approximation to $f$ at that point.
L05210: 54. Suppose that $f$ is differentiable at $x_{0}$. Modify the argument of Exercise 53 to prove that the tangent line to the graph of $f$ at the point $P\left(x_{0}, f\left(x_{0}\right)\right)$ provides the best linear approximation to $f$ at $P$. [Hint: Suppose that $y=f\left(x_{0}\right)+m\left(x-x_{0}\right)$ is any line through $P\left(x_{0}, f\left(x_{0}\right)\right)$ with slope $m \neq f^{\prime}\left(x_{0}\right)$. Apply Definition 1.4.1 to (5) with $x=x_{0}+h$ and $\epsilon=\frac{1}{2}\left|f^{\prime}\left(x_{0}\right)-m\right|$.]
L05211: 55. Writing Write a paragraph that explains what it means for a function to be differentiable. Include examples of functions that are not differentiable as well as examples of functions that are differentiable.
L05212: 56. Writing Explain the relationship between continuity and differentiability.
L05214: ## QUICK CHECK ANSWERS 2.2
L05216: 1. $\frac{f(x+h)-f(x)}{h}$
L05217: 2. (a) $2 x$
L05218: (b) $\frac{1}{2 \sqrt{x}}$
L05219: 3. $1 ;-\frac{2}{3}$
L05220: 4. Theorem 2.2.3: If $f$ is differentiable at $x_{0}$, then $f$ is continuous at $x_{0}$.
