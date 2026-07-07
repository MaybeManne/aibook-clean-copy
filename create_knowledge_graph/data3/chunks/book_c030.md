L10515: on the graph near the end of June. (Why?) To give a more visual example, consider the flask shown in Figure 4.1.15. Suppose that water is added to the flask so that the volume increases at a constant rate with respect to the time $t$, and let us examine the rate at which the water level $y$ rises with respect to $t$. Initially, the level $y$ will rise at a slow rate because of the wide base. However, as the diameter of the flask narrows, the rate at which the level $y$ rises will increase until the level is at the narrow point in the neck. From that point on the rate at which the level rises will decrease as the diameter gets wider and wider. Thus, the narrow point in the neck is the point at which the rate of change of $y$ with respect to $t$ changes from increasing to decreasing.
L10517: - Figure 4.1.15
L10518: [FIGURE:c60b40cd9a0ad798 | A diagram illustrates the relationship between the shape of a flask and the rate at which water fills it. On the left, a flask with a wide base, a narrow neck, and a slightly wider top is shown with...]
L10520: ## LOGISTIC CURVES
L10522: When a population grows in an environment in which space or food is limited, the graph of population versus time is typically an S-shaped curve of the form shown in Figure 4.1.16. The scenario described by this curve is a population that grows slowly at first and then more and more rapidly as the number of individuals producing offspring increases. However, at a certain point in time (where the inflection point occurs) the environmental factors begin to show their effect, and the growth rate begins a steady decline. Over an extended period of time the population approaches a limiting value that represents the upper limit on the number of individuals that the available space or food can sustain. Population growth curves of this type are called logistic growth curves.
L10524: - Example 9 We will see in a later chapter that logistic growth curves arise from equations of the form
L10526: $$
L10527: \begin{equation*}
L10528: y=\frac{L}{1+A e^{-k t}} \tag{1}
L10529: \end{equation*}
L10530: $$
L10532: where $y$ is the population at time $t(t \geq 0)$ and $A, k$, and $L$ are positive constants. Show that Figure 4.1.17 correctly describes the graph of this equation when $A>1$.
L10534: Solution. It follows from (1) that at time $t=0$ the value of $y$ is
L10536: $$
L10537: y=\frac{L}{1+A}
L10538: $$
L10540: and it follows from (1) and the fact that $0<e^{-k t} \leq 1$ for $t \geq 0$ that
L10542: $$
L10543: \begin{equation*}
L10544: \frac{L}{1+A} \leq y<L \tag{2}
L10545: \end{equation*}
L10546: $$
L10548: (verify). This is consistent with the graph in Figure 4.1.17. The horizontal asymptote at $y=L$ is confirmed by the limit
L10550: $$
L10551: \begin{equation*}
L10552: \lim _{t \rightarrow+\infty} y=\lim _{t \rightarrow+\infty} \frac{L}{1+A e^{-k t}}=\frac{L}{1+0}=L \tag{3}
L10553: \end{equation*}
L10554: $$
L10556: Physically, Formulas (2) and (3) tell us that $L$ is an upper limit on the population and that the population approaches this limit over time. Again, this is consistent with the graph in Figure 4.1.17.
L10558: To investigate intervals of increase and decrease, concavity, and inflection points, we need the first and second derivatives of $y$ with respect to $t$. By multiplying both sides of Equation (1) by $e^{k t}\left(1+A e^{-k t}\right)$, we can rewrite (1) as
L10560: $$
L10561: y e^{k t}+A y=L e^{k t}
L10562: $$
L10564: Using implicit differentiation, we can derive that
L10566: $$
L10567: \begin{align*}
L10568: & \frac{d y}{d t}=\frac{k}{L} y(L-y)  \tag{4}\\
L10569: & \frac{d^{2} y}{d t^{2}}=\frac{k^{2}}{L^{2}} y(L-y)(L-2 y) \tag{5}
L10570: \end{align*}
L10571: $$
L10573: (Exercise 70). Since $k>0, y>0$, and $L-y>0$, it follows from (4) that $d y / d t>0$ for all $t$. Thus, $y$ is always increasing, which is consistent with Figure 4.1.17.
L10575: Since $y>0$ and $L-y>0$, it follows from (5) that
L10577: $$
L10578: \begin{aligned}
L10579: & \frac{d^{2} y}{d t^{2}}>0 \quad \text { if } \quad L-2 y>0 \\
L10580: & \frac{d^{2} y}{d t^{2}}<0 \quad \text { if } \quad L-2 y<0
L10581: \end{aligned}
L10582: $$
L10584: Thus, the graph of $y$ versus $t$ is concave up if $y<L / 2$, concave down if $y>L / 2$, and has an inflection point where $y=L / 2$, all of which is consistent with Figure 4.1.17.
L10586: Finally, we leave it for you to solve the equation
L10588: $$
L10589: \frac{L}{2}=\frac{L}{1+A e^{-k t}}
L10590: $$
L10592: for $t$ to show that the inflection point occurs at
L10594: $$
L10595: \begin{equation*}
L10596: t=\frac{1}{k} \ln A=\frac{\ln A}{k} \tag{6}
L10597: \end{equation*}
L10598: $$
L10600: ## QUICK CHECK EXERCISES 4.1 (See page 244 for answers.)
L10602: 1. (a) A function $f$ is increasing on $(a, b)$ if $\_\_\_\_$ whenever $a<x_{1}<x_{2}<b$.
L10603: (b) A function $f$ is decreasing on ( $a, b$ ) if $\_\_\_\_$ whenever $a<x_{1}<x_{2}<b$.
L10604: (c) A function $f$ is concave up on ( $a, b$ ) if $f^{\prime}$ is $\_\_\_\_$ on $(a, b)$.
L10605: (d) If $f^{\prime \prime}(a)$ exists and $f$ has an inflection point at $x=a$, then $f^{\prime \prime}(a)$ $\_\_\_\_$ .
L10606: 2. Let $f(x)=0.1\left(x^{3}-3 x^{2}-9 x\right)$. Then
L10608: $$
L10609: \begin{aligned}
L10610: f^{\prime}(x) & =0.1\left(3 x^{2}-6 x-9\right)=0.3(x+1)(x-3) \\
L10611: f^{\prime \prime}(x) & =0.6(x-1)
L10612: \end{aligned}
L10613: $$
L10615: (a) Solutions to $f^{\prime}(x)=0$ are $x=$ $\_\_\_\_$ .
L10616: (b) The function $f$ is increasing on the interval(s) $\_\_\_\_$ .
L10617: (c) The function $f$ is concave down on the interval(s)
L10618: $\_\_\_\_$ .
L10619: (d) $\_\_\_\_$ is an inflection point on the graph of $f$.
L10620: 3. Suppose that $f(x)$ has derivative $f^{\prime}(x)=(x-4)^{2} e^{-x / 2}$. Then $f^{\prime \prime}(x)=-\frac{1}{2}(x-4)(x-8) e^{-x / 2}$.
L10621: (a) The function $f$ is increasing on the interval(s) $\_\_\_\_$ .
L10622: (b) The function $f$ is concave up on the interval(s)
L10623: $\_\_\_\_$ .
L10624: (c) The function $f$ is concave down on the interval(s)
L10625: $\_\_\_\_$ .
L10626: 4. Consider the statement "The rise in the cost of living slowed during the first half of the year." If we graph the cost of living versus time for the first half of the year, how does the graph reflect this statement?
L10628: ## FOCUS ON CONCEPTS
L10630: 1. In each part, sketch the graph of a function $f$ with the stated properties, and discuss the signs of $f^{\prime}$ and $f^{\prime \prime}$.
L10631: (a) The function $f$ is concave up and increasing on the interval $(-\infty,+\infty)$.
L10632: (b) The function $f$ is concave down and increasing on the interval $(-\infty,+\infty)$.
L10633: (c) The function $f$ is concave up and decreasing on the interval $(-\infty,+\infty)$.
L10634: (d) The function $f$ is concave down and decreasing on the interval $(-\infty,+\infty)$.
L10635: 2. In each part, sketch the graph of a function $f$ with the stated properties.
L10636: (a) $f$ is increasing on $(-\infty,+\infty)$, has an inflection point at the origin, and is concave up on ( $0,+\infty$ ).
L10637: (b) $f$ is increasing on $(-\infty,+\infty)$, has an inflection point at the origin, and is concave down on $(0,+\infty)$.
L10638: (c) $f$ is decreasing on $(-\infty,+\infty)$, has an inflection point at the origin, and is concave up on ( $0,+\infty$ ).
L10639: (d) $f$ is decreasing on $(-\infty,+\infty)$, has an inflection point at the origin, and is concave down on $(0,+\infty)$.
L10640: 3. Use the graph of the equation $y=f(x)$ in the accompanying figure to find the signs of $d y / d x$ and $d^{2} y / d x^{2}$ at the points $A, B$, and $C$.
L10642: [FIGURE:f9c5d5aeaf776e09 | A graph displays a curve $y=f(x)$ in a Cartesian coordinate system with labeled x and y axes. The curve starts by decreasing and being concave up, then transitions to increasing and being concave...]
L10643: -Figure Ex-3
L10645: [FIGURE:c15cebdc479406eb | The graph displays the curve $y=f'(x)$ on an $xy$-coordinate system. The curve starts in the third quadrant, decreases to a local minimum labeled A, then increases, crosses the x-axis, continues...]
L10646: - Figure Ex-4
L10648: 4. Use the graph of the equation $y=f^{\prime}(x)$ in the accompanying figure to find the signs of $d y / d x$ and $d^{2} y / d x^{2}$ at the points $A, B$, and $C$.
L10649: 5. Use the graph of $y=f^{\prime \prime}(x)$ in the accompanying figure
L10651: [FIGURE:1b06d129670d691c | A graph displays the function $y = f''(x)$ in a Cartesian coordinate system. The blue curve, representing the second derivative, is positive for $x < -2.5$, between $x = -0.5$ and $x = 0.5$, and for...]
L10652: - Figure Ex-5
L10654: 6. Use the graph of $y=f^{\prime}(x)$ in the accompanying figure to replace the question mark with $<,=$, or $>$, as appropriate. Explain your reasoning.
L10655: (a) $f(0) ? f(1)$
L10656: (b) $f(1) ? f(2)$
L10657: (c) $f^{\prime}(0) ? 0$
L10658: (d) $f^{\prime}(1) ? 0$
L10659: (e) $f^{\prime \prime}(0) ? 0$
L10660: (f) $f^{\prime \prime}(2) ? 0$
L10662: [FIGURE:14f94e69799bde80 | A graph displays the curve $y=f'(x)$ in a Cartesian coordinate system with labeled x and y axes. The curve starts in the second quadrant, decreases, crosses the x-axis at $x=1$, continues to decrease...]
L10663: Figure Ex-6
L10665: 7. In each part, use the graph of $y=f(x)$ in the accompanying figure to find the requested information.
L10666: (a) Find the intervals on which $f$ is increasing.
L10667: (b) Find the intervals on which $f$ is decreasing.
L10668: (c) Find the open intervals on which $f$ is concave up.
L10669: (d) Find the open intervals on which $f$ is concave down.
L10670: (e) Find all values of $x$ at which $f$ has an inflection point.
L10672: [FIGURE:688a750fe26343ee | A 2D coordinate graph displays a blue curve, labeled $y=f(x)$, plotted against x and y axes. The x-axis is marked with integers from 1 to 7. The curve starts high at $x=1$, decreases to a local...]
L10673: - Figure Ex-7
L10675: 8. Use the graph in Exercise 7 to make a table that shows the signs of $f^{\prime}$ and $f^{\prime \prime}$ over the intervals $(1,2),(2,3),(3,4)$, $(4,5),(5,6)$, and $(6,7)$.
L10677: 9-10 A sign chart is presented for the first and second derivatives of a function $f$. Assuming that $f$ is continuous everywhere, find: (a) the intervals on which $f$ is increasing, (b) the intervals on which $f$ is decreasing, (c) the open intervals on which $f$ is concave up, (d) the open intervals on which $f$ is concave down, and (e) the $x$-coordinates of all inflection points.
L10678: 9.
L10680: | INTERVAL | SIGN OF $f^{\prime}(x)$ | SIGN OF $f^{\prime \prime}(x)$ |
L10681: | :--- | :---: | :---: |
L10682: | $x<1$ | - | + |
L10683: | $1<x<2$ | + | + |
L10684: | $2<x<3$ | + | - |
L10685: | $3<x<4$ | - | - |
L10686: | $4<x$ | - | + |
L10688: 10. 
L10690: | INTERVAL | SIGN OF $f^{\prime}(x)$ | SIGN OF $f^{\prime \prime}(x)$ |
L10691: | :--- | :---: | :---: |
L10692: | $x<1$ | + | + |
L10693: | $1<x<3$ | + | - |
L10694: | $3<x$ | + | + |
L10696: 11-14 True-False Assume that $f$ is differentiable everywhere. Determine whether the statement is true or false. Explain your answer.
L10697: 11. If $f$ is decreasing on $[0,2]$, then $f(0)>f(1)>f(2)$.
L10698: 12. If $f^{\prime}(1)>0$, then $f$ is increasing on $[0,2]$.
L10699: 13. If $f$ is increasing on $[0,2]$, then $f^{\prime}(1)>0$.
L10700: 14. If $f^{\prime}$ is increasing on $[0,1]$ and $f^{\prime}$ is decreasing on $[1,2]$, then $f$ has an inflection point at $x=1$.
L10702: 15-32 Find: (a) the intervals on which $f$ is increasing, (b) the intervals on which $f$ is decreasing, (c) the open intervals on which $f$ is concave up, (d) the open intervals on which $f$ is concave down, and (e) the $x$-coordinates of all inflection points.
L10703: 15. $f(x)=x^{2}-3 x+8$
L10704: 16. $f(x)=5-4 x-x^{2}$
L10705: 17. $f(x)=(2 x+1)^{3}$
L10706: 18. $f(x)=5+12 x-x^{3}$
L10707: 19. $f(x)=3 x^{4}-4 x^{3}$
L10708: 20. $f(x)=x^{4}-5 x^{3}+9 x^{2}$
L10709: 21. $f(x)=\frac{x-2}{\left(x^{2}-x+1\right)^{2}}$
L10710: 22. $f(x)=\frac{x}{x^{2}+2}$
L10711: 23. $f(x)=\sqrt[3]{x^{2}+x+1}$
L10712: 24. $f(x)=x^{4 / 3}-x^{1 / 3}$
L10713: 25. $f(x)=\left(x^{2 / 3}-1\right)^{2}$
L10714: 26. $f(x)=x^{2 / 3}-x$
L10715: 27. $f(x)=e^{-x^{2} / 2}$
L10716: 28. $f(x)=x e^{x^{2}}$
L10717: 29. $f(x)=\ln \sqrt{x^{2}+4}$
L10718: 30. $f(x)=x^{3} \ln x$
L10719: 31. $f(x)=\tan ^{-1}\left(x^{2}-1\right)$
L10720: 32. $f(x)=\sin ^{-1} x^{2 / 3}$
L10722: 33-38 Analyze the trigonometric function $f$ over the specified interval, stating where $f$ is increasing, decreasing, concave up, and concave down, and stating the $x$-coordinates of all inflection points. Confirm that your results are consistent with the graph of $f$ generated with a graphing utility.
L10723: 33. $f(x)=\sin x-\cos x ;[-\pi, \pi]$
L10724: 34. $f(x)=\sec x \tan x ;(-\pi / 2, \pi / 2)$
L10725: 35. $f(x)=1-\tan (x / 2) ;(-\pi, \pi)$
L10726: 36. $f(x)=2 x+\cot x ;(0, \pi)$
L10727: 37. $f(x)=(\sin x+\cos x)^{2} ;[-\pi, \pi]$
L10728: 38. $f(x)=\sin ^{2} 2 x ;[0, \pi]$
L10730: ## FOCUS ON CONCEPTS
L10732: 39. In parts (a)-(c), sketch a continuous curve $y=f(x)$ with the stated properties.
L10733: (a) $f(2)=4, f^{\prime}(2)=0, f^{\prime \prime}(x)>0$ for all $x$
L10734: (b) $f(2)=4, f^{\prime}(2)=0, f^{\prime \prime}(x)<0$ for $x<2, f^{\prime \prime}(x)>0$ for $x>2$
L10735: (c) $f(2)=4, f^{\prime \prime}(x)<0$ for $x \neq 2$ and $\lim _{x \rightarrow 2^{+}} f^{\prime}(x)=+\infty, \lim _{x \rightarrow 2^{-}} f^{\prime}(x)=-\infty$
L10736: 40. In each part sketch a continuous curve $y=f(x)$ with the stated properties.
L10737: (a) $f(2)=4, f^{\prime}(2)=0, f^{\prime \prime}(x)<0$ for all $x$
L10738: (b) $f(2)=4, f^{\prime}(2)=0, f^{\prime \prime}(x)>0$ for $x<2, f^{\prime \prime}(x)<0$ for $x>2$
L10739: (c) $f(2)=4, f^{\prime \prime}(x)>0$ for $x \neq 2$ and $\lim _{x \rightarrow 2^{+}} f^{\prime}(x)=-\infty, \lim _{x \rightarrow 2^{-}} f^{\prime}(x)=+\infty$
L10741: 41-46 If $f$ is increasing on an interval $[0, b)$, then it follows from Definition 4.1.1 that $f(0)<f(x)$ for each $x$ in the interval $(0, b)$. Use this result in these exercises.
L10742: 41. Show that $\sqrt[3]{1+x}<1+\frac{1}{3} x$ if $x>0$, and confirm the inequality with a graphing utility. [Hint: Show that the function $f(x)=1+\frac{1}{3} x-\sqrt[3]{1+x}$ is increasing on $[0,+\infty)$.]
L10743: 42. Show that $x<\tan x$ if $0<x<\pi / 2$, and confirm the inequality with a graphing utility. [Hint: Show that the function $f(x)=\tan x-x$ is increasing on $[0, \pi / 2)$.]
L10744: 43. Use a graphing utility to make a conjecture about the relative sizes of $x$ and $\sin x$ for $x \geq 0$, and prove your conjecture.
L10745: 44. Use a graphing utility to make a conjecture about the relative sizes of $1-x^{2} / 2$ and $\cos x$ for $x \geq 0$, and prove your conjecture. [Hint: Use the result of Exercise 43.]
L10746: 45. (a) Show that $\ln (x+1) \leq x$ if $x \geq 0$.
L10747: (b) Show that $\ln (x+1) \geq x-\frac{1}{2} x^{2}$ if $x \geq 0$.
L10748: (c) Confirm the inequalities in parts (a) and (b) with a graphing utility.
L10749: 46. (a) Show that $e^{x} \geq 1+x$ if $x \geq 0$.
L10750: (b) Show that $e^{x} \geq 1+x+\frac{1}{2} x^{2}$ if $x \geq 0$.
L10751: (c) Confirm the inequalities in parts (a) and (b) with a graphing utility.
L10753: 47-48 Use a graphing utility to generate the graphs of $f^{\prime}$ and $f^{\prime \prime}$ over the stated interval; then use those graphs to estimate the $x$-coordinates of the inflection points of $f$, the intervals on which $f$ is concave up or down, and the intervals on which $f$ is increasing or decreasing. Check your estimates by graphing $f$.
L10754: 47. $f(x)=x^{4}-24 x^{2}+12 x, \quad-5 \leq x \leq 5$
L10755: 48. $f(x)=\frac{1}{1+x^{2}}, \quad-5 \leq x \leq 5$
L10757: C 49-50 Use a CAS to find $f^{\prime \prime}$ and to approximate the $x$ coordinates of the inflection points to six decimal places. Confirm that your answer is consistent with the graph of $f$.
L10758: 49. $f(x)=\frac{10 x-3}{3 x^{2}-5 x+8}$
L10759: 50. $f(x)=\frac{x^{3}-8 x+7}{\sqrt{x^{2}+1}}$
L10760: 51. Use Definition 4.1.1 to prove that $f(x)=x^{2}$ is increasing on $[0,+\infty)$.
L10761: 52. Use Definition 4.1.1 to prove that $f(x)=1 / x$ is decreasing on $(0,+\infty)$.
L10763: ## FOCUS ON CONCEPTS
L10765: 53-54 Determine whether the statements are true or false. If a statement is false, find functions for which the statement fails to hold.
L10766: 53. (a) If $f$ and $g$ are increasing on an interval, then so is $f+g$.
L10767: (b) If $f$ and $g$ are increasing on an interval, then so is $f \cdot g$.
L10768: 54. (a) If $f$ and $g$ are concave up on an interval, then so is $f+g$.
L10769: (b) If $f$ and $g$ are concave up on an interval, then so is $f \cdot g$.
L10770: 55. In each part, find functions $f$ and $g$ that are increasing on $(-\infty,+\infty)$ and for which $f-g$ has the stated property.
L10771: (a) $f-g$ is decreasing on $(-\infty,+\infty)$.
L10772: (b) $f-g$ is constant on $(-\infty,+\infty)$.
L10773: (c) $f-g$ is increasing on $(-\infty,+\infty)$.
L10774: 56. In each part, find functions $f$ and $g$ that are positive and increasing on $(-\infty,+\infty)$ and for which $f / g$ has the stated property.
L10775: (a) $f / g$ is decreasing on $(-\infty,+\infty)$.
L10776: (b) $f / g$ is constant on $(-\infty,+\infty)$.
L10777: (c) $f / g$ is increasing on $(-\infty,+\infty)$.
L10778: 57. (a) Prove that a general cubic polynomial
L10780: $$
L10781: f(x)=a x^{3}+b x^{2}+c x+d \quad(a \neq 0)
L10782: $$
L10784: has exactly one inflection point.
L10785: (b) Prove that if a cubic polynomial has three $x$-intercepts, then the inflection point occurs at the average value of the intercepts.
L10786: (c) Use the result in part (b) to find the inflection point of the cubic polynomial $f(x)=x^{3}-3 x^{2}+2 x$, and check your result by using $f^{\prime \prime}$ to determine where $f$ is concave up and concave down.
L10787: 58. From Exercise 57, the polynomial $f(x)=x^{3}+b x^{2}+1$ has one inflection point. Use a graphing utility to reach a conclusion about the effect of the constant $b$ on the location of the inflection point. Use $f^{\prime \prime}$ to explain what you have observed graphically.
L10788: 59. Use Definition 4.1.1 to prove:
L10789: (a) If $f$ is increasing on the intervals $(a, c]$ and $[c, b)$, then $f$ is increasing on $(a, b)$.
L10790: (b) If $f$ is decreasing on the intervals $(a, c]$ and $[c, b)$, then $f$ is decreasing on ( $a, b$ ).
L10791: 60. Use part (a) of Exercise 59 to show that $f(x)=x+\sin x$ is increasing on the interval $(-\infty,+\infty)$.
L10792: 61. Use part (b) of Exercise 59 to show that $f(x)=\cos x-x$ is decreasing on the interval $(-\infty,+\infty)$.
L10793: 62. Let $y=1 /\left(1+x^{2}\right)$. Find the values of $x$ for which $y$ is increasing most rapidly or decreasing most rapidly.
L10795: ## FOCUS ON CONCEPTS
L10797: 63-66 Suppose that water is flowing at a constant rate into the container shown. Make a rough sketch of the graph of the water level $y$ versus the time $t$. Make sure that your sketch conveys where the graph is concave up and concave down, and label the $y$-coordinates of the inflection points.
L10798: 63.
L10799: [FIGURE:2ac34e752b8ab41f | A transparent, curved-sided container, resembling a fishbowl, is shown partially filled with a light blue liquid. A vertical y-axis passes through the center of the container, with tick marks labeled...]
L10800: 64.
L10801: [FIGURE:294c8a8cdeae19e5 | A 3D diagram depicts a container resembling a vase, with a wider top and bottom and a narrower middle. A vertical y-axis is centered within the container, marked with values 0, 1, and 2. A light blue...]
L10802: 65.
L10803: [FIGURE:67d9a77002bbcb05 | A diagram illustrates a vase with a bulbous, spherical lower section and a flaring, conical upper section. A vertical y-axis passes through the center of the vase, with tick marks labeled 0, 1, 3...]
L10804: 66.
L10805: [FIGURE:819162c6a1116f94 | A three-dimensional diagram shows an hourglass-shaped vase, symmetrical about a vertical y-axis. The y-axis is labeled from 0 to 4, with tick marks at each integer. The vase is partially filled with...]
L10806: 67. Suppose that a population $y$ grows according to the logistic model given by Formula (1).
L10807: (a) At what rate is $y$ increasing at time $t=0$ ?
L10808: (b) In words, describe how the rate of growth of $y$ varies with time.
L10809: (c) At what time is the population growing most rapidly?
L10810: 68. Suppose that the number of individuals at time $t$ in a certain wildlife population is given by
L10812: $$
L10813: N(t)=\frac{340}{1+9(0.77)^{t}}, \quad t \geq 0
L10814: $$
L10816: where $t$ is in years. Use a graphing utility to estimate the time at which the size of the population is increasing most rapidly.
L10817: 69. Suppose that the spread of a flu virus on a college campus is modeled by the function
L10819: $$
L10820: y(t)=\frac{1000}{1+999 e^{-0.9 t}}
L10821: $$
L10823: where $y(t)$ is the number of infected students at time $t$ (in days, starting with $t=0$ ). Use a graphing utility to estimate the day on which the virus is spreading most rapidly.
L10824: 70. The logistic growth model given in Formula (1) is equivalent to
L10826: $$
L10827: y e^{k t}+A y=L e^{k t}
L10828: $$
L10830: where $y$ is the population at time $t(t \geq 0)$ and $A, k$, and $L$
L10831: are positive constants. Use implicit differentiation to verify that
L10833: $$
L10834: \begin{aligned}
L10835: & \frac{d y}{d t}=\frac{k}{L} y(L-y) \\
L10836: & \frac{d^{2} y}{d t^{2}}=\frac{k^{2}}{L^{2}} y(L-y)(L-2 y)
L10837: \end{aligned}
L10838: $$
L10840: 71. Assuming that $A, k$, and $L$ are positive constants, verify that the graph of $y=L /\left(1+A e^{-k t}\right)$ has an inflection point at $\left(\frac{1}{k} \ln A, \frac{1}{2} L\right)$.
L10841: 72. Writing An approaching storm causes the air temperature to fall. Make a statement that indicates there is an inflection point in the graph of temperature versus time. Explain how the existence of an inflection point follows from your statement.
L10842: 73. Writing Explain what the sign analyses of $f^{\prime}(x)$ and $f^{\prime \prime}(x)$ tell us about the graph of $y=f(x)$.
L10844: ## QUICK CHECK ANSWERS 4.1
L10846: 1. (a) $f\left(x_{1}\right)<f\left(x_{2}\right)$
L10847: (b) $f\left(x_{1}\right)>f\left(x_{2}\right)$
L10848: (c) increasing (d) $=0$
L10849: 2. (a) $-1,3$
L10850: (b) $(-\infty,-1]$ and $[3,+\infty)$
L10851: (c) $(-\infty, 1)$
L10852: (d) $(1,-1.1)$
L10853: 3. (a) $(-\infty,+\infty)$
L10854: (b) $(4,8)$
L10855: (c) $(-\infty, 4),(8,+\infty)$
L10856: 4. The graph is increasing and concave down.
