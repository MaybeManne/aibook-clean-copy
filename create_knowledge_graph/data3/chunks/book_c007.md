L02406: 1. (a) Find the largest open interval, centered at the origin on the $x$-axis, such that for each $x$ in the interval the value of the function $f(x)=x+2$ is within 0.1 unit of the number $f(0)=2$.
L02407: (b) Find the largest open interval, centered at $x=3$, such that for each $x$ in the interval the value of the function $f(x)=4 x-5$ is within 0.01 unit of the number $f(3)=7$.
L02408: (c) Find the largest open interval, centered at $x=4$, such that for each $x$ in the interval the value of the function $f(x)=x^{2}$ is within 0.001 unit of the number $f(4)=16$.
L02409: 2. In each part, find the largest open interval, centered at $x=0$, such that for each $x$ in the interval the value of $f(x)=2 x+3$ is within $\epsilon$ units of the number $f(0)=3$.
L02410: (a) $\epsilon=0.1$
L02411: (b) $\epsilon=0.01$
L02412: (c) $\epsilon=0.0012$
L02413: 3. (a) Find the values of $x_{0}$ and $x_{1}$ in the accompanying figure.
L02414: (b) Find a positive number $\delta$ such that $|\sqrt{x}-2|<0.05$ if $0<|x-4|<\delta$.
L02416: [FIGURE:13cf6b31ffade110 | A graph shows the function $y = \sqrt{x}$ in the first quadrant. The point $(4, 2)$ is marked on the curve. Horizontal dashed lines at $y = 2 - 0.05$, $y = 2$, and $y = 2 + 0.05$ define an...]
L02417: Not drawn to scale
L02419: ## - Figure Ex-3
L02421: 4. (a) Find the values of $x_{0}$ and $x_{1}$ in the accompanying figure on the next page.
L02422: (b) Find a positive number $\delta$ such that $|(1 / x)-1|<0.1$ if $0<|x-1|<\delta$.
L02424: [FIGURE:eea3db79d89f0d62 | A graph in the first quadrant shows the curve of the function $y = 1/x$. The y-axis is labeled with $1+0.1$, $1$, and $1-0.1$. Horizontal dashed lines extend from these y-values to the curve...]
L02425: Not drawn to scale
L02427: Figure Ex-4
L02428: 5. Generate the graph of $f(x)=x^{3}-4 x+5$ with a graphing utility, and use the graph to find a number $\delta$ such that $|f(x)-2|<0.05$ if $0<|x-1|<\delta$. [Hint: Show that the inequality $|f(x)-2|<0.05$ can be rewritten as $1.95<x^{3}-4 x+5<2.05$, and estimate the values of $x$ for which $x^{3}-4 x+5=1.95$ and $x^{3}-4 x+5=2.05$.]
L02429: 6. Use the method of Exercise 5 to find a number $\delta$ such that $|\sqrt{5 x+1}-4|<0.5$ if $0<|x-3|<\delta$.
L02430: 7. Let $f(x)=x+\sqrt{x}$ with $L=\lim _{x \rightarrow 1} f(x)$ and let $\epsilon=0.2$. Use a graphing utility and its trace feature to find a positive number $\delta$ such that $|f(x)-L|<\epsilon$ if $0<|x-1|<\delta$.
L02431: 8. Let $f(x)=(\sin 2 x) / x$ and use a graphing utility to conjecture the value of $L=\lim _{x \rightarrow 0} f(x)$. Then let $\epsilon=0.1$ and use the graphing utility and its trace feature to find a positive number $\delta$ such that $|f(x)-L|<\epsilon$ if $0<|x|<\delta$.
L02433: ## FOCUS ON CONCEPTS
L02435: 9. What is wrong with the following "proof" that $\lim _{x \rightarrow 3} 2 x=6$ ? Suppose that $\epsilon=1$ and $\delta=\frac{1}{2}$. Then if $|x-3|<\frac{1}{2}$, we have
L02437: $$
L02438: |2 x-6|=2|x-3|<2\left(\frac{1}{2}\right)=1=\epsilon
L02439: $$
L02441: Therefore, $\lim _{x \rightarrow 3} 2 x=6$.
L02442: 10. What is wrong with the following "proof" that $\lim _{x \rightarrow 3} 2 x=6$ ? Given any $\delta>0$, choose $\epsilon=2 \delta$. Then if $|x-3|<\delta$, we have
L02444: $$
L02445: |2 x-6|=2|x-3|<2 \delta=\epsilon
L02446: $$
L02448: Therefore, $\lim _{x \rightarrow 3} 2 x=6$.
L02449: 11. Recall from Example 1 that the creation of a limit proof involves two stages. The first is a discovery stage in which $\delta$ is found, and the second is the proof stage in which the discovered $\delta$ is shown to work. Fill in the blanks to give an explicit proof that the choice of $\delta=\epsilon / 3$ in Example 1 works. Suppose that $\epsilon>0$. Set $\delta=\epsilon / 3$ and assume that $0<|x-2|<\delta$. Then
L02451: $$
L02452: \begin{aligned}
L02453: |(3 x-5)-1| & =\mid \\
L02454: & =3 \cdot \mid \geq
L02455: \end{aligned}
L02456: $$
L02458: 12. Suppose that $f(x)=c$ is a constant function and that $a$ is some fixed real number. Explain why any choice of $\delta>0$ (e.g., $\delta=1$ ) works to prove $\lim _{x \rightarrow a} f(x)=c$.
L02460: 13-22 Use Definition 1.4.1 to prove that the limit is correct.
L02461: 13. $\lim _{x \rightarrow 2} 3=3$
L02462: 14. $\lim _{x \rightarrow 4}(x+2)=6$
L02463: 15. $\lim _{x \rightarrow 5} 3 x=15$
L02464: 16. $\lim _{x \rightarrow-1}(7 x+5)=-2$
L02465: 17. $\lim _{x \rightarrow 0} \frac{2 x^{2}+x}{x}=1$
L02466: 18. $\lim _{x \rightarrow-3} \frac{x^{2}-9}{x+3}=-6$
L02467: 19. $\lim _{x \rightarrow 1} f(x)=3$, where $f(x)= \begin{cases}x+2, & x \neq 1 \\ 10, & x=1\end{cases}$
L02468: 20. $\lim _{x \rightarrow 2} f(x)=5$, where $f(x)= \begin{cases}9-2 x, & x \neq 2 \\ 49, & x=2\end{cases}$
L02469: 21. $\lim _{x \rightarrow 0}|x|=0$
L02470: 22. $\lim _{x \rightarrow 2} f(x)=5$, where $f(x)= \begin{cases}9-2 x, & x<2 \\ 3 x-1, & x>2\end{cases}$
L02472: 23-26 True-False Determine whether the statement is true or false. Explain your answer.
L02473: 23. Suppose that $f(x)=m x+b, m \neq 0$. To prove that $\lim _{x \rightarrow a} f(x)=f(a)$, we can take $\delta=\epsilon /|m|$.
L02474: 24. Suppose that $f(x)=m x+b, m \neq 0$. To prove that $\lim _{x \rightarrow a} f(x)=f(a)$, we can take $\delta=\epsilon /(2|m|)$.
L02475: 25. For certain functions, the same $\delta$ will work for all $\epsilon>0$ in a limit proof.
L02476: 26. Suppose that $f(x)>0$ for all $x$ in the interval $(-1,1)$. If $\lim _{x \rightarrow 0} f(x)=L$, then $L>0$.
L02478: ## FOCUS ON CONCEPTS
L02480: 27. Give rigorous definitions of $\lim _{x \rightarrow a^{+}} f(x)=L$ and $\lim _{x \rightarrow a^{-}} f(x)=L$.
L02481: 28. Consider the statement that $\lim _{x \rightarrow a}|f(x)-L|=0$.
L02482: (a) Using Definition 1.4.1, write down precisely what this limit statement means.
L02483: (b) Explain why your answer to part (a) shows that
L02485: $$
L02486: \lim _{x \rightarrow a}|f(x)-L|=0 \quad \text { if and only if } \quad \lim _{x \rightarrow a} f(x)=L
L02487: $$
L02489: 29. (a) Show that
L02491: $$
L02492: \left|\left(3 x^{2}+2 x-20\right)-300\right|=|3 x+32| \cdot|x-10|
L02493: $$
L02495: (b) Find an upper bound for $|3 x+32|$ if $x$ satisfies $|x-10|<1$.
L02496: (c) Fill in the blanks to complete a proof that
L02498: $$
L02499: \lim _{x \rightarrow 10}\left[3 x^{2}+2 x-20\right]=300
L02500: $$
L02502: Suppose that $\epsilon>0$. Set $\delta=\min (1$, $\_\_\_\_$ ) and assume that $0<|x-10|<\delta$. Then
L02504: $$
L02505: \begin{aligned}
L02506: \left|\left(3 x^{2}+2 x-20\right)-300\right| & =|3 x+32| \cdot|x-10| \\
L02507: & <-|x-10| \\
L02508: & <- \\
L02509: & =\epsilon
L02510: \end{aligned}
L02511: $$
L02513: 30. (a) Show that
L02515: $$
L02516: \left|\frac{28}{3 x+1}-4\right|=\left|\frac{12}{3 x+1}\right| \cdot|x-2|
L02517: $$
L02519: (b) Is $|12 /(3 x+1)|$ bounded if $|x-2|<4$ ? If not, explain; if so, give a bound.
L02520: (c) Is $|12 /(3 x+1)|$ bounded if $|x-2|<1$ ? If not, explain; if so, give a bound.
L02521: (d) Fill in the blanks to complete a proof that
L02523: $$
L02524: \lim _{x \rightarrow 2}\left[\frac{28}{3 x+1}\right]=4
L02525: $$
L02527: Suppose that $\epsilon>0$. Set $\delta=\min (1$, $\_\_\_\_$ ) and assume that $0<|x-2|<\delta$. Then
L02529: $$
L02530: \begin{aligned}
L02531: \left|\frac{28}{3 x+1}-4\right| & =\left|\frac{12}{3 x+1}\right| \cdot|x-2| \\
L02532: & < \\
L02533: & < \\
L02534: & =\epsilon
L02535: \end{aligned}
L02536: $$
L02538: 31-36 Use Definition 1.4.1 to prove that the stated limit is correct. In each case, to show that $\lim _{x \rightarrow a} f(x)=L$, factor $|f(x)-L|$ in the form
L02540: $$
L02541: |f(x)-L|=\mid \text { "something" }|\cdot| x-a \mid
L02542: $$
L02544: and then bound the size of |"something"| by putting restrictions on the size of $\delta$.
L02545: 31. $\lim _{x \rightarrow 1} 2 x^{2}=2$ [Hint: Assume $\delta \leq 1$.]
L02546: 32. $\lim _{x \rightarrow 3}\left(x^{2}+x\right)=12$ [Hint: Assume $\delta \leq 1$.]
L02547: 33. $\lim _{x \rightarrow-2} \frac{1}{x+1}=-1$
L02548: 34. $\lim _{x \rightarrow 1 / 2} \frac{2 x+3}{x}=8$
L02549: 35. $\lim _{x \rightarrow 4} \sqrt{x}=2$
L02550: 36. $\lim _{x \rightarrow 2} x^{3}=8$
L02551: 37. Let
L02553: $$
L02554: f(x)= \begin{cases}0, & \text { if } x \text { is rational } \\ x, & \text { if } x \text { is irrational }\end{cases}
L02555: $$
L02557: Use Definition 1.4.1 to prove that $\lim _{x \rightarrow 0} f(x)=0$.
L02558: 38. Let
L02560: $$
L02561: f(x)= \begin{cases}0, & \text { if } x \text { is rational } \\ 1, & \text { if } x \text { is irrational }\end{cases}
L02562: $$
L02564: Use Definition 1.4.1 to prove that $\lim _{x \rightarrow 0} f(x)$ does not exist. [Hint: Assume $\lim _{x \rightarrow 0} f(x)=L$ and apply Definition 1.4.1 with $\epsilon=\frac{1}{2}$ to conclude that $|1-L|<\frac{1}{2}$ and $|L|=|0-L|<\frac{1}{2}$. Then show $1 \leq|1-L|+|L|$ and derive a contradiction.]
L02565: 39. (a) Find the values of $x_{1}$ and $x_{2}$ in the accompanying figure.
L02566: (b) Find a positive number $N$ such that
L02568: $$
L02569: \left|\frac{x^{2}}{1+x^{2}}-1\right|<\epsilon
L02570: $$
L02572: for $x>N$.
L02573: (c) Find a negative number $N$ such that
L02575: $$
L02576: \left|\frac{x^{2}}{1+x^{2}}-1\right|<\epsilon
L02577: $$
L02579: for $x<N$.
L02581: [FIGURE:9e5e3e35bad42824 | A graph displays the function $y = \frac{x^2}{1+x^2}$ in an $xy$-coordinate system. The curve starts at the origin $(0,0)$, increases symmetrically, and approaches the horizontal asymptote $y=1$ from...]
L02582: Not drawn to scale
L02584: Figure Ex-39
L02585: 40. (a) Find the values of $x_{1}$ and $x_{2}$ in the accompanying figure.
L02586: (b) Find a positive number $N$ such that
L02588: $$
L02589: \left|\frac{1}{\sqrt[3]{x}}-0\right|=\left|\frac{1}{\sqrt[3]{x}}\right|<\epsilon
L02590: $$
L02592: for $x>N$.
L02593: (c) Find a negative number $N$ such that
L02595: $$
L02596: \left|\frac{1}{\sqrt[3]{x}}-0\right|=\left|\frac{1}{\sqrt[3]{x}}\right|<\epsilon
L02597: $$
L02599: for $x<N$.
L02601: [FIGURE:ceb3ff311c0d7d61 | A graph in a Cartesian coordinate system shows the function $y = \frac{1}{\sqrt[3){x}}$. The curve has two branches: one in the first quadrant, decreasing and approaching the positive x-axis, and one...]
L02602: Figure Ex-40
L02604: 41-44 A positive number $\epsilon$ and the limit $L$ of a function $f$ at $+\infty$ are given. Find a positive number $N$ such that $|f(x)-L|<\epsilon$ if $x>N$.
L02605: 41. $\lim _{x \rightarrow+\infty} \frac{1}{x^{2}}=0 ; \epsilon=0.01$
L02606: 42. $\lim _{x \rightarrow+\infty} \frac{1}{x+2}=0 ; \epsilon=0.005$
L02607: 43. $\lim _{x \rightarrow+\infty} \frac{x}{x+1}=1 ; \epsilon=0.001$
L02608: 44. $\lim _{x \rightarrow+\infty} \frac{4 x-1}{2 x+5}=2 ; \epsilon=0.1$
L02610: 45-48 Apositive number $\epsilon$ and the limit $L$ of a function $f$ at $-\infty$ are given. Find a negative number $N$ such that $|f(x)-L|<\epsilon$ if $x<N$.
L02611: 45. $\lim _{x \rightarrow-\infty} \frac{1}{x+2}=0 ; \epsilon=0.005$
L02612: 46. $\lim _{x \rightarrow-\infty} \frac{1}{x^{2}}=0 ; \epsilon=0.01$
L02613: 47. $\lim _{x \rightarrow-\infty} \frac{4 x-1}{2 x+5}=2 ; \epsilon=0.1$
L02614: 48. $\lim _{x \rightarrow-\infty} \frac{x}{x+1}=1 ; \epsilon=0.001$
L02616: 49-54 Use Definition 1.4.2 or 1.4.3 to prove that the stated limit is correct.
L02617: 49. $\lim _{x \rightarrow+\infty} \frac{1}{x^{2}}=0$
L02618: 50. $\lim _{x \rightarrow+\infty} \frac{1}{x+2}=0$
L02619: 51. $\lim _{x \rightarrow-\infty} \frac{4 x-1}{2 x+5}=2$
L02620: 52. $\lim _{x \rightarrow-\infty} \frac{x}{x+1}=1$
L02621: 53. $\lim _{x \rightarrow+\infty} \frac{2 \sqrt{x}}{\sqrt{x}-1}=2$
L02622: 54. $\lim _{x \rightarrow-\infty} 2^{x}=0$
L02623: 55. (a) Find the largest open interval, centered at the origin on the $x$-axis, such that for each $x$ in the interval, other than the center, the values of $f(x)=1 / x^{2}$ are greater than 100 .
L02624: (b) Find the largest open interval, centered at $x=1$, such that for each $x$ in the interval, other than the center, the values of the function $f(x)=1 /|x-1|$ are greater than 1000 .
L02625: (c) Find the largest open interval, centered at $x=3$, such that for each $x$ in the interval, other than the center, the values of the function $f(x)=-1 /(x-3)^{2}$ are less than -1000 .
L02626: (d) Find the largest open interval, centered at the origin on the $x$-axis, such that for each $x$ in the interval, other than the center, the values of $f(x)=-1 / x^{4}$ are less than $-10,000$.
L02627: 56. In each part, find the largest open interval centered at $x=1$, such that for each $x$ in the interval, other than the center, the value of $f(x)=1 /(x-1)^{2}$ is greater than $M$.
L02628: (a) $M=10$
L02629: (b) $M=1000$
L02630: (c) $M=100,000$
L02632: 57-62 Use Definition 1.4.4 or 1.4.5 to prove that the stated limit is correct.
L02633: 57. $\lim _{x \rightarrow 3} \frac{1}{(x-3)^{2}}=+\infty$
L02634: 58. $\lim _{x \rightarrow 3} \frac{-1}{(x-3)^{2}}=-\infty$
L02635: 59. $\lim _{x \rightarrow 0} \frac{1}{|x|}=+\infty$
L02636: 60. $\lim _{x \rightarrow 1} \frac{1}{|x-1|}=+\infty$
L02637: 61. $\lim _{x \rightarrow 0}\left(-\frac{1}{x^{4}}\right)=-\infty$
L02638: 62. $\lim _{x \rightarrow 0} \frac{1}{x^{4}}=+\infty$
L02640: 63-68 Use the definitions in Exercise 27 to prove that the stated one-sided limit is correct.
L02641: 63. $\lim _{x \rightarrow 2^{+}}(x+1)=3$
L02642: 64. $\lim _{x \rightarrow 1^{-}}(3 x+2)=5$
L02643: 65. $\lim _{x \rightarrow 4^{+}} \sqrt{x-4}=0$
L02644: 66. $\lim _{x \rightarrow 0^{-}} \sqrt{-x}=0$
L02645: 67. $\lim _{x \rightarrow 2^{+}} f(x)=2$, where $f(x)= \begin{cases}x, & x>2 \\ 3 x, & x \leq 2\end{cases}$
L02646: 68. $\lim _{x \rightarrow 2^{-}} f(x)=6$, where $f(x)= \begin{cases}x, & x>2 \\ 3 x, & x \leq 2\end{cases}$
L02648: 69-72 Write out the definition for the corresponding limit in the marginal note on page 105, and use your definition to prove that the stated limit is correct.
L02649: 69.
L02650: (a) $\lim _{x \rightarrow 1^{+}} \frac{1}{1-x}=-\infty$
L02651: (b) $\lim _{x \rightarrow 1^{-}} \frac{1}{1-x}=+\infty$
L02652: 70.
L02653: (a) $\lim _{x \rightarrow 0^{+}} \frac{1}{x}=+\infty$
L02654: (b) $\lim _{x \rightarrow 0^{-}} \frac{1}{x}=-\infty$
L02655: 71.
L02656: (a) $\lim _{x \rightarrow+\infty}(x+1)=+\infty$
L02657: (b) $\lim _{x \rightarrow-\infty}(x+1)=-\infty$
L02658: 72.
L02659: (a) $\lim _{x \rightarrow+\infty}\left(x^{2}-3\right)=+\infty$
L02660: (b) $\lim _{x \rightarrow-\infty}\left(x^{3}+5\right)=-\infty$
L02661: 73. According to Ohm's law, when a voltage of $V$ volts is applied across a resistor with a resistance of $R$ ohms, a current of $I=V / R$ amperes flows through the resistor.
L02662: (a) How much current flows if a voltage of 3.0 volts is applied across a resistance of 7.5 ohms?
L02663: (b) If the resistance varies by $\pm 0.1 \mathrm{ohm}$, and the voltage remains constant at 3.0 volts, what is the resulting range of values for the current?
L02664: (c) If temperature variations cause the resistance to vary by $\pm \delta$ from its value of 7.5 ohms, and the voltage remains constant at 3.0 volts, what is the resulting range of values for the current?
L02665: (d) If the current is not allowed to vary by more than $\epsilon= \pm 0.001$ ampere at a voltage of 3.0 volts, what variation of $\pm \delta$ from the value of 7.5 ohms is allowable?
L02666: (e) Certain alloys become superconductors as their temperature approaches absolute zero $\left(-273^{\circ} \mathrm{C}\right)$, meaning that their resistance approaches zero. If the voltage remains constant, what happens to the current in a superconductor as $R \rightarrow 0^{+}$?
L02667: 74. Writing Compare informal Definition 1.1.1 with Definition 1.4.1.
L02668: (a) What portions of Definition 1.4.1 correspond to the expression "values of $f(x)$ can be made as close as we like to $L$ " in Definition 1.1.1? Explain.
L02669: (b) What portions of Definition 1.4.1 correspond to the expression "taking values of $x$ sufficiently close to $a$ (but not equal to $a$ )" in Definition 1.1.1? Explain.
L02670: 75. Writing Compare informal Definition 1.3.1 with Definition 1.4.2.
L02671: (a) What portions of Definition 1.4.2 correspond to the expression "values of $f(x)$ eventually get as close as we like to a number $L$ " in Definition 1.3.1? Explain.
L02672: (b) What portions of Definition 1.4.2 correspond to the expression "as $x$ increases without bound" in Definition 1.3.1? Explain.
L02674: ## QUICK CHECK ANSWERS 1.4
L02676: 1. $\epsilon>0 ; \delta>0 ; 0<|x-a|<\delta$
L02677: 2. $\lim _{x \rightarrow 1} f(x)=5$
L02678: 3. $\delta=\epsilon / 5$
L02679: 4. $\epsilon>0 ; N ; x>N$
L02680: 5. $N=10,000$
