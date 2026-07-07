L13982: ## QUICK CHECK ANSWERS 4.7
L13984: 1. $x_{2} \approx 4, x_{3} \approx 2$
L13985: 2. $\frac{1}{2}$
L13986: 3. -1
L13987: 4. $\ln 2-\frac{1}{2} \approx 0.193147$
L13989: ### 4.8 ROLLE'S THEOREM; MEAN-VALUE THEOREM
L13991: In this section we will discuss a result called the Mean-Value Theorem. This theorem has so many important consequences that it is regarded as one of the major principles in calculus.
L13993: [FIGURE:91d8885022e78453 | The figure displays two graphs of a function $y=f(x)$ over an interval $[a, b)$ where $f(a)=f(b)=0$. The top graph shows a single local maximum between $a$ and $b$, with a dashed vertical line and a...]
L13994: - Figure 4.8.1
L13996: ## ROLLE'S THEOREM
L13998: We will begin with a special case of the Mean-Value Theorem, called Rolle's Theorem, in honor of the mathematician Michel Rolle. This theorem states the geometrically obvious fact that if the graph of a differentiable function intersects the $x$-axis at two places, $a$ and $b$, then somewhere between $a$ and $b$ there must be at least one place where the tangent line is horizontal (Figure 4.8.1). The precise statement of the theorem is as follows.
L13999: 4.8.1 THEOREM (Rolle's Theorem) Let $f$ be continuous on the closed interval $[a, b]$ and differentiable on the open interval ( $a, b$ ). If
L14001: $$
L14002: f(a)=0 \quad \text { and } \quad f(b)=0
L14003: $$
L14005: then there is at least one point $c$ in the interval $(a, b)$ such that $f^{\prime}(c)=0$.
L14007: PROOF We will divide the proof into three cases: the case where $f(x)=0$ for all $x$ in $(a, b)$, the case where $f(x)>0$ at some point in $(a, b)$, and the case where $f(x)<0$ at some point in ( $a, b$ ).
L14009: CASE I If $f(x)=0$ for all $x$ in ( $a, b$ ), then $f^{\prime}(c)=0$ at every point $c$ in ( $a, b$ ) because $f$ is a constant function on that interval.
L14011: CASE 2 Assume that $f(x)>0$ at some point in $(a, b)$. Since $f$ is continuous on $[a, b]$, it follows from the Extreme-Value Theorem (4.4.2) that $f$ has an absolute maximum on $[a, b]$. The absolute maximum value cannot occur at an endpoint of $[a, b]$ because we have assumed that $f(a)=f(b)=0$, and that $f(x)>0$ at some point in $(a, b)$. Thus, the absolute maximum must occur at some point $c$ in $(a, b)$. It follows from Theorem 4.4.3 that $c$ is a critical point of $f$, and since $f$ is differentiable on ( $a, b$ ), this critical point must be a stationary point; that is, $f^{\prime}(c)=0$.
L14013: CASE 3 Assume that $f(x)<0$ at some point in $(a, b)$. The proof of this case is similar to Case 2 and will be omitted. $\square$
L14015: [FIGURE:a984770ad2c298c1 | A graph of the parabola $y = x^2 - 5x + 4$ on an x-y coordinate plane. The parabola intersects the x-axis at $x=1$ and $x=4$. A dashed vertical line extends from $x = \frac{5}{2}$ on the x-axis down...]
L14016: Figure 4.8.2
L14018: - Example 1 Find the two $x$-intercepts of the function $f(x)=x^{2}-5 x+4$ and confirm that $f^{\prime}(c)=0$ at some point $c$ between those intercepts.
L14020: Solution. The function $f$ can be factored as
L14022: $$
L14023: x^{2}-5 x+4=(x-1)(x-4)
L14024: $$
L14026: so the $x$-intercepts are $x=1$ and $x=4$. Since the polynomial $f$ is continuous and differentiable everywhere, the hypotheses of Rolle's Theorem are satisfied on the interval [1,4]. Thus, we are guaranteed the existence of at least one point $c$ in the interval $(1,4)$ such that $f^{\prime}(c)=0$. Differentiating $f$ yields
L14028: $$
L14029: f^{\prime}(x)=2 x-5
L14030: $$
L14032: Solving the equation $f^{\prime}(x)=0$ yields $x=\frac{5}{2}$, so $c=\frac{5}{2}$ is a point in the interval ( 1,4 ) at which $f^{\prime}(c)=0$ (Figure 4.8.2).
L14034: - Example 2 The differentiability requirement in Rolle's Theorem is critical. If $f$ fails to be differentiable at even one place in the interval $(a, b)$, then the conclusion of the
L14036: Michel Rolle (1652-1719) French mathematician. Rolle, the son of a shopkeeper, received only an elementary education. He married early and as a young man struggled hard to support his family on the meager wages of a transcriber for notaries and attorneys. In spite of his financial problems and minimal education, Rolle studied algebra and Diophantine analysis (a branch of number theory) on his own. Rolle's fortune changed dramatically in 1682 when he published an elegant solution of a difficult, unsolved problem in Diophantine analysis. The public recognition of his achievement led to a patronage under minister Louvois, a job as an elementary mathematics teacher, and eventually to a short-term administrative post in the Ministry of War. In 1685 he joined the Académie des Sciences in a low-level position for which he received no regular salary until 1699. He stayed at the Académie until he died of apoplexy in 1719.
L14038: While Rolle's forte was always Diophantine analysis, his most important work was a book on the algebra of equations, called Traité d'algèbre, published in 1690. In that book Rolle firmly established the notation $\sqrt[n]{a}$ [earlier written as $\sqrt{(n) a}$ ] for the $n$th root of $a$, and proved a polynomial version of the theorem that today bears his name. (Rolle's Theorem was named by Giusto Bellavitis in 1846.) Ironically, Rolle was one of the most vocal early antagonists of calculus. He strove intently to demonstrate that it gave erroneous results and was based on unsound reasoning. He quarreled so vigorously on the subject that the Académie des Sciences was forced to intervene on several occasions. Among his several achievements, Rolle helped advance the currently accepted size order for negative numbers. Descartes, for example, viewed -2 as smaller than -5 . Rolle preceded most of his contemporaries by adopting the current convention in 1691.
L14040: [FIGURE:038bf76231527200 | A Cartesian coordinate system displays the graph of the function $y = |x| - 1$. The V-shaped curve has its vertex at $(0, -1)$, and it intersects the x-axis at $x=-1$ and $x=1$. This graph...]
L14041: A Figure 4.8.3
L14043: [FIGURE:2cfa39ef0f7d926d | A graph shows the curve $y = \sin x$ on a coordinate plane from $x=0$ to $x=2\pi$. The x-axis is labeled with $0, \pi/2, \pi, 3\pi/2, 2\pi$, and the y-axis with $0, 1, -1$. The curve reaches a local...]
L14044: Figure 4.8 .4
L14046: In Examples 1 and 3 we were able to find exact values of $c$ because the equation $f^{\prime}(x)=0$ was easy to solve. However, in the applications of Rolle's Theorem it is usually the existence of $c$ that is important and not its actual value.
L14048: [FIGURE:bc0ed663d59a9c6c | A graph illustrates the Mean Value Theorem. A blue curve $y=f(x)$ is shown with two points, $A(a, f(a))$ and $B(b, f(b))$, marked on it. A purple secant line connects $A$ and $B$. A second purple...]
L14049: - Figure 4.8.6
L14051: The tangent line is parallel to the secant line where the vertical distance $v(x)$ between the secant line and the graph of $f$ is maximum.
L14052: theorem may not hold. For example, the function $f(x)=|x|-1$ graphed in Figure 4.8.3 has roots at $x=-1$ and $x=1$, yet there is no horizontal tangent to the graph of $f$ over the interval $(-1,1)$.
L14054: Example 3 If $f$ satisfies the conditions of Rolle's Theorem on $[a, b]$, then the theorem guarantees the existence of at least one point $c$ in ( $a, b$ ) at which $f^{\prime}(c)=0$. There may, however, be more than one such $c$. For example, the function $f(x)=\sin x$ is continuous and differentiable everywhere, so the hypotheses of Rolle's Theorem are satisfied on the interval $[0,2 \pi]$ whose endpoints are roots of $f$. As indicated in Figure 4.8.4, there are two points in the interval $[0,2 \pi]$ at which the graph of $f$ has a horizontal tangent, $c_{1}=\pi / 2$ and $c_{2}=3 \pi / 2$.
L14056: ## THE MEAN-VALUE THEOREM
L14058: Rolle's Theorem is a special case of a more general result, called the Mean-Value Theorem. Geometrically, this theorem states that between any two points $A(a, f(a))$ and $B(b, f(b))$ on the graph of a differentiable function $f$, there is at least one place where the tangent line to the graph is parallel to the secant line joining $A$ and $B$ (Figure 4.8.5).
L14060: [FIGURE:9098afcd73e62d7b | The figure displays two graphs, (a) and (b), illustrating the Mean-Value Theorem. In both graphs, a blue curve $y=f(x)$ is shown on an x-axis, with points $A(a, f(a))$ and $B(b, f(b))$ marked. A...]
L14061: △ Figure 4.8.5
L14063: Note that the slope of the secant line joining $A(a, f(a))$ and $B(b, f(b))$ is
L14065: $$
L14066: \frac{f(b)-f(a)}{b-a}
L14067: $$
L14069: and that the slope of the tangent line at $c$ in Figure 4.8.5 $a$ is $f^{\prime}(c)$. Similarly, in Figure 4.8.5b the slopes of the tangent lines at $c_{1}$ and $c_{2}$ are $f^{\prime}\left(c_{1}\right)$ and $f^{\prime}\left(c_{2}\right)$, respectively. Since nonvertical parallel lines have the same slope, the Mean-Value Theorem can be stated precisely as follows.
L14070: 4.8.2 THEOREM (Mean-Value Theorem) Let $f$ be continuous on the closed interval $[a, b]$ and differentiable on the open interval ( $a, b$ ). Then there is at least one point $c$ in ( $a, b$ ) such that
L14072: $$
L14073: \begin{equation*}
L14074: f^{\prime}(c)=\frac{f(b)-f(a)}{b-a} \tag{1}
L14075: \end{equation*}
L14076: $$
L14078: MOTIVATION FOR THE PROOF OF THEOREM 4.8.2 Figure 4.8.6 suggests that (1) will hold (i.e., the tangent line will be parallel to the secant line) at a point $c$ where the vertical distance between the curve and the secant line is maximum. Thus, to prove the Mean-Value Theorem it is natural to begin by looking for a formula for the vertical distance $v(x)$ between the curve $y=f(x)$ and the secant line joining $(a, f(a))$ and $(b, f(b))$.
L14080: [FIGURE:b8fce1dbb429c306 | A graph displays the curve $y = \frac{1}{4}x^3 + 1$ in a Cartesian coordinate system. Three points are highlighted on the curve: $(0, 1)$, $(1, 1.25)$, and $(2, 3)$. A purple secant line connects the...]
L14081: △ Figure 4.8.7
L14083: PROOF OF THEOREM 4.8.2 Since the two-point form of the equation of the secant line joining ( $a, f(a)$ ) and ( $b, f(b)$ ) is
L14085: $$
L14086: y-f(a)=\frac{f(b)-f(a)}{b-a}(x-a)
L14087: $$
L14089: or, equivalently,
L14091: $$
L14092: y=\frac{f(b)-f(a)}{b-a}(x-a)+f(a)
L14093: $$
L14095: the difference $v(x)$ between the height of the graph of $f$ and the height of the secant line is
L14097: $$
L14098: \begin{equation*}
L14099: v(x)=f(x)-\left[\frac{f(b)-f(a)}{b-a}(x-a)+f(a)\right] \tag{2}
L14100: \end{equation*}
L14101: $$
L14103: Since $f(x)$ is continuous on $[a, b]$ and differentiable on $(a, b)$, so is $v(x)$. Moreover,
L14105: $$
L14106: v(a)=0 \quad \text { and } \quad v(b)=0
L14107: $$
L14109: so that $v(x)$ satisfies the hypotheses of Rolle's Theorem on the interval $[a, b]$. Thus, there is a point $c$ in ( $a, b$ ) such that $v^{\prime}(c)=0$. But from Equation (2)
L14111: $$
L14112: v^{\prime}(x)=f^{\prime}(x)-\frac{f(b)-f(a)}{b-a}
L14113: $$
L14115: so
L14117: $$
L14118: v^{\prime}(c)=f^{\prime}(c)-\frac{f(b)-f(a)}{b-a}
L14119: $$
L14121: Since $v^{\prime}(c)=0$, we have
L14123: $$
L14124: f^{\prime}(c)=\frac{f(b)-f(a)}{b-a}
L14125: $$
L14127: Example 4 Show that the function $f(x)=\frac{1}{4} x^{3}+1$ satisfies the hypotheses of the Mean-Value Theorem over the interval [ 0,2 ], and find all values of $c$ in the interval ( 0,2 ) at which the tangent line to the graph of $f$ is parallel to the secant line joining the points $(0, f(0))$ and $(2, f(2))$.
L14129: Solution. The function $f$ is continuous and differentiable everywhere because it is a polynomial. In particular, $f$ is continuous on $[0,2]$ and differentiable on $(0,2)$, so the hypotheses of the Mean-Value Theorem are satisfied with $a=0$ and $b=2$. But
L14131: $$
L14132: \begin{array}{ll}
L14133: f(a)=f(0)=1, & f(b)=f(2)=3 \\
L14134: f^{\prime}(x)=\frac{3 x^{2}}{4}, & f^{\prime}(c)=\frac{3 c^{2}}{4}
L14135: \end{array}
L14136: $$
L14138: so in this case Equation (1) becomes
L14140: $$
L14141: \frac{3 c^{2}}{4}=\frac{3-1}{2-0} \quad \text { or } \quad 3 c^{2}=4
L14142: $$
L14144: which has the two solutions $c= \pm 2 / \sqrt{3} \approx \pm 1.15$. However, only the positive solution lies in the interval $(0,2)$; this value of $c$ is consistent with Figure 4.8.7. $\square$
L14146: ## VELOCITY INTERPRETATION OF THE MEAN-VALUE THEOREM
L14148: There is a nice interpretation of the Mean-Value Theorem in the situation where $x=f(t)$ is the position versus time curve for a car moving along a straight road. In this case, the right side of (1) is the average velocity of the car over the time interval from $a \leq t \leq b$, and the left side is the instantaneous velocity at time $t=c$. Thus, the Mean-Value Theorem implies that at least once during the time interval the instantaneous velocity must equal the
L14149: average velocity. This agrees with our real-world experience-if the average velocity for a trip is $40 \mathrm{mi} / \mathrm{h}$, then sometime during the trip the speedometer has to read $40 \mathrm{mi} / \mathrm{h}$.
L14151: Example 5 You are driving on a straight highway on which the speed limit is $55 \mathrm{mi} / \mathrm{h}$. At 8:05 A.M. a police car clocks your velocity at $50 \mathrm{mi} / \mathrm{h}$ and at 8:10 A.M. a second police car posted 5 mi down the road clocks your velocity at $55 \mathrm{mi} / \mathrm{h}$. Explain why the police have a right to charge you with a speeding violation.
L14153: Solution. You traveled 5 mi in $5 \mathrm{~min}\left(=\frac{1}{12} \mathrm{~h}\right)$, so your average velocity was $60 \mathrm{mi} / \mathrm{h}$. Therefore, the Mean-Value Theorem guarantees the police that your instantaneous velocity was $60 \mathrm{mi} / \mathrm{h}$ at least once over the 5 mi section of highway.
L14155: ## CONSEQUENCES OF THE MEAN-VALUE THEOREM
L14157: We stated at the beginning of this section that the Mean-Value Theorem is the starting point for many important results in calculus. As an example of this, we will use it to prove Theorem 4.1.2, which was one of our fundamental tools for analyzing graphs of functions.
L14158: 4.1.2 THEOREM (Revisited) Let $f$ be a function that is continuous on a closed interval $[a, b]$ and differentiable on the open interval ( $a, b$ ).
L14159: (a) If $f^{\prime}(x)>0$ for every value of $x$ in ( $a, b$ ), then $f$ is increasing on $[a, b]$.
L14160: (b) If $f^{\prime}(x)<0$ for every value of $x$ in $(a, b)$, then $f$ is decreasing on $[a, b]$.
L14161: (c) If $f^{\prime}(x)=0$ for every value of $x$ in $(a, b)$, then $f$ is constant on $[a, b]$.
L14162: proof (a) Suppose that $x_{1}$ and $x_{2}$ are points in $[a, b]$ such that $x_{1}<x_{2}$. We must show that $f\left(x_{1}\right)<f\left(x_{2}\right)$. Because the hypotheses of the Mean-Value Theorem are satisfied on the entire interval $[a, b]$, they are satisfied on the subinterval $\left[x_{1}, x_{2}\right]$. Thus, there is some point $c$ in the open interval $\left(x_{1}, x_{2}\right)$ such that
L14164: $$
L14165: f^{\prime}(c)=\frac{f\left(x_{2}\right)-f\left(x_{1}\right)}{x_{2}-x_{1}}
L14166: $$
L14168: or, equivalently,
L14170: $$
L14171: \begin{equation*}
L14172: f\left(x_{2}\right)-f\left(x_{1}\right)=f^{\prime}(c)\left(x_{2}-x_{1}\right) \tag{3}
L14173: \end{equation*}
L14174: $$
L14176: Since $c$ is in the open interval $\left(x_{1}, x_{2}\right)$, it follows that $a<c<b$; thus, $f^{\prime}(c)>0$. However, $x_{2}-x_{1}>0$ since we assumed that $x_{1}<x_{2}$. It follows from (3) that $f\left(x_{2}\right)-f\left(x_{1}\right)>0$ or, equivalently, $f\left(x_{1}\right)<f\left(x_{2}\right)$, which is what we were to prove. The proofs of parts (b) and (c) are similar and are left as exercises.
L14178: ## THE CONSTANT DIFFERENCE THEOREM
L14180: We know from our earliest study of derivatives that the derivative of a constant is zero. Part (c) of Theorem 4.1.2 is the converse of that result; that is, a function whose derivative is zero on an interval must be constant on that interval. If we apply this to the difference of two functions, we obtain the following useful theorem.
L14181: 4.8.3 THEOREM (Constant Difference Theorem) If $f$ and $g$ are differentiable on an interval, and if $f^{\prime}(x)=g^{\prime}(x)$ for all $x$ in that interval, then $f-g$ is constant on the interval; that is, there is a constant $k$ such that $f(x)-g(x)=k$ or, equivalently,
L14183: $$
L14184: f(x)=g(x)+k
L14185: $$
L14187: for all $x$ in the interval.
L14189: PROOF Let $x_{1}$ and $x_{2}$ be any points in the interval such that $x_{1}<x_{2}$. Since the functions $f$ and $g$ are differentiable on the interval, they are continuous on the interval. Since $\left[x_{1}, x_{2}\right]$ is a subinterval, it follows that $f$ and $g$ are continuous on $\left[x_{1}, x_{2}\right]$ and differentiable on $\left(x_{1}, x_{2}\right)$. Moreover, it follows from the basic properties of derivatives and continuity that the same is true of the function
L14191: [FIGURE:d834f3e11ec1de39 | A Cartesian coordinate system displays two wavy curves. The lower curve is labeled $y = g(x)$, and the upper curve is labeled $y = f(x) = g(x) + k$. A double-headed vertical arrow between the curves...]
L14192: △ Figure 4.8.8
L14194: If $f^{\prime}(x)=g^{\prime}(x)$ on an interval, then the graphs of $f$ and $g$ are vertical translations of each other.
L14196: Since
L14198: $$
L14199: F(x)=f(x)-g(x)
L14200: $$
L14202: $$
L14203: F^{\prime}(x)=f^{\prime}(x)-g^{\prime}(x)=0
L14204: $$
L14206: it follows from part (c) of Theorem 4.1.2 that $F(x)=f(x)-g(x)$ is constant on the interval $\left[x_{1}, x_{2}\right]$. This means that $f(x)-g(x)$ has the same value at any two points $x_{1}$ and $x_{2}$ in the interval, and this implies that $f-g$ is constant on the interval.
L14208: Geometrically, the Constant Difference Theorem tells us that if $f$ and $g$ have the same derivative on an interval, then the graphs of $f$ and $g$ are vertical translations of each other over that interval (Figure 4.8.8).
L14210: - Example 6 Part ( $c$ ) of Theorem 4.1.2 is sometimes useful for establishing identities. For example, although we do not need calculus to prove the identity
L14212: $$
L14213: \begin{equation*}
L14214: \sin ^{-1} x+\cos ^{-1} x=\frac{\pi}{2} \quad(-1 \leq x \leq 1) \tag{4}
L14215: \end{equation*}
L14216: $$
L14218: it can be done by letting $f(x)=\sin ^{-1} x+\cos ^{-1} x$. It follows from Formulas (9) and (10) of Section 3.3 that
L14220: $$
L14221: f^{\prime}(x)=\frac{d}{d x}\left[\sin ^{-1} x\right]+\frac{d}{d x}\left[\cos ^{-1} x\right]=\frac{1}{\sqrt{1-x^{2}}}-\frac{1}{\sqrt{1-x^{2}}}=0
L14222: $$
L14224: so $f(x)=\sin ^{-1} x+\cos ^{-1} x$ is constant on the interval $[-1,1]$. We can find this constant by evaluating $f$ at any convenient point in this interval. For example, using $x=0$ we obtain
L14226: $$
L14227: f(0)=\sin ^{-1} 0+\cos ^{-1} 0=0+\frac{\pi}{2}=\frac{\pi}{2}
L14228: $$
L14230: which proves (4).
L14232: ## QUICK CHECK EXERCISES 4.8 (See page 310 for answers.)
L14234: 1. Let $f(x)=x^{2}-x$.
L14235: (a) An interval on which $f$ satisfies the hypotheses of Rolle's Theorem is $\_\_\_\_$ .
L14236: (b) Find all values of $c$ that satisfy the conclusion of Rolle's Theorem for the function $f$ on the interval in part (a).
L14237: 2. Use the accompanying graph of $f$ to find an interval [ $a, b$ ] on which Rolle's Theorem applies, and find all values of $c$ in that interval that satisfy the conclusion of the theorem.
L14239: [FIGURE:35994ce0c4f0cf30 | A graph displays a W-shaped curve on a coordinate plane with x and y axes. The x-axis is labeled from -5 to 5, and the y-axis from -7 to 3, with a grid at integer intervals. The curve has local...]
L14240: \& Figure Ex-2
L14242: 3. Let $f(x)=x^{2}-x$.
L14243: (a) Find a point $b$ such that the slope of the secant line through $(0,0)$ and $(b, f(b))$ is 1.
L14244: (b) Find all values of $c$ that satisfy the conclusion of the Mean-Value Theorem for the function $f$ on the interval $[0, b]$, where $b$ is the point found in part (a).
L14245: 4. Use the graph of $f$ in the accompanying figure to estimate all values of $c$ that satisfy the conclusion of the Mean-Value Theorem on the interval
L14246: (a) $[0,8]$
L14247: (b) $[0,4]$.
L14249: \& Figure Ex-2
L14250: [FIGURE:b3f7438597550db8 | A graph in the first quadrant shows a curve representing the function $y = \sqrt{3x}$. The x-axis is labeled from 0 to 10, and the y-axis is labeled from 0 to 7. The curve starts at the origin...]
L14252: - Figure Ex-4
L14254: 5. Find a function $f$ such that the graph of $f$ contains the point $(1,5)$ and such that for every value of $x_{0}$ the tangent line
L14255: to the graph of $f$ at $x_{0}$ is parallel to the tangent line to the graph of $y=x^{2}$ at $x_{0}$.
L14257: EXERCISE SET 4.8 Graphing Utility
L14259: 1-4 Verify that the hypotheses of Rolle's Theorem are satisfied on the given interval, and find all values of $c$ in that interval that satisfy the conclusion of the theorem.
L14261: 1. $f(x)=x^{2}-8 x+15$; $[3,5]$
L14262: 2. $f(x)=x^{3}-3 x^{2}+2 x ;[0,2]$
L14263: 3. $f(x)=\cos x ;[\pi / 2,3 \pi / 2]$
L14264: 4. $f(x)=\ln \left(4+2 x-x^{2}\right) ;[-1,3]$
L14266: 5-8 Verify that the hypotheses of the Mean-Value Theorem are satisfied on the given interval, and find all values of $c$ in that interval that satisfy the conclusion of the theorem.
L14267: 5. $f(x)=x^{2}-x ;[-3,5]$
L14268: 6. $f(x)=x^{3}+x-4 ;[-1,2]$
L14269: 7. $f(x)=\sqrt{x+1} ;[0,3]$
L14270: 8. $f(x)=x-\frac{1}{x} ;[3,4]$
L14271: 9. (a) Find an interval $[a, b]$ on which
L14273: $$
L14274: f(x)=x^{4}+x^{3}-x^{2}+x-2
L14275: $$
L14277: satisfies the hypotheses of Rolle's Theorem.
L14278: (b) Generate the graph of $f^{\prime}(x)$, and use it to make rough estimates of all values of $c$ in the interval obtained in part (a) that satisfy the conclusion of Rolle's Theorem.
L14279: (c) Use Newton's Method to improve on the rough estimates obtained in part (b).
L14280: 10. Let $f(x)=x^{3}-4 x$.
L14281: (a) Find the equation of the secant line through the points $(-2, f(-2))$ and $(1, f(1))$.
L14282: (b) Show that there is only one point $c$ in the interval $(-2,1)$ that satisfies the conclusion of the Mean-Value Theorem for the secant line in part (a).
L14283: (c) Find the equation of the tangent line to the graph of $f$ at the point $(c, f(c))$.
L14284: (d) Use a graphing utility to generate the secant line in part (a) and the tangent line in part (c) in the same coordinate system, and confirm visually that the two lines seem parallel.
L14286: 11-14 True-False Determine whether the statement is true or false. Explain your answer.
L14287: 11. Rolle's Theorem says that if $f$ is a continuous function on $[a, b]$ and $f(a)=f(b)$, then there is a point between $a$ and $b$ at which the curve $y=f(x)$ has a horizontal tangent line.
L14288: 12. If $f$ is continuous on a closed interval $[a, b]$ and differentiable on $(a, b)$, then there is a point between $a$ and $b$ at which the instantaneous rate of change of $f$ matches the average rate of change of $f$ over $[a, b]$.
L14289: 13. The Constant Difference Theorem says that if two functions have derivatives that differ by a constant on an interval, then the functions are equal on the interval.
L14290: 14. One application of the Mean-Value Theorem is to prove that a function with positive derivative on an interval must be increasing on that interval.
L14292: ## FOCUS ON CONCEPTS
L14294: 15. Let $f(x)=\tan x$.
L14295: (a) Show that there is no point $c$ in the interval $(0, \pi)$ such that $f^{\prime}(c)=0$, even though $f(0)=f(\pi)=0$.
L14296: (b) Explain why the result in part (a) does not contradict Rolle's Theorem.
L14297: 16. Let $f(x)=x^{2 / 3}, a=-1$, and $b=8$.
L14298: (a) Show that there is no point $c$ in ( $a, b$ ) such that
L14300: $$
L14301: f^{\prime}(c)=\frac{f(b)-f(a)}{b-a}
L14302: $$
L14304: (b) Explain why the result in part (a) does not contradict the Mean-Value Theorem.
L14305: 17. (a) Show that if $f$ is differentiable on $(-\infty,+\infty)$, and if $y=f(x)$ and $y=f^{\prime}(x)$ are graphed in the same coordinate system, then between any two $x$-intercepts of $f$ there is at least one $x$-intercept of $f^{\prime}$.
L14306: (b) Give some examples that illustrate this.
L14307: 18. Review Formulas (8) and (9) in Section 2.1 and use the Mean-Value Theorem to show that if $f$ is differentiable on $(-\infty,+\infty)$, then for any interval $\left[x_{0}, x_{1}\right]$ there is at least one point in $\left(x_{0}, x_{1}\right)$ where the instantaneous rate of change of $y$ with respect to $x$ is equal to the average rate of change over the interval.
L14309: 19-21 Use the result of Exercise 18 in these exercises.
L14310: 19. An automobile travels 4 mi along a straight road in 5 min . Show that the speedometer reads exactly $48 \mathrm{mi} / \mathrm{h}$ at least once during the trip.
L14311: 20. At 11 A.M. on a certain morning the outside temperature was $76^{\circ} \mathrm{F}$. At 11 P.M. that evening it had dropped to $52^{\circ} \mathrm{F}$.
L14312: (a) Show that at some instant during this period the temperature was decreasing at the rate of $2^{\circ} \mathrm{F} / \mathrm{h}$.
L14313: (b) Suppose that you know the temperature reached a high of $88^{\circ} \mathrm{F}$ sometime between 11 A.M. and 11 p.M. Show that at some instant during this period the temperature was decreasing at a rate greater than $3^{\circ} \mathrm{F} / \mathrm{h}$.
L14314: 21. Suppose that two runners in a 100 m dash finish in a tie. Show that they had the same velocity at least once during the race.
L14315: 22. Use the fact that
L14317: $$
L14318: \frac{d}{d x}[x \ln (2-x)]=\ln (2-x)-\frac{x}{2-x}
L14319: $$
L14321: to show that the equation $x=(2-x) \ln (2-x)$ has at least one solution in the interval $(0,1)$.
L14322: 23. (a) Use the Constant Difference Theorem (4.8.3) to show that if $f^{\prime}(x)=g^{\prime}(x)$ for all $x$ in the interval $(-\infty,+\infty)$, and if $f$ and $g$ have the same value at some point $x_{0}$, then $f(x)=g(x)$ for all $x$ in $(-\infty,+\infty)$.
L14323: (b) Use the result in part (a) to confirm the trigonometric identity $\sin ^{2} x+\cos ^{2} x=1$.
L14324: 24. (a) Use the Constant Difference Theorem (4.8.3) to show that if $f^{\prime}(x)=g^{\prime}(x)$ for all $x$ in $(-\infty,+\infty)$, and if $f\left(x_{0}\right)-g\left(x_{0}\right)=c$ at some point $x_{0}$, then
L14326: $$
L14327: f(x)-g(x)=c
L14328: $$
L14330: for all $x$ in $(-\infty,+\infty)$.
L14331: (b) Use the result in part (a) to show that the function
L14333: $$
L14334: h(x)=(x-1)^{3}-\left(x^{2}+3\right)(x-3)
L14335: $$
L14337: is constant for all $x$ in ( $-\infty,+\infty$ ), and find the constant.
L14338: (c) Check the result in part (b) by multiplying out and simplifying the formula for $h(x)$.
L14339: 25. Let $g(x)=x e^{x}-e^{x}$. Find $f(x)$ so that $f^{\prime}(x)=g^{\prime}(x)$ and $f(1)=2$.
L14340: 26. Let $g(x)=\tan ^{-1} x$. Find $f(x)$ so that $f^{\prime}(x)=g^{\prime}(x)$ and $f(1)=2$.
