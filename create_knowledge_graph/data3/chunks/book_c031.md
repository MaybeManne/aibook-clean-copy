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
L10858: ### 4.2 ANALYSIS OF FUNCTIONS II: RELATIVE EXTREMA; GRAPHING POLYNOMIALS
L10860: In this section we will develop methods for finding the high and low points on the graph of a function and we will discuss procedures for analyzing the graphs of polynomials.
L10862: [FIGURE:1f7372ba52869373 | A diagram illustrating absolute and relative extrema using a terrain profile. A blue wavy line represents the terrain, with the highest point labeled "Highest mountain" (absolute maximum) and a lower...]
L10863: - Figure 4.2.1
L10865: ## RELATIVE MAXIMA AND MINIMA
L10867: If we imagine the graph of a function $f$ to be a two-dimensional mountain range with hills and valleys, then the tops of the hills are called "relative maxima," and the bottoms of the valleys are called "relative minima" (Figure 4.2.1). The relative maxima are the high points in their immediate vicinity, and the relative minima are the low points. A relative maximum need not be the highest point in the entire mountain range, and a relative minimum need not be the lowest point-they are just high and low points relative to the nearby terrain. These ideas are captured in the following definition.
L10868: 4.2.1 DEFINITION A function $f$ is said to have a relative maximum at $x_{0}$ if there is an open interval containing $x_{0}$ on which $f\left(x_{0}\right)$ is the largest value, that is, $f\left(x_{0}\right) \geq f(x)$ for all $x$ in the interval. Similarly, $f$ is said to have a relative minimum at $x_{0}$ if there is an open interval containing $x_{0}$ on which $f\left(x_{0}\right)$ is the smallest value, that is, $f\left(x_{0}\right) \leq f(x)$ for all $x$ in the interval. If $f$ has either a relative maximum or a relative minimum at $x_{0}$, then $f$ is said to have a relative extremum at $x_{0}$.
L10870: - Example 1 We can see from Figure 4.2.2 that:
L10871: - $f(x)=x^{2}$ has a relative minimum at $x=0$ but no relative maxima.
L10872: - $f(x)=x^{3}$ has no relative extrema.
L10873: - $f(x)=x^{3}-3 x+3$ has a relative maximum at $x=-1$ and a relative minimum at $x=1$.
L10874: - $f(x)=\frac{1}{2} x^{4}-\frac{4}{3} x^{3}-x^{2}+4 x+1$ has relative minima at $x=-1$ and $x=2$ and a relative maximum at $x=1$.
L10875: - $f(x)=\cos x$ has relative maxima at all even multiples of $\pi$ and relative minima at all odd multiples of $\pi$.
L10877: [FIGURE:92e914c6bb0c10f3 | This figure presents five separate graphs, each illustrating a different function on a Cartesian coordinate system. From left to right, the graphs show: a parabola $y = x^2$, a cubic function $y =...]
L10878: - Figure 4.2.2
L10880: [FIGURE:027817d11bcc4a1b | A graph of a function $y=f(x)$ illustrates relative maxima, minima, and points of nondifferentiability. The function has smooth relative maxima at $x_1$ and $x_5$, and a smooth relative minimum at...]
L10881: Figure 4.2.3 The points $x_{1}, x_{2}, x_{3}$, $x_{4}$, and $x_{5}$ are critical points. Of these, $x_{1}, x_{2}$, and $x_{5}$ are stationary points.
L10883: [FIGURE:0f1dc20cdf6d7a2e | A Cartesian coordinate system displays the graph of the function $y = x^3 - 3x + 1$. The curve has a relative maximum at $(-1, 3)$, indicated by a blue dot and a horizontal purple line at $y=3$. It...]
L10884: Figure 4.2.4
L10886: What is the maximum number of critical points that a polynomial of degree $n$ can have? Why?
L10888: The relative extrema for the five functions in Example 1 occur at points where the graphs of the functions have horizontal tangent lines. Figure 4.2.3 illustrates that a relative extremum can also occur at a point where a function is not differentiable. In general, we define a critical point for a function $f$ to be a point in the domain of $f$ at which either the graph of $f$ has a horizontal tangent line or $f$ is not differentiable. To distinguish between the two types of critical points we call $x$ a stationary point of $f$ if $f^{\prime}(x)=0$. The following theorem, which is proved in Appendix D, states that the critical points for a function form a complete set of candidates for relative extrema on the interior of the domain of the function.
L10889: 4.2.2 THEOREM Suppose that $f$ is a function defined on an open interval containing the point $x_{0}$. If $f$ has a relative extremum at $x=x_{0}$, then $x=x_{0}$ is a critical point of $f$; that is, either $f^{\prime}\left(x_{0}\right)=0$ or $f$ is not differentiable at $x_{0}$.
L10891: Example 2 Find all critical points of $f(x)=x^{3}-3 x+1$.
L10893: Solution. The function $f$, being a polynomial, is differentiable everywhere, so its critical points are all stationary points. To find these points we must solve the equation $f^{\prime}(x)=0$. Since
L10895: $$
L10896: f^{\prime}(x)=3 x^{2}-3=3(x+1)(x-1)
L10897: $$
L10899: we conclude that the critical points occur at $x=-1$ and $x=1$. This is consistent with the graph of $f$ in Figure 4.2.4.
L10901: Example 3 Find all critical points of $f(x)=3 x^{5 / 3}-15 x^{2 / 3}$.
L10903: Solution. The function $f$ is continuous everywhere and its derivative is
L10905: $$
L10906: f^{\prime}(x)=5 x^{2 / 3}-10 x^{-1 / 3}=5 x^{-1 / 3}(x-2)=\frac{5(x-2)}{x^{1 / 3}}
L10907: $$
L10909: We see from this that $f^{\prime}(x)=0$ if $x=2$ and $f^{\prime}(x)$ is undefined if $x=0$. Thus $x=0$ and $x=2$ are critical points and $x=2$ is a stationary point. This is consistent with the graph of $f$ shown in Figure 4.2.5.
L10911: ## TECHNOLOGY
L10913: MASTERY
L10915: Your graphing utility may have trouble producing portions of the graph in Figure 4.2.5 because of the fractional exponents. If this is the case for you, graph the function
L10917: $$
L10918: y=3(|x| / x)|x|^{5 / 3}-15|x|^{2 / 3}
L10919: $$
L10921: which is equivalent to $f(x)$ for $x \neq 0$. Appendix A explores the method suggested here in more detail.
L10923: [FIGURE:0b7969d310d8597f | The graph displays the function $y = 3x^{5/3} - 15x^{2/3}$ on an $xy$-coordinate plane, with the $x$-axis marked from -1 to 6. The blue curve rises steeply to a cusp at the origin $(0,0)$, then...]
L10924: △ Figure 4.2.5
L10926: ## FIRST DERIVATIVE TEST
L10928: Theorem 4.2.2 asserts that the relative extrema must occur at critical points, but it does not say that a relative extremum occurs at every critical point. For example, for the eight critical points in Figure 4.2.6, relative extrema occur at each $x_{0}$ in the top row but not at any $x_{0}$ in the bottom row. Moreover, at the critical points in the first row the derivatives have opposite signs on the two sides of $x_{0}$, whereas at the critical points in the second row the signs of the derivatives are the same on both sides. This suggests:
L10930: A function $f$ has a relative extremum at those critical points where $f^{\prime}$ changes sign.
L10932: △ Figure 4.2.5
L10933: [FIGURE:90ded78fffb41eaa | The figure displays eight graphs, each illustrating a different type of critical point for a function $f(x)$ at $x=x_0$. The top row shows critical points that are relative extrema: a relative...]
L10935: We can actually take this a step further. At the two relative maxima in Figure 4.2.6 the derivative is positive on the left side and negative on the right side, and at the two relative minima the derivative is negative on the left side and positive on the right side. All of this is summarized more precisely in the following theorem.
L10937: Informally stated, parts (a) and (b) of Theorem 4.2.3 tell us that for a continuous function, relative maxima occur at critical points where the derivative changes from + to - and relative minima where it changes from - to +.
L10939: Use the first derivative test to confirm the behavior at $x_{0}$ of each graph in Figure 4.2.6.
L10941: Table 4.2.1
L10942: | INTERVAL | $5(x-2) / x^{1 / 3}$ | $f^{\prime}(x)$ |
L10943: | :--- | :---: | :---: |
L10944: | $x<0$ | $(-) /(-)$ | + |
L10945: | $0<x<2$ | $(-) /(+)$ | - |
L10946: | $x>2$ | $(+) /(+)$ | + |
L10949: [FIGURE:74644a8b465d7690 | A graph illustrates the relationship between the second derivative of a function $f$ and its relative extrema and concavity. The blue curve shows a relative maximum where $f'' < 0$ and the curve is...]
L10950: △ Figure 4.2.7
L10952: 4.2.3 THEOREM (First Derivative Test) Suppose that $f$ is continuous at a critical point $x_{0}$.
L10953: (a) If $f^{\prime}(x)>0$ on an open interval extending left from $x_{0}$ and $f^{\prime}(x)<0$ on an open interval extending right from $x_{0}$, then $f$ has a relative maximum at $x_{0}$.
L10954: (b) If $f^{\prime}(x)<0$ on an open interval extending left from $x_{0}$ and $f^{\prime}(x)>0$ on an open interval extending right from $x_{0}$, then $f$ has a relative minimum at $x_{0}$.
L10955: (c) If $f^{\prime}(x)$ has the same sign on an open interval extending left from $x_{0}$ as it does on an open interval extending right from $x_{0}$, then $f$ does not have a relative extremum at $x_{0}$.
L10956: proof We will prove part (a) and leave parts (b) and (c) as exercises. We are assuming that $f^{\prime}(x)>0$ on the interval ( $a, x_{0}$ ) and that $f^{\prime}(x)<0$ on the interval ( $x_{0}, b$ ), and we want to show that
L10958: $$
L10959: f\left(x_{0}\right) \geq f(x)
L10960: $$
L10962: for all $x$ in the interval $(a, b)$. However, the two hypotheses, together with Theorem 4.1.2 and its associated marginal note imply that $f$ is increasing on the interval ( $a, x_{0}$ ] and decreasing on the interval $\left[x_{0}, b\right)$. Thus, $f\left(x_{0}\right) \geq f(x)$ for all $x$ in ( $a, b$ ) with equality only at $x_{0}$.
L10964: Example 4 We showed in Example 3 that the function $f(x)=3 x^{5 / 3}-15 x^{2 / 3}$ has critical points at $x=0$ and $x=2$. Figure 4.2.5 suggests that $f$ has a relative maximum at $x=0$ and a relative minimum at $x=2$. Confirm this using the first derivative test.
L10966: Solution. We showed in Example 3 that
L10968: $$
L10969: f^{\prime}(x)=\frac{5(x-2)}{x^{1 / 3}}
L10970: $$
L10972: A sign analysis of this derivative is shown in Table 4.2.1. The sign of $f^{\prime}$ changes from + to - at $x=0$, so there is a relative maximum at that point. The sign changes from - to + at $x=2$, so there is a relative minimum at that point.
L10974: ## SECOND DERIVATIVE TEST
L10976: There is another test for relative extrema that is based on the following geometric observation: A function $f$ has a relative maximum at a stationary point if the graph of $f$ is concave down on an open interval containing that point, and it has a relative minimum if it is concave up (Figure 4.2.7).
L10977: 4.2.4 THEOREM (Second Derivative Test) Suppose that $f$ is twice differentiable at the point $x_{0}$.
L10978: (a) If $f^{\prime}\left(x_{0}\right)=0$ and $f^{\prime \prime}\left(x_{0}\right)>0$, then $f$ has a relative minimum at $x_{0}$.
L10979: (b) If $f^{\prime}\left(x_{0}\right)=0$ and $f^{\prime \prime}\left(x_{0}\right)<0$, then $f$ has a relative maximum at $x_{0}$.
L10980: (c) If $f^{\prime}\left(x_{0}\right)=0$ and $f^{\prime \prime}\left(x_{0}\right)=0$, then the test is inconclusive; that is, $f$ may have a relative maximum, a relative minimum, or neither at $x_{0}$.
L10982: The second derivative test is often easier to apply than the first derivative test. However, the first derivative test can be used at any critical point of a continuous function, while the second derivative test applies only at stationary points where the second derivative exists.
L10984: [FIGURE:95b13d49a12faabf | The graph displays the function $y = 3x^5 - 5x^3$ on a Cartesian coordinate system with x and y axes labeled. The curve has a local maximum at approximately $x = -1$ with a y-value of $2$, and a...]
L10985: - Figure 4.2.8
L10987: We will prove parts (a) and (c) and leave part (b) as an exercise.
L10988: proof (a) We are given that $f^{\prime}\left(x_{0}\right)=0$ and $f^{\prime \prime}\left(x_{0}\right)>0$, and we want to show that $f$ has a relative minimum at $x_{0}$. Expressing $f^{\prime \prime}\left(x_{0}\right)$ as a limit and using the two given conditions we obtain
L10990: $$
L10991: f^{\prime \prime}\left(x_{0}\right)=\lim _{x \rightarrow x_{0}} \frac{f^{\prime}(x)-f^{\prime}\left(x_{0}\right)}{x-x_{0}}=\lim _{x \rightarrow x_{0}} \frac{f^{\prime}(x)}{x-x_{0}}>0
L10992: $$
L10994: This implies that for $x$ sufficiently close to but different from $x_{0}$ we have
L10996: $$
L10997: \begin{equation*}
L10998: \frac{f^{\prime}(x)}{x-x_{0}}>0 \tag{1}
L10999: \end{equation*}
L11000: $$
L11002: Thus, there is an open interval extending left from $x_{0}$ and an open interval extending right from $x_{0}$ on which (1) holds. On the open interval extending left the denominator in (1) is negative, so $f^{\prime}(x)<0$, and on the open interval extending right the denominator is positive, so $f^{\prime}(x)>0$. It now follows from part (b) of the first derivative test (Theorem 4.2.3) that $f$ has a relative minimum at $x_{0}$.
L11004: PROOF (c) To prove this part of the theorem we need only provide functions for which $f^{\prime}\left(x_{0}\right)=0$ and $f^{\prime \prime}\left(x_{0}\right)=0$ at some point $x_{0}$, but with one having a relative minimum at $x_{0}$, one having a relative maximum at $x_{0}$, and one having neither at $x_{0}$. We leave it as an exercise for you to show that three such functions are $f(x)=x^{4}$ (relative minimum at $x=0$ ), $f(x)=-x^{4}$ (relative maximum at $x=0$ ), and $f(x)=x^{3}$ (neither a relative maximum nor a relative minimum at $x_{0}$ ).
L11006: Example 5 Find the relative extrema of $f(x)=3 x^{5}-5 x^{3}$.
L11007: Solution. We have
L11009: $$
L11010: \begin{aligned}
L11011: f^{\prime}(x) & =15 x^{4}-15 x^{2}=15 x^{2}\left(x^{2}-1\right)=15 x^{2}(x+1)(x-1) \\
L11012: f^{\prime \prime}(x) & =60 x^{3}-30 x=30 x\left(2 x^{2}-1\right)
L11013: \end{aligned}
L11014: $$
L11016: Solving $f^{\prime}(x)=0$ yields the stationary points $x=0, x=-1$, and $x=1$. As shown in the following table, we can conclude from the second derivative test that $f$ has a relative maximum at $x=-1$ and a relative minimum at $x=1$.
L11018: | STATIONARY POINT | $30 x\left(2 x^{2}-1\right)$ | $f^{\prime \prime}(x)$ | SECOND DERIVATIVE TEST |
L11019: | :---: | :---: | :---: | :--- |
L11020: | $x=-1$ | -30 | - | $f$ has a relative maximum |
L11021: | $x=0$ | 0 | 0 | Inconclusive |
L11022: | $x=1$ | 30 | + | $f$ has a relative minimum |
L11024: The test is inconclusive at $x=0$, so we will try the first derivative test at that point. A sign analysis of $f^{\prime}$ is given in the following table:
L11026: | INTERVAL | $15 x^{2}(x+1)(x-1)$ | $f^{\prime}(x)$ |
L11027: | ---: | ---: | ---: |
L11028: | $-1<x<0$ | $(+)(+)(-)$ | - |
L11029: | $0<x<1$ | $(+)(+)(-)$ | - |
L11031: Since there is no sign change in $f^{\prime}$ at $x=0$, there is neither a relative maximum nor a relative minimum at that point. All of this is consistent with the graph of $f$ shown in Figure 4.2.8.
L11033: ## GEOMETRIC IMPLICATIONS OF MULTIPLICITY
L11035: Our final goal in this section is to outline a general procedure that can be used to analyze and graph polynomials. To do so, it will be helpful to understand how the graph of a polynomial behaves in the vicinity of its roots. For example, it would be nice to know what property of the polynomial in Example 5 produced the inflection point and horizontal tangent at the root $x=0$.
L11037: Recall that a root $x=r$ of a polynomial $p(x)$ has multiplicity $\boldsymbol{m}$ if $(x-r)^{m}$ divides $p(x)$ but $(x-r)^{m+1}$ does not. A root of multiplicity 1 is called a simple root. Figure 4.2.9 and the following theorem show that the behavior of a polynomial in the vicinity of a real root is determined by the multiplicity of that root (we omit the proof).
L11038: 4.2.5 THE GEOMETRIC IMPLICATIONS OF MULTIPLICITY Suppose that $p(x)$ is a polynomial with a root of multiplicity $m$ at $x=r$.
L11039: (a) If $m$ is even, then the graph of $y=p(x)$ is tangent to the $x$-axis at $x=r$, does not cross the $x$-axis there, and does not have an inflection point there.
L11040: (b) If $m$ is odd and greater than 1 , then the graph is tangent to the $x$-axis at $x=r$, crosses the $x$-axis there, and also has an inflection point there.
L11041: (c) If $m=1$ (so that the root is simple), then the graph is not tangent to the $x$-axis at $x=r$, crosses the $x$-axis there, and may or may not have an inflection point there.
L11043: [FIGURE:52eb0e96482b1bff | The figure displays six distinct blue curves, each illustrating the local behavior of a polynomial function near a root on a horizontal axis. A red dot marks each root, and a green circle highlights...]
L11044: △ Figure 4.2.9
L11046: [FIGURE:cc63b84207c66186 | A Cartesian coordinate system displays the graph of the polynomial function $y = x^3(3x-4)(x+2)^2$. The curve touches the x-axis at $x=-2$, crosses the x-axis at $x=0$ with a horizontal tangent (an...]
L11047: \$ Figure 4.2.10
L11049: Example 6 Make a conjecture about the behavior of the graph of
L11051: $$
L11052: y=x^{3}(3 x-4)(x+2)^{2}
L11053: $$
L11055: in the vicinity of its $x$-intercepts, and test your conjecture by generating the graph.
L11056: Solution. The $x$-intercepts occur at $x=0, x=\frac{4}{3}$, and $x=-2$. The root $x=0$ has multiplicity 3 , which is odd, so at that point the graph should be tangent to the $x$-axis, cross the $x$-axis, and have an inflection point there. The root $x=-2$ has multiplicity 2 , which is even, so the graph should be tangent to but not cross the $x$-axis there. The root $x=\frac{4}{3}$ is simple, so at that point the curve should cross the $x$-axis without being tangent to it. All of this is consistent with the graph in Figure 4.2.10.
L11058: For each of the graphs in Figure 4.2.11, count the number of $x$-intercepts, relative extrema, and inflection points, and confirm that your count is consistent with the degree of the polynomial.
L11060: ## ANALYSIS OF POLYNOMIALS
L11062: Historically, the term "curve sketching" meant using calculus to help draw the graph of a function by hand-the graph was the goal. Since graphs can now be produced with great precision using calculators and computers, the purpose of curve sketching has changed. Today, we typically start with a graph produced by a calculator or computer, then use curve sketching to identify important features of the graph that the calculator or computer might have missed. Thus, the goal of curve sketching is no longer the graph itself, but rather the information it reveals about the function.
L11064: Polynomials are among the simplest functions to graph and analyze. Their significant features are symmetry, intercepts, relative extrema, inflection points, and the behavior as $x \rightarrow+\infty$ and as $x \rightarrow-\infty$. Figure 4.2.11 shows the graphs of four polynomials in $x$. The graphs in Figure 4.2.11 have properties that are common to all polynomials:
L11066: - The natural domain of a polynomial is $(-\infty,+\infty)$.
L11067: - Polynomials are continuous everywhere.
L11068: - Polynomials are differentiable everywhere, so their graphs have no corners or vertical tangent lines.
L11069: - The graph of a nonconstant polynomial eventually increases or decreases without bound as $x \rightarrow+\infty$ and as $x \rightarrow-\infty$. This is because the limit of a nonconstant polynomial as $x \rightarrow+\infty$ or as $x \rightarrow-\infty$ is $\pm \infty$, depending on the sign of the term of highest degree and whether the polynomial has even or odd degree [see Formulas (17) and (18) of Section 1.3 and the related discussion].
L11070: - The graph of a polynomial of degree $n(>2)$ has at most $n x$-intercepts, at most $n-1$ relative extrema, and at most $n-2$ inflection points. This is because the $x$ intercepts, relative extrema, and inflection points of a polynomial $p(x)$ are among the real solutions of the equations $p(x)=0, p^{\prime}(x)=0$, and $p^{\prime \prime}(x)=0$, and the polynomials in these equations have degree $n, n-1$, and $n-2$, respectively. Thus, for example, the graph of a quadratic polynomial has at most two $x$-intercepts, one relative extremum, and no inflection points; and the graph of a cubic polynomial has at most three $x$-intercepts, two relative extrema, and one inflection point.
L11072: [FIGURE:dc12f8b13f6c206a | The figure displays four separate graphs, each illustrating the typical shape of a polynomial function of a given degree. Each graph has an x-axis and a y-axis. The first graph shows a parabola...]
L11073: - Figure 4.2.11
L11075: [FIGURE:76ef5dba87332516 | The graph displays the quartic function $y = 3x^4 - 6x^3 + 2x$ plotted on a coordinate plane within the viewing window $x \in [-2, 2)$ and $y \in [-3, 3)$. The curve, rendered with dotted lines...]
L11076: - Figure 4.2.12
L11078: Example 7 Figure 4.2.12 shows the graph of
L11080: $$
L11081: y=3 x^{4}-6 x^{3}+2 x
L11082: $$
L11084: produced on a graphing calculator. Confirm that the graph is not missing any significant features.
L11086: Solution. We can be confident that the graph shows all significant features of the polynomial because the polynomial has degree 4 and we can account for four roots, three relative extrema, and two inflection points. Moreover, the graph suggests the correct behavior as
L11088: A review of polynomial factoring is given in Appendix C.
L11090: [FIGURE:53416f98cc33ebb0 | The figure presents a three-part analysis of the function $y = x^3 - 3x + 2$. The top section displays a sign chart for the first derivative, $dy/dx = 3(x-1)(x+1)$, indicating that $y$ is increasing...]
L11091: - Figure 4.2.13
L11093: $x \rightarrow+\infty$ and as $x \rightarrow-\infty$, since
L11095: $$
L11096: \begin{aligned}
L11097: & \lim _{x \rightarrow+\infty}\left(3 x^{4}-6 x^{3}+2 x\right)=\lim _{x \rightarrow+\infty} 3 x^{4}=+\infty \\
L11098: & \lim _{x \rightarrow-\infty}\left(3 x^{4}-6 x^{3}+2 x\right)=\lim _{x \rightarrow-\infty} 3 x^{4}=+\infty
L11099: \end{aligned}
L11100: $$
L11102: Example 8 Sketch the graph of the equation
L11104: $$
L11105: y=x^{3}-3 x+2
L11106: $$
L11108: and identify the locations of the intercepts, relative extrema, and inflection points.
L11109: Solution. The following analysis will produce the information needed to sketch the graph:
L11111: - $x$-intercepts: Factoring the polynomial yields
L11113: $$
L11114: x^{3}-3 x+2=(x+2)(x-1)^{2}
L11115: $$
L11117: which tells us that the $x$-intercepts are $x=-2$ and $x=1$.
L11119: - $y$-intercept: Setting $x=0$ yields $y=2$.
L11120: - End behavior: We have
L11122: $$
L11123: \begin{aligned}
L11124: \lim _{x \rightarrow+\infty}\left(x^{3}-3 x+2\right) & =\lim _{x \rightarrow+\infty} x^{3}=+\infty \\
L11125: \lim _{x \rightarrow-\infty}\left(x^{3}-3 x+2\right) & =\lim _{x \rightarrow-\infty} x^{3}=-\infty
L11126: \end{aligned}
L11127: $$
L11129: so the graph increases without bound as $x \rightarrow+\infty$ and decreases without bound as $x \rightarrow-\infty$.
L11131: - Derivatives:
L11133: $$
L11134: \begin{aligned}
L11135: & \frac{d y}{d x}=3 x^{2}-3=3(x-1)(x+1) \\
L11136: & \frac{d^{2} y}{d x^{2}}=6 x
L11137: \end{aligned}
L11138: $$
L11140: - Increase, decrease, relative extrema, inflection points: Figure 4.2.13 gives a sign analysis of the first and second derivatives and indicates its geometric significance. There are stationary points at $x=-1$ and $x=1$. Since the sign of $d y / d x$ changes from + to - at $x=-1$, there is a relative maximum there, and since it changes from - to + at $x=1$, there is a relative minimum there. The sign of $d^{2} y / d x^{2}$ changes from - to + at $x=0$, so there is an inflection point there.
L11141: - Final sketch: Figure 4.2.14 shows the final sketch with the coordinates of the intercepts, relative extrema, and inflection point labeled. $\square$
L11143: [FIGURE:5878a7d7f543f94a | A graph of the cubic function $y = x^3 - 3x + 2$ is displayed on a Cartesian coordinate system with x and y axes. The blue curve passes through the x-axis at $(-2, 0)$ and $(1, 0)$, and the y-axis at...]
L11144: \$ Figure 4.2.14
L11146: ## QUICK CHECK EXERCISES 4.2 (See page 254 for answers.)
L11148: 1. A function $f$ has a relative maximum at $x_{0}$ if there is an open interval containing $x_{0}$ on which $f(x)$ is $\_\_\_\_$ $f\left(x_{0}\right)$ for every $x$ in the interval.
L11149: 2. Suppose that $f$ is defined everywhere and $x=2,3,5,7$ are critical points for $f$. If $f^{\prime}(x)$ is positive on the intervals $(-\infty, 2)$ and (5, 7), and if $f^{\prime}(x)$ is negative on the intervals $(2,3),(3,5)$, and $(7,+\infty)$, then $f$ has relative maxima at $x=$ $\_\_\_\_$ and $f$ has relative minima at $x=$ $\_\_\_\_$ .
L11150: 3. Suppose that $f$ is defined everywhere and $x=-2$ and $x=1$ are critical points for $f$. If $f^{\prime \prime}(x)=2 x+1$, then $f$ has a relative $\_\_\_\_$ at $x=-2$ and $f$ has a relative
L11151: $\_\_\_\_$ at $x=1$.
L11152: 4. Let $f(x)=\left(x^{2}-4\right)^{2}$. Then $f^{\prime}(x)=4 x\left(x^{2}-4\right)$ and $f^{\prime \prime}(x)=4\left(3 x^{2}-4\right)$. Identify the locations of the (a) relative maxima, (b) relative minima, and (c) inflection points on the graph of $f$.
