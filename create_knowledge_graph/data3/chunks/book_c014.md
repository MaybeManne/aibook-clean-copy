L04517: ## QUICK CHECK ANSWERS 2.1
L04519: 1. $\frac{f(x)-f\left(x_{0}\right)}{x-x_{0}} ; \frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h}$
L04520: 2. -4
L04521: 3. (a) 9; positive; 4
L04522: (b) $1 \mathrm{ft} / \mathrm{s}$
L04523: 4. $s=3 t-7$
L04524: 5. (a) 8 (b) $\lim _{x \rightarrow 2} \frac{\left(x^{2}+x\right)-6}{x-2}$ or $\lim _{h \rightarrow 0} \frac{\left[(2+h)^{2}+(2+h)\right]-6}{h}$.
L04526: ### 2.2 THE DERIVATIVE FUNCTION
L04528: The expression
L04530: $$
L04531: \frac{f(x+h)-f(x)}{h}
L04532: $$
L04534: that appears in (2) is commonly called the difference quotient.
L04536: In this section we will discuss the concept of a "derivative," which is the primary mathematical tool that is used to calculate and study rates of change.
L04538: ## DEFINITION OF THE DERIVATIVE FUNCTION
L04540: In the last section we showed that if the limit
L04542: $$
L04543: \lim _{h \rightarrow 0} \frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h}
L04544: $$
L04546: exists, then it can be interpreted either as the slope of the tangent line to the curve $y=f(x)$ at $x=x_{0}$ or as the instantaneous rate of change of $y$ with respect to $x$ at $x=x_{0}$ [see Formulas (2) and (11) of that section]. This limit is so important that it has a special notation:
L04548: $$
L04549: \begin{equation*}
L04550: f^{\prime}\left(x_{0}\right)=\lim _{h \rightarrow 0} \frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h} \tag{1}
L04551: \end{equation*}
L04552: $$
L04554: You can think of $f^{\prime}$ (read " $f$ prime") as a function whose input is $x_{0}$ and whose output is the number $f^{\prime}\left(x_{0}\right)$ that represents either the slope of the tangent line to $y=f(x)$ at $x=x_{0}$ or the instantaneous rate of change of $y$ with respect to $x$ at $x=x_{0}$. To emphasize this function point of view, we will replace $x_{0}$ by $x$ in (1) and make the following definition.
L04555: 2.2.1 DEFINITION The function $f^{\prime}$ defined by the formula
L04557: $$
L04558: \begin{equation*}
L04559: f^{\prime}(x)=\lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h} \tag{2}
L04560: \end{equation*}
L04561: $$
L04563: is called the derivative off with respect to $\boldsymbol{x}$. The domain of $f^{\prime}$ consists of all $x$ in the domain of $f$ for which the limit exists.
L04565: The term "derivative" is used because the function $f^{\prime}$ is derived from the function $f$ by a limiting process.
L04567: Example 1 Find the derivative with respect to $x$ of $f(x)=x^{2}$, and use it to find the equation of the tangent line to $y=x^{2}$ at $x=2$.
L04569: [FIGURE:9cc028156e3f9f9c | A graph shows a blue parabola representing the function $y=x^2$ on a Cartesian coordinate plane. A blue point is marked on the parabola at $(2,4)$. A magenta line is drawn tangent to the parabola at...]
L04570: △ Figure 2.2.1
L04572: Solution. It follows from (2) that
L04574: $$
L04575: \begin{aligned}
L04576: f^{\prime}(x) & =\lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h}=\lim _{h \rightarrow 0} \frac{(x+h)^{2}-x^{2}}{h} \\
L04577: & =\lim _{h \rightarrow 0} \frac{x^{2}+2 x h+h^{2}-x^{2}}{h}=\lim _{h \rightarrow 0} \frac{2 x h+h^{2}}{h} \\
L04578: & =\lim _{h \rightarrow 0}(2 x+h)=2 x
L04579: \end{aligned}
L04580: $$
L04582: Thus, the slope of the tangent line to $y=x^{2}$ at $x=2$ is $f^{\prime}(2)=4$. Since $y=4$ if $x=2$, the point-slope form of the tangent line is
L04584: $$
L04585: y-4=4(x-2)
L04586: $$
L04588: which we can rewrite in slope-intercept form as $y=4 x-4$ (Figure 2.2.1).
L04590: You can think of $f^{\prime}$ as a "slope-producing function" in the sense that the value of $f^{\prime}(x)$ at $x=x_{0}$ is the slope of the tangent line to the graph of $f$ at $x=x_{0}$. This aspect of the derivative is illustrated in Figure 2.2.2, which shows the graphs of $f(x)=x^{2}$ and its derivative $f^{\prime}(x)=2 x$ (obtained in Example 1). The figure illustrates that the values of $f^{\prime}(x)=2 x$ at $x=-2,0$, and 2 correspond to the slopes of the tangent lines to the graph of $f(x)=x^{2}$ at those values of $x$.
L04591: [FIGURE:0bb585fcd1639d61 | The figure contains two graphs. The left graph shows the parabola $y = f(x) = x^2$ with three tangent lines: at $x=0$ with slope $0$, at $x=-2$ with slope $-4$, and at $x=2$ with slope $4$. The right...]
L04593: In general, if $f^{\prime}(x)$ is defined at $x=x_{0}$, then the point-slope form of the equation of the tangent line to the graph of $y=f(x)$ at $x=x_{0}$ may be found using the following steps.
L04595: Finding an Equation for the Tangent Line to $y=f(x)$ at $x=x_{0}$.
L04596: Step 1. Evaluate $f\left(x_{0}\right)$; the point of tangency is $\left(x_{0}, f\left(x_{0}\right)\right)$.
L04597: Step 2. Find $f^{\prime}(x)$ and evaluate $f^{\prime}\left(x_{0}\right)$, which is the slope $m$ of the line.
L04598: Step 3. Substitute the value of the slope $m$ and the point $\left(x_{0}, f\left(x_{0}\right)\right)$ into the point-slope form of the line
L04600: $$
L04601: y-f\left(x_{0}\right)=f^{\prime}\left(x_{0}\right)\left(x-x_{0}\right)
L04602: $$
L04604: or, equivalently,
L04606: $$
L04607: \begin{equation*}
L04608: y=f\left(x_{0}\right)+f^{\prime}\left(x_{0}\right)\left(x-x_{0}\right) \tag{3}
L04609: \end{equation*}
L04610: $$
L04612: In Solution (a), the binomial formula is used to expand $(x+h)^{3}$. This formula may be found on the front endpaper.
L04614: [FIGURE:c07911d507bacc4f | A graph displays two functions, $f$ and $f'$, on an $x$-$y$ coordinate system with integer tick marks from -2 to 2. The blue curve, labeled $f$, is a cubic function $f(x) = x^3 - x$, passing through...]
L04615: - Figure 2.2.3
L04617: [FIGURE:634be91134c18e8c | A Cartesian coordinate system displays a straight line represented by the equation $y = mx + b$. A portion of this line is highlighted in magenta, with a blue point marked on the line within the...]
L04618: Figure 2.2.4
L04620: At each value of $x$ the tangent line has slope $m$.
L04622: The result in Example 3 is consistent with our earlier observation that the rate of change of $y$ with respect to $x$ along a line $y=m x+b$ is constant and that constant is $m$.
L04624: ## Example 2
L04626: (a) Find the derivative with respect to $x$ of $f(x)=x^{3}-x$.
L04627: (b) Graph $f$ and $f^{\prime}$ together, and discuss the relationship between the two graphs.
L04629: Solution (a).
L04631: $$
L04632: \begin{aligned}
L04633: f^{\prime}(x) & =\lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h} \\
L04634: & =\lim _{h \rightarrow 0} \frac{\left[(x+h)^{3}-(x+h)\right]-\left[x^{3}-x\right]}{h} \\
L04635: & =\lim _{h \rightarrow 0} \frac{\left[x^{3}+3 x^{2} h+3 x h^{2}+h^{3}-x-h\right]-\left[x^{3}-x\right]}{h} \\
L04636: & =\lim _{h \rightarrow 0} \frac{3 x^{2} h+3 x h^{2}+h^{3}-h}{h} \\
L04637: & =\lim _{h \rightarrow 0}\left[3 x^{2}+3 x h+h^{2}-1\right]=3 x^{2}-1
L04638: \end{aligned}
L04639: $$
L04641: Solution (b). Since $f^{\prime}(x)$ can be interpreted as the slope of the tangent line to the graph of $y=f(x)$ at $x$, it follows that $f^{\prime}(x)$ is positive where the tangent line has positive slope, is negative where the tangent line has negative slope, and is zero where the tangent line is horizontal. We leave it for you to verify that this is consistent with the graphs of $f(x)=x^{3}-x$ and $f^{\prime}(x)=3 x^{2}-1$ shown in Figure 2.2.3.
L04643: Example 3 At each value of $x$, the tangent line to a line $y=m x+b$ coincides with the line itself (Figure 2.2.4), and hence all tangent lines have slope $m$. This suggests geometrically that if $f(x)=m x+b$, then $f^{\prime}(x)=m$ for all $x$. This is confirmed by the following computations:
L04645: $$
L04646: \begin{aligned}
L04647: f^{\prime}(x) & =\lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h} \\
L04648: & =\lim _{h \rightarrow 0} \frac{[m(x+h)+b]-[m x+b]}{h} \\
L04649: & =\lim _{h \rightarrow 0} \frac{m h}{h}=\lim _{h \rightarrow 0} m=m
L04650: \end{aligned}
L04651: $$
L04653: ## Example 4
L04655: (a) Find the derivative with respect to $x$ of $f(x)=\sqrt{x}$.
L04656: (b) Find the slope of the tangent line to $y=\sqrt{x}$ at $x=9$.
L04657: (c) Find the limits of $f^{\prime}(x)$ as $x \rightarrow 0^{+}$and as $x \rightarrow+\infty$, and explain what those limits say about the graph of $f$.
L04659: Solution (a). Recall from Example 4 of Section 2.1 that the slope of the tangent line to $y=\sqrt{x}$ at $x=x_{0}$ is given by $m_{\tan }=1 /\left(2 \sqrt{x_{0}}\right)$. Thus, $f^{\prime}(x)=1 /(2 \sqrt{x})$.
L04661: Solution (b). The slope of the tangent line at $x=9$ is $f^{\prime}(9)$. From part (a), this slope is $f^{\prime}(9)=1 /(2 \sqrt{9})=\frac{1}{6}$.
L04663: [FIGURE:e29e3477e2a8bdff | The figure presents two coordinate plane graphs. The upper graph displays the function $y = f(x) = \sqrt{x}$, a curve starting at the origin and increasing with a decreasing slope as $x$ increases...]
L04664: △ Figure 2.2.5
L04666: Solution (c). The graphs of $f(x)=\sqrt{x}$ and $f^{\prime}(x)=1 /(2 \sqrt{x})$ are shown in Figure 2.2.5. Observe that $f^{\prime}(x)>0$ if $x>0$, which means that all tangent lines to the graph of $y=\sqrt{x}$ have positive slope at all points in this interval. Since
L04668: $$
L04669: \lim _{x \rightarrow 0^{+}} \frac{1}{2 \sqrt{x}}=+\infty \quad \text { and } \quad \lim _{x \rightarrow+\infty} \frac{1}{2 \sqrt{x}}=0
L04670: $$
L04672: the graph of $f$ becomes more and more vertical as $x \rightarrow 0^{+}$and more and more horizontal as $x \rightarrow+\infty$. $\square$
L04674: ## COMPUTING INSTANTANEOUS VELOCITY
L04676: It follows from Formula (5) of Section 2.1 (with $t$ replacing $t_{0}$ ) that if $s=f(t)$ is the position function of a particle in rectilinear motion, then the instantaneous velocity at an arbitrary time $t$ is given by
L04678: $$
L04679: v_{\mathrm{inst}}=\lim _{h \rightarrow 0} \frac{f(t+h)-f(t)}{h}
L04680: $$
L04682: Since the right side of this equation is the derivative of the function $f$ (with $t$ rather than $x$ as the independent variable), it follows that if $f(t)$ is the position function of a particle in rectilinear motion, then the function
L04684: $$
L04685: \begin{equation*}
L04686: v(t)=f^{\prime}(t)=\lim _{h \rightarrow 0} \frac{f(t+h)-f(t)}{h} \tag{4}
L04687: \end{equation*}
L04688: $$
L04690: represents the instantaneous velocity of the particle at time $t$. Accordingly, we call (4) the instantaneous velocity function or, more simply, the velocity function of the particle.
L04692: - Example 5 Recall the particle from Example 5 of Section 2.1 with position function $s=f(t)=1+5 t-2 t^{2}$. Here $f(t)$ is measured in meters and $t$ is measured in seconds. Find the velocity function of the particle.
L04694: Solution. It follows from (4) that the velocity function is
L04696: $$
L04697: \begin{aligned}
L04698: v(t) & =\lim _{h \rightarrow 0} \frac{f(t+h)-f(t)}{h}=\lim _{h \rightarrow 0} \frac{\left[1+5(t+h)-2(t+h)^{2}\right]-\left[1+5 t-2 t^{2}\right]}{h} \\
L04699: & =\lim _{h \rightarrow 0} \frac{-2\left[t^{2}+2 t h+h^{2}-t^{2}\right]+5 h}{h}=\lim _{h \rightarrow 0} \frac{-4 t h-2 h^{2}+5 h}{h} \\
L04700: & =\lim _{h \rightarrow 0}(-4 t-2 h+5)=5-4 t
L04701: \end{aligned}
L04702: $$
L04704: where the units of velocity are meters per second.
L04706: ## DIFFERENTIABILITY
L04708: It is possible that the limit that defines the derivative of a function $f$ may not exist at certain points in the domain of $f$. At such points the derivative is undefined. To account for this possibility we make the following definition.
L04710: ### 2.2.2 DEFINITION A function $f$ is said to be differentiable at $\boldsymbol{x}_{\mathbf{0}}$ if the limit
L04712: $$
L04713: \begin{equation*}
L04714: f^{\prime}\left(x_{0}\right)=\lim _{h \rightarrow 0} \frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h} \tag{5}
L04715: \end{equation*}
L04716: $$
L04718: exists. If $f$ is differentiable at each point of the open interval ( $a, b$ ), then we say that it is differentiable on $(\boldsymbol{a}, \boldsymbol{b})$, and similarly for open intervals of the form $(a,+\infty),(-\infty, b)$, and $(-\infty,+\infty)$. In the last case we say that $f$ is differentiable everywhere.
L04720: Geometrically, a function $f$ is differentiable at $x_{0}$ if the graph of $f$ has a tangent line at $x_{0}$. Thus, $f$ is not differentiable at any point $x_{0}$ where the secant lines from $P\left(x_{0}, f\left(x_{0}\right)\right)$ to points $Q(x, f(x))$ distinct from $P$ do not approach a unique nonvertical limiting position as $x \rightarrow x_{0}$. Figure 2.2.6 illustrates two common ways in which a function that is continuous at $x_{0}$ can fail to be differentiable at $x_{0}$. These can be described informally as
L04722: - corner points
L04723: - points of vertical tangency
L04725: At a corner point, the slopes of the secant lines have different limits from the left and from the right, and hence the two-sided limit that defines the derivative does not exist (Figure 2.2.7). At a point of vertical tangency the slopes of the secant lines approach $+\infty$ or $-\infty$ from the left and from the right (Figure 2.2.8), so again the limit that defines the derivative does not exist.
L04727: - Figure 2.2.6
L04729: [FIGURE:5951f4f5a0b3c492 | A graph on an $xy$-coordinate plane displays a blue curve representing the function $y=f(x)$. The curve features a sharp, upward-pointing corner at a specific point, which is marked by a blue dot. A...]
L04730: Corner point
L04732: [FIGURE:ddfcfe9decb5bf17 | A coordinate plane displays the graph of a smooth curve $y=f(x)$. A specific point on the curve, located at $x=x_0$, is highlighted with a blue dot, and a vertical dashed line extends from this point...]
L04734: Point of vertical tangency
L04736: [FIGURE:172c9e4faceaa919 | A graph illustrates a function that is continuous but not differentiable at a point $P(x_0, f(x_0))$, which forms a sharp corner or cusp. Secant lines connecting $P$ to points $Q(x, f(x))$ are shown...]
L04737: △ Figure 2.2.7
L04739: There are other less obvious circumstances under which a function may fail to be differentiable. (See Exercise 49, for example.)
L04741: [FIGURE:3327242727611584 | The graph illustrates a point of vertical tangency at $P(x_0, f(x_0))$. A blue curve is shown, and as a point $Q(x, f(x))$ approaches $P$ from the right (indicated by a cyan arrow on the $x$-axis)...]
L04742: △ Figure 2.2.8
L04744: [FIGURE:a61c122aca4e7637 | A graph shows a blue curve in a coordinate system, descending steeply from left to right. A point $P$ is marked on the curve, corresponding to $x_0$ on the x-axis. Several other points, collectively...]
L04746: Differentiability at $x_{0}$ can also be described informally in terms of the behavior of the graph of $f$ under increasingly stronger magnification at the point $P\left(x_{0}, f\left(x_{0}\right)\right)$ (Figure 2.2.9). If $f$ is differentiable at $x_{0}$, then under sufficiently strong magnification at $P$ the
L04748: [FIGURE:ea7320c68c1e7f32 | Three graphs illustrate the concept of differentiability at a point $x_0$. Each graph shows a blue curve, a point $P$ on the curve at $x_0$, and a magnifying glass effect that zooms in on $P$...]
L04749: - Figure 2.2.9
L04751: [FIGURE:a962f635cc820d97 | A graph displays the function $y = |x|$ in a Cartesian coordinate system. The x-axis and y-axis intersect at the origin, labeled "0". The graph forms a V-shape, with its vertex at the origin...]
L04752: △ Figure 2.2.10
L04754: [FIGURE:f4dd3caa972cc20f | The graph displays the derivative $y = f'(x)$, which is a piecewise function. For $x > 0$, the graph is a horizontal line segment at $y=1$, ending with an open circle at $(0,1)$. For $x < 0$, it is a...]
L04755: - Figure 2.2.11
L04757: A theorem that says "If statement $A$ is true, then statement $B$ is true" is equivalent to the theorem that says "If statement $B$ is not true, then statement $A$ is not true." The two theorems are called contrapositive forms of one another. Thus, Theorem 2.2.3 can be rewritten in contrapositive form as "If a function $f$ is not continuous at $x_{0}$, then $f$ is not differentiable at $x_{0} .^{\prime \prime}$
L04758: graph looks like a nonvertical line (the tangent line); if a corner point occurs at $x_{0}$, then no matter how great the magnification at $P$ the corner persists and the graph never looks like a nonvertical line; and if vertical tangency occurs at $x_{0}$, then the graph of $f$ looks like a vertical line under sufficiently strong magnification at $P$.
L04760: - Example 6 The graph of $y=|x|$ in Figure 2.2.10 has a corner at $x=0$, which implies that $f(x)=|x|$ is not differentiable at $x=0$.
L04761: (a) Prove that $f(x)=|x|$ is not differentiable at $x=0$ by showing that the limit in Definition 2.2.2 does not exist at $x=0$.
L04762: (b) Find a formula for $f^{\prime}(x)$.
L04764: Solution (a). From Formula (5) with $x_{0}=0$, the value of $f^{\prime}(0)$, if it were to exist, would be given by
L04766: $$
L04767: \begin{equation*}
L04768: f^{\prime}(0)=\lim _{h \rightarrow 0} \frac{f(0+h)-f(0)}{h}=\lim _{h \rightarrow 0} \frac{f(h)-f(0)}{h}=\lim _{h \rightarrow 0} \frac{|h|-|0|}{h}=\lim _{h \rightarrow 0} \frac{|h|}{h} \tag{6}
L04769: \end{equation*}
L04770: $$
L04772: But
L04774: $$
L04775: \frac{|h|}{h}=\left\{\begin{aligned}
L04776: 1, & h>0 \\
L04777: -1, & h<0
L04778: \end{aligned}\right.
L04779: $$
L04781: so that
L04783: $$
L04784: \lim _{h \rightarrow 0^{-}} \frac{|h|}{h}=-1 \quad \text { and } \quad \lim _{h \rightarrow 0^{+}} \frac{|h|}{h}=1
L04785: $$
L04787: Since these one-sided limits are not equal, the two-sided limit in (5) does not exist, and hence $f$ is not differentiable at $x=0$.
L04789: Solution (b). A formula for the derivative of $f(x)=|x|$ can be obtained by writing $|x|$ in piecewise form and treating the cases $x>0$ and $x<0$ separately. If $x>0$, then $f(x)=x$ and $f^{\prime}(x)=1$; if $x<0$, then $f(x)=-x$ and $f^{\prime}(x)=-1$. Thus,
L04791: $$
L04792: f^{\prime}(x)=\left\{\begin{aligned}
L04793: 1, & x>0 \\
L04794: -1, & x<0
L04795: \end{aligned}\right.
L04796: $$
L04798: The graph of $f^{\prime}$ is shown in Figure 2.2.11. Observe that $f^{\prime}$ is not continuous at $x=0$, so this example shows that a function that is continuous everywhere may have a derivative that fails to be continuous everywhere.
L04800: ## THE RELATIONSHIP BETWEEN DIFFERENTIABILITY AND CONTINUITY
L04802: We already know that functions are not differentiable at corner points and points of vertical tangency. The next theorem shows that functions are not differentiable at points of discontinuity. We will do this by proving that if $f$ is differentiable at a point, then it must be continuous at that point.
L04804: ### 2.2.3 THEOREM If a function $f$ is differentiable at $x_{0}$, then $f$ is continuous at $x_{0}$.
L04806: PROOF We are given that $f$ is differentiable at $x_{0}$, so it follows from (5) that $f^{\prime}\left(x_{0}\right)$ exists and is given by
L04808: $$
L04809: \begin{equation*}
L04810: f^{\prime}\left(x_{0}\right)=\lim _{h \rightarrow 0}\left[\frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h}\right] \tag{7}
L04811: \end{equation*}
L04812: $$
L04814: ## WARNING
L04816: The converse of Theorem 2.2.3 is false; that is, a function may be continuous at a point but not differentiable at that point. This occurs, for example, at corner points of continuous functions. For instance, $f(x)=|x|$ is continuous at $x=0$ but not differentiable there (Example 6).
L04818: To show that $f$ is continuous at $x_{0}$, we must show that $\lim _{x \rightarrow x_{0}} f(x)=f\left(x_{0}\right)$ or, equivalently,
L04820: $$
L04821: \lim _{x \rightarrow x_{0}}\left[f(x)-f\left(x_{0}\right)\right]=0
L04822: $$
L04824: Expressing this in terms of the variable $h=x-x_{0}$, we must prove that
L04826: $$
L04827: \lim _{h \rightarrow 0}\left[f\left(x_{0}+h\right)-f\left(x_{0}\right)\right]=0
L04828: $$
L04830: However, this can be proved using (7) as follows:
L04832: $$
L04833: \begin{aligned}
L04834: \lim _{h \rightarrow 0}\left[f\left(x_{0}+h\right)-f\left(x_{0}\right)\right] & =\lim _{h \rightarrow 0}\left[\frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h} \cdot h\right] \\
L04835: & =\lim _{h \rightarrow 0}\left[\frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h}\right] \cdot \lim _{h \rightarrow 0} h \\
L04836: & =f^{\prime}\left(x_{0}\right) \cdot 0=0
L04837: \end{aligned}
L04838: $$
L04840: The relationship between continuity and differentiability was of great historical significance in the development of calculus. In the early nineteenth century mathematicians believed that if a continuous function had many points of nondifferentiability, these points, like the tips of a sawblade, would have to be separated from one another and joined by smooth curve segments (Figure 2.2.12). This misconception was corrected by a series of discoveries beginning in 1834. In that year a Bohemian priest, philosopher, and mathematician named Bernhard Bolzano discovered a procedure for constructing a continuous function that is not differentiable at any point. Later, in 1860, the great German mathematician Karl Weierstrass (biography on p. 102) produced the first formula for such a function. The graphs of such functions are impossible to draw; it is as if the corners are so numerous that any segment of the curve, when suitably enlarged, reveals more corners. The discovery of these functions was important in that it made mathematicians distrustful of their geometric intuition and more reliant on precise mathematical proof. Recently, such functions have started to play a fundamental role in the study of geometric objects called fractals. Fractals have revealed an order to natural phenomena that were previously dismissed as random and chaotic.
L04842: - Figure 2.2.12
L04843: [FIGURE:3ce2001ef97b4e4c | A graph displays a continuous blue curve plotted on an $x$-$y$ coordinate system. The curve features numerous sharp corners and kinks, indicating points where the function is not differentiable...]
L04845: [FIGURE:97a62754aa47690d | A black and white portrait of an older man with short, wavy hair, looking slightly to the right. He is wearing a dark jacket and cravat, consistent with early 19th-century attire, likely representing...]
L04847: Bernhard Bolzano (1781-1848) Bolzano, the son of an art dealer, was born in Prague, Bohemia (Czech Republic). He was educated at the University of Prague, and eventually won enough mathematical fame to be recommended for a mathematics chair there. However, Bolzano became an ordained Roman Catholic priest, and in 1805 he was appointed to a chair of Philosophy at the University of Prague. Bolzano was a man of great human compassion; he spoke out for educational reform, he voiced the right of individual conscience over government demands, and he lectured on the absurdity
L04848: of war and militarism. His views so disenchanted Emperor Franz I of Austria that the emperor pressed the Archbishop of Prague to have Bolzano recant his statements. Bolzano refused and was then forced to retire in 1824 on a small pension. Bolzano's main contribution to mathematics was philosophical. His work helped convince mathematicians that sound mathematics must ultimately rest on rigorous proof rather than intuition. In addition to his work in mathematics, Bolzano investigated problems concerning space, force, and wave propagation.
L04850: ## DERIVATIVES AT THE ENDPOINTS OF AN INTERVAL
L04852: If a function $f$ is defined on a closed interval $[a, b]$ but not outside that interval, then $f^{\prime}$ is not defined at the endpoints of the interval because derivatives are two-sided limits. To deal with this we define left-hand derivatives and right-hand derivatives by
L04854: $$
L04855: f_{-}^{\prime}(x)=\lim _{h \rightarrow 0^{-}} \frac{f(x+h)-f(x)}{h} \quad \text { and } \quad f_{+}^{\prime}(x)=\lim _{h \rightarrow 0^{+}} \frac{f(x+h)-f(x)}{h}
L04856: $$
L04858: respectively. These are called one-sided derivatives. Geometrically, $f_{-}^{\prime}(x)$ is the limit of the slopes of the secant lines as $x$ is approached from the left and $f_{+}^{\prime}(x)$ is the limit of the
L04860: [FIGURE:037488adaedba825 | A graph displays a continuous, wavy blue curve labeled $y=f(x)$ above a horizontal axis. At $x=a$, a dashed vertical line extends from the axis to a point on the curve. A purple line segment, tangent...]
L04861: △ Figure 2.2.13
L04863: Later, the symbols $d y$ and $d x$ will be given specific meanings. However, for the time being do not regard $d y / d x$ as a ratio, but rather as a single symbol denoting the derivative. slopes of the secant lines as $x$ is approached from the right. For a closed interval $[a, b]$, we will understand the derivative at the left endpoint to be $f_{+}^{\prime}(a)$ and at the right endpoint to be $f_{-}^{\prime}(b)$ (Figure 2.2.13).
L04865: In general, we will say that $f$ is differentiable on an interval of the form $[a, b],[a,+\infty)$, $(-\infty, b],[a, b)$, or $(a, b]$ if it is differentiable at all points inside the interval and the appropriate one-sided derivative exists at each included endpoint.
L04867: It can be proved that a function $f$ is continuous from the left at those points where the left-hand derivative exists and is continuous from the right at those points where the right-hand derivative exists.
