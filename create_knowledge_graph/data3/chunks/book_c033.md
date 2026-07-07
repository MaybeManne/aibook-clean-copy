L11327: ## QUICK CHECK ANSWERS 4.2
L11329: 1. less than or equal to
L11330: 2. 2,$7 ; 5$
L11331: 3. maximum; minimum
L11332: 4. (a) $(0,16)$ (b) $(-2,0)$ and $(2,0)$
L11333: (c) $(-2 / \sqrt{3}, 64 / 9)$ and $(2 / \sqrt{3}, 64 / 9)$
L11335: ### 4.3 ANALYSIS OF FUNCTIONS III: RATIONAL FUNCTIONS, CUSPS, AND VERTICAL TANGENTS
L11337: In this section we will discuss procedures for graphing rational functions and other kinds of curves. We will also discuss the interplay between calculus and technology in curve sketching.
L11339: ## PROPERTIES OF GRAPHS
L11341: In many problems, the properties of interest in the graph of a function are:
L11343: - symmetries
L11344: - $x$-intercepts
L11345: - relative extrema
L11346: - intervals of increase and decrease
L11347: - asymptotes
L11348: - periodicity
L11349: - $y$-intercepts
L11350: - concavity
L11351: - inflection points
L11352: - behavior as $x \rightarrow+\infty$ or as $x \rightarrow-\infty$
L11354: Some of these properties may not be relevant in certain cases; for example, asymptotes are characteristic of rational functions but not of polynomials, and periodicity is characteristic of
L11355: trigonometric functions but not of polynomial or rational functions. Thus, when analyzing the graph of a function $f$, it helps to know something about the general properties of the family to which it belongs.
L11357: In a given problem you will usually have a definite objective for your analysis of a graph. For example, you may be interested in showing all of the important characteristics of the function, you may only be interested in the behavior of the graph as $x \rightarrow+\infty$ or as $x \rightarrow-\infty$, or you may be interested in some specific feature such as a particular inflection point. Thus, your objectives in the problem will dictate those characteristics on which you want to focus.
L11359: ## GRAPHING RATIONAL FUNCTIONS
L11361: Recall that a rational function is a function of the form $f(x)=P(x) / Q(x)$ in which $P(x)$ and $Q(x)$ are polynomials. Graphs of rational functions are more complicated than those of polynomials because of the possibility of asymptotes and discontinuities (see Figure 0.3.11, for example). If $P(x)$ and $Q(x)$ have no common factors, then the information obtained in the following steps will usually be sufficient to obtain an accurate sketch of the graph of a rational function.
L11363: ## Graphing a Rational Function $f(x)=P(x) / Q(x)$ if $P(x)$ and $Q(x)$ have no Common Factors
L11365: Step 1. (symmetries). Determine whether there is symmetry about the $y$-axis or the origin.
L11367: Step 2. ( $\boldsymbol{x}$ - and $\boldsymbol{y}$-intercepts). Find the $x$ - and $y$-intercepts.
L11368: Step 3. (vertical asymptotes). Find the values of $x$ for which $Q(x)=0$. The graph has a vertical asymptote at each such value.
L11370: Step 4. (sign of $\boldsymbol{f}(\boldsymbol{x}))$. The only places where $f(x)$ can change sign are at the $x$ intercepts or vertical asymptotes. Mark the points on the $x$-axis at which these occur and calculate a sample value of $f(x)$ in each of the open intervals determined by these points. This will tell you whether $f(x)$ is positive or negative over that interval.
L11372: Step 5. (end behavior). Determine the end behavior of the graph by computing the limits of $f(x)$ as $x \rightarrow+\infty$ and as $x \rightarrow-\infty$. If either limit has a finite value $L$, then the line $y=L$ is a horizontal asymptote.
L11374: Step 6. (derivatives). Find $f^{\prime}(x)$ and $f^{\prime \prime}(x)$.
L11375: Step 7. (conclusions and graph). Analyze the sign changes of $f^{\prime}(x)$ and $f^{\prime \prime}(x)$ to determine the intervals where $f(x)$ is increasing, decreasing, concave up, and concave down. Determine the locations of all stationary points, relative extrema, and inflection points. Use the sign analysis of $f(x)$ to determine the behavior of the graph in the vicinity of the vertical asymptotes. Sketch a graph of $f$ that exhibits these conclusions.
L11377: Example 1 Sketch a graph of the equation
L11379: $$
L11380: y=\frac{2 x^{2}-8}{x^{2}-16}
L11381: $$
L11383: and identify the locations of the intercepts, relative extrema, inflection points, and asymptotes.
L11385: Solution. The numerator and denominator have no common factors, so we will use the procedure just outlined.
L11387: SIGN ANALYSIS OF $y=\frac{2 x^{2}-8}{x^{2}-16}$
L11389: Table 4.3.1
L11390: |  | TEST | VALUE | SIGN |
L11391: | :--- | :---: | :---: | :---: |
L11392: | INTERVAL | POINT | OF $y$ | OF $y$ |
L11393: | $(-\infty,-4)$ | -5 | $14 / 3$ | + |
L11394: | $(-4,-2)$ | -3 | $-10 / 7$ | - |
L11395: | $(-2,2)$ | 0 | $1 / 2$ | + |
L11396: | $(2,4)$ | 3 | $-10 / 7$ | - |
L11397: | $(4,+\infty)$ | 5 | $14 / 3$ | + |
L11400: The procedure we stated for graphing a rational function $P(x) / Q(x)$ applies only if the polynomials $P(x)$ and $Q(x)$ have no common factors. How would you find the graph if those polynomials have common factors?
L11402: - Symmetries: Replacing $x$ by $-x$ does not change the equation, so the graph is symmetric about the $y$-axis.
L11403: - $x$ - and $y$-intercepts: Setting $y=0$ yields the $x$-intercepts $x=-2$ and $x=2$. Setting $x=0$ yields the $y$-intercept $y=\frac{1}{2}$.
L11404: - Vertical asymptotes: We observed above that the numerator and denominator of $y$ have no common factors, so the graph has vertical asymptotes at the points where the denominator of $y$ is zero, namely, at $x=-4$ and $x=4$.
L11405: - Sign of y: The set of points where $x$-intercepts or vertical asymptotes occur is $\{-4,-2,2,4\}$. These points divide the $x$-axis into the open intervals
L11407: $$
L11408: (-\infty,-4), \quad(-4,-2), \quad(-2,2), \quad(2,4), \quad(4,+\infty)
L11409: $$
L11411: We can find the sign of $y$ on each interval by choosing an arbitrary test point in the interval and evaluating $y=f(x)$ at the test point (Table 4.3.1). This analysis is summarized on the first line of Figure 4.3.1a.
L11413: - End behavior: The limits
L11415: $$
L11416: \begin{aligned}
L11417: & \lim _{x \rightarrow+\infty} \frac{2 x^{2}-8}{x^{2}-16}=\lim _{x \rightarrow+\infty} \frac{2-\left(8 / x^{2}\right)}{1-\left(16 / x^{2}\right)}=2 \\
L11418: & \lim _{x \rightarrow-\infty} \frac{2 x^{2}-8}{x^{2}-16}=\lim _{x \rightarrow-\infty} \frac{2-\left(8 / x^{2}\right)}{1-\left(16 / x^{2}\right)}=2
L11419: \end{aligned}
L11420: $$
L11422: yield the horizontal asymptote $y=2$.
L11424: - Derivatives:
L11426: $$
L11427: \begin{aligned}
L11428: \frac{d y}{d x} & =\frac{\left(x^{2}-16\right)(4 x)-\left(2 x^{2}-8\right)(2 x)}{\left(x^{2}-16\right)^{2}}=-\frac{48 x}{\left(x^{2}-16\right)^{2}} \\
L11429: \frac{d^{2} y}{d x^{2}} & =\frac{48\left(16+3 x^{2}\right)}{\left(x^{2}-16\right)^{3}} \quad(\text { verify })
L11430: \end{aligned}
L11431: $$
L11433: Conclusions and graph:
L11435: - The sign analysis of $y$ in Figure 4.3.1a reveals the behavior of the graph in the vicinity of the vertical asymptotes: The graph increases without bound as $x \rightarrow-4^{-}$ and decreases without bound as $x \rightarrow-4^{+}$; and the graph decreases without bound as $x \rightarrow 4^{-}$and increases without bound as $x \rightarrow 4^{+}$(Figure 4.3.1b).
L11436: - The sign analysis of $d y / d x$ in Figure 4.3.1a shows that the graph is increasing to the left of $x=0$ and is decreasing to the right of $x=0$. Thus, there is a relative maximum at the stationary point $x=0$. There are no relative minima.
L11437: - The sign analysis of $d^{2} y / d x^{2}$ in Figure 4.3.1a shows that the graph is concave up to the left of $x=-4$, is concave down between $x=-4$ and $x=4$, and is concave up to the right of $x=4$. There are no inflection points.
L11439: The graph is shown in Figure 4.3.1c.
L11441: Example 2 Sketch a graph of
L11443: $$
L11444: y=\frac{x^{2}-1}{x^{3}}
L11445: $$
L11447: and identify the locations of all asymptotes, intercepts, relative extrema, and inflection points.
L11449: Solution. The numerator and denominator have no common factors, so we will use the procedure outlined previously.
L11451: [FIGURE:0b6185bac15fc79f | The figure presents a comprehensive analysis of the function $y = \frac{2x^2 - 8}{x^2 - 16}$. Part (a) shows three number lines: the first indicates the sign of $y$ with vertical asymptotes at $x =...]
L11452: - Figure 4.3.1
L11454: SIGN ANALYSIS OF $y=\frac{x^{2}-1}{x^{3}}$
L11456: Table 4.3.2
L11457: | INTERVAL | TEST <br> POINT | VALUE <br> OF $y$ | SIGN <br> OF $y$ |
L11458: | :--- | ---: | ---: | ---: |
L11459: | $(-\infty,-1)$ | -2 | $-\frac{3}{8}$ | - |
L11460: | $(-1,0)$ | $-\frac{1}{2}$ | 6 | + |
L11461: | $(0,1)$ | $\frac{1}{2}$ | -6 | - |
L11462: | $(1,+\infty)$ | 2 | $\frac{3}{8}$ | + |
L11465: - Symmetries: Replacing $x$ by $-x$ and $y$ by $-y$ yields an equation that simplifies to the original equation, so the graph is symmetric about the origin.
L11466: - $x$-and $y$-intercepts: Setting $y=0$ yields the $x$-intercepts $x=-1$ and $x=1$. Setting $x=0$ leads to a division by zero, so there is no $y$-intercept.
L11467: - Vertical asymptotes: Setting $x^{3}=0$ yields the solution $x=0$. This is not a root of $x^{2}-1$, so $x=0$ is a vertical asymptote.
L11468: - Sign of $y$ : The set of points where $x$-intercepts or vertical asymptotes occur is $\{-1,0,1\}$. These points divide the $x$-axis into the open intervals
L11470: $$
L11471: (-\infty,-1), \quad(-1,0), \quad(0,1), \quad(1,+\infty)
L11472: $$
L11474: Table 4.3.2 uses the method of test points to produce the sign of $y$ on each of these intervals.
L11476: - End behavior: The limits
L11478: $$
L11479: \begin{aligned}
L11480: & \lim _{x \rightarrow+\infty} \frac{x^{2}-1}{x^{3}}=\lim _{x \rightarrow+\infty}\left(\frac{1}{x}-\frac{1}{x^{3}}\right)=0 \\
L11481: & \lim _{x \rightarrow-\infty} \frac{x^{2}-1}{x^{3}}=\lim _{x \rightarrow-\infty}\left(\frac{1}{x}-\frac{1}{x^{3}}\right)=0
L11482: \end{aligned}
L11483: $$
L11485: yield the horizontal asymptote $y=0$.
L11487: - Derivatives:
L11489: $$
L11490: \begin{aligned}
L11491: & \frac{d y}{d x}=\frac{x^{3}(2 x)-\left(x^{2}-1\right)\left(3 x^{2}\right)}{\left(x^{3}\right)^{2}}=\frac{3-x^{2}}{x^{4}}=\frac{(\sqrt{3}+x)(\sqrt{3}-x)}{x^{4}} \\
L11492: & \frac{d^{2} y}{d x^{2}}=\frac{x^{4}(-2 x)-\left(3-x^{2}\right)\left(4 x^{3}\right)}{\left(x^{4}\right)^{2}}=\frac{2\left(x^{2}-6\right)}{x^{5}}=\frac{2(x-\sqrt{6})(x+\sqrt{6})}{x^{5}}
L11493: \end{aligned}
L11494: $$
L11496: ## Conclusions and graph:
L11498: - The sign analysis of $y$ in Figure 4.3.2a reveals the behavior of the graph in the vicinity of the vertical asymptote $x=0$ : The graph increases without bound as $x \rightarrow 0^{-}$and decreases without bound as $x \rightarrow 0^{+}$(Figure 4.3.2b).
L11499: - The sign analysis of $d y / d x$ in Figure 4.3.2a shows that there is a relative minimum at $x=-\sqrt{3}$ and a relative maximum at $x=\sqrt{3}$.
L11500: - The sign analysis of $d^{2} y / d x^{2}$ in Figure 4.3.2a shows that the graph changes concavity at the vertical asymptote $x=0$ and that there are inflection points at $x=-\sqrt{6}$ and $x=\sqrt{6}$.
L11502: The graph is shown in Figure 4.3.2c. To produce a slightly more accurate sketch, we used a graphing utility to help plot the relative extrema and inflection points. You should confirm that the approximate coordinates of the inflection points are $(-2.45,-0.34)$ and $(2.45$, 0.34 ) and that the approximate coordinates of the relative minimum and relative maximum are $(-1.73,-0.38)$ and $(1.73,0.38)$, respectively.
L11504: [FIGURE:afe32360750f6a59 | The figure presents a comprehensive analysis of the function $y = \frac{x^2 - 1}{x^3}$. Part (a) consists of three number lines: the first shows the sign of $y$, indicating its roots at $x = \pm 1$...]
L11505: △ Figure 4.3.2
L11507: [FIGURE:7d4555e3216cb2ad | A 2D Cartesian coordinate system displays the graph of the function $y = x + 1/x$ in blue, along with its oblique asymptote $y=x$ as a dashed red line. The function has a vertical asymptote at $x=0$...]
L11508: - Figure 4.3.3
L11510: $$
L11511: y=\frac{x^{2}+1}{x}
L11512: $$
L11514: [FIGURE:d569aee2f467e0c6 | The graph displays two functions on an x-y coordinate system. A solid blue curve represents the function $y = \frac{x^3 - x^2 - 8}{x-1}$, which has a vertical asymptote at $x=1$, indicated by a...]
L11515: - Figure 4.3.4
L11517: ## RATIONAL FUNCTIONS WITH OBLIQUE OR CURVILINEAR ASYMPTOTES
L11519: In the rational functions of Examples 1 and 2, the degree of the numerator did not exceed the degree of the denominator, and the asymptotes were either vertical or horizontal. If the numerator of a rational function has greater degree than the denominator, then other kinds of "asymptotes" are possible. For example, consider the rational functions
L11521: $$
L11522: \begin{equation*}
L11523: f(x)=\frac{x^{2}+1}{x} \quad \text { and } \quad g(x)=\frac{x^{3}-x^{2}-8}{x-1} \tag{1}
L11524: \end{equation*}
L11525: $$
L11527: By division we can rewrite these as
L11529: $$
L11530: f(x)=x+\frac{1}{x} \quad \text { and } \quad g(x)=x^{2}-\frac{8}{x-1}
L11531: $$
L11533: Since the second terms both approach 0 as $x \rightarrow+\infty$ or as $x \rightarrow-\infty$, it follows that
L11535: $$
L11536: \begin{array}{ll}
L11537: (f(x)-x) \rightarrow 0 & \text { as } x \rightarrow+\infty \text { or as } x \rightarrow-\infty \\
L11538: \left(g(x)-x^{2}\right) \rightarrow 0 & \text { as } x \rightarrow+\infty \text { or as } x \rightarrow-\infty
L11539: \end{array}
L11540: $$
L11542: Geometrically, this means that the graph of $y=f(x)$ eventually gets closer and closer to the line $y=x$ as $x \rightarrow+\infty$ or as $x \rightarrow-\infty$. The line $y=x$ is called an oblique or slant asymptote of $f$. Similarly, the graph of $y=g(x)$ eventually gets closer and closer to the parabola $y=x^{2}$ as $x \rightarrow+\infty$ or as $x \rightarrow-\infty$. The parabola is called a curvilinear asymptote of $g$. The graphs of the functions in (1) are shown in Figures 4.3.3 and 4.3.4.
L11544: In general, if $f(x)=P(x) / Q(x)$ is a rational function, then we can find quotient and remainder polynomials $q(x)$ and $r(x)$ such that
L11546: $$
L11547: f(x)=q(x)+\frac{r(x)}{Q(x)}
L11548: $$
L11550: and the degree of $r(x)$ is less than the degree of $Q(x)$. Then $r(x) / Q(x) \rightarrow 0$ as $x \rightarrow+\infty$ and as $x \rightarrow-\infty$, so $y=q(x)$ is an asymptote of $f$. This asymptote will be an oblique line if the degree of $P(x)$ is one greater than the degree of $Q(x)$, and it will be curvilinear if the degree of $P(x)$ exceeds that of $Q(x)$ by two or more. Problems involving these kinds of asymptotes are given in the exercises (Exercises 17 and 18).
L11552: - Figure 4.3.5
L11554: The steps that are used to sketch the graph of a rational function can serve as guidelines for sketching graphs of other types of functions. This is illustrated in Examples 3, 4, and 5.
L11556: ## GRAPHS WITH VERTICAL TANGENTS AND CUSPS
L11558: Figure 4.3.5 shows four curve elements that are commonly found in graphs of functions that involve radicals or fractional exponents. In all four cases, the function is not differentiable at $x_{0}$ because the secant line through $\left(x_{0}, f\left(x_{0}\right)\right)$ and $(x, f(x))$ approaches a vertical position as $x$ approaches $x_{0}$ from either side. Thus, in each case, the curve has a vertical tangent line at ( $x_{0}, f\left(x_{0}\right)$ ). In parts ( $a$ ) and ( $b$ ) of the figure, there is an inflection point at $x_{0}$ because there is a change in concavity at that point. In parts ( $c$ ) and ( $d$ ), where $f^{\prime}(x)$ approaches $+\infty$ from one side of $x_{0}$ and $-\infty$ from the other side, we say that the graph has a cusp at $x_{0}$.
L11559: [FIGURE:3368dc5a142b1d93 | A graph shows an S-shaped curve that is monotonically increasing. A horizontal axis is present, labeled with $x_0$ at a specific point. A vertical dashed red line passes through $x_0$. The curve...]
L11561: $$
L11562: \begin{aligned}
L11563: & \lim _{x \rightarrow x_{0}^{+}} f^{\prime}(x)=+\infty \\
L11564: & \lim _{x \rightarrow x_{0}^{-}} f^{\prime}(x)=+\infty
L11565: \end{aligned}
L11566: $$
L11568: (a)
L11570: [FIGURE:16b332ed19315479 | A graph displays a smooth, decreasing curve that approaches a vertical tangent line at $x = x_0$. The horizontal axis is marked with $x_0$ at the point where the vertical tangent occurs. Below the...]
L11571: (b)
L11573: [FIGURE:8ff3e59526693867 | A graph displays a blue curve forming a sharp peak, or cusp, at its highest point. A dashed vertical line passes through this cusp and intersects the horizontal axis at $x_0$. This figure illustrates...]
L11575: $$
L11576: \begin{aligned}
L11577: & \lim _{x \rightarrow x_{0}^{+}} f^{\prime}(x)=-\infty \\
L11578: & \lim _{x \rightarrow x_{0}^{-}} f^{\prime}(x)=+\infty
L11579: \end{aligned}
L11580: $$
L11582: (c)
L11584: [FIGURE:0bf3b74ad21db244 | A graph displays a V-shaped curve with a cusp at $x = x_0$, where it touches the horizontal x-axis. A vertical dashed line passes through $x_0$. Below the graph, a gray box contains two limit...]
L11585: (d)
L11587: Example 3 Sketch the graph of $y=(x-4)^{2 / 3}$.
L11589: - Symmetries: There are no symmetries about the coordinate axes or the origin (verify). However, the graph of $y=(x-4)^{2 / 3}$ is symmetric about the line $x=4$ since it is a translation (4 units to the right) of the graph of $y=x^{2 / 3}$, which is symmetric about the $y$-axis.
L11590: - $x$ - and $y$-intercepts: Setting $y=0$ yields the $x$-intercept $x=4$. Setting $x=0$ yields the $y$-intercept $y=\sqrt[3]{16} \approx 2.5$.
L11591: - Vertical asymptotes: None, since $f(x)=(x-4)^{2 / 3}$ is continuous everywhere.
L11592: - End behavior: The graph has no horizontal asymptotes since
L11594: $$
L11595: \lim _{x \rightarrow+\infty}(x-4)^{2 / 3}=+\infty \quad \text { and } \quad \lim _{x \rightarrow-\infty}(x-4)^{2 / 3}=+\infty
L11596: $$
L11598: - Derivatives:
L11600: $$
L11601: \begin{aligned}
L11602: & \frac{d y}{d x}=f^{\prime}(x)=\frac{2}{3}(x-4)^{-1 / 3}=\frac{2}{3(x-4)^{1 / 3}} \\
L11603: & \frac{d^{2} y}{d x^{2}}=f^{\prime \prime}(x)=-\frac{2}{9}(x-4)^{-4 / 3}=-\frac{2}{9(x-4)^{4 / 3}}
L11604: \end{aligned}
L11605: $$
L11607: - Vertical tangent lines: There is a vertical tangent line and cusp at $x=4$ of the type in Figure 4.3.5d since $f(x)=(x-4)^{2 / 3}$ is continuous at $x=4$ and
L11609: $$
L11610: \begin{aligned}
L11611: & \lim _{x \rightarrow 4^{+}} f^{\prime}(x)=\lim _{x \rightarrow 4^{+}} \frac{2}{3(x-4)^{1 / 3}}=+\infty \\
L11612: & \lim _{x \rightarrow 4^{-}} f^{\prime}(x)=\lim _{x \rightarrow 4^{-}} \frac{2}{3(x-4)^{1 / 3}}=-\infty
L11613: \end{aligned}
L11614: $$
L11616: Conclusions and graph:
L11618: - The function $f(x)=(x-4)^{2 / 3}=\left((x-4)^{1 / 3}\right)^{2}$ is nonnegative for all $x$. There is a zero for $f$ at $x=4$.
L11619: - There is a critical point at $x=4$ since $f$ is not differentiable there. We saw above that a cusp occurs at this point. The sign analysis of $d y / d x$ in Figure 4.3.6 $a$ and the first derivative test show that there is a relative minimum at this cusp since $f^{\prime}(x)<0$ if $x<4$ and $f^{\prime}(x)>0$ if $x>4$.
L11620: - The sign analysis of $d^{2} y / d x^{2}$ in Figure 4.3.6a shows that the graph is concave down on both sides of the cusp.
L11622: The graph is shown in Figure 4.3.6b.
L11624: Figure 4.3.6
L11625: [FIGURE:4e5b71cfdc6f7721 | The figure illustrates the properties of the function $y = (x-4)^{2/3}$ through sign analysis and its graph. Part (a) presents three number lines: the first shows that $y$ is positive everywhere...]
L11627: Example 4 Sketch the graph of $y=6 x^{1 / 3}+3 x^{4 / 3}$.
L11628: Solution. It will help in our analysis to write
L11630: $$
L11631: f(x)=6 x^{1 / 3}+3 x^{4 / 3}=3 x^{1 / 3}(2+x)
L11632: $$
L11634: - Symmetries: There are no symmetries about the coordinate axes or the origin (verify).
L11635: - $x$ - and $y$-intercepts: Setting $y=3 x^{1 / 3}(2+x)=0$ yields the $x$-intercepts $x=0$ and $x=-2$. Setting $x=0$ yields the $y$-intercept $y=0$.
L11636: - Vertical asymptotes: None, since $f(x)=6 x^{1 / 3}+3 x^{4 / 3}$ is continuous everywhere.
L11637: - End behavior: The graph has no horizontal asymptotes since
L11639: $$
L11640: \begin{aligned}
L11641: & \lim _{x \rightarrow+\infty}\left(6 x^{1 / 3}+3 x^{4 / 3}\right)=\lim _{x \rightarrow+\infty} 3 x^{1 / 3}(2+x)=+\infty \\
L11642: & \lim _{x \rightarrow-\infty}\left(6 x^{1 / 3}+3 x^{4 / 3}\right)=\lim _{x \rightarrow-\infty} 3 x^{1 / 3}(2+x)=+\infty
L11643: \end{aligned}
L11644: $$
L11646: - Derivatives:
L11648: $$
L11649: \begin{aligned}
L11650: & \frac{d y}{d x}=f^{\prime}(x)=2 x^{-2 / 3}+4 x^{1 / 3}=2 x^{-2 / 3}(1+2 x)=\frac{2(2 x+1)}{x^{2 / 3}} \\
L11651: & \frac{d^{2} y}{d x^{2}}=f^{\prime \prime}(x)=-\frac{4}{3} x^{-5 / 3}+\frac{4}{3} x^{-2 / 3}=\frac{4}{3} x^{-5 / 3}(-1+x)=\frac{4(x-1)}{3 x^{5 / 3}}
L11652: \end{aligned}
L11653: $$
L11655: - Vertical tangent lines: There is a vertical tangent line at $x=0$ since $f$ is continuous there and
L11657: $$
L11658: \begin{aligned}
L11659: & \lim _{x \rightarrow 0^{+}} f^{\prime}(x)=\lim _{x \rightarrow 0^{+}} \frac{2(2 x+1)}{x^{2 / 3}}=+\infty \\
L11660: & \lim _{x \rightarrow 0^{-}} f^{\prime}(x)=\lim _{x \rightarrow 0^{-}} \frac{2(2 x+1)}{x^{2 / 3}}=+\infty
L11661: \end{aligned}
L11662: $$
L11664: This and the change in concavity at $x=0$ mean that $(0,0)$ is an inflection point of the type in Figure 4.3.5a.
L11666: ## TECHNOLOGY MASTERY
L11668: The graph in Figure 4.3.7b was generated with a graphing utility. However, the inflection point at $x=1$ is so subtle that it is not evident from this graph. See if you can produce a version of this graph with your graphing utility that makes the inflection point evident.
L11670: ## Conclusions and graph:
L11672: - From the sign analysis of $y$ in Figure 4.3.7a, the graph is below the $x$-axis between the $x$-intercepts $x=-2$ and $x=0$ and is above the $x$-axis if $x<-2$ or $x>0$.
L11673: - From the formula for $d y / d x$ we see that there is a stationary point at $x=-\frac{1}{2}$ and a critical point at $x=0$ at which $f$ is not differentiable. We saw above that a vertical tangent line and inflection point are at that critical point.
L11674: - The sign analysis of $d y / d x$ in Figure 4.3.7a and the first derivative test show that there is a relative minimum at the stationary point at $x=-\frac{1}{2}$ (verify).
L11675: - The sign analysis of $d^{2} y / d x^{2}$ in Figure 4.3.7a shows that in addition to the inflection point at the vertical tangent there is an inflection point at $x=1$ at which the graph changes from concave down to concave up.
L11677: The graph is shown in Figure 4.3.7b.
L11679: [FIGURE:c17a455e825fc3d8 | Three horizontal number lines, each labeled $x$, illustrate the sign analysis for the function $y = 3x^{1/3}(2+x)$ and its derivatives. The top line shows $y$ is positive for $x < -2$ and $x > 0$...]
L11680: (a)
L11682: [FIGURE:bed12060a4ef9c02 | The graph of the function $y = 6x^{1/3} + 3x^{4/3}$ is displayed on a coordinate plane. The curve descends from the second quadrant, crosses the x-axis at $x=-2$, reaches a local minimum near $(-0.5...]
L11683: (b)
L11685: - Figure 4.3.7
L11688: ## GRAPHING OTHER KINDS OF FUNCTIONS
L11690: We have discussed methods for graphing polynomials, rational functions, and functions with cusps and vertical tangent lines. The same calculus tools that we used to analyze these functions can also be used to analyze and graph trigonometric functions, logarithmic and exponential functions, and an endless variety of other kinds of functions.
L11692: Example 5 Sketch the graph of $y=e^{-x^{2} / 2}$ and identify the locations of all relative extrema and inflection points.
L11694: ## Solution.
L11696: - Symmetries: Replacing $x$ by $-x$ does not change the equation, so the graph is symmetric about the $y$-axis.
L11697: - $x$ - and $y$-intercepts: Setting $y=0$ leads to the equation $e^{-x^{2} / 2}=0$, which has no solutions since all powers of $e$ have positive values. Thus, there are no $x$-intercepts. Setting $x=0$ yields the $y$-intercept $y=1$.
L11698: - Vertical asymptotes: There are no vertical asymptotes since $e^{-x^{2} / 2}$ is continuous on $(-\infty,+\infty)$.
L11699: - End behavior: The $x$-axis ( $y=0$ ) is a horizontal asymptote since
L11701: $$
L11702: \lim _{x \rightarrow-\infty} e^{-x^{2} / 2}=\lim _{x \rightarrow+\infty} e^{-x^{2} / 2}=0
L11703: $$
L11705: - Derivatives:
L11707: $$
L11708: \begin{aligned}
L11709: \frac{d y}{d x} & =e^{-x^{2} / 2} \frac{d}{d x}\left[-\frac{x^{2}}{2}\right]=-x e^{-x^{2} / 2} \\
L11710: \frac{d^{2} y}{d x^{2}} & =-x \frac{d}{d x}\left[e^{-x^{2} / 2}\right]+e^{-x^{2} / 2} \frac{d}{d x}[-x] \\
L11711: & =x^{2} e^{-x^{2} / 2}-e^{-x^{2} / 2}=\left(x^{2}-1\right) e^{-x^{2} / 2}
L11712: \end{aligned}
L11713: $$
