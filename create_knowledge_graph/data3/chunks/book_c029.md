L10188: $$
L10189: \frac{d}{d x}\left(e^{x}\right)=e^{x}
L10190: $$
L10192: [FIGURE:df0afb5996eb2708 | A photograph shows a large offshore oil-drilling rig standing in calm blue ocean water under a clear sky. The rig is a complex structure with a tall white drilling tower, several cranes, and a...]
L10194: ## THE DERIVATIVE IN GRAPHING AND APPLICATIONS
L10196: Stone/Getty Images
L10198: Derivatives can help to find the most cost-effective location for an offshore oil-drilling rig.
L10200: In this chapter we will study various applications of the derivative. For example, we will use methods of calculus to analyze functions and their graphs. In the process, we will show how calculus and graphing utilities, working together, can provide most of the important information about the behavior of functions. Another important application of the derivative will be in the solution of optimization problems. For example, if time is the main consideration in a problem, we might be interested in finding the quickest way to perform a task, and if cost is the main consideration, we might be interested in finding the least expensive way to perform a task. Mathematically, optimization problems can be reduced to finding the largest or smallest value of a function on some interval, and determining where the largest or smallest value occurs. Using the derivative, we will develop the mathematical tools necessary for solving such problems. We will also use the derivative to study the motion of a particle moving along a line, and we will show how the derivative can help us to approximate solutions of equations.
L10202: ### 4.1 ANALYSIS OF FUNCTIONS I: INCREASE, DECREASE, AND CONCAVITY
L10204: Although graphing utilities are useful for determining the general shape of a graph, many problems require more precision than graphing utilities are capable of producing. The purpose of this section is to develop mathematical tools that can be used to determine the exact shape of a graph and the precise locations of its key features.
L10206: ## INCREASING AND DECREASING FUNCTIONS
L10208: The terms increasing, decreasing, and constant are used to describe the behavior of a function as we travel left to right along its graph. For example, the function graphed in Figure 4.1.1 can be described as increasing to the left of $x=0$, decreasing from $x=0$ to $x=2$, increasing from $x=2$ to $x=4$, and constant to the right of $x=4$.
L10210: Figure 4.1.1
L10211: [FIGURE:420d3aa8df5c0489 | A graph of a function $f(x)$ is shown on an x-axis, illustrating intervals where the function is increasing, decreasing, or constant. The curve rises for $x < 0$ and between $x=2$ and $x=4$...]
L10213: The definitions of "increasing," "decreasing," and "constant" describe the behavior of a function on an interval and not at a point. In particular, it is not inconsistent to say that the function in Figure 4.1.1 is decreasing on the interval $[0,2]$ and increasing on the interval $[2,4]$.
L10215: - Figure 4.1.2
L10216: - Figure 4.1.3
L10218: Observe that the derivative conditions in Theorem 4.1.2 are only required to hold inside the interval $[a, b]$, even though the conclusions apply to the entire interval.
L10220: [FIGURE:666188ca2876b19c | A graph in the first quadrant shows an increasing, concave-down blue curve labeled $y$ versus $x$. Four blue points are marked on the curve, and short red line segments connect these points...]
L10221: Each tangent line has positive slope.
L10223: [FIGURE:8241b8911ff4c0fd | A graph on an $xy$-coordinate system shows a smooth blue curve that generally decreases in the first quadrant. A red piecewise linear path, consisting of straight line segments, approximates the blue...]
L10224: Each tangent line has negative slope.
L10226: The following definition, which is illustrated in Figure 4.1.2, expresses these intuitive ideas precisely.
L10227: 4.1.1 DEFINITION Let $f$ be defined on an interval, and let $x_{1}$ and $x_{2}$ denote points in that interval.
L10228: (a) $f$ is increasing on the interval if $f\left(x_{1}\right)<f\left(x_{2}\right)$ whenever $x_{1}<x_{2}$.
L10229: [FIGURE:07df9250ae3f4876 | A graph in the first quadrant displays a horizontal line segment, representing a constant function, above the x-axis. This segment is visually defined by two vertical dashed lines extending from the...]
L10231: Each tangent line has zero slope.
L10232: (b) $f$ is decreasing on the interval if $f\left(x_{1}\right)>f\left(x_{2}\right)$ whenever $x_{1}<x_{2}$.
L10233: (c) $\quad f$ is constant on the interval if $f\left(x_{1}\right)=f\left(x_{2}\right)$ for all points $x_{1}$ and $x_{2}$.
L10234: [FIGURE:7aa4ea3ed25f7653 | The figure presents three graphs, each illustrating a different type of function behavior. Graph (a) shows an increasing function, where for $x_1 < x_2$, the corresponding function values satisfy...]
L10236: Figure 4.1.3 suggests that a differentiable function $f$ is increasing on any interval where each tangent line to its graph has positive slope, is decreasing on any interval where each tangent line to its graph has negative slope, and is constant on any interval where each tangent line to its graph has zero slope. This intuitive observation suggests the following important theorem that will be proved in Section 4.8.
L10237: 4.1.2 THEOREM Let $f$ be a function that is continuous on a closed interval $[a, b]$ and differentiable on the open interval ( $a, b$ ).
L10238: (a) If $f^{\prime}(x)>0$ for every value of $x$ in ( $a, b$ ), then $f$ is increasing on $[a, b]$.
L10239: (b) If $f^{\prime}(x)<0$ for every value of $x$ in ( $a, b$ ), then $f$ is decreasing on $[a, b]$.
L10240: (c) If $f^{\prime}(x)=0$ for every value of $x$ in $(a, b)$, then $f$ is constant on $[a, b]$.
L10242: Although stated for closed intervals, Theorem 4.1.2 is applicable on any interval on which $f$ is continuous. For example, if $f$ is continuous on $[a,+\infty)$ and $f^{\prime}(x)>0$ on $(a,+\infty)$, then $f$ is increasing on $[a,+\infty)$; and if $f$ is continuous on $(-\infty,+\infty)$ and $f^{\prime}(x)<0$ on $(-\infty,+\infty)$, then $f$ is decreasing on $(-\infty,+\infty)$.
L10244: [FIGURE:84f36b09342db04e | A blue parabola, representing the function $f(x) = x^2 - 4x + 3$, is plotted on a Cartesian coordinate system. The parabola opens upwards, with its vertex at $(2, -1)$, intersecting the y-axis at...]
L10245: Figure 4.1.4
L10247: [FIGURE:0e0682e034c849e7 | The graph displays the function $f(x) = x^3$ in a Cartesian coordinate system. The x-axis is labeled 'x' with tick marks at -3 and 3, and the y-axis is labeled 'y' with tick marks at -4 and 4. The...]
L10248: Figure 4.1.5
L10250: [FIGURE:38ba1c5cba3cd084 | A graph of a function $y=f(x)$ is shown on a Cartesian coordinate system with labeled x and y axes. The blue curve illustrates a differentiable function that has two local minima and one local...]
L10251: Figure 4.1.6
L10253: $$
L10254: f(x)=3 x^{4}+4 x^{3}-12 x^{2}+2
L10255: $$
L10257: Example 1 Find the intervals on which $f(x)=x^{2}-4 x+3$ is increasing and the intervals on which it is decreasing.
L10259: Solution. The graph of $f$ in Figure 4.1.4 suggests that $f$ is decreasing for $x \leq 2$ and increasing for $x \geq 2$. To confirm this, we analyze the sign of $f^{\prime}$. The derivative of $f$ is
L10261: $$
L10262: f^{\prime}(x)=2 x-4=2(x-2)
L10263: $$
L10265: It follows that
L10267: $$
L10268: \begin{array}{lll}
L10269: f^{\prime}(x)<0 & \text { if } & x<2 \\
L10270: f^{\prime}(x)>0 & \text { if } & 2<x
L10271: \end{array}
L10272: $$
L10274: Since $f$ is continuous everywhere, it follows from the comment after Theorem 4.1.2 that
L10276: ```
L10277: f is decreasing on ( - - , 2]
L10278: f is increasing on [2,+\infty)
L10279: ```
L10281: These conclusions are consistent with the graph of $f$ in Figure 4.1.4.
L10283: Example 2 Find the intervals on which $f(x)=x^{3}$ is increasing and the intervals on which it is decreasing.
L10285: Solution. The graph of $f$ in Figure 4.1.5 suggests that $f$ is increasing over the entire $x$-axis. To confirm this, we differentiate $f$ to obtain $f^{\prime}(x)=3 x^{2}$. Thus,
L10287: $$
L10288: \begin{array}{lll}
L10289: f^{\prime}(x)>0 & \text { if } & x<0 \\
L10290: f^{\prime}(x)>0 & \text { if } & 0<x
L10291: \end{array}
L10292: $$
L10294: Since $f$ is continuous everywhere,
L10296: ```
L10297: f is increasing on ( - \infty, 0]
L10298: f is increasing on [0, +\infty)
L10299: ```
L10301: Since $f$ is increasing on the adjacent intervals $(-\infty, 0]$ and $[0,+\infty)$, it follows that $f$ is increasing on their union ( $-\infty,+\infty$ ) (see Exercise 59).
L10303: ## Example 3
L10305: (a) Use the graph of $f(x)=3 x^{4}+4 x^{3}-12 x^{2}+2$ in Figure 4.1.6 to make a conjecture about the intervals on which $f$ is increasing or decreasing.
L10306: (b) Use Theorem 4.1.2 to determine whether your conjecture is correct.
L10308: Solution (a). The graph suggests that the function $f$ is decreasing if $x \leq-2$, increasing if $-2 \leq x \leq 0$, decreasing if $0 \leq x \leq 1$, and increasing if $x \geq 1$.
L10310: Solution (b). Differentiating $f$ we obtain
L10312: $$
L10313: f^{\prime}(x)=12 x^{3}+12 x^{2}-24 x=12 x\left(x^{2}+x-2\right)=12 x(x+2)(x-1)
L10314: $$
L10316: The sign analysis of $f^{\prime}$ in Table 4.1.1 can be obtained using the method of test points discussed in Web Appendix E. The conclusions in Table 4.1.1 confirm the conjecture in part (a).
L10318: [FIGURE:bb883ad74bead4e4 | The figure illustrates the concepts of concave up and concave down using a single blue curve. The left portion of the curve, which has an upward curvature, is labeled "Concave up 'holds water'" and...]
L10319: - Figure 4.1.7
L10321: [FIGURE:115172a3c4b5b47e | Two graphs illustrate the concepts of concavity. The top graph displays a curve that is concave up, with a green shaded region above it, and shows tangent lines whose slopes are increasing from left...]
L10322: Figure 4.1.8
L10324: Table 4.1.1
L10325: | INTERVAL | $(12 x)(x+2)(x-1)$ | $f^{\prime}(x)$ | CONCLUSION |
L10326: | :---: | :---: | :---: | :--- |
L10327: | $x<-2$ | $(-)(-)(-)$ | - | $f$ is decreasing on $(-\infty,-2]$ |
L10328: | $-2<x<0$ | $(-)(+)(-)$ | + | $f$ is increasing on $[-2,0]$ |
L10329: | $0<x<1$ | $(+)(+)(-)$ | - | $f$ is decreasing on $[0,1]$ |
L10330: | $1<x$ | $(+)(+)(+)$ | + | $f$ is increasing on $[1,+\infty)$ |
L10333: ## CONCAVITY
L10335: Although the sign of the derivative of $f$ reveals where the graph of $f$ is increasing or decreasing, it does not reveal the direction of curvature. For example, the graph is increasing on both sides of the point in Figure 4.1.7, but on the left side it has an upward curvature ("holds water") and on the right side it has a downward curvature ("spills water"). On intervals where the graph of $f$ has upward curvature we say that $f$ is concave up, and on intervals where the graph has downward curvature we say that $f$ is concave down.
L10337: Figure 4.1.8 suggests two ways to characterize the concavity of a differentiable function $f$ on an open interval:
L10339: - $f$ is concave up on an open interval if its tangent lines have increasing slopes on that interval and is concave down if they have decreasing slopes.
L10340: - $f$ is concave up on an open interval if its graph lies above its tangent lines on that interval and is concave down if it lies below its tangent lines.
L10342: Our formal definition for "concave up" and "concave down" corresponds to the first of these characterizations.
L10343: 4.1.3 DEFINITION If $f$ is differentiable on an open interval, then $f$ is said to be concave up on the open interval if $f^{\prime}$ is increasing on that interval, and $f$ is said to be concave down on the open interval if $f^{\prime}$ is decreasing on that interval.
L10345: Since the slopes of the tangent lines to the graph of a differentiable function $f$ are the values of its derivative $f^{\prime}$, it follows from Theorem 4.1.2 (applied to $f^{\prime}$ rather than $f$ ) that $f^{\prime}$ will be increasing on intervals where $f^{\prime \prime}$ is positive and that $f^{\prime}$ will be decreasing on intervals where $f^{\prime \prime}$ is negative. Thus, we have the following theorem.
L10346: 4.1.4 THEOREM Let $f$ be twice differentiable on an open interval.
L10347: (a) If $f^{\prime \prime}(x)>0$ for every value of $x$ in the open interval, then $f$ is concave up on that interval.
L10348: (b) If $f^{\prime \prime}(x)<0$ for every value of $x$ in the open interval, then $f$ is concave down on that interval.
L10350: Example 4 Figure 4.1.4 suggests that the function $f(x)=x^{2}-4 x+3$ is concave up on the interval $(-\infty,+\infty)$. This is consistent with Theorem 4.1.4, since $f^{\prime}(x)=2 x-4$ and $f^{\prime \prime}(x)=2$, so
L10352: $$
L10353: f^{\prime \prime}(x)>0 \quad \text { on the interval }(-\infty,+\infty)
L10354: $$
L10356: Also, Figure 4.1.5 suggests that $f(x)=x^{3}$ is concave down on the interval ( $-\infty, 0$ ) and concave up on the interval $(0,+\infty)$. This agrees with Theorem 4.1.4, since $f^{\prime}(x)=3 x^{2}$ and $f^{\prime \prime}(x)=6 x$, so
L10358: $$
L10359: f^{\prime \prime}(x)<0 \quad \text { if } x<0 \quad \text { and } \quad f^{\prime \prime}(x)>0 \quad \text { if } x>0
L10360: $$
L10362: ## INFLECTION POINTS
L10364: We see from Example 4 and Figure 4.1.5 that the graph of $f(x)=x^{3}$ changes from concave down to concave up at $x=0$. Points where a curve changes from concave up to concave down or vice versa are of special interest, so there is some terminology associated with them.
L10366: [FIGURE:fa860a46762a0fe2 | The figure displays two graphs illustrating inflection points and changes in concavity. The top graph shows a curve that is concave up (shaded light blue) to the left of $x_0$ and concave down...]
L10367: - Figure 4.1.9
L10369: [FIGURE:1c92287c2e586cd1 | A graph displays the function $f(x) = x^3 - 3x^2 + 1$ on an $xy$-coordinate system. The curve increases to a local maximum at approximately $(0, 1)$, then decreases to a local minimum around $(2...]
L10370: - Figure 4.1.10
L10372: 4.1.5 DEFINITION If $f$ is continuous on an open interval containing a value $x_{0}$, and if $f$ changes the direction of its concavity at the point $\left(x_{0}, f\left(x_{0}\right)\right)$, then we say that $f$ has an inflection point at $\boldsymbol{x}_{\mathbf{0}}$, and we call the point $\left(x_{0}, f\left(x_{0}\right)\right)$ on the graph of $f$ an inflection point of $f$ (Figure 4.1.9).
L10374: - Example 5 Figure 4.1.10 shows the graph of the function $f(x)=x^{3}-3 x^{2}+1$. Use the first and second derivatives of $f$ to determine the intervals on which $f$ is increasing, decreasing, concave up, and concave down. Locate all inflection points and confirm that your conclusions are consistent with the graph.
L10376: Solution. Calculating the first two derivatives of $f$ we obtain
L10378: $$
L10379: \begin{aligned}
L10380: & f^{\prime}(x)=3 x^{2}-6 x=3 x(x-2) \\
L10381: & f^{\prime \prime}(x)=6 x-6=6(x-1)
L10382: \end{aligned}
L10383: $$
L10385: The sign analysis of these derivatives is shown in the following tables:
L10387: | INTERVAL | $(3 x)(x-2)$ | $f^{\prime}(x)$ | CONCLUSION |
L10388: | :--- | :--- | :--- | :--- |
L10389: | $x<0$ | (-)(-) | + | $f$ is increasing on $(-\infty, 0]$ |
L10390: | $0<x<2$ | (+)(-) | - | $f$ is decreasing on [0,2] |
L10391: | $x>2$ | (+)(+) | + | $f$ is increasing on $[2,+\infty)$ |
L10392: | INTERVAL | $6(x-1)$ | $f^{\prime \prime}(x)$ | CONCLUSION |
L10393: | $x<1$ | (-) | - | $f$ is concave down on $(-\infty, 1)$ |
L10394: | $x>1$ | (+) | + | $f$ is concave up on ( $1,+\infty$ ) |
L10396: The second table shows that there is an inflection point at $x=1$, since $f$ changes from concave down to concave up at that point. The inflection point is $(1, f(1))=(1,-1)$. All of these conclusions are consistent with the graph of $f$.
L10398: One can correctly guess from Figure 4.1.10 that the function $f(x)=x^{3}-3 x^{2}+1$ has an inflection point at $x=1$ without actually computing derivatives. However, sometimes changes in concavity are so subtle that calculus is essential to confirm their existence and identify their location. Here is an example.
L10400: [FIGURE:5d7e631af8f01d1d | A Cartesian coordinate system shows the graph of the function $f(x)=xe^{-x}$. The blue curve starts in the third quadrant, passes through the origin $(0,0)$, increases to a local maximum around $x=1$...]
L10401: Figure 4.1.11
L10403: $$
L10404: f(x)=x e^{-x}
L10405: $$
L10407: [FIGURE:0f439f9930fea059 | A Cartesian coordinate system displays the graph of the function $f(x) = x + 2 \sin x$. The x-axis is labeled with tick marks at $0, \pi/2, \pi, 3\pi/2,$ and $2\pi$, while the y-axis has tick marks...]
L10408: Figure 4.1.12
L10410: Example 6 Figure 4.1.11 suggests that the function $f(x)=x e^{-x}$ has an inflection point but its exact location is not evident from the graph in this figure. Use the first and second derivatives of $f$ to determine the intervals on which $f$ is increasing, decreasing, concave up, and concave down. Locate all inflection points.
L10412: Solution. Calculating the first two derivatives of $f$ we obtain (verify)
L10414: $$
L10415: \begin{aligned}
L10416: f^{\prime}(x) & =(1-x) e^{-x} \\
L10417: f^{\prime \prime}(x) & =(x-2) e^{-x}
L10418: \end{aligned}
L10419: $$
L10421: Keeping in mind that $e^{-x}$ is positive for all $x$, the sign analysis of these derivatives is easily determined:
L10423: | INTERVAL | $(1-x)\left(e^{-x}\right)$ | $f^{\prime}(x)$ | CONCLUSION |
L10424: | :---: | :---: | :---: | :---: |
L10425: | $x<1$ | $(+)(+)$ | + | $f$ is increasing on $(-\infty, 1]$ |
L10426: | $x>1$ | $(-)(+)$ | - | $f$ is decreasing on $[1,+\infty)$ |
L10429: | INTERVAL | $(x-2)\left(e^{-x}\right)$ | $f^{\prime \prime}(x)$ | CONCLUSION |
L10430: | :---: | :---: | :---: | :---: |
L10431: | $x<2$ | $(-)(+)$ | - | $f$ is concave down on $(-\infty, 2)$ |
L10432: | $x>2$ | $(+)(+)$ | + | $f$ is concave up on $(2,+\infty)$ |
L10434: The second table shows that there is an inflection point at $x=2$, since $f$ changes from concave down to concave up at that point. All of these conclusions are consistent with the graph of $f$.
L10436: Example 7 Figure 4.1.12 shows the graph of the function $f(x)=x+2 \sin x$ over the interval $[0,2 \pi]$. Use the first and second derivatives of $f$ to determine where $f$ is increasing, decreasing, concave up, and concave down. Locate all inflection points and confirm that your conclusions are consistent with the graph.
L10438: Solution. Calculating the first two derivatives of $f$ we obtain
L10440: $$
L10441: \begin{aligned}
L10442: f^{\prime}(x) & =1+2 \cos x \\
L10443: f^{\prime \prime}(x) & =-2 \sin x
L10444: \end{aligned}
L10445: $$
L10447: Since $f^{\prime}$ is a continuous function, it changes sign on the interval ( $0,2 \pi$ ) only at points where $f^{\prime}(x)=0$ (why?). These values are solutions of the equation
L10449: $$
L10450: 1+2 \cos x=0 \quad \text { or equivalently } \quad \cos x=-\frac{1}{2}
L10451: $$
L10453: There are two solutions of this equation in the interval ( $0,2 \pi$ ), namely, $x=2 \pi / 3$ and $x=4 \pi / 3$ (verify). Similarly, $f^{\prime \prime}$ is a continuous function, so its sign changes in the interval ( $0,2 \pi$ ) will occur only at values of $x$ for which $f^{\prime \prime}(x)=0$. These values are solutions of the equation
L10455: $$
L10456: -2 \sin x=0
L10457: $$
L10459: The signs in the two tables of Example 7 can be obtained either using the method of test points or using the unit circle definition of the sine and cosine functions.
L10461: [FIGURE:43a1d53cf06f06e3 | A graph of the function $f(x) = x^4$ is shown on a Cartesian coordinate system. The x-axis is labeled 'x' with explicit tick marks at -2 and 2, and the y-axis is labeled 'y' with an explicit tick...]
L10462: Figure 4.1.13
L10464: Give an argument to show that the function $f(x)=x^{4}$ graphed in Figure 4.1.13 is concave up on the interval $(-\infty,+\infty)$.
L10466: There is one solution of this equation in the interval ( $0,2 \pi$ ), namely, $x=\pi$. With the help of these "sign transition points" we obtain the sign analysis shown in the following tables:
L10468: | INTERVAL | $f^{\prime}(x)=1+2 \cos x$ | CONCLUSION |
L10469: | :--- | :--- | :--- |
L10470: | $0<x<2 \pi / 3$ | + | $f$ is increasing on [ $0,2 \pi / 3$ ] |
L10471: | $2 \pi / 3<x<4 \pi / 3$ | - | $f$ is decreasing on $[2 \pi / 3,4 \pi / 3]$ |
L10472: | $4 \pi / 3<x<2 \pi$ | + | $f$ is increasing on $[4 \pi / 3,2 \pi]$ |
L10473: | INTERVAL | $f^{\prime \prime}(x)=-2 \sin x$ | CONCLUSION |
L10474: | $0<x<\pi$ | - | $f$ is concave down on ( $0, \pi$ ) |
L10475: | $\pi<x<2 \pi$ | + | $f$ is concave up on ( $\pi, 2 \pi$ ) |
L10477: The second table shows that there is an inflection point at $x=\pi$, since $f$ changes from concave down to concave up at that point. All of these conclusions are consistent with the graph of $f$.
L10479: In the preceding examples the inflection points of $f$ occurred wherever $f^{\prime \prime}(x)=0$. However, this is not always the case. Here is a specific example.
L10481: - Example 8 Find the inflection points, if any, of $f(x)=x^{4}$.
L10483: Solution. Calculating the first two derivatives of $f$ we obtain
L10485: $$
L10486: \begin{gathered}
L10487: f^{\prime}(x)=4 x^{3} \\
L10488: f^{\prime \prime}(x)=12 x^{2}
L10489: \end{gathered}
L10490: $$
L10492: Since $f^{\prime \prime}(x)$ is positive for $x<0$ and for $x>0$, the function $f$ is concave up on the interval $(-\infty, 0)$ and on the interval ( $0,+\infty$ ). Thus, there is no change in concavity and hence no inflection point at $x=0$, even though $f^{\prime \prime}(0)=0$ (Figure 4.1.13).
L10494: We will see later that if a function $f$ has an inflection point at $x=x_{0}$ and $f^{\prime \prime}\left(x_{0}\right)$ exists, then $f^{\prime \prime}\left(x_{0}\right)=0$. Also, we will see in Section 4.3 that an inflection point may also occur where $f^{\prime \prime}(x)$ is not defined.
L10496: ## INFLECTION POINTS IN APPLICATIONS
L10498: Inflection points of a function $f$ are those points on the graph of $y=f(x)$ where the slopes of the tangent lines change from increasing to decreasing or vice versa (Figure 4.1.14). Since the slope of the tangent line at a point on the graph of $y=f(x)$ can be interpreted as the rate of change of $y$ with respect to $x$ at that point, we can interpret inflection points in the following way:
L10500: Inflection points mark the places on the curve $y=f(x)$ where the rate of change of $y$ with respect to $x$ changes from increasing to decreasing, or vice versa.
L10502: This is a subtle idea, since we are dealing with a change in a rate of change. It can help with your understanding of this idea to realize that inflection points may have interpretations in more familiar contexts. For example, consider the statement "Oil prices rose sharply during the first half of the year but have since begun to level off." If the price of oil is plotted as a function of time of year, this statement suggests the existence of an inflection point
L10504: [FIGURE:b294b83616d248e9 | This figure presents two graphs of a function $y=f(x)$ with tangent lines, demonstrating how the slope changes around an inflection point $x_0$. The top graph illustrates a transition from increasing...]
L10505: - Figure 4.1.14
L10507: [FIGURE:f3030ba6062cd926 | A graph on a $t$-$y$ coordinate plane shows a blue S-shaped curve, representing a logistic growth model. The curve starts with a positive $y$ value and increases, initially concave up, then passing...]
L10508: Logistic growth curve
L10510: - Figure 4.1.16
L10512: [FIGURE:8975e5a20b0cf54a | A graph displays a logistic growth curve, representing the equation $y=\frac{L}{1+A e^{-k t}}$, with time $t$ on the horizontal axis and population $y$ on the vertical axis. The curve begins at the...]
L10513: - Figure 4.1.17
L10515: on the graph near the end of June. (Why?) To give a more visual example, consider the flask shown in Figure 4.1.15. Suppose that water is added to the flask so that the volume increases at a constant rate with respect to the time $t$, and let us examine the rate at which the water level $y$ rises with respect to $t$. Initially, the level $y$ will rise at a slow rate because of the wide base. However, as the diameter of the flask narrows, the rate at which the level $y$ rises will increase until the level is at the narrow point in the neck. From that point on the rate at which the level rises will decrease as the diameter gets wider and wider. Thus, the narrow point in the neck is the point at which the rate of change of $y$ with respect to $t$ changes from increasing to decreasing.
L10517: - Figure 4.1.15
L10518: [FIGURE:c60b40cd9a0ad798 | A diagram illustrates the relationship between the shape of a flask and the rate at which water fills it. On the left, a flask with a wide base, a narrow neck, and a slightly wider top is shown with...]
