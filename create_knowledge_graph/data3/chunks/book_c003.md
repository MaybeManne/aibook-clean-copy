L00774: ## QUICK CHECK ANSWERS 1.1
L00776: 1. $f(x) ; L ; x ; a$
L00777: 2. $f(x) ; x ; a$
L00778: 3. Both one-sided limits must exist and equal $L$.
L00779: 4. (a) 0 (b) 1
L00780: (c) $+\infty$
L00781: (d) $-\infty$
L00782: 5. 4
L00784: ### 1.2 COMPUTING LIMITS
L00786: In this section we will discuss techniques for computing limits of many functions. We base these results on the informal development of the limit concept discussed in the preceding section. A more formal derivation of these results is possible after Section 1.4.
L00788: ## SOME BASIC LIMITS
L00790: Our strategy for finding limits algebraically has two parts:
L00792: - First we will obtain the limits of some simple functions.
L00793: - Then we will develop a repertoire of theorems that will enable us to use the limits of those simple functions as building blocks for finding limits of more complicated functions.
L00795: We start with the following basic results, which are illustrated in Figure 1.2.1.
L00797: ### 1.2.1 Theorem Let $a$ and $k$ be real numbers.
L00799: (a) $\lim _{x \rightarrow a} k=k$
L00800: (b) $\lim _{x \rightarrow a} x=a$
L00801: (c) $\lim _{x \rightarrow 0^{-}} \frac{1}{x}=-\infty$
L00802: (d) $\lim _{x \rightarrow 0^{+}} \frac{1}{x}=+\infty$
L00803: [FIGURE:8dbc4003ed8956f4 | The figure displays four separate graphs, each illustrating a basic limit concept. The first graph shows a horizontal line $y=k$; as $x$ approaches $a$ from both sides, indicated by arrows on the...]
L00805: Do not confuse the algebraic size of a number with its closeness to zero. For positive numbers, the smaller the number the closer it is to zero, but for negative numbers, the larger the number the closer it is to zero. For example, -2 is larger than -4 , but it is closer to zero.
L00807: The following examples explain these results further.
L00809: Example 1 If $f(x)=k$ is a constant function, then the values of $f(x)$ remain fixed at $k$ as $x$ varies, which explains why $f(x) \rightarrow k$ as $x \rightarrow a$ for all values of $a$. For example,
L00811: $$
L00812: \lim _{x \rightarrow-25} 3=3, \quad \lim _{x \rightarrow 0} 3=3, \quad \lim _{x \rightarrow \pi} 3=3
L00813: $$
L00815: Example 2 If $f(x)=x$, then as $x \rightarrow a$ it must also be true that $f(x) \rightarrow a$. For example,
L00817: $$
L00818: \lim _{x \rightarrow 0} x=0, \quad \lim _{x \rightarrow-2} x=-2, \quad \lim _{x \rightarrow \pi} x=\pi
L00819: $$
L00821: Theorem 1.2.2(e) remains valid for $n$ even and $L_{1}=0$, provided $f(x)$ is nonnegative for $x$ near $a$ with $x \neq a$.
L00823: Example 3 You should know from your experience with fractions that for a fixed nonzero numerator, the closer the denominator is to zero, the larger the absolute value of the fraction. This fact and the data in Table 1.2.1 suggest why $1 / x \rightarrow+\infty$ as $x \rightarrow 0^{+}$and why $1 / x \rightarrow-\infty$ as $x \rightarrow 0^{-}$.
L00825: Table 1.2.1
L00826: |  | VALUES |  |  |  |  |  | CONCLUSION |
L00827: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
L00828: | $x$ | -1 | -0.1 | -0.01 | -0.001 | -0.0001 | $\cdots$ | As $x \rightarrow 0^{-}$the value of $1 / x$ |
L00829: | $1 / x$ | -1 | -10 | -100 | -1000 | $-10,000$ | $\cdots$ | decreases without bound. |
L00830: | $x$ | 1 | 0.1 | 0.01 | 0.001 | 0.0001 | $\cdots$ | As $x \rightarrow 0^{+}$the value of $1 / x$ |
L00831: | $1 / x$ | 1 | 10 | 100 | 1000 | 10,000 | $\cdots$ | increases without bound. |
L00834: The following theorem, parts of which are proved in Appendix D, will be our basic tool for finding limits algebraically.
L00835: 1.2.2 THEOREM Let a be a real number, and suppose that
L00837: $$
L00838: \lim _{x \rightarrow a} f(x)=L_{1} \quad \text { and } \quad \lim _{x \rightarrow a} g(x)=L_{2}
L00839: $$
L00841: That is, the limits exist and have values $L_{1}$ and $L_{2}$, respectively. Then:
L00842: (a) $\lim _{x \rightarrow a}[f(x)+g(x)]=\lim _{x \rightarrow a} f(x)+\lim _{x \rightarrow a} g(x)=L_{1}+L_{2}$
L00843: (b) $\lim _{x \rightarrow a}[f(x)-g(x)]=\lim _{x \rightarrow a} f(x)-\lim _{x \rightarrow a} g(x)=L_{1}-L_{2}$
L00844: (c) $\lim _{x \rightarrow a}[f(x) g(x)]=\left(\lim _{x \rightarrow a} f(x)\right)\left(\lim _{x \rightarrow a} g(x)\right)=L_{1} L_{2}$
L00845: (d) $\lim _{x \rightarrow a} \frac{f(x)}{g(x)}=\frac{\lim _{x \rightarrow a} f(x)}{\lim _{x \rightarrow a} g(x)}=\frac{L_{1}}{L_{2}}, \quad$ provided $L_{2} \neq 0$
L00846: (e) $\lim _{x \rightarrow a} \sqrt[n]{f(x)}=\sqrt[n]{\lim _{x \rightarrow a} f(x)}=\sqrt[n]{L_{1}}$, provided $L_{1}>0$ if $n$ is even.
L00848: Moreover, these statements are also true for the one-sided limits as $x \rightarrow a^{-}$or as $x \rightarrow a^{+}$.
L00850: This theorem can be stated informally as follows:
L00851: (a) The limit of a sum is the sum of the limits.
L00852: (b) The limit of a difference is the difference of the limits.
L00853: (c) The limit of a product is the product of the limits.
L00854: (d) The limit of a quotient is the quotient of the limits, provided the limit of the denominator is not zero.
L00855: (e) The limit of an $n$th root is the $n$th root of the limit.
L00857: For the special case of part (c) in which $f(x)=k$ is a constant function, we have
L00859: $$
L00860: \begin{equation*}
L00861: \lim _{x \rightarrow a}(k g(x))=\lim _{x \rightarrow a} k \cdot \lim _{x \rightarrow a} g(x)=k \lim _{x \rightarrow a} g(x) \tag{1}
L00862: \end{equation*}
L00863: $$
L00865: and similarly for one-sided limits. This result can be rephrased as follows:
L00867: ## A constant factor can be moved through a limit symbol.
L00869: Although parts (a) and (c) of Theorem 1.2.2 are stated for two functions, the results hold for any finite number of functions. Moreover, the various parts of the theorem can be used in combination to reformulate expressions involving limits.
L00871: ## Example 4
L00873: $$
L00874: \begin{array}{lc}
L00875: \lim _{x \rightarrow a}[f(x)-g(x)+2 h(x)]=\lim _{x \rightarrow a} f(x)-\lim _{x \rightarrow a} g(x)+2 \lim _{x \rightarrow a} h(x) \\
L00876: \lim _{x \rightarrow a}[f(x) g(x) h(x)]=\left(\lim _{x \rightarrow a} f(x)\right)\left(\lim _{x \rightarrow a} g(x)\right)\left(\lim _{x \rightarrow a} h(x)\right) \\
L00877: \lim _{x \rightarrow a}[f(x)]^{3}=\left(\lim _{x \rightarrow a} f(x)\right)^{3} & \text { Take } g(x)=h(x)=f(x) \text { in the last equation. } \\
L00878: \lim _{x \rightarrow a}[f(x)]^{n}=\left(\lim _{x \rightarrow a} f(x)\right)^{n} & \begin{array}{l}
L00879: \text { The extension of Theorem 1.2.2(c) in which } \\
L00880: \text { there are } n \text { factors, each of which is } f(x)
L00881: \end{array} \\
L00882: \lim _{x \rightarrow a} x^{n}=\left(\lim _{x \rightarrow a} x\right)^{n}=a^{n} & \text { Apply the previous result with } f(x)=x .
L00883: \end{array}
L00884: $$
L00886: ## LIMITS OF POLYNOMIALS AND RATIONAL FUNCTIONS AS $\boldsymbol{x} \rightarrow \boldsymbol{a}$
L00888: ## Example 5 Find $\lim _{x \rightarrow 5}\left(x^{2}-4 x+3\right)$.
L00890: ## Solution.
L00892: $$
L00893: \begin{aligned}
L00894: \lim _{x \rightarrow 5}\left(x^{2}-4 x+3\right) & =\lim _{x \rightarrow 5} x^{2}-\lim _{x \rightarrow 5} 4 x+\lim _{x \rightarrow 5} 3 \\
L00895: & =\lim _{x \rightarrow 5} x^{2}-4 \lim _{x \rightarrow 5} x+\lim _{x \rightarrow 5} 3 \\
L00896: & =5^{2}-4(5)+3 \\
L00897: & =8
L00898: \end{aligned}
L00899: $$
L00901: Observe that in Example 5 the limit of the polynomial $p(x)=x^{2}-4 x+3$ as $x \rightarrow 5$ turned out to be the same as $p(5)$. This is not an accident. The next result shows that, in general, the limit of a polynomial $p(x)$ as $x \rightarrow a$ is the same as the value of the polynomial at $a$. Knowing this fact allows us to reduce the computation of limits of polynomials to simply evaluating the polynomial at the appropriate point.
L00903: ### 1.2.3 THEOREM For any polynomial
L00905: $$
L00906: p(x)=c_{0}+c_{1} x+\cdots+c_{n} x^{n}
L00907: $$
L00909: and any real number $a$,
L00911: $$
L00912: \lim _{x \rightarrow a} p(x)=c_{0}+c_{1} a+\cdots+c_{n} a^{n}=p(a)
L00913: $$
L00915: PROOF
L00917: $$
L00918: \begin{aligned}
L00919: \lim _{x \rightarrow a} p(x) & =\lim _{x \rightarrow a}\left(c_{0}+c_{1} x+\cdots+c_{n} x^{n}\right) \\
L00920: & =\lim _{x \rightarrow a} c_{0}+\lim _{x \rightarrow a} c_{1} x+\cdots+\lim _{x \rightarrow a} c_{n} x^{n} \\
L00921: & =\lim _{x \rightarrow a} c_{0}+c_{1} \lim _{x \rightarrow a} x+\cdots+c_{n} \lim _{x \rightarrow a} x^{n} \\
L00922: & =c_{0}+c_{1} a+\cdots+c_{n} a^{n}=p(a)
L00923: \end{aligned}
L00924: $$
L00926: Example 6 Find $\lim _{x \rightarrow 1}\left(x^{7}-2 x^{5}+1\right)^{35}$.
L00927: Solution. The function involved is a polynomial (why?), so the limit can be obtained by evaluating this polynomial at $x=1$. This yields
L00929: $$
L00930: \lim _{x \rightarrow 1}\left(x^{7}-2 x^{5}+1\right)^{35}=0
L00931: $$
L00933: Recall that a rational function is a ratio of two polynomials. The following example illustrates how Theorems 1.2.2(d) and 1.2.3 can sometimes be used in combination to compute limits of rational functions.
L00935: - Example 7 Find $\lim _{x \rightarrow 2} \frac{5 x^{3}+4}{x-3}$.
L00937: Solution.
L00939: $$
L00940: \begin{aligned}
L00941: \lim _{x \rightarrow 2} \frac{5 x^{3}+4}{x-3} & =\frac{\lim _{x \rightarrow 2}\left(5 x^{3}+4\right)}{\lim _{x \rightarrow 2}(x-3)} \\
L00942: & =\frac{5 \cdot 2^{3}+4}{2-3}=-44
L00943: \end{aligned}
L00944: $$
L00946: The method used in the last example will not work for rational functions in which the limit of the denominator is zero because Theorem 1.2.2(d) is not applicable. There are two cases of this type to be considered-the case where the limit of the denominator is zero and the limit of the numerator is not, and the case where the limits of the numerator and denominator are both zero. If the limit of the denominator is zero but the limit of the numerator is not, then one can prove that the limit of the rational function does not exist and that one of the following situations occurs:
L00948: - The limit may be $-\infty$ from one side and $+\infty$ from the other.
L00949: - The limit may be $+\infty$.
L00950: - The limit may be $-\infty$.
L00952: Figure 1.2.2 illustrates these three possibilities graphically for rational functions of the form $1 /(x-a), 1 /(x-a)^{2}$, and $-1 /(x-a)^{2}$.
L00954: Example 8 Find
L00955: (a) $\lim _{x \rightarrow 4^{+}} \frac{2-x}{(x-4)(x+2)}$
L00956: (b) $\lim _{x \rightarrow 4^{-}} \frac{2-x}{(x-4)(x+2)}$
L00957: (c) $\lim _{x \rightarrow 4} \frac{2-x}{(x-4)(x+2)}$
L00959: Solution. In all three parts the limit of the numerator is -2 , and the limit of the denominator is 0 , so the limit of the ratio does not exist. To be more specific than this, we need
L00961: [FIGURE:472e2f23c46f34c1 | A number line displays the sign analysis for the rational expression $\frac{2-x}{(x-4)(x+2)}$. The $x$-axis is marked with critical points at $-2$, $2$, and $4$. The expression is positive for $x <...]
L00962: △ Figure 1.2.3
L00964: In Example 9(a), the simplified function $x-3$ is defined at $x=3$, but the original function is not. However, this has no effect on the limit as $x$ approaches 3 since the two functions are identical if $x \neq 3$ (Exercise 50).
L00966: [FIGURE:71d7bdd1789e302a | The graph displays the function $y = \frac{1}{x-a}$ on a coordinate plane with an x-axis. A vertical dashed line at $x=a$ represents a vertical asymptote. The curve has two branches: for $x > a$, it...]
L00967: △ Figure 1.2.2
L00969: $$
L00970: \begin{aligned}
L00971: & \lim _{x \rightarrow a^{+}} \frac{1}{x-a}=+\infty \\
L00972: & \lim _{x \rightarrow a^{-}} \frac{1}{x-a}=-\infty
L00973: \end{aligned}
L00974: $$
L00976: [FIGURE:86cd5d2f17ca592c | This graph illustrates the behavior of the function $y = \frac{1}{(x-a)^2}$. It shows a vertical asymptote at $x=a$, indicated by a dashed line, where the function values tend towards positive...]
L00978: $$
L00979: \lim _{x \rightarrow a} \frac{1}{(x-a)^{2}}=+\infty
L00980: $$
L00982: [FIGURE:1e7b4188bd910a32 | The graph illustrates the function $y = -\frac{1}{(x-a)^2}$, featuring a vertical asymptote at $x=a$, marked by a dashed red line. The blue curve approaches negative infinity as $x$ approaches $a$...]
L00984: $$
L00985: \lim _{x \rightarrow a}-\frac{1}{(x-a)^{2}}=-\infty
L00986: $$
L00988: to analyze the sign of the ratio. The sign of the ratio, which is given in Figure 1.2.3, is determined by the signs of $2-x, x-4$, and $x+2$. (The method of test points, discussed in Web Appendix E, provides a way of finding the sign of the ratio here.) It follows from this figure that as $x$ approaches 4 from the right, the ratio is always negative; and as $x$ approaches 4 from the left, the ratio is eventually positive. Thus,
L00990: $$
L00991: \lim _{x \rightarrow 4^{+}} \frac{2-x}{(x-4)(x+2)}=-\infty \quad \text { and } \quad \lim _{x \rightarrow 4^{-}} \frac{2-x}{(x-4)(x+2)}=+\infty
L00992: $$
L00994: Because the one-sided limits have opposite signs, all we can say about the two-sided limit is that it does not exist.
L00996: In the case where $p(x) / q(x)$ is a rational function for which $p(a)=0$ and $q(a)=0$, the numerator and denominator must have one or more common factors of $x-a$. In this case the limit of $p(x) / q(x)$ as $x \rightarrow a$ can be found by canceling all common factors of $x-a$ and using one of the methods already considered to find the limit of the simplified function. Here is an example.
L00998: - Example 9 Find
L00999: (a) $\lim _{x \rightarrow 3} \frac{x^{2}-6 x+9}{x-3}$
L01000: (b) $\lim _{x \rightarrow-4} \frac{2 x+8}{x^{2}+x-12}$
L01001: (c) $\lim _{x \rightarrow 5} \frac{x^{2}-3 x-10}{x^{2}-10 x+25}$
L01003: Solution ( $\boldsymbol{a}$ ). The numerator and the denominator both have a zero at $x=3$, so there is a common factor of $x-3$. Then
L01005: $$
L01006: \lim _{x \rightarrow 3} \frac{x^{2}-6 x+9}{x-3}=\lim _{x \rightarrow 3} \frac{(x-3)^{2}}{x-3}=\lim _{x \rightarrow 3}(x-3)=0
L01007: $$
L01009: Solution (b). The numerator and the denominator both have a zero at $x=-4$, so there is a common factor of $x-(-4)=x+4$. Then
L01011: $$
L01012: \lim _{x \rightarrow-4} \frac{2 x+8}{x^{2}+x-12}=\lim _{x \rightarrow-4} \frac{2(x+4)}{(x+4)(x-3)}=\lim _{x \rightarrow-4} \frac{2}{x-3}=-\frac{2}{7}
L01013: $$
L01015: Solution ( $\boldsymbol{c}$ ). The numerator and the denominator both have a zero at $x=5$, so there is a common factor of $x-5$. Then
L01017: $$
L01018: \lim _{x \rightarrow 5} \frac{x^{2}-3 x-10}{x^{2}-10 x+25}=\lim _{x \rightarrow 5} \frac{(x-5)(x+2)}{(x-5)(x-5)}=\lim _{x \rightarrow 5} \frac{x+2}{x-5}
L01019: $$
L01021: [FIGURE:bd890beb73ad8433 | A number line labeled $x$ displays the sign of the expression $\frac{x+2}{x-5}$. The critical points are marked at $x=-2$ and $x=5$. For $x < -2$, the expression is positive; at $x=-2$, it is zero...]
L01022: Figure 1.2.4
L01024: Discuss the logical errors in the following statement: An indeterminate form of type $0 / 0$ must have a limit of zero because zero divided by anything is zero.
L01026: However,
L01028: $$
L01029: \lim _{x \rightarrow 5}(x+2)=7 \neq 0 \quad \text { and } \quad \lim _{x \rightarrow 5}(x-5)=0
L01030: $$
L01032: so
L01034: $$
L01035: \lim _{x \rightarrow 5} \frac{x^{2}-3 x-10}{x^{2}-10 x+25}=\lim _{x \rightarrow 5} \frac{x+2}{x-5}
L01036: $$
L01038: does not exist. More precisely, the sign analysis in Figure 1.2.4 implies that
L01040: $$
L01041: \lim _{x \rightarrow 5^{+}} \frac{x^{2}-3 x-10}{x^{2}-10 x+25}=\lim _{x \rightarrow 5^{+}} \frac{x+2}{x-5}=+\infty
L01042: $$
L01044: and
L01046: $$
L01047: \lim _{x \rightarrow 5^{-}} \frac{x^{2}-3 x-10}{x^{2}-10 x+25}=\lim _{x \rightarrow 5^{-}} \frac{x+2}{x-5}=-\infty
L01048: $$
L01050: A quotient $f(x) / g(x)$ in which the numerator and denominator both have a limit of zero as $x \rightarrow a$ is called an indeterminate form of type $\mathbf{0} / \mathbf{0}$. The problem with such limits is that it is difficult to tell by inspection whether the limit exists, and, if so, its value. Informally stated, this is because there are two conflicting influences at work. The value of $f(x) / g(x)$ would tend to zero as $f(x)$ approached zero if $g(x)$ were to remain at some fixed nonzero value, whereas the value of this ratio would tend to increase or decrease without bound as $g(x)$ approached zero if $f(x)$ were to remain at some fixed nonzero value. But with both $f(x)$ and $g(x)$ approaching zero, the behavior of the ratio depends on precisely how these conflicting tendencies offset one another for the particular $f$ and $g$.
L01052: Sometimes, limits of indeterminate forms of type $0 / 0$ can be found by algebraic simplification, as in the last example, but frequently this will not work and other methods must be used. We will study such methods in later sections.
L01054: The following theorem summarizes our observations about limits of rational functions.
L01056: ### 1.2.4 THEOREM Let
L01058: $$
L01059: f(x)=\frac{p(x)}{q(x)}
L01060: $$
L01062: be a rational function, and let a be any real number.
L01063: (a) If $q(a) \neq 0$, then $\lim _{x \rightarrow a} f(x)=f(a)$.
L01064: (b) If $q(a)=0$ but $p(a) \neq 0$, then $\lim _{x \rightarrow a} f(x)$ does not exist.
L01066: ## LIMITS INVOLVING RADICALS
L01068: Example 10 Find $\lim _{x \rightarrow 1} \frac{x-1}{\sqrt{x}-1}$.
L01069: Solution. In Example 2 of Section 1.1 we used numerical evidence to conjecture that this limit is 2 . Here we will confirm this algebraically. Since this limit is an indeterminate form of type 0/0, we will need to devise some strategy for making the limit (if it exists) evident. One such strategy is to rationalize the denominator of the function. This yields
L01071: $$
L01072: \frac{x-1}{\sqrt{x}-1}=\frac{(x-1)(\sqrt{x}+1)}{(\sqrt{x}-1)(\sqrt{x}+1)}=\frac{(x-1)(\sqrt{x}+1)}{x-1}=\sqrt{x}+1 \quad(x \neq 1)
L01073: $$
L01075: Confirm the limit in Example 10 by factoring the numerator.
L01077: [FIGURE:9a90a018692aefc8 | A graph displays a piecewise-defined function $y=f(x)$ on a Cartesian coordinate system. For $x < -2$, the curve descends from near the x-axis towards a vertical asymptote at $x=-2$. At $x=-2$, there...]
L01078: △ Figure 1.2.5
L01080: Therefore,
L01082: $$
L01083: \lim _{x \rightarrow 1} \frac{x-1}{\sqrt{x}-1}=\lim _{x \rightarrow 1}(\sqrt{x}+1)=2
L01084: $$
L01086: ## LIMITS OF PIECEWISE-DEFINED FUNCTIONS
L01088: For functions that are defined piecewise, a two-sided limit at a point where the formula changes is best obtained by first finding the one-sided limits at that point.
L01090: Example 11 Let
L01092: $$
L01093: f(x)=\left\{\begin{aligned}
L01094: & 1 /(x+2), & x & <-2 \\
L01095: & x^{2}-5, & -2 & <x \leq 3 \\
L01096: & \sqrt{x+13}, & x & >3
L01097: \end{aligned}\right.
L01098: $$
L01100: Find
L01101: (a) $\lim _{x \rightarrow-2} f(x)$
L01102: (b) $\lim _{x \rightarrow 0} f(x)$
L01103: (c) $\lim _{x \rightarrow 3} f(x)$
L01105: Solution (a). We will determine the stated two-sided limit by first considering the corresponding one-sided limits. For each one-sided limit, we must use that part of the formula that is applicable on the interval over which $x$ varies. For example, as $x$ approaches -2 from the left, the applicable part of the formula is
L01107: $$
L01108: f(x)=\frac{1}{x+2}
L01109: $$
L01111: and as $x$ approaches -2 from the right, the applicable part of the formula near -2 is
L01113: $$
L01114: f(x)=x^{2}-5
L01115: $$
L01117: Thus,
L01119: $$
L01120: \begin{aligned}
L01121: \lim _{x \rightarrow-2^{-}} f(x) & =\lim _{x \rightarrow-2^{-}} \frac{1}{x+2}=-\infty \\
L01122: \lim _{x \rightarrow-2^{+}} f(x) & =\lim _{x \rightarrow-2^{+}}\left(x^{2}-5\right)=(-2)^{2}-5=-1
L01123: \end{aligned}
L01124: $$
L01126: from which it follows that $\lim _{x \rightarrow-2} f(x)$ does not exist.
L01128: Solution (b). The applicable part of the formula is $f(x)=x^{2}-5$ on both sides of 0 , so there is no need to consider one-sided limits here. We see directly that
L01130: $$
L01131: \lim _{x \rightarrow 0} f(x)=\lim _{x \rightarrow 0}\left(x^{2}-5\right)=0^{2}-5=-5
L01132: $$
L01134: Solution (c). Using the applicable parts of the formula for $f(x)$, we obtain
L01136: $$
L01137: \begin{aligned}
L01138: & \lim _{x \rightarrow 3^{-}} f(x)=\lim _{x \rightarrow 3^{-}}\left(x^{2}-5\right)=3^{2}-5=4 \\
L01139: & \lim _{x \rightarrow 3^{+}} f(x)=\lim _{x \rightarrow 3^{+}} \sqrt{x+13}=\sqrt{\lim _{x \rightarrow 3^{+}}(x+13)}=\sqrt{3+13}=4
L01140: \end{aligned}
L01141: $$
L01143: Since the one-sided limits are equal, we have
L01145: $$
L01146: \lim _{x \rightarrow 3} f(x)=4
L01147: $$
L01149: We note that the limit calculations in parts (a), (b), and (c) are consistent with the graph of $f$ shown in Figure 1.2.5.
L01151: 1. In each part, find the limit by inspection.
L01152: (a) $\lim _{x \rightarrow 8} 7=$ $\_\_\_\_$ (b) $\lim _{y \rightarrow 3^{+}} 12 y=$ $\_\_\_\_$
L01153: (c) $\lim _{x \rightarrow 0^{-}} \frac{x}{|x|}=$ $\_\_\_\_$
L01154: (d) $\lim _{w \rightarrow 5} \frac{w}{|w|}=$ $\_\_\_\_$
L01155: (e) $\lim _{z \rightarrow 1^{-}} \frac{1}{1-z}=$ $\_\_\_\_$
L01156: 2. Given that $\lim _{x \rightarrow a} f(x)=1$ and $\lim _{x \rightarrow a} g(x)=2$, find the limits.
L01157: (a) $\lim _{x \rightarrow a}[3 f(x)+2 g(x)]=$ $\_\_\_\_$
L01158: (b) $\lim _{x \rightarrow a} \frac{2 f(x)+1}{1-f(x) g(x)}=$ $\_\_\_\_$
L01159: (c) $\lim _{x \rightarrow a} \frac{\sqrt{f(x)+3}}{g(x)}=$ $\_\_\_\_$
L01161: ## EXERCISE SET 1.2
L01163: 1. Given that
L01165: $$
L01166: \lim _{x \rightarrow a} f(x)=2, \quad \lim _{x \rightarrow a} g(x)=-4, \quad \lim _{x \rightarrow a} h(x)=0
L01167: $$
L01169: find the limits.
L01170: (a) $\lim _{x \rightarrow a}[f(x)+2 g(x)]$
L01171: (b) $\lim _{x \rightarrow a}[h(x)-3 g(x)+1]$
L01172: (c) $\lim _{x \rightarrow a}[f(x) g(x)]$
L01173: (d) $\lim _{x \rightarrow a}[g(x)]^{2}$
L01174: (e) $\lim _{x \rightarrow a} \sqrt[3]{6+f(x)}$
L01175: (f) $\lim _{x \rightarrow a} \frac{2}{g(x)}$
L01176: 2. Use the graphs of $f$ and $g$ in the accompanying figure to find the limits that exist. If the limit does not exist, explain why.
L01177: (a) $\lim _{x \rightarrow 2}[f(x)+g(x)]$
L01178: (b) $\lim _{x \rightarrow 0}[f(x)+g(x)]$
L01179: (c) $\lim _{x \rightarrow 0^{+}}[f(x)+g(x)]$
L01180: (d) $\lim _{x \rightarrow 0^{-}}[f(x)+g(x)]$
L01181: (e) $\lim _{x \rightarrow 2} \frac{f(x)}{1+g(x)}$
L01182: (f) $\lim _{x \rightarrow 2} \frac{1+g(x)}{f(x)}$
L01183: (g) $\lim _{x \rightarrow 0^{+}} \sqrt{f(x)}$
L01184: (h) $\lim _{x \rightarrow 0^{-}} \sqrt{f(x)}$
L01185: [FIGURE:a901b09be98878f1 | A coordinate plane with x and y axes and a grid displays the graph of a function $y=f(x)$. The graph consists of two line segments and a single point. The first segment is a decreasing line from the...]
L01186: [FIGURE:4db99b4f99bf2888 | A graph on a coordinate plane with x and y axes and a grid. The x-axis and y-axis have tick marks labeled '1' at unit intervals. A piecewise linear function, $y = g(x)$, is plotted. It consists of...]
L01188: - Figure Ex-2
L01190: 3-30 Find the limits.
L01191: 3. Find the limits.
L01192: (a) $\lim _{x \rightarrow-1}\left(x^{3}+x^{2}+x\right)^{101}=$ $\_\_\_\_$
L01193: (b) $\lim _{x \rightarrow 2^{-}} \frac{(x-1)(x-2)}{x+1}=$ $\_\_\_\_$
L01194: (c) $\lim _{x \rightarrow-1^{+}} \frac{(x-1)(x-2)}{x+1}=$ $\_\_\_\_$
L01195: (d) $\lim _{x \rightarrow 4} \frac{x^{2}-16}{x-4}=$ $\_\_\_\_$
L01196: 4. Let
L01198: $$
L01199: f(x)= \begin{cases}x+1, & x \leq 1 \\ x-1, & x>1\end{cases}
L01200: $$
L01202: Find the limits that exist.
L01203: (a) $\lim _{x \rightarrow 1^{-}} f(x)=$ $\_\_\_\_$
L01204: (b) $\lim _{x \rightarrow 1^{+}} f(x)=$ $\_\_\_\_$
L01205: (c) $\lim _{x \rightarrow 1} f(x)=$ $\_\_\_\_$
L01206: 3. $\lim _{x \rightarrow 2} x(x-1)(x+1)$
L01207: 4. $\lim _{x \rightarrow 3} x^{3}-3 x^{2}+9 x$
L01208: 5. $\lim _{x \rightarrow 3} \frac{x^{2}-2 x}{x+1}$
L01209: 6. $\lim _{x \rightarrow 0} \frac{6 x-9}{x^{3}-12 x+3}$
L01210: 7. $\lim _{x \rightarrow 1^{+}} \frac{x^{4}-1}{x-1}$
L01211: 8. $\lim _{t \rightarrow-2} \frac{t^{3}+8}{t+2}$
L01212: 9. $\lim _{x \rightarrow-1} \frac{x^{2}+6 x+5}{x^{2}-3 x-4}$
L01213: 10. $\lim _{x \rightarrow 2} \frac{x^{2}-4 x+4}{x^{2}+x-6}$
L01214: 11. $\lim _{x \rightarrow-1} \frac{2 x^{2}+x-1}{x+1}$
L01215: 12. $\lim _{x \rightarrow 1} \frac{3 x^{2}-x-2}{2 x^{2}+x-3}$
L01216: 13. $\lim _{t \rightarrow 2} \frac{t^{3}+3 t^{2}-12 t+4}{t^{3}-4 t}$
L01217: 14. $\lim _{t \rightarrow 1} \frac{t^{3}+t^{2}-5 t+3}{t^{3}-3 t+2}$
L01218: 15. $\lim _{x \rightarrow 3^{+}} \frac{x}{x-3}$
L01219: 16. $\lim _{x \rightarrow 3^{-}} \frac{x}{x-3}$
L01220: 17. $\lim _{x \rightarrow 3} \frac{x}{x-3}$
L01221: 18. $\lim _{x \rightarrow 2^{+}} \frac{x}{x^{2}-4}$
L01222: 19. $\lim _{x \rightarrow 2^{-}} \frac{x}{x^{2}-4}$
L01223: 20. $\lim _{x \rightarrow 2} \frac{x}{x^{2}-4}$
L01224: 21. $\lim _{y \rightarrow 6^{+}} \frac{y+6}{y^{2}-36}$
L01225: 22. $\lim _{y \rightarrow 6^{-}} \frac{y+6}{y^{2}-36}$
L01226: 23. $\lim _{y \rightarrow 6} \frac{y+6}{y^{2}-36}$
L01227: 24. $\lim _{x \rightarrow 4^{+}} \frac{3-x}{x^{2}-2 x-8}$
L01228: 25. $\lim _{x \rightarrow 4^{-}} \frac{3-x}{x^{2}-2 x-8}$
L01229: 26. $\lim _{x \rightarrow 4} \frac{3-x}{x^{2}-2 x-8}$
L01230: 27. $\lim _{x \rightarrow 2^{+}} \frac{1}{|2-x|}$
L01231: 28. $\lim _{x \rightarrow 3^{-}} \frac{1}{|x-3|}$
L01232: 29. $\lim _{x \rightarrow 9} \frac{x-9}{\sqrt{x}-3}$
L01233: 30. $\lim _{y \rightarrow 4} \frac{4-y}{2-\sqrt{y}}$
L01234: 31. Let
L01236: $$
L01237: f(x)=\left\{\begin{array}{rr}
L01238: x-1, & x \leq 3 \\
L01239: 3 x-7, & x>3
L01240: \end{array}\right.
L01241: $$
L01243: Find
L01244: (a) $\lim _{x \rightarrow 3^{-}} f(x)$
L01245: (b) $\lim _{x \rightarrow 3^{+}} f(x)$
L01246: (c) $\lim _{x \rightarrow 3} f(x)$.
L01247: 32. Let
L01249: $$
L01250: g(t)= \begin{cases}t-2, & t<0 \\ t^{2}, & 0 \leq t \leq 2 \\ 2 t, & t>2\end{cases}
L01251: $$
L01253: Find
L01254: (a) $\lim _{t \rightarrow 0} g(t)$
L01255: (b) $\lim _{t \rightarrow 1} g(t)$
L01256: (c) $\lim _{t \rightarrow 2} g(t)$.
L01258: 33-36 True-False Determine whether the statement is true or false. Explain your answer.
L01259: 33. If $\lim _{x \rightarrow a} f(x)$ and $\lim _{x \rightarrow a} g(x)$ exist, then so does $\lim _{x \rightarrow a}[f(x)+g(x)]$.
L01260: 34. If $\lim _{x \rightarrow a} g(x)=0$ and $\lim _{x \rightarrow a} f(x)$ exists, then $\lim _{x \rightarrow a}[f(x) / g(x)]$ does not exist.
L01261: 35. If $\lim _{x \rightarrow a} f(x)$ and $\lim _{x \rightarrow a} g(x)$ both exist and are equal, then $\lim _{x \rightarrow a}[f(x) / g(x)]=1$.
L01262: 36. If $f(x)$ is a rational function and $x=a$ is in the domain of $f$, then $\lim _{x \rightarrow a} f(x)=f(a)$.
L01264: 37-38 First rationalize the numerator and then find the limit.
L01265: 37. $\lim _{x \rightarrow 0} \frac{\sqrt{x+4}-2}{x}$
L01266: 38. $\lim _{x \rightarrow 0} \frac{\sqrt{x^{2}+4}-2}{x}$
L01267: 39. Let
L01269: $$
L01270: f(x)=\frac{x^{3}-1}{x-1}
L01271: $$
L01273: (a) Find $\lim _{x \rightarrow 1} f(x)$.
L01274: (b) Sketch the graph of $y=f(x)$.
L01275: 40. Let
L01277: $$
L01278: f(x)= \begin{cases}\frac{x^{2}-9}{x+3}, & x \neq-3 \\ k, & x=-3\end{cases}
L01279: $$
L01281: (a) Find $k$ so that $f(-3)=\lim _{x \rightarrow-3} f(x)$.
L01282: (b) With $k$ assigned the value $\lim _{x \rightarrow-3} f(x)$, show that $f(x)$ can be expressed as a polynomial.
