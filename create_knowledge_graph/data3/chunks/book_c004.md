L01277: $$
L01278: f(x)= \begin{cases}\frac{x^{2}-9}{x+3}, & x \neq-3 \\ k, & x=-3\end{cases}
L01279: $$
L01281: (a) Find $k$ so that $f(-3)=\lim _{x \rightarrow-3} f(x)$.
L01282: (b) With $k$ assigned the value $\lim _{x \rightarrow-3} f(x)$, show that $f(x)$ can be expressed as a polynomial.
L01284: ## FOCUS ON CONCEPTS
L01286: 41. (a) Explain why the following calculation is incorrect.
L01288: $$
L01289: \begin{aligned}
L01290: \lim _{x \rightarrow 0^{+}}\left(\frac{1}{x}-\frac{1}{x^{2}}\right) & =\lim _{x \rightarrow 0^{+}} \frac{1}{x}-\lim _{x \rightarrow 0^{+}} \frac{1}{x^{2}} \\
L01291: & =+\infty-(+\infty)=0
L01292: \end{aligned}
L01293: $$
L01295: (b) Show that $\lim _{x \rightarrow 0^{+}}\left(\frac{1}{x}-\frac{1}{x^{2}}\right)=-\infty$.
L01296: 42. (a) Explain why the following argument is incorrect.
L01298: $$
L01299: \begin{aligned}
L01300: \lim _{x \rightarrow 0}\left(\frac{1}{x}-\frac{2}{x^{2}+2 x}\right) & =\lim _{x \rightarrow 0} \frac{1}{x}\left(1-\frac{2}{x+2}\right) \\
L01301: & =\infty \cdot 0=0
L01302: \end{aligned}
L01303: $$
L01305: (b) Show that $\lim _{x \rightarrow 0}\left(\frac{1}{x}-\frac{2}{x^{2}+2 x}\right)=\frac{1}{2}$.
L01306: 43. Find all values of $a$ such that
L01308: $$
L01309: \lim _{x \rightarrow 1}\left(\frac{1}{x-1}-\frac{a}{x^{2}-1}\right)
L01310: $$
L01312: exists and is finite.
L01313: 44. (a) Explain informally why
L01315: $$
L01316: \lim _{x \rightarrow 0^{-}}\left(\frac{1}{x}+\frac{1}{x^{2}}\right)=+\infty
L01317: $$
L01319: (b) Verify the limit in part (a) algebraically.
L01320: 45. Let $p(x)$ and $q(x)$ be polynomials, with $q\left(x_{0}\right)=0$. Discuss the behavior of the graph of $y=p(x) / q(x)$ in the vicinity of $x=x_{0}$. Give examples to support your conclusions.
L01321: 46. Suppose that $f$ and $g$ are two functions such that $\lim _{x \rightarrow a} f(x)$ exists but $\lim _{x \rightarrow a}[f(x)+g(x)]$ does not exist. Use Theorem 1.2.2. to prove that $\lim _{x \rightarrow a} g(x)$ does not exist.
L01322: 47. Suppose that $f$ and $g$ are two functions such that both $\lim _{x \rightarrow a} f(x)$ and $\lim _{x \rightarrow a}[f(x)+g(x)]$ exist. Use Theorem 1.2.2 to prove that $\lim _{x \rightarrow a} g(x)$ exists.
L01323: 48. Suppose that $f$ and $g$ are two functions such that
L01325: $$
L01326: \lim _{x \rightarrow a} g(x)=0 \quad \text { and } \quad \lim _{x \rightarrow a} \frac{f(x)}{g(x)}
L01327: $$
L01329: exists. Use Theorem 1.2.2 to prove that $\lim _{x \rightarrow a} f(x)=0$.
L01330: 49. Writing According to Newton's Law of Universal Gravitation, the gravitational force of attraction between two masses is inversely proportional to the square of the distance between them. What results of this section are useful in describing the gravitational force of attraction between the masses as they get closer and closer together?
L01331: 50. Writing Suppose that $f$ and $g$ are two functions that are equal except at a finite number of points and that $a$ denotes a real number. Explain informally why both
L01333: $$
L01334: \lim _{x \rightarrow a} f(x) \text { and } \lim _{x \rightarrow a} g(x)
L01335: $$
L01337: exist and are equal, or why both limits fail to exist. Write a short paragraph that explains the relationship of this result to the use of "algebraic simplification" in the evaluation of a limit.
L01339: ## QUICK CHECK ANSWERS 1.2
L01341: 1. (a) 7
L01342: (b) 36 (c) -1
L01343: (d) 1 (e) $+\infty$
L01344: 2. (a) 7
L01345: (b) -3
L01346: (c) 1
L01347: 3. (a) -1
L01348: (b) 0
L01349: (c) $+\infty$
L01350: (d) 8
L01351: 4. (a) 2 (b) 0 (c) does not exist
L01353: ### 1.3 LIMITS AT INFINITY; END BEHAVIOR OF A FUNCTION
L01355: [FIGURE:abccb43ecbe376d2 | The figure displays two graphs of the function $y = \frac{1}{x}$ to illustrate limits at infinity. The top graph shows that as $x$ decreases without bound (approaches $-\infty$), the function value...]
L01356: Figure 1.3.1
L01358: [FIGURE:6f0495c18901e0db | Two graphs illustrate the concept of a horizontal asymptote. The top graph shows a curve $y=f(x)$ approaching a horizontal dashed line $y=L$ as $x$ tends to positive infinity, visually representing...]
L01359: △ Figure 1.3.2
L01361: Up to now we have been concerned with limits that describe the behavior of a function $f(x)$ as $x$ approaches some real number $a$. In this section we will be concerned with the behavior of $f(x)$ as $x$ increases or decreases without bound.
L01363: ## LIMITS AT INFINITY AND HORIZONTAL ASYMPTOTES
L01365: If the values of a variable $x$ increase without bound, then we write $x \rightarrow+\infty$, and if the values of $x$ decrease without bound, then we write $x \rightarrow-\infty$. The behavior of a function $f(x)$ as $x$ increases without bound or decreases without bound is sometimes called the end behavior of the function. For example,
L01367: $$
L01368: \begin{equation*}
L01369: \lim _{x \rightarrow-\infty} \frac{1}{x}=0 \quad \text { and } \quad \lim _{x \rightarrow+\infty} \frac{1}{x}=0 \tag{1-2}
L01370: \end{equation*}
L01371: $$
L01373: are illustrated numerically in Table 1.3.1 and geometrically in Figure 1.3.1.
L01375: Table 1.3.1
L01376: |  | VALUES |  |  |  |  |  | CONCLUSION |
L01377: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
L01378: | $x$ | -1 | -10 | -100 | -1000 | $-10,000$ | $\cdots$ | As $x \rightarrow-\infty$ the value of $1 / x$ |
L01379: | $1 / x$ | -1 | -0.1 | -0.01 | -0.001 | -0.0001 | $\cdots$ | increases toward zero. |
L01380: | $x$ | 1 | 10 | 100 | 1000 | 10,000 | $\cdots$ | As $x \rightarrow+\infty$ the value of $1 / x$ |
L01381: | $1 / x$ | 1 | 0.1 | 0.01 | 0.001 | 0.0001 | $\cdots$ | decreases toward zero. |
L01384: In general, we will use the following notation.
L01385: 1.3.1 LIMITS AT INFINITY (AN INFORMAL VIEW) If the values of $f(x)$ eventually get as close as we like to a number $L$ as $x$ increases without bound, then we write
L01387: $$
L01388: \begin{equation*}
L01389: \lim _{x \rightarrow+\infty} f(x)=L \quad \text { or } \quad f(x) \rightarrow L \text { as } x \rightarrow+\infty \tag{3}
L01390: \end{equation*}
L01391: $$
L01393: Similarly, if the values of $f(x)$ eventually get as close as we like to a number $L$ as $x$ decreases without bound, then we write
L01395: $$
L01396: \begin{equation*}
L01397: \lim _{x \rightarrow-\infty} f(x)=L \quad \text { or } \quad f(x) \rightarrow L \text { as } x \rightarrow-\infty \tag{4}
L01398: \end{equation*}
L01399: $$
L01401: Figure 1.3.2 illustrates the end behavior of a function $f$ when
L01403: $$
L01404: \lim _{x \rightarrow+\infty} f(x)=L \quad \text { or } \quad \lim _{x \rightarrow-\infty} f(x)=L
L01405: $$
L01407: In the first case the graph of $f$ eventually comes as close as we like to the line $y=L$ as $x$ increases without bound, and in the second case it eventually comes as close as we like to the line $y=L$ as $x$ decreases without bound. If either limit holds, we call the line $y=L$ a horizontal asymptote for the graph of $f$.
L01409: - Example 1 It follows from (1) and (2) that $y=0$ is a horizontal asymptote for the graph of $f(x)=1 / x$ in both the positive and negative directions. This is consistent with the graph of $y=1 / x$ shown in Figure 1.3.1.
L01411: [FIGURE:99750a6a06d41282 | A graph displays the function $y = \tan^{-1} x$ on a Cartesian coordinate system. The blue curve passes through the origin, increasing from left to right. It approaches the horizontal dashed line $y...]
L01412: - Figure 1.3.3
L01414: [FIGURE:78086254c53ffb11 | A graph in the $xy$-plane shows a blue curve with two branches. A horizontal dashed line, labeled $y=e$ (approximately $y=2.7$), acts as a horizontal asymptote. The left branch of the curve...]
L01415: - Figure 1.3.4
L01417: $$
L01418: y=\left(1+\frac{1}{x}\right)^{x}
L01419: $$
L01421: Example 2 Figure 1.3.3 is the graph of $f(x)=\tan ^{-1} x$. As suggested by this graph,
L01423: $$
L01424: \begin{equation*}
L01425: \lim _{x \rightarrow+\infty} \tan ^{-1} x=\frac{\pi}{2} \quad \text { and } \quad \lim _{x \rightarrow-\infty} \tan ^{-1} x=-\frac{\pi}{2} \tag{5-6}
L01426: \end{equation*}
L01427: $$
L01429: so the line $y=\pi / 2$ is a horizontal asymptote for $f$ in the positive direction and the line $y=-\pi / 2$ is a horizontal asymptote in the negative direction. $\square$
L01431: Example 3 Figure 1.3.4 is the graph of $f(x)=(1+1 / x)^{x}$. As suggested by this graph,
L01433: $$
L01434: \begin{equation*}
L01435: \lim _{x \rightarrow+\infty}\left(1+\frac{1}{x}\right)^{x}=e \quad \text { and } \quad \lim _{x \rightarrow-\infty}\left(1+\frac{1}{x}\right)^{x}=e \tag{7-8}
L01436: \end{equation*}
L01437: $$
L01439: so the line $y=e$ is a horizontal asymptote for $f$ in both the positive and negative directions. $\square$
L01441: ## LIMIT LAWS FOR LIMITS AT INFINITY
L01443: It can be shown that the limit laws in Theorem 1.2.2 carry over without change to limits at $+\infty$ and $-\infty$. Moreover, it follows by the same argument used in Section 1.2 that if $n$ is a positive integer, then
L01445: $$
L01446: \begin{equation*}
L01447: \lim _{x \rightarrow+\infty}(f(x))^{n}=\left(\lim _{x \rightarrow+\infty} f(x)\right)^{n} \quad \lim _{x \rightarrow-\infty}(f(x))^{n}=\left(\lim _{x \rightarrow-\infty} f(x)\right)^{n} \tag{9-10}
L01448: \end{equation*}
L01449: $$
L01451: provided the indicated limit of $f(x)$ exists. It also follows that constants can be moved through the limit symbols for limits at infinity:
L01453: $$
L01454: \begin{equation*}
L01455: \lim _{x \rightarrow+\infty} k f(x)=k \lim _{x \rightarrow+\infty} f(x) \quad \lim _{x \rightarrow-\infty} k f(x)=k \lim _{x \rightarrow-\infty} f(x) \tag{11-12}
L01456: \end{equation*}
L01457: $$
L01459: provided the indicated limit of $f(x)$ exists.
L01460: Finally, if $f(x)=k$ is a constant function, then the values of $f$ do not change as $x \rightarrow+\infty$ or as $x \rightarrow-\infty$, so
L01462: $$
L01463: \begin{equation*}
L01464: \lim _{x \rightarrow+\infty} k=k \quad \lim _{x \rightarrow-\infty} k=k \tag{13-14}
L01465: \end{equation*}
L01466: $$
L01468: ## Example 4
L01470: (a) It follows from (1), (2), (9), and (10) that if $n$ is a positive integer, then
L01472: $$
L01473: \lim _{x \rightarrow+\infty} \frac{1}{x^{n}}=\left(\lim _{x \rightarrow+\infty} \frac{1}{x}\right)^{n}=0 \quad \text { and } \quad \lim _{x \rightarrow-\infty} \frac{1}{x^{n}}=\left(\lim _{x \rightarrow-\infty} \frac{1}{x}\right)^{n}=0
L01474: $$
L01476: (b) It follows from (7) and the extension of Theorem 1.2.2(e) to the case $x \rightarrow+\infty$ that
L01478: $$
L01479: \begin{aligned}
L01480: \lim _{x \rightarrow+\infty}\left(1+\frac{1}{2 x}\right)^{x} & =\lim _{x \rightarrow+\infty}\left[\left(1+\frac{1}{2 x}\right)^{2 x}\right]^{1 / 2} \\
L01481: & =\left[\lim _{x \rightarrow+\infty}\left(1+\frac{1}{2 x}\right)^{2 x}\right]^{1 / 2}=e^{1 / 2}=\sqrt{e}
L01482: \end{aligned}
L01483: $$
L01485: ## INFINITE LIMITS AT INFINITY
L01487: Limits at infinity, like limits at a real number $a$, can fail to exist for various reasons. One such possibility is that the values of $f(x)$ increase or decrease without bound as $x \rightarrow+\infty$ or as $x \rightarrow-\infty$. We will use the following notation to describe this situation.
L01488: 1.3.2 INFINITE LIMITS AT INFINITY (AN INFORMAL VIEW) If the values of $f(x)$ increase without bound as $x \rightarrow+\infty$ or as $x \rightarrow-\infty$, then we write
L01490: $$
L01491: \lim _{x \rightarrow+\infty} f(x)=+\infty \quad \text { or } \quad \lim _{x \rightarrow-\infty} f(x)=+\infty
L01492: $$
L01494: as appropriate; and if the values of $f(x)$ decrease without bound as $x \rightarrow+\infty$ or as $x \rightarrow-\infty$, then we write
L01496: $$
L01497: \lim _{x \rightarrow+\infty} f(x)=-\infty \quad \text { or } \quad \lim _{x \rightarrow-\infty} f(x)=-\infty
L01498: $$
L01500: as appropriate.
L01502: ## LIMITS OF $\boldsymbol{x}^{\boldsymbol{n}}$ AS $\boldsymbol{x} \rightarrow \pm \infty$
L01504: Figure 1.3.5 illustrates the end behavior of the polynomials $x^{n}$ for $n=1,2,3$, and 4 . These are special cases of the following general results:
L01506: $$
L01507: \begin{equation*}
L01508: \lim _{x \rightarrow+\infty} x^{n}=+\infty, \quad n=1,2,3, \ldots \tag{15-16}
L01509: \end{equation*}
L01510: $$
L01512: $$
L01513: \lim _{x \rightarrow-\infty} x^{n}= \begin{cases}-\infty, & n=1,3,5, \ldots \\ +\infty, & n=2,4,6, \ldots\end{cases}
L01514: $$
L01516: [FIGURE:c6142e296ee60947 | Four graphs illustrate the end behavior of power functions $y=x^n$ for $n=1, 2, 3, 4$. Each graph is on an $x$-$y$ coordinate system with labeled axes and shows the function curve along with its...]
L01517: △ Figure 1.3.5
L01519: Multiplying $x^{n}$ by a positive real number does not affect limits (15) and (16), but multiplying by a negative real number reverses the sign.
L01521: ## Example 5
L01523: $$
L01524: \begin{array}{ll}
L01525: \lim _{x \rightarrow+\infty} 2 x^{5}=+\infty, & \lim _{x \rightarrow-\infty} 2 x^{5}=-\infty \\
L01526: \lim _{x \rightarrow+\infty}-7 x^{6}=-\infty, & \lim _{x \rightarrow-\infty}-7 x^{6}=-\infty
L01527: \end{array}
L01528: $$
L01530: ## - LIMITS OF POLYNOMIALS AS $\boldsymbol{x} \rightarrow \pm \infty$
L01532: There is a useful principle about polynomials which, expressed informally, states:
L01534: The end behavior of a polynomial matches the end behavior of its highest degree term.
L01536: More precisely, if $c_{n} \neq 0$, then
L01538: $$
L01539: \begin{align*}
L01540: \lim _{x \rightarrow-\infty}\left(c_{0}+c_{1} x+\cdots+c_{n} x^{n}\right) & =\lim _{x \rightarrow-\infty} c_{n} x^{n}  \tag{17}\\
L01541: \lim _{x \rightarrow+\infty}\left(c_{0}+c_{1} x+\cdots+c_{n} x^{n}\right) & =\lim _{x \rightarrow+\infty} c_{n} x^{n} \tag{18}
L01542: \end{align*}
L01543: $$
L01545: We can motivate these results by factoring out the highest power of $x$ from the polynomial and examining the limit of the factored expression. Thus,
L01547: $$
L01548: c_{0}+c_{1} x+\cdots+c_{n} x^{n}=x^{n}\left(\frac{c_{0}}{x^{n}}+\frac{c_{1}}{x^{n-1}}+\cdots+c_{n}\right)
L01549: $$
L01551: As $x \rightarrow-\infty$ or $x \rightarrow+\infty$, it follows from Example 4(a) that all of the terms with positive powers of $x$ in the denominator approach 0 , so (17) and (18) are certainly plausible.
L01553: ## Example 6
L01555: $$
L01556: \begin{aligned}
L01557: & \lim _{x \rightarrow-\infty}\left(7 x^{5}-4 x^{3}+2 x-9\right)=\lim _{x \rightarrow-\infty} 7 x^{5}=-\infty \\
L01558: & \lim _{x \rightarrow-\infty}\left(-4 x^{8}+17 x^{3}-5 x+1\right)=\lim _{x \rightarrow-\infty}-4 x^{8}=-\infty
L01559: \end{aligned}
L01560: $$
L01562: ## LIMITS OF RATIONAL FUNCTIONS AS $\boldsymbol{x} \rightarrow \pm \infty$
L01564: One technique for determining the end behavior of a rational function is to divide each term in the numerator and denominator by the highest power of $x$ that occurs in the denominator, after which the limiting behavior can be determined using results we have already established. Here are some examples.
L01566: Example 7 Find $\lim _{x \rightarrow+\infty} \frac{3 x+5}{6 x-8}$.
L01567: Solution. Divide each term in the numerator and denominator by the highest power of $x$ that occurs in the denominator, namely, $x^{1}=x$. We obtain
L01569: $$
L01570: \begin{aligned}
L01571: & \lim _{x \rightarrow+\infty} \frac{3 x+5}{6 x-8}=\lim _{x \rightarrow+\infty} \frac{3+\frac{5}{x}}{6-\frac{8}{x}} \\
L01572: &=\frac{\lim _{x \rightarrow+\infty}\left(3+\frac{5}{x}\right)}{\lim _{x \rightarrow+\infty}\left(6-\frac{8}{x}\right)} \quad \text { Divide each term by } x . \\
L01573: &=\frac{\lim _{x \rightarrow+\infty} 3+\lim _{x \rightarrow+\infty} \frac{5}{x}}{\lim _{x \rightarrow+\infty} 6-\lim _{x \rightarrow+\infty} \frac{8}{x}} \quad \text { quotient of the limits. } \\
L01574: &=\frac{\begin{array}{l}
L01575: \text { Limit of a sum is the } \\
L01576: \text { sum of the limits. }
L01577: \end{array}}{3+5 \lim _{x \rightarrow+\infty} \frac{1}{x}}=\frac{3+0}{6-8 \lim _{x \rightarrow+\infty} \frac{1}{x}}=\frac{1}{2} \quad \text { A constant can be moved through a } \\
L01578: & \text { limit symbol; Formulas (2) and (13). }
L01579: \end{aligned}
L01580: $$
L01582: Example 8 Find
L01583: (a) $\lim _{x \rightarrow-\infty} \frac{4 x^{2}-x}{2 x^{3}-5}$
L01584: (b) $\lim _{x \rightarrow+\infty} \frac{5 x^{3}-2 x^{2}+1}{1-3 x}$
L01586: Solution (a). Divide each term in the numerator and denominator by the highest power of $x$ that occurs in the denominator, namely, $x^{3}$. We obtain
L01588: $$
L01589: \begin{aligned}
L01590: \lim _{x \rightarrow-\infty} \frac{4 x^{2}-x}{2 x^{3}-5} & =\lim _{x \rightarrow-\infty} \frac{\frac{4}{x}-\frac{1}{x^{2}}}{2-\frac{5}{x^{3}}} \\
L01591: & =\frac{\lim _{x \rightarrow-\infty}\left(\frac{4}{x}-\frac{1}{x^{2}}\right)}{\lim _{x \rightarrow-\infty}\left(2-\frac{5}{x^{3}}\right)} \quad \text { Divide each term by } x^{3} . \\
L01592: & =\frac{}{\lim _{x \rightarrow-\infty} \frac{4}{x}-\lim _{x \rightarrow-\infty} \frac{1}{x^{2}}} \quad \begin{array}{l}
L01593: \text { Limit of a quotient is the } \\
L01594: \text { quotient of the limits. }
L01595: \end{array} \\
L01596: & \quad \lim _{x \rightarrow-\infty} 2-\lim _{x \rightarrow-\infty} \frac{5}{x^{3}} \\
L01597: & =\frac{4 \lim _{x \rightarrow-\infty} \frac{1}{x}-\lim _{x \rightarrow-\infty} \frac{1}{x^{2}}}{2-5 \lim _{x \rightarrow-\infty} \frac{1}{x^{3}}}=\frac{0-0}{2-0}=0 \quad \begin{array}{l}
L01598: \text { A constant a difference is the be moved through } \\
L01599: \text { a limit symbol; Formula (14) and } \\
L01600: \text { Example 4. }
L01601: \end{array}
L01602: \end{aligned}
L01603: $$
L01605: Solution (b). Divide each term in the numerator and denominator by the highest power of $x$ that occurs in the denominator, namely, $x^{1}=x$. We obtain
L01607: $$
L01608: \begin{equation*}
L01609: \lim _{x \rightarrow+\infty} \frac{5 x^{3}-2 x^{2}+1}{1-3 x}=\lim _{x \rightarrow+\infty} \frac{5 x^{2}-2 x+\frac{1}{x}}{\frac{1}{x}-3} \tag{19}
L01610: \end{equation*}
L01611: $$
L01613: In this case we cannot argue that the limit of the quotient is the quotient of the limits because the limit of the numerator does not exist. However, we have
L01615: $$
L01616: \lim _{x \rightarrow+\infty} 5 x^{2}-2 x=+\infty, \quad \lim _{x \rightarrow+\infty} \frac{1}{x}=0, \quad \lim _{x \rightarrow+\infty}\left(\frac{1}{x}-3\right)=-3
L01617: $$
L01619: Thus, the numerator on the right side of (19) approaches $+\infty$ and the denominator has a finite negative limit. We conclude from this that the quotient approaches $-\infty$; that is,
L01621: $$
L01622: \lim _{x \rightarrow+\infty} \frac{5 x^{3}-2 x^{2}+1}{1-3 x}=\lim _{x \rightarrow+\infty} \frac{5 x^{2}-2 x+\frac{1}{x}}{\frac{1}{x}-3}=-\infty
L01623: $$
L01625: ## A QUICK METHOD FOR FINDING LIMITS OF RATIONAL FUNCTIONS AS $\boldsymbol{x} \rightarrow+\infty$ OR $\boldsymbol{x} \rightarrow-\infty$
L01627: Since the end behavior of a polynomial matches the end behavior of its highest degree term, one can reasonably conclude:
L01629: The end behavior of a rational function matches the end behavior of the quotient of the highest degree term in the numerator divided by the highest degree term in the denominator.
L01631: ## Example 9 Use the preceding observation to compute the limits in Examples 7 and 8.
L01633: ## Solution.
L01635: $$
L01636: \begin{aligned}
L01637: & \lim _{x \rightarrow+\infty} \frac{3 x+5}{6 x-8}=\lim _{x \rightarrow+\infty} \frac{3 x}{6 x}=\lim _{x \rightarrow+\infty} \frac{1}{2}=\frac{1}{2} \\
L01638: & \lim _{x \rightarrow-\infty} \frac{4 x^{2}-x}{2 x^{3}-5}=\lim _{x \rightarrow-\infty} \frac{4 x^{2}}{2 x^{3}}=\lim _{x \rightarrow-\infty} \frac{2}{x}=0 \\
L01639: & \lim _{x \rightarrow+\infty} \frac{5 x^{3}-2 x^{2}+1}{1-3 x}=\lim _{x \rightarrow+\infty} \frac{5 x^{3}}{(-3 x)}=\lim _{x \rightarrow+\infty}\left(-\frac{5}{3} x^{2}\right)=-\infty
L01640: \end{aligned}
L01641: $$
L01643: ## LIMITS INVOLVING RADICALS
L01645: ## Example 10 Find
L01647: (a) $\lim _{x \rightarrow+\infty} \frac{\sqrt{x^{2}+2}}{3 x-6}$
L01648: (b) $\lim _{x \rightarrow-\infty} \frac{\sqrt{x^{2}+2}}{3 x-6}$
L01650: In both parts it would be helpful to manipulate the function so that the powers of $x$ are transformed to powers of $1 / x$. This can be achieved in both cases by dividing the numerator and denominator by $|x|$ and using the fact that $\sqrt{x^{2}}=|x|$.
L01651: Solution (a). As $x \rightarrow+\infty$, the values of $x$ under consideration are positive, so we can replace $|x|$ by $x$ where helpful. We obtain
L01653: $$
L01654: \begin{aligned}
L01655: \lim _{x \rightarrow+\infty} \frac{\sqrt{x^{2}+2}}{3 x-6} & =\lim _{x \rightarrow+\infty} \frac{\frac{\sqrt{x^{2}+2}}{|x|}}{\frac{3 x-6}{|x|}}=\lim _{x \rightarrow+\infty} \frac{\frac{\sqrt{x^{2}+2}}{\sqrt{x^{2}}}}{\frac{3 x-6}{x}} \\
L01656: & =\lim _{x \rightarrow+\infty} \frac{\sqrt{1+\frac{2}{x^{2}}}}{3-\frac{6}{x}}=\frac{\lim _{x \rightarrow+\infty} \sqrt{1+\frac{2}{x^{2}}}}{\lim _{x \rightarrow+\infty}\left(3-\frac{6}{x}\right)} \\
L01657: & =\frac{\sqrt{\lim _{x \rightarrow+\infty}\left(1+\frac{2}{x^{2}}\right)}}{\lim _{x \rightarrow+\infty}\left(3-\frac{6}{x}\right)}=\frac{\sqrt{\left(\lim _{x \rightarrow+\infty} 1\right)+\left(2 \lim _{x \rightarrow+\infty} \frac{1}{x^{2}}\right)}}{\left(\lim _{x \rightarrow+\infty} 3\right)-\left(6 \lim _{x \rightarrow+\infty} \frac{1}{x}\right)} \\
L01658: & =\frac{\sqrt{1+(2 \cdot 0)}}{3-(6 \cdot 0)}=\frac{1}{3}
L01659: \end{aligned}
L01660: $$
L01662: ## TECHNOLOGY MASTERY
L01664: It follows from Example 10 that the function
L01666: $$
L01667: f(x)=\frac{\sqrt{x^{2}+2}}{3 x-6}
L01668: $$
L01670: has an asymptote of $y=\frac{1}{3}$ in the positive direction and an asymptote of $y=-\frac{1}{3}$ in the negative direction. Confirm this using a graphing utility.
L01672: Solution (b). As $x \rightarrow-\infty$, the values of $x$ under consideration are negative, so we can replace $|x|$ by $-x$ where helpful. We obtain
L01674: $$
L01675: \begin{aligned}
L01676: \lim _{x \rightarrow-\infty} \frac{\sqrt{x^{2}+2}}{3 x-6} & =\lim _{x \rightarrow-\infty} \frac{\frac{\sqrt{x^{2}+2}}{|x|}}{\frac{3 x-6}{|x|}}=\lim _{x \rightarrow-\infty} \frac{\frac{\sqrt{x^{2}+2}}{\sqrt{x^{2}}}}{\frac{3 x-6}{(-x)}} \\
L01677: & =\lim _{x \rightarrow-\infty} \frac{\sqrt{1+\frac{2}{x^{2}}}}{-3+\frac{6}{x}}=-\frac{1}{3}
L01678: \end{aligned}
L01679: $$
L01681: [FIGURE:24013f3311927223 | Two graphs illustrate the end behavior of functions. Graph (a) displays the curve for $y = \sqrt{x^6 + 5} - x^3$, which decreases from the upper left, passes through a local maximum near $(0, 2)$...]
L01682: Figure 1.3.6
L01684: We noted in Section 1.1 that the standard rules of algebra do not apply to the symbols $+\infty$ and $-\infty$. Part (b) of Example 11 illustrates this. The terms $\sqrt{x^{6}+5 x^{3}}$ and $x^{3}$ both approach $+\infty$ as $x \rightarrow+\infty$, but their difference does not approach 0 .
L01686: [FIGURE:765df26b20c95c74 | A graph displays the curve $y = \sin x$ on a Cartesian coordinate system with labeled x and y axes. The blue sinusoidal curve oscillates around the x-axis, passing through the origin and extending...]
L01687: Figure 1.3.7
L01689: $$
L01690: \begin{aligned}
L01691: & \text { There is no limit as } \\
L01692: & x \rightarrow+\infty \text { or } x \rightarrow-\infty \text {. }
L01693: \end{aligned}
L01694: $$
L01696: Example 11 Find
L01697: (a) $\lim _{x \rightarrow+\infty}\left(\sqrt{x^{6}+5}-x^{3}\right)$
L01698: (b) $\lim _{x \rightarrow+\infty}\left(\sqrt{x^{6}+5 x^{3}}-x^{3}\right)$
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
