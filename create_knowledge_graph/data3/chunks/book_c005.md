L01700: Solution. Graphs of the functions $f(x)=\sqrt{x^{6}+5}-x^{3}$, and $g(x)=\sqrt{x^{6}+5 x^{3}}-x^{3}$ for $x \geq 0$, are shown in Figure 1.3.6. From the graphs we might conjecture that the requested limits are 0 and $\frac{5}{2}$, respectively. To confirm this, we treat each function as a fraction with a denominator of 1 and rationalize the numerator.
L01702: $$
L01703: \begin{aligned}
L01704: \lim _{x \rightarrow+\infty}\left(\sqrt{x^{6}+5}-x^{3}\right) & =\lim _{x \rightarrow+\infty}\left(\sqrt{x^{6}+5}-x^{3}\right)\left(\frac{\sqrt{x^{6}+5}+x^{3}}{\sqrt{x^{6}+5}+x^{3}}\right) \\
L01705: & =\lim _{x \rightarrow+\infty} \frac{\left(x^{6}+5\right)-x^{6}}{\sqrt{x^{6}+5}+x^{3}}=\lim _{x \rightarrow+\infty} \frac{5}{\sqrt{x^{6}+5}+x^{3}} \\
L01706: & =\lim _{x \rightarrow+\infty} \frac{\frac{5}{x^{3}}}{\sqrt{1+\frac{5}{x^{6}}}+1} \\
L01707: & =\frac{0}{\sqrt{1+0}+1}=0 \\
L01708: \lim _{x \rightarrow+\infty}\left(\sqrt{x^{6}+5 x^{3}}-x^{3}\right) & =\lim _{x \rightarrow+\infty}\left(\sqrt{x^{6}+5 x^{3}}-x^{3}\right) \\
L01709: & \left.=\lim _{x \rightarrow+\infty} \frac{\left(x^{6}+5 x^{3}\right)-x^{6}}{\sqrt{x^{6}+5 x^{3}}+x^{3}}=\lim _{x \rightarrow+\infty} \frac{5 x^{3}}{\sqrt{x^{6}+5 x^{3}}+x^{3}}\right) \\
L01710: & =\lim _{x \rightarrow+\infty} \frac{5}{\sqrt{1+\frac{5}{x^{3}}}+1} \quad \sqrt{\sqrt{x^{6}}=x^{3} \text { for } x>0} \\
L01711: & =\frac{5}{\sqrt{1+0}+1}=\frac{5}{2}
L01712: \end{aligned}
L01713: $$
L01715: ## END BEHAVIOR OF TRIGONOMETRIC, EXPONENTIAL, AND LOGARITHMIC FUNCTIONS
L01717: Consider the function $f(x)=\sin x$ that is graphed in Figure 1.3.7. For this function the limits as $x \rightarrow+\infty$ and as $x \rightarrow-\infty$ fail to exist not because $f(x)$ increases or decreases without bound, but rather because the values vary between -1 and 1 without approaching some specific real number. In general, the trigonometric functions fail to have limits as $x \rightarrow+\infty$ and as $x \rightarrow-\infty$ because of periodicity. There is no specific notation to denote this kind of behavior.
L01719: In Section 0.5 we showed that the functions $e^{x}$ and $\ln x$ both increase without bound as $x \rightarrow+\infty$ (Figures 0.5.8 and 0.5.9). Thus, in limit notation we have
L01721: $$
L01722: \begin{equation*}
L01723: \lim _{x \rightarrow+\infty} \ln x=+\infty \quad \lim _{x \rightarrow+\infty} e^{x}=+\infty \tag{20-21}
L01724: \end{equation*}
L01725: $$
L01727: For reference, we also list the following limits, which are consistent with the graphs in Figure 1.3.8:
L01729: $$
L01730: \begin{equation*}
L01731: \lim _{x \rightarrow-\infty} e^{x}=0 \quad \lim _{x \rightarrow 0^{+}} \ln x=-\infty \tag{22-23}
L01732: \end{equation*}
L01733: $$
L01735: [FIGURE:59eb0cfd3b50c508 | A Cartesian coordinate system displays the graphs of two functions and a dashed line representing $y=x$. The blue curve, labeled $y=e^x$, passes through $(0,1)$ and increases exponentially. The...]
L01736: - Figure 1.3.8
L01738: [FIGURE:9888c8985ac81517 | A graph displays two exponential functions, $y=e^x$ (blue) and $y=e^{-x}$ (purple), on a Cartesian coordinate system. The curve $y=e^x$ increases exponentially from left to right, while $y=e^{-x}$...]
L01739: △ Figure 1.3.9
L01741: Finally, the following limits can be deduced by noting that the graph of $y=e^{-x}$ is the reflection about the $y$-axis of the graph of $y=e^{x}$ (Figure 1.3.9).
L01743: $$
L01744: \begin{equation*}
L01745: \lim _{x \rightarrow+\infty} e^{-x}=0 \quad \lim _{x \rightarrow-\infty} e^{-x}=+\infty \tag{24-25}
L01746: \end{equation*}
L01747: $$
L01749: ## QUICK CHECK EXERCISES 1.3 (See page 100 for answers.)
L01751: 1. Find the limits.
L01752: (a) $\lim _{x \rightarrow-\infty}(3-x)=$ $\_\_\_\_$
L01753: (b) $\lim _{x \rightarrow+\infty}\left(5-\frac{1}{x}\right)=$ $\_\_\_\_$
L01754: (c) $\lim _{x \rightarrow+\infty} \ln \left(\frac{1}{x}\right)=$ $\_\_\_\_$
L01755: (d) $\lim _{x \rightarrow+\infty} \frac{1}{e^{x}}=$ $\_\_\_\_$
L01756: 2. Find the limits that exist.
L01757: (a) $\lim _{x \rightarrow-\infty} \frac{2 x^{2}+x}{4 x^{2}-3}=$ $\_\_\_\_$
L01758: (b) $\lim _{x \rightarrow+\infty} \frac{1}{2+\sin x}=$ $\_\_\_\_$
L01759: (c) $\lim _{x \rightarrow+\infty}\left(1+\frac{1}{x}\right)^{x}=$ $\_\_\_\_$
L01760: 3. Given that
L01762: $$
L01763: \lim _{x \rightarrow+\infty} f(x)=2 \quad \text { and } \quad \lim _{x \rightarrow+\infty} g(x)=-3
L01764: $$
L01766: find the limits that exist.
L01767: (a) $\lim _{x \rightarrow+\infty}[3 f(x)-g(x)]=$ $\_\_\_\_$
L01768: (b) $\lim _{x \rightarrow+\infty} \frac{f(x)}{g(x)}=$ $\_\_\_\_$
L01769: (c) $\lim _{x \rightarrow+\infty} \frac{2 f(x)+3 g(x)}{3 f(x)+2 g(x)}=$ $\_\_\_\_$
L01770: (d) $\lim _{x \rightarrow+\infty} \sqrt{10-f(x) g(x)}=$ $\_\_\_\_$
L01771: 4. Consider the graphs of $1 / x, \sin x, \ln x, e^{x}$, and $e^{-x}$. Which of these graphs has a horizontal asymptote?
L01773: ## EXERCISE SET 1.3 Graphing Utility
L01775: 1-4 In these exercises, make reasonable assumptions about the end behavior of the indicated function.
L01777: 1. For the function $g$ graphed in the accompanying figure, find
L01778: (a) $\lim _{x \rightarrow-\infty} g(x)$
L01779: (b) $\lim _{x \rightarrow+\infty} g(x)$.
L01781: [FIGURE:5dc8df5beb887d9e | The figure shows the graph of the function $y = g(x)$ on a Cartesian coordinate system. The $x$-axis and $y$-axis are labeled, with grid lines and tick marks at integer values, including '1' on the...]
L01782: Figure Ex-1
L01784: 2. For the function $\phi$ graphed in the accompanying figure, find
L01785: (a) $\lim _{x \rightarrow-\infty} \phi(x)$
L01786: (b) $\lim _{x \rightarrow+\infty} \phi(x)$.
L01788: [FIGURE:4754353c8b7fd4e9 | A graph on a Cartesian coordinate system shows the function $y = \phi(x)$. The curve has two branches, one in the first quadrant and one in the third quadrant, both approaching the x-axis as a...]
L01789: \& Figure Ex-2
L01791: 3. For the function $\phi$ graphed in the accompanying figure, find
L01792: (a) $\lim _{x \rightarrow-\infty} \phi(x)$
L01793: (b) $\lim _{x \rightarrow+\infty} \phi(x)$.
L01795: [FIGURE:a6c5da3fc86c5015 | A graph displays the function $y = \phi(x)$ on an $xy$-coordinate plane with a grid. The $x$-axis and $y$-axis are labeled, with major tick marks at $x=4$ and $y=4$. As $x \to -\infty$, the curve...]
L01796: Figure Ex-3
L01798: 4. For the function $G$ graphed in the accompanying figure, find
L01799: (a) $\lim _{x \rightarrow-\infty} G(x)$
L01800: (b) $\lim _{x \rightarrow+\infty} G(x)$.
L01801: [FIGURE:1cd8cdb6736f95b8 | The graph displays the function $y = G(x)$ on a coordinate plane with x and y axes and a grid background. The curve oscillates, with its amplitude decreasing as $x$ increases, indicating that $G(x)$...]
L01803: Figure Ex-4
L01804: 5. Given that
L01806: $$
L01807: \lim _{x \rightarrow+\infty} f(x)=3, \quad \lim _{x \rightarrow+\infty} g(x)=-5, \quad \lim _{x \rightarrow+\infty} h(x)=0
L01808: $$
L01810: find the limits that exist. If the limit does not exist, explain why.
L01811: (a) $\lim _{x \rightarrow+\infty}[f(x)+3 g(x)]$
L01812: (b) $\lim _{x \rightarrow+\infty}[h(x)-4 g(x)+1]$
L01813: (c) $\lim _{x \rightarrow+\infty}[f(x) g(x)]$
L01814: (d) $\lim _{x \rightarrow+\infty}[g(x)]^{2}$
L01815: (e) $\lim _{x \rightarrow+\infty} \sqrt[3]{5+f(x)}$
L01816: (f) $\lim _{x \rightarrow+\infty} \frac{3}{g(x)}$
L01817: (g) $\lim _{x \rightarrow+\infty} \frac{3 h(x)+4}{x^{2}}$
L01818: (h) $\lim _{x \rightarrow+\infty} \frac{6 f(x)}{5 f(x)+3 g(x)}$
L01819: 6. Given that
L01821: $$
L01822: \lim _{x \rightarrow-\infty} f(x)=7 \quad \text { and } \quad \lim _{x \rightarrow-\infty} g(x)=-6
L01823: $$
L01825: find the limits that exist. If the limit does not exist, explain why.
L01826: (a) $\lim _{x \rightarrow-\infty}[2 f(x)-g(x)]$
L01827: (b) $\lim _{x \rightarrow-\infty}[6 f(x)+7 g(x)]$
L01828: (c) $\lim _{x \rightarrow-\infty}\left[x^{2}+g(x)\right]$
L01829: (d) $\lim _{x \rightarrow-\infty}\left[x^{2} g(x)\right]$
L01830: (e) $\lim _{x \rightarrow-\infty} \sqrt[3]{f(x) g(x)}$
L01831: (f) $\lim _{x \rightarrow-\infty} \frac{g(x)}{f(x)}$
L01832: (g) $\lim _{x \rightarrow-\infty}\left[f(x)+\frac{g(x)}{x}\right]$
L01833: (h) $\lim _{x \rightarrow-\infty} \frac{x f(x)}{(2 x+3) g(x)}$
L01834: 7. (a) Complete the table and make a guess about the limit indicated.
L01836: $$
L01837: f(x)=\tan ^{-1}\left(\frac{1}{x}\right) \quad \lim _{x \rightarrow 0^{+}} f(x)
L01838: $$
L01840: | $x$ | 0.1 | 0.01 | 0.001 | 0.0001 | 0.00001 | 0.000001 |
L01841: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
L01842: | $f(x)$ |  |  |  |  |  |  |
L01844: (b) Use Figure 1.3.3 to find the exact value of the limit in part (a).
L01845: 8. Complete the table and make a guess about the limit indicated.
L01847: $$
L01848: f(x)=x^{1 / x} \quad \lim _{x \rightarrow+\infty} f(x)
L01849: $$
L01851: | $x$ | 10 | 100 | 1000 | 10,000 | 100,000 | $1,000,000$ |
L01852: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
L01853: | $f(x)$ |  |  |  |  |  |  |
L01855: 9-40 Find the limits. $\square$
L01856: 9. $\lim _{x \rightarrow+\infty}\left(1+2 x-3 x^{5}\right)$
L01857: 10. $\lim _{x \rightarrow+\infty}\left(2 x^{3}-100 x+5\right)$
L01858: 11. $\lim _{x \rightarrow+\infty} \sqrt{x}$
L01859: 12. $\lim _{x \rightarrow-\infty} \sqrt{5-x}$
L01860: 13. $\lim _{x \rightarrow+\infty} \frac{3 x+1}{2 x-5}$
L01861: 14. $\lim _{x \rightarrow+\infty} \frac{5 x^{2}-4 x}{2 x^{2}+3}$
L01862: 15. $\lim _{y \rightarrow-\infty} \frac{3}{y+4}$
L01863: 16. $\lim _{x \rightarrow+\infty} \frac{1}{x-12}$
L01864: 17. $\lim _{x \rightarrow-\infty} \frac{x-2}{x^{2}+2 x+1}$
L01865: 18. $\lim _{x \rightarrow+\infty} \frac{5 x^{2}+7}{3 x^{2}-x}$
L01866: 19. $\lim _{x \rightarrow+\infty} \frac{7-6 x^{5}}{x+3}$
L01867: 20. $\lim _{t \rightarrow-\infty} \frac{5-2 t^{3}}{t^{2}+1}$
L01868: 21. $\lim _{t \rightarrow+\infty} \frac{6-t^{3}}{7 t^{3}+3}$
L01869: 22. $\lim _{x \rightarrow-\infty} \frac{x+4 x^{3}}{1-x^{2}+7 x^{3}}$
L01870: 23. $\lim _{x \rightarrow+\infty} \sqrt[3]{\frac{2+3 x-5 x^{2}}{1+8 x^{2}}}$
L01871: 24. $\lim _{s \rightarrow+\infty} \sqrt[3]{\frac{3 s^{7}-4 s^{5}}{2 s^{7}+1}}$
L01872: 25. $\lim _{x \rightarrow-\infty} \frac{\sqrt{5 x^{2}-2}}{x+3}$
L01873: 26. $\lim _{x \rightarrow+\infty} \frac{\sqrt{5 x^{2}-2}}{x+3}$
L01874: 27. $\lim _{y \rightarrow-\infty} \frac{2-y}{\sqrt{7+6 y^{2}}}$
L01875: 28. $\lim _{y \rightarrow+\infty} \frac{2-y}{\sqrt{7+6 y^{2}}}$
L01876: 29. $\lim _{x \rightarrow-\infty} \frac{\sqrt{3 x^{4}+x}}{x^{2}-8}$
L01877: 30. $\lim _{x \rightarrow+\infty} \frac{\sqrt{3 x^{4}+x}}{x^{2}-8}$
L01878: 31. $\lim _{x \rightarrow+\infty}\left(\sqrt{x^{2}+3}-x\right)$
L01879: 32. $\lim _{x \rightarrow+\infty}\left(\sqrt{x^{2}-3 x}-x\right)$
L01880: 33. $\lim _{x \rightarrow-\infty} \frac{1-e^{x}}{1+e^{x}}$
L01881: 34. $\lim _{x \rightarrow+\infty} \frac{1-e^{x}}{1+e^{x}}$
L01882: 35. $\lim _{x \rightarrow+\infty} \frac{e^{x}+e^{-x}}{e^{x}-e^{-x}}$
L01883: 36. $\lim _{x \rightarrow-\infty} \frac{e^{x}+e^{-x}}{e^{x}-e^{-x}}$
L01884: 37. $\lim _{x \rightarrow+\infty} \ln \left(\frac{2}{x^{2}}\right)$
L01885: 38. $\lim _{x \rightarrow 0^{+}} \ln \left(\frac{2}{x^{2}}\right)$
L01886: 39. $\lim _{x \rightarrow+\infty} \frac{(x+1)^{x}}{x^{x}}$
L01887: 40. $\lim _{x \rightarrow+\infty}\left(1+\frac{1}{x}\right)^{-x}$
L01889: 41-44 True-False Determine whether the statement is true or false. Explain your answer.
L01890: 41. We have $\lim _{x \rightarrow+\infty}\left(1+\frac{1}{x}\right)^{2 x}=(1+0)^{+\infty}=1^{+\infty}=1$.
L01891: 42. If $y=L$ is a horizontal asymptote for the curve $y=f(x)$, then
L01893: $$
L01894: \lim _{x \rightarrow-\infty} f(x)=L \quad \text { and } \quad \lim _{x \rightarrow+\infty} f(x)=L
L01895: $$
L01897: 43. If $y=L$ is a horizontal asymptote for the curve $y=f(x)$, then it is possible for the graph of $f$ to intersect the line $y=L$ infinitely many times.
L01898: 44. If a rational function $p(x) / q(x)$ has a horizontal asymptote, then the degree of $p(x)$ must equal the degree of $q(x)$.
L01900: ## FOCUS ON CONCEPTS
L01902: 45. Assume that a particle is accelerated by a constant force. The two curves $v=n(t)$ and $v=e(t)$ in the accompanying figure provide velocity versus time curves for the particle as predicted by classical physics and by the special theory of relativity, respectively. The parameter $c$ represents the speed of light. Using the language of limits, describe the differences in the long-term predictions of the two theories.
L01904: [FIGURE:6292cd78e751d6e8 | A 2D graph plots velocity $v$ on the vertical axis against time $t$ on the horizontal axis. A horizontal dashed line at $v=c$ represents a constant velocity $c$. Two curves originate from the origin...]
L01905: Figure Ex-45
L01907: 46. Let $T=f(t)$ denote the temperature of a baked potato $t$ minutes after it has been removed from a hot oven. The accompanying figure shows the temperature versus time curve for the potato, where $r$ is the temperature of the room.
L01908: (a) What is the physical significance of $\lim _{t \rightarrow 0^{+}} f(t)$ ?
L01909: (b) What is the physical significance of $\lim _{t \rightarrow+\infty} f(t)$ ?
L01911: [FIGURE:d9256317b6406504 | The graph shows Temperature $T$ in degrees Fahrenheit on the vertical axis versus Time $t$ in minutes on the horizontal axis. A blue curve, labeled $T = f(t)$, starts at the point $(0, 400)$ and...]
L01912: Figure Ex-46
L01914: 47. Let
L01916: $$
L01917: f(x)= \begin{cases}2 x^{2}+5, & x<0 \\ \frac{3-5 x^{3}}{1+4 x+x^{3}}, & x \geq 0\end{cases}
L01918: $$
L01920: Find
L01921: (a) $\lim _{x \rightarrow-\infty} f(x)$
L01922: (b) $\lim _{x \rightarrow+\infty} f(x)$.
L01923: 48. Let
L01925: $$
L01926: g(t)= \begin{cases}\frac{2+3 t}{5 t^{2}+6}, & t<1,000,000 \\ \frac{\sqrt{36 t^{2}-100}}{5-t}, & t>1,000,000\end{cases}
L01927: $$
L01929: Find
L01930: (a) $\lim _{t \rightarrow-\infty} g(t)$
L01931: (b) $\lim _{t \rightarrow+\infty} g(t)$.
L01932: 49. Discuss the limits of $p(x)=(1-x)^{n}$ as $x \rightarrow+\infty$ and $x \rightarrow-\infty$ for positive integer values of $n$.
L01933: 50. In each part, find examples of polynomials $p(x)$ and $q(x)$ that satisfy the stated condition and such that $p(x) \rightarrow+\infty$ and $q(x) \rightarrow+\infty$ as $x \rightarrow+\infty$.
L01934: (a) $\lim _{x \rightarrow+\infty} \frac{p(x)}{q(x)}=1$
L01935: (b) $\lim _{x \rightarrow+\infty} \frac{p(x)}{q(x)}=0$
L01936: (c) $\lim _{x \rightarrow+\infty} \frac{p(x)}{q(x)}=+\infty$
L01937: (d) $\lim _{x \rightarrow+\infty}[p(x)-q(x)]=3$
L01938: 51. (a) Do any of the trigonometric functions $\sin x, \cos x, \tan x$, $\cot x, \sec x$, and $\csc x$ have horizontal asymptotes?
L01939: (b) Do any of the trigonometric functions have vertical asymptotes? Where?
L01940: 52. Find
L01942: $$
L01943: \lim _{x \rightarrow+\infty} \frac{c_{0}+c_{1} x+\cdots+c_{n} x^{n}}{d_{0}+d_{1} x+\cdots+d_{m} x^{m}}
L01944: $$
L01946: where $c_{n} \neq 0$ and $d_{m} \neq 0$. [Hint: Your answer will depend on whether $m<n, m=n$, or $m>n$.]
L01948: ## FOCUS ON CONCEPTS
L01950: 53-54 These exercises develop some versions of the substitution principle, a useful tool for the evaluation of limits.
L01951: 53. (a) Explain why we can evaluate $\lim _{x \rightarrow+\infty} e^{x^{2}}$ by making the substitution $t=x^{2}$ and writing
L01953: $$
L01954: \lim _{x \rightarrow+\infty} e^{x^{2}}=\lim _{t \rightarrow+\infty} e^{t}=+\infty
L01955: $$
L01957: (b) Suppose $g(x) \rightarrow+\infty$ as $x \rightarrow+\infty$. Given any function $f(x)$, explain why we can evaluate $\lim _{x \rightarrow+\infty} f[g(x)]$ by substituting $t=g(x)$ and writing
L01959: $$
L01960: \lim _{x \rightarrow+\infty} f[g(x)]=\lim _{t \rightarrow+\infty} f(t)
L01961: $$
L01963: (Here, "equality" is interpreted to mean that either both limits exist and are equal or that both limits fail to exist.)
L01964: (c) Why does the result in part (b) remain valid if $\lim _{x \rightarrow+\infty}$ is replaced everywhere by one of $\lim _{x \rightarrow-\infty}, \lim _{x \rightarrow c}, \lim _{x \rightarrow c^{-}}$, or $\lim _{x \rightarrow c^{+}}$?
L01965: 54. (a) Explain why we can evaluate $\lim _{x \rightarrow+\infty} e^{-x^{2}}$ by making the substitution $t=-x^{2}$ and writing
L01967: $$
L01968: \lim _{x \rightarrow+\infty} e^{-x^{2}}=\lim _{t \rightarrow-\infty} e^{t}=0
L01969: $$
L01971: (cont.)
L01972: (b) Suppose $g(x) \rightarrow-\infty$ as $x \rightarrow+\infty$. Given any function $f(x)$, explain why we can evaluate $\lim _{x \rightarrow+\infty} f[g(x)]$ by substituting $t=g(x)$ and writing
L01974: $$
L01975: \lim _{x \rightarrow+\infty} f[g(x)]=\lim _{t \rightarrow-\infty} f(t)
L01976: $$
L01978: (Here, "equality" is interpreted to mean that either both limits exist and are equal or that both limits fail to exist.)
L01979: (c) Why does the result in part (b) remain valid if $\lim _{x \rightarrow+\infty}$ is replaced everywhere by one of $\lim _{x \rightarrow-\infty}, \lim _{x \rightarrow c}, \lim _{x \rightarrow c^{-}}$, or $\lim _{x \rightarrow c^{+}}$?
L01981: 55-62 Evaluate the limit using an appropriate substitution.
L01982: 55. $\lim _{x \rightarrow 0^{+}} e^{1 / x}$
L01983: 56. $\lim _{x \rightarrow 0^{-}} e^{1 / x}$
L01984: 57. $\lim _{x \rightarrow 0^{+}} e^{\csc x}$
L01985: 58. $\lim _{x \rightarrow 0^{-}} e^{\csc x}$
L01986: 59. $\lim _{x \rightarrow+\infty} \frac{\ln 2 x}{\ln 3 x}$ [Hint: $t=\ln x$ ]
L01987: 60. $\lim _{x \rightarrow+\infty}\left[\ln \left(x^{2}-1\right)-\ln (x+1)\right][$ Hint: $t=x-1]$
L01988: 61. $\lim _{x \rightarrow+\infty}\left(1-\frac{1}{x}\right)^{-x}[$ Hint: $t=-x]$
L01989: 62. $\lim _{x \rightarrow+\infty}\left(1+\frac{2}{x}\right)^{x}$ [Hint: $t=x / 2$ ]
L01990: 63. Let $f(x)=b^{x}$, where $0<b$. Use the substitution principle to verify the asymptotic behavior of $f$ that is illustrated in Figure 0.5.1. [Hint: $f(x)=b^{x}=\left(e^{\ln b}\right)^{x}=e^{(\ln b) x}$ ]
L01991: 64. Prove that $\lim _{x \rightarrow 0}(1+x)^{1 / x}=e$ by completing parts (a) and (b).
L01992: (a) Use Equation (7) and the substitution $t=1 / x$ to prove that $\lim _{x \rightarrow 0^{+}}(1+x)^{1 / x}=e$.
L01993: (b) Use Equation (8) and the substitution $t=1 / x$ to prove that $\lim _{x \rightarrow 0^{-}}(1+x)^{1 / x}=e$.
L01994: 65. Suppose that the speed $v$ (in $\mathrm{ft} / \mathrm{s}$ ) of a skydiver $t$ seconds after leaping from a plane is given by the equation $v=190\left(1-e^{-0.168 t}\right)$.
L01995: (a) Graph $v$ versus $t$.
L01996: (b) By evaluating an appropriate limit, show that the graph of $v$ versus $t$ has a horizontal asymptote $v=c$ for an appropriate constant $c$.
L01997: (c) What is the physical significance of the constant $c$ in part (b)?
L01998: 66. The population $p$ of the United States (in millions) in year $t$ may be modeled by the function
L02000: $$
L02001: p=\frac{50371.7}{151.3+181.626 e^{-0.031636(t-1950)}}
L02002: $$
L02004: (a) Based on this model, what was the U.S. population in 1950?
L02005: (b) Plot $p$ versus $t$ for the 200-year period from 1950 to 2150 .
L02006: (c) By evaluating an appropriate limit, show that the graph of $p$ versus $t$ has a horizontal asymptote $p=c$ for an appropriate constant $c$.
L02007: (d) What is the significance of the constant $c$ in part (b) for population predicted by this model?
L02008: 67. (a) Compute the (approximate) values of the terms in the sequence
L02010: $$
L02011: \begin{aligned}
L02012: & 1.01^{101}, 1.001^{1001}, 1.0001^{10001}, 1.00001^{100001} \\
L02013: & 1.000001^{1000001}, 1.0000001^{10000001} \ldots
L02014: \end{aligned}
L02015: $$
L02017: What number do these terms appear to be approaching?
L02018: (b) Use Equation (7) to verify your answer in part (a).
L02019: (c) Let $1 \leq a \leq 9$ denote a positive integer. What number is approached more and more closely by the terms in the following sequence?
L02021: $$
L02022: \begin{aligned}
L02023: & 1.01^{a 0 a}, 1.001^{a 00 a}, 1.0001^{a 000 a}, 1.00001^{a 0000 a} \\
L02024: & 1.000001^{a 00000 a}, 1.0000001^{a 000000 a} \ldots
L02025: \end{aligned}
L02026: $$
L02028: (The powers are positive integers that begin and end with the digit $a$ and have 0 's in the remaining positions).
L02029: 68. Let $f(x)=\left(1+\frac{1}{x}\right)^{x}$.
L02030: (a) Prove the identity
L02032: $$
L02033: f(-x)=\frac{x}{x-1} \cdot f(x-1)
L02034: $$
L02036: (b) Use Equation (7) and the identity from part (a) to prove Equation (8).
L02037: 69-73 The notion of an asymptote can be extended to include curves as well as lines. Specifically, we say that curves $y=f(x)$ and $y=g(x)$ are asymptotic as $\boldsymbol{x} \rightarrow+\infty$ provided
L02039: $$
L02040: \lim _{x \rightarrow+\infty}[f(x)-g(x)]=0
L02041: $$
L02043: and are asymptotic as $\boldsymbol{x} \rightarrow-\infty$ provided
L02045: $$
L02046: \lim _{x \rightarrow-\infty}[f(x)-g(x)]=0
L02047: $$
L02049: In these exercises, determine a simpler function $g(x)$ such that $y=f(x)$ is asymptotic to $y=g(x)$ as $x \rightarrow+\infty$ or $x \rightarrow-\infty$. Use a graphing utility to generate the graphs of $y=f(x)$ and $y=g(x)$ and identify all vertical asymptotes.
L02050: 69. $f(x)=\frac{x^{2}-2}{x-2}$ [Hint: Divide $x-2$ into $x^{2}-2$.]
L02051: 70. $f(x)=\frac{x^{3}-x+3}{x}$
L02052: 71. $f(x)=\frac{-x^{3}+3 x^{2}+x-1}{x-3}$
L02053: 72. $f(x)=\frac{x^{5}-x^{3}+3}{x^{2}-1}$
L02054: 73. $f(x)=\sin x+\frac{1}{x-1}$
L02055: 74. Writing In some models for learning a skill (e.g., juggling), it is assumed that the skill level for an individual increases with practice but cannot become arbitrarily high. How do concepts of this section apply to such a model?
L02056: 75. Writing In some population models it is assumed that a given ecological system possesses a carrying capacity $L$. Populations greater than the carrying capacity tend to decline toward $L$, while populations less than the carrying
L02057: capacity tend to increase toward $L$. Explain why these assumptions are reasonable, and discuss how the concepts of this section apply to such a model.
L02059: ## QUICK CHECK ANSWERS 1.3
L02061: 1. (a) $+\infty$
L02062: (b) 5
L02063: (c) $-\infty$
L02064: (d) 0
L02065: 2. (a) $\frac{1}{2}$
L02066: (b) does not exist (c) $e$
L02067: 3. (a) 9 (b) $-\frac{2}{3}$
L02068: (c) does not exist (d) 4
L02069: 4. $1 / x, e^{x}$, and $e^{-x}$ each has a horizontal asymptote.
