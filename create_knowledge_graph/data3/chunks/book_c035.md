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
L11993: ### 4.4 ABSOLUTE MAXIMA AND MINIMA
L11995: At the beginning of Section 4.2 we observed that if the graph of a function $f$ is viewed as a two-dimensional mountain range (Figure 4.2.1), then the relative maxima and minima correspond to the tops of the hills and the bottoms of the valleys; that is, they are the high and low points in their immediate vicinity. In this section we will be concerned with the more encompassing problem of finding the highest and lowest points over the entire mountain range, that is, we will be looking for the top of the highest hill and the bottom of the deepest valley. In mathematical terms, we will be looking for the largest and smallest values of a function over an interval.
L11997: ## ABSOLUTE EXTREMA
L11999: We will begin with some terminology for describing the largest and smallest values of a function on an interval.
L12000: 4.4.1 DEFINITION Consider an interval in the domain of a function $f$ and a point $x_{0}$ in that interval. We say that $f$ has an absolute maximum at $x_{0}$ if $f(x) \leq f\left(x_{0}\right)$ for all $x$ in the interval, and we say that $f$ has an absolute minimum at $x_{0}$ if $f\left(x_{0}\right) \leq f(x)$ for all $x$ in the interval. We say that $f$ has an absolute extremum at $x_{0}$ if it has either an absolute maximum or an absolute minimum at that point.
L12002: If $f$ has an absolute maximum at the point $x_{0}$ on an interval, then $f\left(x_{0}\right)$ is the largest value of $f$ on the interval, and if $f$ has an absolute minimum at $x_{0}$, then $f\left(x_{0}\right)$ is the smallest value of $f$ on the interval. In general, there is no guarantee that a function will actually have an absolute maximum or minimum on a given interval (Figure 4.4.1).
L12004: [FIGURE:ee100e8c6e547d0f | This figure displays five graphs, (a) through (e), illustrating different scenarios for the existence of absolute maxima and minima for a function $f(x)$. Graph (a) shows a wavy curve with an...]
L12005: \$ Figure 4.4.1
L12007: The hypotheses in the Extreme-Value Theorem are essential. That is, if either the interval is not closed or $f$ is not continuous on the interval, then $f$ need not have absolute extrema on the interval (Exercises 4-6).
L12009: ## REMARK
L12011: Theorem 4.4.3 is also valid on infinite open intervals, that is, intervals of the form $(-\infty,+\infty),(a,+\infty)$, and $(-\infty, b)$.
L12013: ## THE EXTREME VALUE THEOREM
L12015: Parts $(a)-(d)$ of Figure 4.4.1 show that a continuous function may or may not have absolute maxima or minima on an infinite interval or on a finite open interval. However, the following theorem shows that a continuous function must have both an absolute maximum and an absolute minimum on every finite closed interval [see part ( $e$ ) of Figure 4.4.1].
L12016: 4.4.2 THEOREM (Extreme-Value Theorem) If a function $f$ is continuous on a finite closed interval $[a, b]$, then $f$ has both an absolute maximum and an absolute minimum on $[a, b]$.
L12018: Although the proof of this theorem is too difficult to include here, you should be able to convince yourself of its validity with a little experimentation-try graphing various continuous functions over the interval $[0,1]$, and convince yourself that there is no way to avoid having a highest and lowest point on a graph. As a physical analogy, if you imagine the graph to be a roller-coaster track starting at $x=0$ and ending at $x=1$, the roller coaster will have to pass through a highest point and a lowest point during the trip.
L12020: The Extreme-Value Theorem is an example of what mathematicians call an existence theorem. Such theorems state conditions under which certain objects exist, in this case absolute extrema. However, knowing that an object exists and finding it are two separate things. We will now address methods for determining the locations of absolute extrema under the conditions of the Extreme-Value Theorem.
L12022: If $f$ is continuous on the finite closed interval $[a, b]$, then the absolute extrema of $f$ occur either at the endpoints of the interval or inside on the open interval $(a, b)$. If the absolute extrema happen to fall inside, then the following theorem tells us that they must occur at critical points of $f$.
L12024: [^2][FIGURE:ee474ddede432c6a | Three graphs illustrate the Extreme Value Theorem for continuous functions on a closed interval $[a, b)$. Graph (a) shows a function with its absolute minimum at $x=a$ and absolute maximum at $x=b$...]
L12025: △ Figure 4.4.2 In part (a) the absolute maximum occurs at an endpoint of $[a, b]$, in part ( $b$ ) it occurs at a stationary point in ( $a, b$ ), and in part ( $c$ ) it occurs at a critical point in ( $a, b$ ) where $f$ is not differentiable.
L12027: [FIGURE:3150ec942a78c31d | A graph of the function $y = 2x^3 - 15x^2 + 36x$ is shown on a coordinate system, with $x$ from 1 to 5 and $y$ from 20 to 55. The dotted curve starts at $(1, 23)$, rises to a local maximum, then...]
L12028: △ Figure 4.4.3
L12030: Table 4.4.1
L12031: | $x$ | -1 | 0 | $\frac{1}{8}$ | 1 |
L12032: | :---: | ---: | ---: | ---: | ---: |
L12033: | $f(x)$ | 9 | 0 | $-\frac{9}{8}$ | 3 |
L12036: PROOF If $f$ has an absolute maximum on $(a, b)$ at $x_{0}$, then $f\left(x_{0}\right)$ is also a relative maximum for $f$; for if $f\left(x_{0}\right)$ is the largest value of $f$ on all $(a, b)$, then $f\left(x_{0}\right)$ is certainly the largest value for $f$ in the immediate vicinity of $x_{0}$. Thus, $x_{0}$ is a critical point of $f$ by Theorem 4.2.2. The proof for absolute minima is similar.
L12038: It follows from this theorem that if $f$ is continuous on the finite closed interval $[a, b]$, then the absolute extrema occur either at the endpoints of the interval or at critical points inside the interval (Figure 4.4.2). Thus, we can use the following procedure to find the absolute extrema of a continuous function on a finite closed interval $[a, b]$.
L12040: ## A Procedure for Finding the Absolute Extrema of a Continuous Function fon a Finite Closed Interval [ $a, b$ ]
L12042: Step 1. Find the critical points of $f$ in ( $a, b$ ).
L12043: Step 2. Evaluate $f$ at all the critical points and at the endpoints $a$ and $b$.
L12044: Step 3. The largest of the values in Step 2 is the absolute maximum value of $f$ on $[a, b]$ and the smallest value is the absolute minimum.
L12046: Example 1 Find the absolute maximum and minimum values of the function $f(x)=2 x^{3}-15 x^{2}+36 x$ on the interval $[1,5]$, and determine where these values occur.
L12048: Solution. Since $f$ is continuous and differentiable everywhere, the absolute extrema must occur either at endpoints of the interval or at solutions to the equation $f^{\prime}(x)=0$ in the open interval $(1,5)$. The equation $f^{\prime}(x)=0$ can be written as
L12050: $$
L12051: 6 x^{2}-30 x+36=6\left(x^{2}-5 x+6\right)=6(x-2)(x-3)=0
L12052: $$
L12054: Thus, there are stationary points at $x=2$ and at $x=3$. Evaluating $f$ at the endpoints, at $x=2$, and at $x=3$ yields
L12056: $$
L12057: \begin{aligned}
L12058: & f(1)=2(1)^{3}-15(1)^{2}+36(1)=23 \\
L12059: & f(2)=2(2)^{3}-15(2)^{2}+36(2)=28 \\
L12060: & f(3)=2(3)^{3}-15(3)^{2}+36(3)=27 \\
L12061: & f(5)=2(5)^{3}-15(5)^{2}+36(5)=55
L12062: \end{aligned}
L12063: $$
L12065: from which we conclude that the absolute minimum of $f$ on $[1,5]$ is 23 , occurring at $x=1$, and the absolute maximum of $f$ on $[1,5]$ is 55 , occurring at $x=5$. This is consistent with the graph of $f$ in Figure 4.4.3.
L12067: Example 2 Find the absolute extrema of $f(x)=6 x^{4 / 3}-3 x^{1 / 3}$ on the interval $[-1,1]$, and determine where these values occur.
L12069: Solution. Note that $f$ is continuous everywhere and therefore the Extreme-Value Theorem guarantees that $f$ has a maximum and a minimum value in the interval $[-1,1]$. Differentiating, we obtain
L12071: $$
L12072: f^{\prime}(x)=8 x^{1 / 3}-x^{-2 / 3}=x^{-2 / 3}(8 x-1)=\frac{8 x-1}{x^{2 / 3}}
L12073: $$
L12075: Thus, $f^{\prime}(x)=0$ at $x=\frac{1}{8}$, and $f^{\prime}(x)$ is undefined at $x=0$. Evaluating $f$ at these critical points and endpoints yields Table 4.4.1, from which we conclude that an absolute minimum value of $-\frac{9}{8}$ occurs at $x=\frac{1}{8}$, and an absolute maximum value of 9 occurs at $x=-1$.
L12077: ## ABSOLUTE EXTREMA ON INFINITE INTERVALS
L12079: We observed earlier that a continuous function may or may not have absolute extrema on an infinite interval (see Figure 4.4.1). However, certain conclusions about the existence of absolute extrema of a continuous function $f$ on $(-\infty,+\infty)$ can be drawn from the behavior of $f(x)$ as $x \rightarrow-\infty$ and as $x \rightarrow+\infty$ (Table 4.4.2).
L12081: Table 4.4.2
L12082: ABSOLUTE EXTREMA ON INFINITE INTERVALS
L12083: | LIMITS | $\begin{aligned} & \lim _{x \rightarrow-\infty} f(x)=+\infty \\ & \lim _{x \rightarrow+\infty} f(x)=+\infty \end{aligned}$ | $\begin{aligned} & \lim _{x \rightarrow-\infty} f(x)=-\infty \\ & \lim _{x \rightarrow+\infty} f(x)=-\infty \end{aligned}$ | $\begin{aligned} & \lim _{x \rightarrow-\infty} f(x)=-\infty \\ & \lim _{x \rightarrow+\infty} f(x)=+\infty \end{aligned}$ | $\begin{aligned} \lim _{x \rightarrow-\infty} f(x) & =+\infty \\ \lim _{x \rightarrow+\infty} f(x) & =-\infty \end{aligned}$ |
L12084: | :--- | :--- | :--- | :--- | :--- |
L12085: | CONCLUSION IF $\boldsymbol{f}$ IS CONTINUOUS EVERYWHERE | $f$ has an absolute minimum but no absolute maximum on $(-\infty,+\infty)$. | $f$ has an absolute maximum but no absolute minimum on $(-\infty,+\infty)$. | $f$ has neither an absolute maximum nor an absolute minimum on $(-\infty,+\infty)$. | $f$ has neither an absolute maximum nor an absolute minimum on $(-\infty,+\infty)$. |
L12086: | GRAPH | [FIGURE:06657a6d1cdb5eab | A graph on an $x$-$y$ coordinate system displays a blue curve that generally decreases, then increases, exhibiting some oscillations. A distinct blue dot on the curve highlights a point that...] | [FIGURE:586e3c99c7d1c722 | A two-dimensional coordinate system displays a blue curve representing a function $y=f(x)$. The curve passes through the origin, has a local minimum in the third quadrant, and a local maximum in the...] | [FIGURE:414667de09aa4f80 | A Cartesian coordinate system displays a continuous, wavy blue curve. The curve starts in the third quadrant, crosses the x-axis, exhibits several local minima and maxima, and then rises into the...] | [FIGURE:ebce698429848c9b | A coordinate system with labeled $x$ and $y$ axes displays a continuous, wavy blue curve. The curve generally decreases from the second quadrant, crosses the $y$-axis, then the $x$-axis in the first...] |
L12089: [FIGURE:0b5d0b8039d59abc | The graph displays the function $p(x) = 3x^4 + 4x^3$ on a Cartesian coordinate system. The curve shows a local minimum at approximately $(-1, -1)$ and an inflection point at the origin $(0, 0)$, both...]
L12090: △ Figure 4.4.4
L12092: Example 3 What can you say about the existence of absolute extrema on ( $-\infty,+\infty$ ) for polynomials?
L12094: Solution. If $p(x)$ is a polynomial of odd degree, then
L12096: $$
L12097: \begin{equation*}
L12098: \lim _{x \rightarrow+\infty} p(x) \text { and } \lim _{x \rightarrow-\infty} p(x) \tag{1}
L12099: \end{equation*}
L12100: $$
L12102: have opposite signs (one is $+\infty$ and the other is $-\infty$ ), so there are no absolute extrema. On the other hand, if $p(x)$ has even degree, then the limits in (1) have the same sign (both $+\infty$ or both $-\infty$ ). If the leading coefficient is positive, then both limits are $+\infty$, and there is an absolute minimum but no absolute maximum; if the leading coefficient is negative, then both limits are $-\infty$, and there is an absolute maximum but no absolute minimum.
L12104: Example 4 Determine by inspection whether $p(x)=3 x^{4}+4 x^{3}$ has any absolute extrema. If so, find them and state where they occur.
L12106: Solution. Since $p(x)$ has even degree and the leading coefficient is positive, $p(x) \rightarrow+\infty$ as $x \rightarrow \pm \infty$. Thus, there is an absolute minimum but no absolute maximum. From Theorem 4.4.3 [applied to the interval $(-\infty,+\infty)$ ], the absolute minimum must occur at a critical point of $p$. Since $p$ is differentiable everywhere, we can find all critical points by solving the equation $p^{\prime}(x)=0$. This equation is
L12108: $$
L12109: 12 x^{3}+12 x^{2}=12 x^{2}(x+1)=0
L12110: $$
L12112: from which we conclude that the critical points are $x=0$ and $x=-1$. Evaluating $p$ at these critical points yields
L12114: $$
L12115: p(0)=0 \quad \text { and } \quad p(-1)=-1
L12116: $$
L12118: Therefore, $p$ has an absolute minimum of -1 at $x=-1$ (Figure 4.4.4).
L12120: ## ABSOLUTE EXTREMA ON OPEN INTERVALS
L12122: We know that a continuous function may or may not have absolute extrema on an open interval. However, certain conclusions about the existence of absolute extrema of a continuous function $f$ on a finite open interval $(a, b)$ can be drawn from the behavior of $f(x)$ as $x \rightarrow a^{+}$and as $x \rightarrow b^{-}$(Table 4.4.3). Similar conclusions can be drawn for intervals of the form $(-\infty, b)$ or $(a,+\infty)$.
L12124: Table 4.4.3
L12125: ABSOLUTE EXTREMA ON OPEN INTERVALS
L12126: | LIMITS | $\begin{aligned} & \lim _{x \rightarrow a^{+}} f(x)=+\infty \\ & \lim _{x \rightarrow b^{-}} f(x)=+\infty \end{aligned}$ | $\begin{aligned} & \lim _{x \rightarrow a^{+}} f(x)=-\infty \\ & \lim _{x \rightarrow b^{-}} f(x)=-\infty \end{aligned}$ | $\begin{aligned} & \lim _{x \rightarrow a^{+}} f(x)=-\infty \\ & \lim _{x \rightarrow b^{-}} f(x)=+\infty \end{aligned}$ | $\begin{aligned} & \lim _{x \rightarrow a^{+}} f(x)=+\infty \\ & \lim _{x \rightarrow b^{-}} f(x)=-\infty \end{aligned}$ |
L12127: | :--- | :--- | :--- | :--- | :--- |
L12128: | CONCLUSION IF $\boldsymbol{f}$ is continuous ON $(a, b)$ | $f$ has an absolute minimum but no absolute maximum on ( $a, b$ ). | $f$ has an absolute maximum but no absolute minimum on ( $a, b$ ). | $f$ has neither an absolute maximum nor an absolute minimum on $(a, b)$. | $f$ has neither an absolute maximum nor an absolute minimum on $(a, b)$. |
L12129: | GRAPH | [FIGURE:2ce1f7d552226d9b | A graph displays a continuous function on an open interval $(a,b)$. The horizontal axis is labeled $x$. A blue curve starts high near the vertical dashed line at $x=a$, decreases to an absolute...] | [FIGURE:428ba858db2989fb | A graph displays a continuous blue curve on an x-axis, bounded by vertical dashed lines at $x=a$ and $x=b$. The curve starts below the x-axis at $x=a$, rises to an absolute maximum point marked by a...] | [FIGURE:96c2c85cb523abc2 | A graph displays a continuous blue curve, representing a function $y=f(x)$, on an x-axis. Vertical dashed lines mark the open interval $(a, b)$ on the x-axis. The curve illustrates a continuous...] | [FIGURE:258afe38bde59a04 | A graph shows a continuous blue curve on an open interval $(a, b)$. The horizontal axis is labeled $x$, with vertical dashed lines marking $x=a$ and $x=b$. The curve starts high as $x$ approaches $a$...] |
L12132: Example 5 Determine whether the function
L12134: $$
L12135: f(x)=\frac{1}{x^{2}-x}
L12136: $$
L12138: has any absolute extrema on the interval $(0,1)$. If so, find them and state where they occur.
L12139: Solution. Since $f$ is continuous on the interval $(0,1)$ and
L12141: $$
L12142: \begin{aligned}
L12143: & \lim _{x \rightarrow 0^{+}} f(x)=\lim _{x \rightarrow 0^{+}} \frac{1}{x^{2}-x}=\lim _{x \rightarrow 0^{+}} \frac{1}{x(x-1)}=-\infty \\
L12144: & \lim _{x \rightarrow 1^{-}} f(x)=\lim _{x \rightarrow 1^{-}} \frac{1}{x^{2}-x}=\lim _{x \rightarrow 1^{-}} \frac{1}{x(x-1)}=-\infty
L12145: \end{aligned}
L12146: $$
L12148: [FIGURE:9f29075ed7d3f002 | The graph displays the function $y = \frac{1}{x^2 - x}$ for $x$ in the interval $(0, 1)$. The x-axis is labeled with tick marks at $\frac{1}{4}$, $\frac{1}{2}$, $\frac{3}{4}$, and $1$, while the...]
L12149: △ Figure 4.4.5
L12151: the function $f$ has an absolute maximum but no absolute minimum on the interval $(0,1)$. By Theorem 4.4.3 the absolute maximum must occur at a critical point of $f$ in the interval $(0,1)$. We have
L12153: $$
L12154: f^{\prime}(x)=-\frac{2 x-1}{\left(x^{2}-x\right)^{2}}
L12155: $$
L12157: so the only solution of the equation $f^{\prime}(x)=0$ is $x=\frac{1}{2}$. Although $f$ is not differentiable at $x=0$ or at $x=1$, these values are doubly disqualified since they are neither in the domain of $f$ nor in the interval $(0,1)$. Thus, the absolute maximum occurs at $x=\frac{1}{2}$, and this absolute maximum is
L12159: $$
L12160: f\left(\frac{1}{2}\right)=\frac{1}{\left(\frac{1}{2}\right)^{2}-\frac{1}{2}}=-4
L12161: $$
L12163: (Figure 4.4.5).
L12165: ## ABSOLUTE EXTREMA OF FUNCTIONS WITH ONE RELATIVE EXTREMUM
L12167: If a continuous function has only one relative extremum on a finite or infinite interval, then that relative extremum must of necessity also be an absolute extremum. To understand why
L12169: [FIGURE:e36b6b31685e497d | A graph displays a continuous curve with two relative extrema. The curve first rises to a relative maximum, whose x-coordinate is marked as $x_0$, then falls to a relative minimum, and subsequently...]
L12170: △ Figure 4.4.6
L12172: [FIGURE:4383cc2898da9911 | A 2D graph plots the function $f(x) = e^{(x^3 - 3x^2)}$ on the interval $(0, +\infty)$. The blue curve starts at $(0, 1)$, decreases to a local minimum near $(2, e^{-4})$, and then increases sharply...]
L12173: △ Figure 4.4.7
L12175: Does the function in Example 6 have an absolute minimum on the interval $(-\infty,+\infty)$ ?
L12176: this is so, suppose that $f$ has a relative maximum at $x_{0}$ in an interval, and there are no other relative extrema of $f$ on the interval. If $f\left(x_{0}\right)$ is not the absolute maximum of $f$ on the interval, then the graph of $f$ has to make an upward turn somewhere on the interval to rise above $f\left(x_{0}\right)$. However, this cannot happen because in the process of making an upward turn it would produce a second relative extremum (Figure 4.4.6). Thus, $f\left(x_{0}\right)$ must be the absolute maximum as well as a relative maximum. This idea is captured in the following theorem, which we state without proof.
L12177: 4.4.4 THEOREM Suppose that $f$ is continuous and has exactly one relative extremum on an interval, say at $x_{0}$.
L12178: (a) If $f$ has a relative minimum at $x_{0}$, then $f\left(x_{0}\right)$ is the absolute minimum of $f$ on the interval.
L12179: (b) If $f$ has a relative maximum at $x_{0}$, then $f\left(x_{0}\right)$ is the absolute maximum of $f$ the interval.
L12181: This theorem is often helpful in situations where other methods are difficult or tedious to apply.
L12183: Example 6 Find the absolute extrema, if any, of the function $f(x)=e^{\left(x^{3}-3 x^{2}\right)}$ on the interval $(0,+\infty)$.
L12185: Solution. We have
L12187: $$
L12188: \lim _{x \rightarrow+\infty} f(x)=+\infty
L12189: $$
L12191: (verify), so $f$ does not have an absolute maximum on the interval $(0,+\infty)$. However, the continuity of $f$ together with the fact that
L12193: $$
L12194: \lim _{x \rightarrow 0^{+}} f(x)=e^{0}=1
L12195: $$
L12197: is finite allow for the possibility that $f$ has an absolute minimum on $(0,+\infty)$. If so, it would have to occur at a critical point of $f$, so we consider
L12199: $$
L12200: f^{\prime}(x)=e^{\left(x^{3}-3 x^{2}\right)}\left(3 x^{2}-6 x\right)=3 x(x-2) e^{\left(x^{3}-3 x^{2}\right)}
L12201: $$
L12203: Since $e^{\left(x^{3}-3 x^{2}\right)}>0$ for all values of $x$, we see that $x=0$ and $x=2$ are the only critical points of $f$. Of these, only $x=2$ is in the interval ( $0,+\infty$ ), so this is the point at which an absolute minimum could occur. To see whether an absolute minimum actually does occur at this point, we can apply part (a) of Theorem 4.4.4. Since
L12205: $$
L12206: \begin{aligned}
L12207: f^{\prime \prime}(x) & =e^{\left(x^{3}-3 x^{2}\right)}\left(3 x^{2}-6 x\right)^{2}+e^{\left(x^{3}-3 x^{2}\right)}(6 x-6) \\
L12208: & =\left[\left(3 x^{2}-6 x\right)^{2}+(6 x-6)\right] e^{\left(x^{3}-3 x^{2}\right)}
L12209: \end{aligned}
L12210: $$
L12212: we have
L12214: $$
L12215: f^{\prime \prime}(2)=(0+6) e^{-4}=6 e^{-4}>0
L12216: $$
L12218: so a relative minimum occurs at $x=2$ by the second derivative test. Thus, $f(x)$ has an absolute minimum at $x=2$, and this absolute minimum is $f(2)=e^{-4} \approx 0.0183$ (Figure 4.4.7).
L12220: 1. Use the accompanying graph to find the $x$-coordinates of the relative extrema and absolute extrema of $f$ on $[0,6]$.
L12222: QUICK CHECK EXERCISES 4.4 (See page 274 for answers.)
L12223: [FIGURE:5efc5d6888d1e71d | A graph displays a curve $y=f(x)$ on a coordinate plane with an x-axis ranging from 0 to 6 and a y-axis ranging from 0 to 5. The curve begins at $(0,1)$, rises to a local maximum at $(1,2)$, then...]
L12225: Figure Ex-1
L12226: 2. Suppose that a function $f$ is continuous on $[-4,4]$ and has critical points at $x=-3,0,2$. Use the accompanying table
L12227: to determine the absolute maximum and absolute minimum values, if any, for $f$ on the indicated intervals.
L12228: (a) $[1,4]$
L12229: (b) $[-2,2]$
L12230: (c) $[-4,4]$
L12231: (d) $(-4,4)$
L12233: | $x$ | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 |
L12234: | :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
L12235: | $f(x)$ | 2224 | -1333 | 0 | 1603 | 2096 | 2293 | 2400 | 2717 | 6064 |
L12237: 3. Let $f(x)=x^{3}-3 x^{2}-9 x+25$. Use the derivative $f^{\prime}(x)=3(x+1)(x-3)$ to determine the absolute maximum and absolute minimum values, if any, for $f$ on each of the given intervals.
L12238: (a) $[0,4]$
L12239: (b) $[-2,4]$
L12240: (c) $[-4,2]$
L12241: (d) $[-5,10]$
L12242: (e) $(-5,4)$
L12244: ## FOCUS ON CONCEPTS
L12246: 1-2 Use the graph to find $x$-coordinates of the relative extrema and absolute extrema of $f$ on [0,7].
L12248: 1.
L12249: [FIGURE:37560761390aa47c | A graph displays a function $y = f(x)$ on a grid from $x=0$ to $x=7$. The curve starts at $(0,1)$, rises to a relative maximum at approximately $x=2$, decreases to a relative minimum at approximately...]
L12251: 2.
L12252: [FIGURE:bd9ce53846e649ad | A graph displays a curve $y=f(x)$ on a coordinate plane with labeled x and y axes, each having a tick mark at 1. The curve exhibits two local minima and one local maximum within the visible range...]
L12254: 3. In each part, sketch the graph of a continuous function $f$ with the stated properties on the interval $[0,10]$.
L12255: (a) $f$ has an absolute minimum at $x=0$ and an absolute maximum at $x=10$.
L12256: (b) $f$ has an absolute minimum at $x=2$ and an absolute maximum at $x=7$.
L12257: (c) $f$ has relative minima at $x=1$ and $x=8$, has relative maxima at $x=3$ and $x=7$, has an absolute minimum at $x=5$, and has an absolute maximum at $x=10$.
L12258: 4. In each part, sketch the graph of a continuous function $f$ with the stated properties on the interval $(-\infty,+\infty)$.
L12259: (a) $f$ has no relative extrema or absolute extrema.
L12260: (b) $f$ has an absolute minimum at $x=0$ but no absolute maximum.
L12261: (c) $f$ has an absolute maximum at $x=-5$ and an absolute minimum at $x=5$.
L12262: 5. Let
L12264: $$
L12265: f(x)= \begin{cases}\frac{1}{1-x}, & 0 \leq x<1 \\ 0, & x=1\end{cases}
L12266: $$
L12268: Explain why $f$ has a minimum value but no maximum value on the closed interval $[0,1]$.
L12269: 6. Let
L12271: $$
L12272: f(x)= \begin{cases}x, & 0<x<1 \\ \frac{1}{2}, & x=0,1\end{cases}
L12273: $$
L12275: Explain why $f$ has neither a minimum value nor a maximum value on the closed interval $[0,1]$.
L12277: 7-16 Find the absolute maximum and minimum values of $f$ on the given closed interval, and state where those values occur.
L12278: 7. $f(x)=4 x^{2}-12 x+10 ;[1,2]$
L12279: 8. $f(x)=8 x-x^{2} ;[0,6]$
L12280: 9. $f(x)=(x-2)^{3} ;[1,4]$
L12281: 10. $f(x)=2 x^{3}+3 x^{2}-12 x$; $[-3,2]$
L12282: 11. $f(x)=\frac{3 x}{\sqrt{4 x^{2}+1}} ;[-1,1]$
L12283: 12. $f(x)=\left(x^{2}+x\right)^{2 / 3} ;[-2,3]$
L12284: 13. $f(x)=x-2 \sin x ;[-\pi / 4, \pi / 2]$
L12285: 14. $f(x)=\sin x-\cos x ;[0, \pi]$
L12286: 15. $f(x)=1+\left|9-x^{2}\right| ;[-5,1]$
L12287: 16. $f(x)=|6-4 x|$; $[-3,3]$
L12289: 17-20 True-False Determine whether the statement is true or false. Explain your answer.
L12290: 17. If a function $f$ is continuous on $[a, b]$, then $f$ has an absolute maximum on $[a, b]$.
L12291: 18. If a function $f$ is continuous on ( $a, b$ ), then $f$ has an absolute minimum on $(a, b)$.
L12292: 19. If a function $f$ has an absolute minimum on $(a, b)$, then there is a critical point of $f$ in ( $a, b$ ).
L12293: 20. If a function $f$ is continuous on $[a, b]$ and $f$ has no relative extreme values in $(a, b)$, then the absolute maximum value of $f$ exists and occurs either at $x=a$ or at $x=b$.
L12295: 21-28 Find the absolute maximum and minimum values of $f$, if any, on the given interval, and state where those values occur.
L12296: 21. $f(x)=x^{2}-x-2 ;(-\infty,+\infty)$
L12297: 22. $f(x)=3-4 x-2 x^{2} ;(-\infty,+\infty)$
L12298: 23. $f(x)=4 x^{3}-3 x^{4} ;(-\infty,+\infty)$
L12299: 24. $f(x)=x^{4}+4 x ;(-\infty,+\infty)$
L12300: 25. $f(x)=2 x^{3}-6 x+2$; $(-\infty,+\infty)$
L12301: 26. $f(x)=x^{3}-9 x+1 ;(-\infty,+\infty)$
L12302: 27. $f(x)=\frac{x^{2}+1}{x+1} ;(-5,-1)$
L12303: 28. $f(x)=\frac{x-2}{x+1} ;(-1,5]$
L12305: 29-42 Use a graphing utility to estimate the absolute maximum and minimum values of $f$, if any, on the stated interval, and then use calculus methods to find the exact values.
L12306: 29. $f(x)=\left(x^{2}-2 x\right)^{2} ;(-\infty,+\infty)$
L12307: 30. $f(x)=(x-1)^{2}(x+2)^{2} ;(-\infty,+\infty)$
L12308: 31. $f(x)=x^{2 / 3}(20-x) ;[-1,20]$
L12309: 32. $f(x)=\frac{x}{x^{2}+2} ;[-1,4]$
L12310: 33. $f(x)=1+\frac{1}{x} ;(0,+\infty)$
L12311: 34. $f(x)=\frac{2 x^{2}-3 x+3}{x^{2}-2 x+2} ;[1,+\infty)$
L12312: 35. $f(x)=\frac{2-\cos x}{\sin x} ;[\pi / 4,3 \pi / 4]$
L12313: 36. $f(x)=\sin ^{2} x+\cos x ;[-\pi, \pi]$
L12314: 37. $f(x)=x^{3} e^{-2 x} ;[1,4]$
L12315: 38. $f(x)=\frac{\ln (2 x)}{x} ;[1, e]$
L12316: 39. $f(x)=5 \ln \left(x^{2}+1\right)-3 x$; $[0,4]$
L12317: 40. $f(x)=\left(x^{2}-1\right) e^{x}$; [-2,2]
L12318: 41. $f(x)=\sin (\cos x) ;[0,2 \pi]$
L12319: 42. $f(x)=\cos (\sin x) ;[0, \pi]$
L12320: 43. Find the absolute maximum and minimum values of
L12322: $$
L12323: f(x)= \begin{cases}4 x-2, & x<1 \\ (x-2)(x-3), & x \geq 1\end{cases}
L12324: $$
L12326: on $\left[\frac{1}{2}, \frac{7}{2}\right]$.
L12327: 44. Let $f(x)=x^{2}+p x+q$. Find the values of $p$ and $q$ such that $f(1)=3$ is an extreme value of $f$ on $[0,2]$. Is this value a maximum or minimum?
L12329: 45-46 If $f$ is a periodic function, then the locations of all absolute extrema on the interval $(-\infty,+\infty)$ can be obtained by finding the locations of the absolute extrema for one period and using the periodicity to locate the rest. Use this idea in these exercises to find the absolute maximum and minimum values of the function, and state the $x$-values at which they occur.
L12330: 45. $f(x)=2 \cos x+\cos 2 x$
L12331: 46. $f(x)=3 \cos \frac{x}{3}+2 \cos \frac{x}{2}$
L12333: 47-48 One way of proving that $f(x) \leq g(x)$ for all $x$ in a given interval is to show that $0 \leq g(x)-f(x)$ for all $x$ in the interval; and one way of proving the latter inequality is to show that the absolute minimum value of $g(x)-f(x)$ on the interval is nonnegative. Use this idea to prove the inequalities in these exercises. □
L12334: 47. Prove that $\sin x \leq x$ for all $x$ in the interval $[0,2 \pi]$.
L12335: 48. Prove that $\cos x \geq 1-\left(x^{2} / 2\right)$ for all $x$ in the interval $[0,2 \pi]$.
L12336: 49. What is the smallest possible slope for a tangent to the graph of the equation $y=x^{3}-3 x^{2}+5 x$ ?
L12337: 50. (a) Show that $f(x)=\sec x+\csc x$ has a minimum value but no maximum value on the interval $(0, \pi / 2)$.
L12338: (b) Find the minimum value in part (a).
L12339: c 51. Show that the absolute minimum value of
L12341: $$
L12342: f(x)=x^{2}+\frac{x^{2}}{(8-x)^{2}}, \quad x>8
L12343: $$
L12345: occurs at $x=10$ by using a CAS to find $f^{\prime}(x)$ and to solve the equation $f^{\prime}(x)=0$.
L12346: 52. The concentration $C(t)$ of a drug in the bloodstream $t$ hours after it has been injected is commonly modeled by an equation of the form
L12348: $$
L12349: C(t)=\frac{K\left(e^{-b t}-e^{-a t}\right)}{a-b}
L12350: $$
L12352: where $K>0$ and $a>b>0$.
L12353: (a) At what time does the maximum concentration occur?
L12354: (b) Let $K=1$ for simplicity, and use a graphing utility to check your result in part (a) by graphing $C(t)$ for various values of $a$ and $b$.
L12355: 53. Suppose that the equations of motion of a paper airplane during the first 12 seconds of flight are
L12357: $$
L12358: x=t-2 \sin t, \quad y=2-2 \cos t \quad(0 \leq t \leq 12)
L12359: $$
L12361: What are the highest and lowest points in the trajectory, and when is the airplane at those points?
L12362: 54. The accompanying figure shows the path of a fly whose equations of motion are
L12363: $x=\frac{\cos t}{2+\sin t}, \quad y=3+\sin (2 t)-2 \sin ^{2} t \quad(0 \leq t \leq 2 \pi)$
L12364: (a) How high and low does it fly?
L12365: (b) How far left and right of the origin does it fly?
L12367: [FIGURE:e1c4e7f033a90ffa | The figure displays a two-dimensional Cartesian coordinate system with a horizontal $x$-axis and a vertical $y$-axis. A blue curve, representing the path of a fly, is drawn, starting in the second...]
L12368: Figure Ex-54
L12370: 55. Let $f(x)=a x^{2}+b x+c$, where $a>0$. Prove that $f(x) \geq 0$ for all $x$ if and only if $b^{2}-4 a c \leq 0$. [Hint: Find the minimum of $f(x)$.]
L12371: 56. Prove Theorem 4.4.3 in the case where the extreme value is a minimum.
L12372: 57. Writing Suppose that $f$ is continuous and positive-valued everywhere and that the $x$-axis is an asymptote for the graph of $f$, both as $x \rightarrow-\infty$ and as $x \rightarrow+\infty$. Explain why $f$
L12373: cannot have an absolute minimum but may have a relative minimum.
L12374: 58. Writing Explain the difference between a relative maximum and an absolute maximum. Sketch a graph that illustrates a function with a relative maximum that is not an absolute maximum, and sketch another graph illustrating an absolute maximum that is not a relative maximum. Explain how these graphs satisfy the given conditions.
