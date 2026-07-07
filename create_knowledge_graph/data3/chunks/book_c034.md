L11705: - Derivatives:
L11707: $$
L11708: \begin{aligned}
L11709: \frac{d y}{d x} & =e^{-x^{2} / 2} \frac{d}{d x}\left[-\frac{x^{2}}{2}\right]=-x e^{-x^{2} / 2} \\
L11710: \frac{d^{2} y}{d x^{2}} & =-x \frac{d}{d x}\left[e^{-x^{2} / 2}\right]+e^{-x^{2} / 2} \frac{d}{d x}[-x] \\
L11711: & =x^{2} e^{-x^{2} / 2}-e^{-x^{2} / 2}=\left(x^{2}-1\right) e^{-x^{2} / 2}
L11712: \end{aligned}
L11713: $$
L11715: ## Conclusions and graph:
L11717: - The sign analysis of $y$ in Figure 4.3.8a is based on the fact that $e^{-x^{2} / 2}>0$ for all $x$. This shows that the graph is always above the $x$-axis.
L11718: - The sign analysis of $d y / d x$ in Figure 4.3.8 $a$ is based on the fact that $d y / d x=-x e^{-x^{2} / 2}$ has the same sign as $-x$. This analysis and the first derivative test show that there is a stationary point at $x=0$ at which there is a relative maximum. The value of $y$ at the relative maximum is $y=e^{0}=1$.
L11719: - The sign analysis of $d^{2} y / d x^{2}$ in Figure 4.3.8a is based on the fact that $d^{2} y / d x^{2}= \left(x^{2}-1\right) e^{-x^{2} / 2}$ has the same sign as $x^{2}-1$. This analysis shows that there are inflection points at $x=-1$ and $x=1$. The graph changes from concave up to concave down at $x=-1$ and from concave down to concave up at $x=1$. The coordinates of the inflection points are $\left(-1, e^{-1 / 2}\right) \approx(-1,0.61)$ and $\left(1, e^{-1 / 2}\right) \approx(1,0.61)$.
L11721: The graph is shown in Figure 4.3.8b.
L11723: [FIGURE:d1d45664311d6b0c | Part (a) presents three number lines illustrating the sign analysis for the function $y = e^{-x^2/2}$: the first shows $y$ is always positive; the second indicates $dy/dx$ is positive for $x < 0$...]
L11724: - Figure 4.3.8
L11726: [FIGURE:351defc81daf305c | The graph displays the function $y = \frac{\ln x}{x}$ plotted within the viewing window $x \in [-1, 25)$ and $y \in [-0.5, 0.5)$, with x-axis tick marks every 5 units and y-axis tick marks every 0.2...]
L11727: - Figure 4.3.9
L11729: ## GRAPHING USING CALCULUS AND TECHNOLOGY TOGETHER
L11731: Thus far in this chapter we have used calculus to produce graphs of functions; the graph was the end result. Now we will work in the reverse direction by starting with a graph produced by a graphing utility. Our goal will be to use the tools of calculus to determine the exact locations of relative extrema, inflection points, and other features suggested by that graph and to determine whether the graph may be missing some important features that we would like to see.
L11733: Example 6 Use a graphing utility to generate the graph of $f(x)=(\ln x) / x$, and discuss what it tells you about relative extrema, inflection points, asymptotes, and end behavior. Use calculus to find the locations of all key features of the graph.
L11735: Solution. Figure 4.3.9 shows a graph of $f$ produced by a graphing utility. The graph suggests that there is an $x$-intercept near $x=1$, a relative maximum somewhere between
L11736: $x=0$ and $x=5$, an inflection point near $x=5$, a vertical asymptote at $x=0$, and possibly a horizontal asymptote $y=0$. For a more precise analysis of this information we need to consider the derivatives
L11738: $$
L11739: \begin{aligned}
L11740: f^{\prime}(x) & =\frac{x\left(\frac{1}{x}\right)-(\ln x)(1)}{x^{2}}=\frac{1-\ln x}{x^{2}} \\
L11741: f^{\prime \prime}(x) & =\frac{x^{2}\left(-\frac{1}{x}\right)-(1-\ln x)(2 x)}{x^{4}}=\frac{2 x \ln x-3 x}{x^{4}}=\frac{2 \ln x-3}{x^{3}}
L11742: \end{aligned}
L11743: $$
L11745: - Relative extrema: Solving $f^{\prime}(x)=0$ yields the stationary point $x=e$ (verify). Since
L11747: $$
L11748: f^{\prime \prime}(e)=\frac{2-3}{e^{3}}=-\frac{1}{e^{3}}<0
L11749: $$
L11751: there is a relative maximum at $x=e \approx 2.7$ by the second derivative test.
L11753: - Inflection points: Since $f(x)=(\ln x) / x$ is only defined for positive values of $x$, the second derivative $f^{\prime \prime}(x)$ has the same sign as $2 \ln x-3$. We leave it for you to use the inequalities $(2 \ln x-3)<0$ and $(2 \ln x-3)>0$ to show that $f^{\prime \prime}(x)<0$ if $x<e^{3 / 2}$ and $f^{\prime \prime}(x)>0$ if $x>e^{3 / 2}$. Thus, there is an inflection point at $x=e^{3 / 2} \approx 4.5$.
L11754: - Asymptotes: Applying L'Hôpital's rule we have
L11756: $$
L11757: \lim _{x \rightarrow+\infty} \frac{\ln x}{x}=\lim _{x \rightarrow+\infty} \frac{(1 / x)}{1}=\lim _{x \rightarrow+\infty} \frac{1}{x}=0
L11758: $$
L11760: so that $y=0$ is a horizontal asymptote. Also, there is a vertical asymptote at $x=0$ since
L11762: $$
L11763: \lim _{x \rightarrow 0^{+}} \frac{\ln x}{x}=-\infty
L11764: $$
L11766: (why?).
L11768: - Intercepts: Setting $f(x)=0$ yields $(\ln x) / x=0$. The only real solution of this equation is $x=1$, so there is an $x$-intercept at this point.
L11771: ## QUICK CHECK EXERCISES 4.3 (See page 266 for answers.)
L11773: 1. Let $f(x)=\frac{3(x+1)(x-3)}{(x+2)(x-4)}$. Given that
L11775: $$
L11776: f^{\prime}(x)=\frac{-30(x-1)}{(x+2)^{2}(x-4)^{2}}, \quad f^{\prime \prime}(x)=\frac{90\left(x^{2}-2 x+4\right)}{(x+2)^{3}(x-4)^{3}}
L11777: $$
L11779: determine the following properties of the graph of $f$.
L11780: (a) The $x$ - and $y$-intercepts are $\_\_\_\_$ .
L11781: (b) The vertical asymptotes are $\_\_\_\_$ .
L11782: (c) The horizontal asymptote is $\_\_\_\_$ .
L11783: (d) The graph is above the $x$-axis on the intervals $\_\_\_\_$ .
L11784: (e) The graph is increasing on the intervals $\_\_\_\_$ .
L11785: (f) The graph is concave up on the intervals $\_\_\_\_$ .
L11786: (g) The relative maximum point on the graph is $\_\_\_\_$ .
L11787: 2. Let $f(x)=\frac{x^{2}-4}{x^{8 / 3}}$. Given that
L11789: $$
L11790: f^{\prime}(x)=\frac{-2\left(x^{2}-16\right)}{3 x^{11 / 3}}, \quad f^{\prime \prime}(x)=\frac{2\left(5 x^{2}-176\right)}{9 x^{14 / 3}}
L11791: $$
L11793: determine the following properties of the graph of $f$.
L11794: (a) The $x$-intercepts are $\_\_\_\_$ .
L11795: (b) The vertical asymptote is $\_\_\_\_$ .
L11796: (c) The horizontal asymptote is $\_\_\_\_$ .
L11797: (d) The graph is above the $x$-axis on the intervals $\_\_\_\_$ .
L11798: (e) The graph is increasing on the intervals $\_\_\_\_$ .
L11799: (f) The graph is concave up on the intervals $\_\_\_\_$ .
L11800: (g) Inflection points occur at $x=$ $\_\_\_\_$ .
L11801: 3. Let $f(x)=(x-2)^{2} e^{x / 2}$. Given that
L11802: $f^{\prime}(x)=\frac{1}{2}\left(x^{2}-4\right) e^{x / 2}, \quad f^{\prime \prime}(x)=\frac{1}{4}\left(x^{2}+4 x-4\right) e^{x / 2}$ determine the following properties of the graph of $f$.
L11803: (a) The horizontal asymptote is $\_\_\_\_$ .
L11804: (b) The graph is above the $x$-axis on the intervals $\_\_\_\_$ .
L11805: (c) The graph is increasing on the intervals $\_\_\_\_$ .
L11806: (d) The graph is concave up on the intervals $\_\_\_\_$ .
L11807: (e) The relative minimum point on the graph is $\_\_\_\_$ .
L11808: (f) The relative maximum point on the graph is $\_\_\_\_$ .
L11809: (g) Inflection points occur at $x=$ $\_\_\_\_$ .
L11811: 1-14 Give a graph of the rational function and label the coordinates of the stationary points and inflection points. Show the horizontal and vertical asymptotes and label them with their equations. Label point(s), if any, where the graph crosses a horizontal asymptote. Check your work with a graphing utility.
L11813: 1. $\frac{2 x-6}{4-x}$
L11814: 2. $\frac{8}{x^{2}-4}$
L11815: 3. $\frac{x}{x^{2}-4}$
L11816: 4. $\frac{x^{2}}{x^{2}-4}$
L11817: 5. $\frac{x^{2}}{x^{2}+4}$
L11818: 6. $\frac{\left(x^{2}-1\right)^{2}}{x^{4}+1}$
L11819: 7. $\frac{x^{3}+1}{x^{3}-1}$
L11820: 8. $2-\frac{1}{3 x^{2}+x^{3}}$
L11821: 9. $\frac{4}{x^{2}}-\frac{2}{x}+3$
L11822: 10. $\frac{3(x+1)^{2}}{(x-1)^{2}}$
L11823: 11. $\frac{(3 x+1)^{2}}{(x-1)^{2}}$
L11824: 12. $3+\frac{x+1}{(x-1)^{4}}$
L11825: 13. $\frac{x^{2}+x}{1-x^{2}}$
L11826: 14. $\frac{x^{2}}{1-x^{3}}$
L11828: 15-16 In each part, make a rough sketch of the graph using asymptotes and appropriate limits but no derivatives. Compare your graph to that generated with a graphing utility.
L11829: 15.
L11830: (a) $y=\frac{3 x^{2}-8}{x^{2}-4}$
L11831: (b) $y=\frac{x^{2}+2 x}{x^{2}-1}$
L11832: 16.
L11833: (a) $y=\frac{2 x-x^{2}}{x^{2}+x-2}$
L11834: (b) $y=\frac{x^{2}}{x^{2}-x-2}$
L11835: 17. Show that $y=x+3$ is an oblique asymptote of the graph of $f(x)=x^{2} /(x-3)$. Sketch the graph of $y=f(x)$ showing this asymptotic behavior.
L11836: 18. Show that $y=3-x^{2}$ is a curvilinear asymptote of the graph of $f(x)=\left(2+3 x-x^{3}\right) / x$. Sketch the graph of $y=f(x)$ showing this asymptotic behavior.
L11838: 19-24 Sketch a graph of the rational function and label the coordinates of the stationary points and inflection points. Show the horizontal, vertical, oblique, and curvilinear asymptotes and label them with their equations. Label point(s), if any, where the graph crosses an asymptote. Check your work with a graphing utility.
L11839: 19. $x^{2}-\frac{1}{x}$
L11840: 20. $\frac{x^{2}-2}{x}$
L11841: 21. $\frac{(x-2)^{3}}{x^{2}}$
L11842: 22. $x-\frac{1}{x}-\frac{1}{x^{2}}$
L11843: 23. $\frac{x^{3}-4 x-8}{x+2}$
L11844: 24. $\frac{x^{5}}{x^{2}+1}$
L11846: ## FOCUS ON CONCEPTS
L11848: 25. In each part, match the function with graphs I-VI.
L11849: (a) $x^{1 / 3}$
L11850: (b) $x^{1 / 4}$
L11851: (c) $x^{1 / 5}$
L11852: (d) $x^{2 / 5}$
L11853: (e) $x^{4 / 3}$
L11854: (f) $x^{-1 / 3}$
L11856: [FIGURE:0d403554dcad652b | The figure displays six separate graphs, labeled I through VI, each showing a function plotted on a Cartesian coordinate system with x and y axes. Graph I shows a curve in the first quadrant...]
L11857: - Figure Ex-25
L11859: 26. Sketch the general shape of the graph of $y=x^{1 / n}$, and then explain in words what happens to the shape of the graph as $n$ increases if
L11860: (a) $n$ is a positive even integer
L11861: (b) $n$ is a positive odd integer.
L11863: 27-30 True-False Determine whether the statement is true or false. Explain your answer.
L11864: 27. Suppose that $f(x)=P(x) / Q(x)$, where $P$ and $Q$ are polynomials with no common factors. If $y=5$ is a horizontal asymptote for the graph of $f$, then $P$ and $Q$ have the same degree.
L11865: 28. If the graph of $f$ has a vertical asymptote at $x=1$, then $f$ cannot be continuous at $x=1$.
L11866: 29. If the graph of $f^{\prime}$ has a vertical asymptote at $x=1$, then $f$ cannot be continuous at $x=1$.
L11867: 30. If the graph of $f$ has a cusp at $x=1$, then $f$ cannot have an inflection point at $x=1$.
L11869: 31-38 Give a graph of the function and identify the locations of all critical points and inflection points. Check your work with a graphing utility.
L11870: 31. $\sqrt{4 x^{2}-1}$
L11871: 32. $\sqrt[3]{x^{2}-4}$
L11872: 33. $2 x+3 x^{2 / 3}$
L11873: 34. $2 x^{2}-3 x^{4 / 3}$
L11874: 35. $4 x^{1 / 3}-x^{4 / 3}$
L11875: 36. $5 x^{2 / 3}+x^{5 / 3}$
L11876: 37. $\frac{8+x}{2+\sqrt[3]{x}}$
L11877: 38. $\frac{8(\sqrt{x}-1)}{x}$
L11879: 39-44 Give a graph of the function and identify the locations of all relative extrema and inflection points. Check your work with a graphing utility.
L11880: 39. $x+\sin x$
L11881: 40. $x-\tan x$
L11882: 41. $\sqrt{3} \cos x+\sin x$
L11883: 42. $\sin x+\cos x$
L11884: 43. $\sin ^{2} x-\cos x, \quad-\pi \leq x \leq 3 \pi$
L11885: 44. $\sqrt{\tan x}, \quad 0 \leq x<\pi / 2$
L11887: 45-54 Using L'Hôpital's rule (Section 3.6) one can verify that
L11889: $$
L11890: \lim _{x \rightarrow+\infty} \frac{e^{x}}{x}=+\infty, \quad \lim _{x \rightarrow+\infty} \frac{x}{e^{x}}=0, \quad \lim _{x \rightarrow-\infty} x e^{x}=0
L11891: $$
L11893: In these exercises: (a) Use these results, as necessary, to find the limits of $f(x)$ as $x \rightarrow+\infty$ and as $x \rightarrow-\infty$. (b) Sketch a graph of $f(x)$ and identify all relative extrema, inflection points, and asymptotes (as appropriate). Check your work with a graphing utility.
L11894: 45. $f(x)=x e^{x}$
L11895: 46. $f(x)=x e^{-x}$
L11896: 47. $f(x)=x^{2} e^{-2 x}$
L11897: 48. $f(x)=x^{2} e^{2 x}$
L11898: 49. $f(x)=x^{2} e^{-x^{2}}$
L11899: 50. $f(x)=e^{-1 / x^{2}}$
L11900: 51. $f(x)=\frac{e^{x}}{1-x}$
L11901: 52. $f(x)=x^{2 / 3} e^{x}$
L11902: 53. $f(x)=x^{2} e^{1-x}$
L11903: 54. $f(x)=x^{3} e^{x-1}$
L11905: 55-60 Using L'Hôpital's rule (Section 3.6) one can verify that
L11907: $$
L11908: \lim _{x \rightarrow+\infty} \frac{\ln x}{x^{r}}=0, \quad \lim _{x \rightarrow+\infty} \frac{x^{r}}{\ln x}=+\infty, \quad \lim _{x \rightarrow 0^{+}} x^{r} \ln x=0
L11909: $$
L11911: for any positive real number $r$. In these exercises: (a) Use these results, as necessary, to find the limits of $f(x)$ as $x \rightarrow+\infty$ and as $x \rightarrow 0^{+}$. (b) Sketch a graph of $f(x)$ and identify all relative extrema, inflection points, and asymptotes (as appropriate). Check your work with a graphing utility.
L11912: 55. $f(x)=x \ln x$
L11913: 56. $f(x)=x^{2} \ln x$
L11914: 57. $f(x)=x^{2} \ln (2 x)$
L11915: 58. $f(x)=\ln \left(x^{2}+1\right)$
L11916: 59. $f(x)=x^{2 / 3} \ln x$
L11917: 60. $f(x)=x^{-1 / 3} \ln x$
L11919: ## FOCUS ON CONCEPTS
L11921: 61. Consider the family of curves $y=x e^{-b x}(b>0)$.
L11922: (a) Use a graphing utility to generate some members of this family.
L11923: (b) Discuss the effect of varying $b$ on the shape of the graph, and discuss the locations of the relative extrema and inflection points.
L11924: 62. Consider the family of curves $y=e^{-b x^{2}}(b>0)$.
L11925: (a) Use a graphing utility to generate some members of this family.
L11926: (b) Discuss the effect of varying $b$ on the shape of the graph, and discuss the locations of the relative extrema and inflection points.
L11927: 63. (a) Determine whether the following limits exist, and if so, find them:
L11929: $$
L11930: \lim _{x \rightarrow+\infty} e^{x} \cos x, \quad \lim _{x \rightarrow-\infty} e^{x} \cos x
L11931: $$
L11933: (b) Sketch the graphs of the equations $y=e^{x}, y=-e^{x}$, and $y=e^{x} \cos x$ in the same coordinate system, and label any points of intersection.
L11934: (c) Use a graphing utility to generate some members of the family $y=e^{a x} \cos b x(a>0$ and $b>0)$, and discuss the effect of varying $a$ and $b$ on the shape of the curve.
L11935: 64. Consider the family of curves $y=x^{n} e^{-x^{2} / n}$, where $n$ is a positive integer.
L11936: (a) Use a graphing utility to generate some members of this family.
L11937: (b) Discuss the effect of varying $n$ on the shape of the graph, and discuss the locations of the relative extrema and inflection points.
L11938: 65. The accompanying figure shows the graph of the derivative of a function $h$ that is defined and continuous on the interval $(-\infty,+\infty)$. Assume that the graph of $h^{\prime}$ has a vertical asymptote at $x=3$ and that
L11940: $$
L11941: \begin{aligned}
L11942: & h^{\prime}(x) \rightarrow 0^{+} \text {as } x \rightarrow-\infty \\
L11943: & h^{\prime}(x) \rightarrow-\infty \text { as } x \rightarrow+\infty
L11944: \end{aligned}
L11945: $$
L11947: (a) What are the critical points for $h(x)$ ?
L11948: (b) Identify the intervals on which $h(x)$ is increasing.
L11949: (c) Identify the $x$-coordinates of relative extrema for $h(x)$ and classify each as a relative maximum or relative minimum.
L11950: (d) Estimate the $x$-coordinates of inflection points for $h(x)$.
L11952: [FIGURE:46b95d4772f9ba6a | A graph of the derivative $y=h'(x)$ is shown on a Cartesian coordinate system with x and y axes. The curve starts near the x-axis for $x < 0$, crosses the x-axis around $x=0.5$ and $x=1$, then dips...]
L11953: Figure Ex-65
L11955: 66. Let $f(x)=(1-2 x) h(x)$, where $h(x)$ is as given in Exercise 65 . Suppose that $x=5$ is a critical point for $f(x)$.
L11956: (a) Estimate $h(5)$.
L11957: (b) Use the second derivative test to determine whether $f(x)$ has a relative maximum or a relative minimum at $x=5$.
L11958: 67. A rectangular plot of land is to be fenced off so that the area enclosed will be $400 \mathrm{ft}^{2}$. Let $L$ be the length of fencing needed and $x$ the length of one side of the rectangle. Show that $L=2 x+800 / x$ for $x>0$, and sketch the graph of $L$ versus $x$ for $x>0$.
L11959: 68. A box with a square base and open top is to be made from sheet metal so that its volume is $500 \mathrm{in}^{3}$. Let $S$ be the area
L11960: of the surface of the box and $x$ the length of a side of the square base. Show that $S=x^{2}+2000 / x$ for $x>0$, and sketch the graph of $S$ versus $x$ for $x>0$.
L11961: 69. The accompanying figure shows a computer-generated graph of the polynomial $y=0.1 x^{5}(x-1)$ using a viewing window of $[-2,2.5] \times[-1,5]$. Show that the choice of the vertical scale caused the computer to miss important features of the graph. Find the features that were missed and make your own sketch of the graph that shows the missing features.
L11962: 70. The accompanying figure shows a computer-generated graph of the polynomial $y=0.1 x^{5}(x+1)^{2}$ using a viewing window of $[-2,1.5] \times[-0.2,0.2]$. Show that the choice of the vertical scale caused the computer to miss important features of the graph. Find the features that were missed and make your own sketch of the graph that shows the missing features.
L11964: [FIGURE:a5c5f4e1d1f28ad0 | The graph displays a smooth, symmetric curve, representing a function $h(x)$, on a Cartesian coordinate system with x-axis labels from -2 to 2 and y-axis labels from -1 to 5. The curve forms a...]
L11965: - Figure Ex-69
L11967: Generated by Mathematica
L11969: [FIGURE:3e036db221a5afa5 | A graph of a function $h(x)$ is shown on a Cartesian coordinate system with the x-axis ranging from -2 to 1 and the y-axis from -0.2 to 0.2. The curve is monotonically increasing, passing through the...]
L11970: Generated by Mathematica
L11972: - Figure Ex-70
L11974: 71. Writing Suppose that $x=x_{0}$ is a point at which a function $f$ is continuous but not differentiable and that $f^{\prime}(x)$ approaches different finite limits as $x$ approaches $x_{0}$ from either side. Invent your own term to describe the graph of $f$ at such a point and discuss the appropriateness of your term.
L11975: 72. Writing Suppose that the graph of a function $f$ is obtained using a graphing utility. Discuss the information that calculus techniques can provide about $f$ to add to what can already be inferred about $f$ from the graph as shown on your utility's display.
L11977: ## QUICK CHECK ANSWERS 4.3
L11979: 1. (a) $(-1,0),(3,0),\left(0, \frac{9}{8}\right)$ (b) $x=-2$ and $x=4$ (c) $y=3$ (d) $(-\infty,-2),(-1,3)$, and $(4,+\infty)$ (e) $(-\infty,-2)$ and $(-2,1]$
L11980: (f) $(-\infty,-2)$ and $(4,+\infty)$ (g) $\left(1, \frac{4}{3}\right)$
L11981: 2. (a) $(-2,0),(2,0)$
L11982: (b) $x=0$
L11983: (b) $(-\infty, 2)$ and $(2,+\infty)$
L11984: (c) $y=0$
L11985: (c) $(-\infty,-2]$ and $[2,+\infty)$
L11986: (d) $(-\infty,-2)$ and $(2,+\infty)$
L11987: (d) $(-\infty,-2-2 \sqrt{2})$ and $(-2+2 \sqrt{2},+\infty)$
L11988: (e) $(-\infty,-4]$ and $(0,4]$
L11989: (e) $(2,0)$
L11990: (f) $(-\infty,-4 \sqrt{11 / 5})$ and $(4 \sqrt{11 / 5},+\infty)$ (g) $\pm 4 \sqrt{11 / 5} \approx \pm 5.93 \quad$ 3. (a) $y=0$ (as $x \rightarrow-\infty$ )
L11991: (f) $\left(-2,16 e^{-1}\right) \approx(-2,5.89)$ (g) $-2 \pm 2 \sqrt{2}$
