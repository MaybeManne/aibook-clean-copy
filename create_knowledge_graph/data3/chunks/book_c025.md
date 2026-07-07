L08871: where $s$ is the object distance from the lens, $S$ is the image distance from the lens, and $f$ is the focal length of the lens. Suppose that a certain lens has a focal length of 6 cm and that an object is moving toward the lens at the rate of $2 \mathrm{~cm} / \mathrm{s}$. How fast is the image distance changing at the instant when the object is 10 cm from the lens? Is the image moving away from the lens or toward the lens?
L08872: 44. Water is stored in a cone-shaped reservoir (vertex down). Assuming the water evaporates at a rate proportional to the surface area exposed to the air, show that the depth of the water will decrease at a constant rate that does not depend on the dimensions of the reservoir.
L08873: 45. A meteor enters the Earth's atmosphere and burns up at a rate that, at each instant, is proportional to its surface area. Assuming that the meteor is always spherical, show that the radius decreases at a constant rate.
L08874: 46. On a certain clock the minute hand is 4 in long and the hour hand is 3 in long. How fast is the distance between the tips of the hands changing at 9 o'clock?
L08875: 47. Coffee is poured at a uniform rate of $20 \mathrm{~cm}^{3} / \mathrm{s}$ into a cup whose inside is shaped like a truncated cone (see the accompanying figure). If the upper and lower radii of the cup are 4 cm and 2 cm and the height of the cup is 6 cm , how fast will the coffee level be rising when the coffee is halfway up? [Hint: Extend the cup downward to form a cone.]
L08877: [FIGURE:27864f195c03ea8d | A stylized drawing of a white cup with a gray outline and handle, filled approximately halfway with a brown liquid. This image appears to be decorative and does not directly relate to the surrounding...]
L08878: -Figure Ex-47
L08880: ## QUICK CHECK ANSWERS 3.4
L08882: 1. 60
L08883: 2. $\frac{3}{20}$
L08884: 3. $x \frac{d x}{d t}+y \frac{d y}{d t}=0$
L08885: 4. $\frac{d V}{d t}=2 \pi r h \frac{d r}{d t}+\pi r^{2} \frac{d h}{d t}$
L08887: ### 3.5 LOCAL LINEAR APPROXIMATION; DIFFERENTIALS
L08889: [FIGURE:4bc16eed9b6f5c86 | A graph displays the parabola $y=x^2+1$ in an $xy$-coordinate system. Seven distinct points are marked along the curve, and for each point, a magnified inset view shows a small segment of the...]
L08890: △ Figure 3.5.1
L08892: [FIGURE:9e3762c2d5be7ae6 | A graph displays the function $y = f(x) = \sqrt{x}$ as a blue curve and its tangent line $y = 1 + \frac{1}{2}(x - 1)$ as a purple line. Both curves intersect and are tangent at the point $(1, 1)$...]
L08893: △ Figure 3.5.2
L08895: In this section we will show how derivatives can be used to approximate nonlinear functions by linear functions. Also, up to now we have been interpreting $d y / d x$ as a single entity representing the derivative. In this section we will define the quantities $d x$ and $d y$ themselves, thereby allowing us to interpret $d y / d x$ as an actual ratio.
L08897: Recall from Section 2.2 that if a function $f$ is differentiable at $x_{0}$, then a sufficiently magnified portion of the graph of $f$ centered at the point $P\left(x_{0}, f\left(x_{0}\right)\right)$ takes on the appearance of a straight line segment. Figure 3.5.1 illustrates this at several points on the graph of $y=x^{2}+1$. For this reason, a function that is differentiable at $x_{0}$ is sometimes said to be locally linear at $x_{0}$.
L08899: The line that best approximates the graph of $f$ in the vicinity of $P\left(x_{0}, f\left(x_{0}\right)\right)$ is the tangent line to the graph of $f$ at $x_{0}$, given by the equation
L08901: $$
L08902: y=f\left(x_{0}\right)+f^{\prime}\left(x_{0}\right)\left(x-x_{0}\right)
L08903: $$
L08905: [see Formula (3) of Section 2.2]. Thus, for values of $x$ near $x_{0}$ we can approximate values of $f(x)$ by
L08907: $$
L08908: \begin{equation*}
L08909: f(x) \approx f\left(x_{0}\right)+f^{\prime}\left(x_{0}\right)\left(x-x_{0}\right) \tag{1}
L08910: \end{equation*}
L08911: $$
L08913: This is called the local linear approximation of $f$ at $x_{0}$. This formula can also be expressed in terms of the increment $\Delta x=x-x_{0}$ as
L08915: $$
L08916: \begin{equation*}
L08917: f\left(x_{0}+\Delta x\right) \approx f\left(x_{0}\right)+f^{\prime}\left(x_{0}\right) \Delta x \tag{2}
L08918: \end{equation*}
L08919: $$
L08921: ## Example 1
L08923: (a) Find the local linear approximation of $f(x)=\sqrt{x}$ at $x_{0}=1$.
L08924: (b) Use the local linear approximation obtained in part (a) to approximate $\sqrt{1.1}$, and compare your approximation to the result produced directly by a calculating utility.
L08926: Solution (a). Since $f^{\prime}(x)=1 /(2 \sqrt{x})$, it follows from (1) that the local linear approximation of $\sqrt{x}$ at a point $x_{0}$ is
L08928: $$
L08929: \sqrt{x} \approx \sqrt{x_{0}}+\frac{1}{2 \sqrt{x_{0}}}\left(x-x_{0}\right)
L08930: $$
L08932: Thus, the local linear approximation at $x_{0}=1$ is
L08934: $$
L08935: \begin{equation*}
L08936: \sqrt{x} \approx 1+\frac{1}{2}(x-1) \tag{3}
L08937: \end{equation*}
L08938: $$
L08940: The graphs of $y=\sqrt{x}$ and the local linear approximation $y=1+\frac{1}{2}(x-1)$ are shown in Figure 3.5.2.
L08942: Solution (b). Applying (3) with $x=1.1$ yields
L08944: $$
L08945: \sqrt{1.1} \approx 1+\frac{1}{2}(1.1-1)=1.05
L08946: $$
L08948: Since the tangent line $y=1+\frac{1}{2}(x-1)$ in Figure 3.5.2 lies above the graph of $f(x)=\sqrt{x}$, we would expect this approximation to be slightly too large. This expectation is confirmed by the calculator approximation $\sqrt{1.1} \approx 1.04881$.
L08950: Examples 1 and 2 illustrate important ideas and are not meant to suggest that you should use local linear approximations for computations that your calculating utility can perform. The main application of local linear approximation is in modeling problems where it is useful to replace complicated functions by simpler ones.
L08952: [FIGURE:c8518de881607cf4 | A graph displays the curve $y=\sin x$ in blue and the line $y=x$ in red on a Cartesian coordinate system. Both curves intersect at the origin $(0,0)$, which is marked with a blue dot. The line $y=x$...]
L08953: △ Figure 3.5.3
L08955: [FIGURE:a54dc68b532ff905 | A graph plots the absolute error function $E(x) = |\sin x - x|$ as a blue curve, which is symmetric and parabolic-like, centered at the origin. The x-axis ranges from -0.5 to 0.5, and the E-axis from...]
L08956: Figure 3.5.4
L08958: ## Example 2
L08960: (a) Find the local linear approximation of $f(x)=\sin x$ at $x_{0}=0$.
L08961: (b) Use the local linear approximation obtained in part (a) to approximate $\sin 2^{\circ}$, and compare your approximation to the result produced directly by your calculating device.
L08963: Solution (a). Since $f^{\prime}(x)=\cos x$, it follows from (1) that the local linear approximation of $\sin x$ at a point $x_{0}$ is
L08965: $$
L08966: \sin x \approx \sin x_{0}+\left(\cos x_{0}\right)\left(x-x_{0}\right)
L08967: $$
L08969: Thus, the local linear approximation at $x_{0}=0$ is
L08971: $$
L08972: \sin x \approx \sin 0+(\cos 0)(x-0)
L08973: $$
L08975: which simplifies to
L08977: $$
L08978: \begin{equation*}
L08979: \sin x \approx x \tag{4}
L08980: \end{equation*}
L08981: $$
L08983: Solution (b). The variable $x$ in (4) is in radian measure, so we must first convert $2^{\circ}$ to radians before we can apply this approximation. Since
L08985: $$
L08986: 2^{\circ}=2\left(\frac{\pi}{180}\right)=\frac{\pi}{90} \approx 0.0349066 \text { radian }
L08987: $$
L08989: it follows from (4) that $\sin 2^{\circ} \approx 0.0349066$. Comparing the two graphs in Figure 3.5.3, we would expect this approximation to be slightly larger than the exact value. The calculator approximation $\sin 2^{\circ} \approx 0.0348995$ shows that this is indeed the case.
L08991: ## ERROR IN LOCAL LINEAR APPROXIMATIONS
L08993: As a general rule, the accuracy of the local linear approximation to $f(x)$ at $x_{0}$ will deteriorate as $x$ gets progressively farther from $x_{0}$. To illustrate this for the approximation $\sin x \approx x$ in Example 2, let us graph the function
L08995: $$
L08996: E(x)=|\sin x-x|
L08997: $$
L08999: which is the absolute value of the error in the approximation (Figure 3.5.4).
L09000: In Figure 3.5.4, the graph shows how the absolute error in the local linear approximation of $\sin x$ increases as $x$ moves progressively farther from 0 in either the positive or negative direction. The graph also tells us that for values of $x$ between the two vertical lines, the absolute error does not exceed 0.01 . Thus, for example, we could use the local linear approximation $\sin x \approx x$ for all values of $x$ in the interval $-0.35<x<0.35$ (radians) with confidence that the approximation is within $\pm 0.01$ of the exact value.
L09002: ## DIFFERENTIALS
L09004: Newton and Leibniz each used a different notation when they published their discoveries of calculus, thereby creating a notational divide between Britain and the European continent that lasted for more than 50 years. The Leibniz notation $d y / d x$ eventually prevailed because it suggests correct formulas in a natural way, the chain rule
L09006: $$
L09007: \frac{d y}{d x}=\frac{d y}{d u} \cdot \frac{d u}{d x}
L09008: $$
L09010: being a good example.
L09011: Up to now we have interpreted $d y / d x$ as a single entity representing the derivative of $y$ with respect to $x$; the symbols " $d y$ " and " $d x$," which are called differentials, have had no meanings attached to them. Our next goal is to define these symbols in such a way that $d y / d x$ can be treated as an actual ratio. To do this, assume that $f$ is differentiable at a point $x$, define $d x$ to be an independent variable that can have any real value, and define $d y$ by the formula
L09013: $$
L09014: \begin{equation*}
L09015: d y=f^{\prime}(x) d x \tag{5}
L09016: \end{equation*}
L09017: $$
L09019: [FIGURE:6fddbf116cdbec32 | A graph in the $xy$-plane shows a blue curve labeled $y=f(x)$ and a purple line tangent to it at an arbitrary point. The horizontal distance along the $x$-axis from $x$ to $x+dx$ is marked as "Run =...]
L09020: △ Figure 3.5.5
L09022: [FIGURE:f1857155298b8c6a | A graph displays the parabola $y = x^2$ in blue. A purple line, which is tangent to the parabola at the point $(1,1)$, is also shown. Between the points $(1,1)$ and $(3,5)$ on this tangent line, a...]
L09023: △ Figure 3.5.6
L09025: [FIGURE:7e3c781c0e9e64d0 | A graph in the $xy$-plane displays a blue curve representing $y = f(x)$ and a magenta line tangent to the curve at a point $(x, f(x))$. A horizontal segment from $x$ to $x + \Delta x$ on the x-axis...]
L09026: - Figure 3.5.7
L09028: [FIGURE:8451f67104286819 | A graph in the first quadrant shows the curve $y = \sqrt{x}$. A tangent line is drawn to the curve at the point where $x=4$. For a change in $x$ from $4$ to $7$, the differential $dy$ represents the...]
L09029: - Figure 3.5.8
L09031: If $d x \neq 0$, then we can divide both sides of (5) by $d x$ to obtain
L09033: $$
L09034: \begin{equation*}
L09035: \frac{d y}{d x}=f^{\prime}(x) \tag{6}
L09036: \end{equation*}
L09037: $$
L09039: Thus, we have achieved our goal of defining $d y$ and $d x$ so their ratio is $f^{\prime}(x)$. Formula (5) is said to express (6) in differential form.
L09041: To interpret (5) geometrically, note that $f^{\prime}(x)$ is the slope of the tangent line to the graph of $f$ at $x$. The differentials $d y$ and $d x$ can be viewed as a corresponding rise and run of this tangent line (Figure 3.5.5).
L09043: Example 3 Express the derivative with respect to $x$ of $y=x^{2}$ in differential form, and discuss the relationship between $d y$ and $d x$ at $x=1$.
L09045: Solution. The derivative of $y$ with respect to $x$ is $d y / d x=2 x$, which can be expressed in differential form as
L09047: $$
L09048: d y=2 x d x
L09049: $$
L09051: When $x=1$ this becomes
L09053: $$
L09054: d y=2 d x
L09055: $$
L09057: This tells us that if we travel along the tangent line to the curve $y=x^{2}$ at $x=1$, then a change of $d x$ units in $x$ produces a change of $2 d x$ units in $y$. Thus, for example, a run of $d x=2$ units produces a rise of $d y=4$ units along the tangent line (Figure 3.5.6).
L09059: It is important to understand the distinction between the increment $\Delta y$ and the differential $d y$. To see the difference, let us assign the independent variables $d x$ and $\Delta x$ the same value, so $d x=\Delta x$. Then $\Delta y$ represents the change in $y$ that occurs when we start at $x$ and travel along the curve $y=f(x)$ until we have moved $\Delta x(=d x)$ units in the $x$-direction, while $d y$ represents the change in $y$ that occurs if we start at $x$ and travel along the tangent line until we have moved $d x(=\Delta x)$ units in the $x$-direction (Figure 3.5.7).
L09061: - Example 4 Let $y=\sqrt{x}$. Find $d y$ and $\Delta y$ at $x=4$ with $d x=\Delta x=3$. Then make a sketch of $y=\sqrt{x}$, showing $d y$ and $\Delta y$ in the picture.
L09063: Solution. With $f(x)=\sqrt{x}$ we obtain
L09065: $$
L09066: \Delta y=f(x+\Delta x)-f(x)=\sqrt{x+\Delta x}-\sqrt{x}=\sqrt{7}-\sqrt{4} \approx 0.65
L09067: $$
L09069: If $y=\sqrt{x}$, then
L09071: $$
L09072: \frac{d y}{d x}=\frac{1}{2 \sqrt{x}}, \quad \text { so } \quad d y=\frac{1}{2 \sqrt{x}} d x=\frac{1}{2 \sqrt{4}}(3)=\frac{3}{4}=0.75
L09073: $$
L09075: Figure 3.5.8 shows the curve $y=\sqrt{x}$ together with $d y$ and $\Delta y$.
L09077: ## LOCAL LINEAR APPROXIMATION FROM THE DIFFERENTIAL POINT OF VIEW
L09079: Although $\Delta y$ and $d y$ are generally different, the differential $d y$ will nonetheless be a good approximation of $\Delta y$ provided $d x=\Delta x$ is close to 0 . To see this, recall from Section 2.2 that
L09081: $$
L09082: f^{\prime}(x)=\lim _{\Delta x \rightarrow 0} \frac{\Delta y}{\Delta x}
L09083: $$
L09085: It follows that if $\Delta x$ is close to 0 , then we will have $f^{\prime}(x) \approx \Delta y / \Delta x$ or, equivalently,
L09087: $$
L09088: \Delta y \approx f^{\prime}(x) \Delta x
L09089: $$
L09091: If we agree to let $d x=\Delta x$, then we can rewrite this as
L09093: $$
L09094: \begin{equation*}
L09095: \Delta y \approx f^{\prime}(x) d x=d y \tag{7}
L09096: \end{equation*}
L09097: $$
L09099: [FIGURE:01de72ec4834d342 | A photograph shows two women, both barefoot, standing against a light yellow wall. One woman, wearing a red shirt and jeans, stands facing forward with her back to the wall. The other woman, wearing...]
L09100: © Michael Newman/PhotoEdit
L09101: Real-world measurements inevitably have small errors.
L09103: Note that measurement error is positive if the measured value is greater than the exact value and is negative if it is less than the exact value. The sign of the propagated error conveys similar information.
L09105: [^0]In words, this states that for values of $d x$ near zero the differential $d y$ closely approximates the increment $\Delta y$ (Figure 3.5.7). But this is to be expected since the graph of the tangent line at $x$ is the local linear approximation of the graph of $f$.
L09107: ## ERROR PROPAGATION
L09109: In real-world applications, small errors in measured quantities will invariably occur. These measurement errors are of importance in scientific research-all scientific measurements come with measurement errors included. For example, your height might be measured as $170 \pm 0.5 \mathrm{~cm}$, meaning that your exact height lies somewhere between 169.5 and 170.5 cm . Researchers often must use these inexactly measured quantities to compute other quantities, thereby propagating the errors from the measured quantities to the computed quantities. This phenomenon is called error propagation. Researchers must be able to estimate errors in the computed quantities. Our goal is to show how to estimate these errors using local linear approximation and differentials. For this purpose, suppose
L09110: > $x_{0}$ is the exact value of the quantity being measured $y_{0}=f\left(x_{0}\right)$ is the exact value of the quantity being computed $x$ is the measured value of $x_{0} y=f(x)$ is the computed value of $y$
L09112: We define
L09114: $$
L09115: \begin{aligned}
L09116: & d x(=\Delta x)=x-x_{0} \text { to be the measurement error of } x \\
L09117: & \Delta y=f(x)-f\left(x_{0}\right) \text { to be the propagated error of } y
L09118: \end{aligned}
L09119: $$
L09121: It follows from (7) with $x_{0}$ replacing $x$ that the propagated error $\Delta y$ can be approximated by
L09123: $$
L09124: \begin{equation*}
L09125: \Delta y \approx d y=f^{\prime}\left(x_{0}\right) d x \tag{8}
L09126: \end{equation*}
L09127: $$
L09129: Unfortunately, there is a practical difficulty in applying this formula since the value of $x_{0}$ is unknown. (Keep in mind that only the measured value $x$ is known to the researcher.) This being the case, it is standard practice in research to use the measured value $x$ in place of $x_{0}$ in (8) and use the approximation
L09131: $$
L09132: \begin{equation*}
L09133: \Delta y \approx d y=f^{\prime}(x) d x \tag{9}
L09134: \end{equation*}
L09135: $$
L09137: for the propagated error.
L09139: Example 5 Suppose that the side of a square is measured with a ruler to be 10 inches with a measurement error of at most $\pm \frac{1}{32} \mathrm{in}$. Estimate the error in the computed area of the square.
L09141: Solution. Let $x$ denote the exact length of a side and $y$ the exact area so that $y=x^{2}$. It follows from (9) with $f(x)=x^{2}$ that if $d x$ is the measurement error, then the propagated error $\Delta y$ can be approximated as
L09143: $$
L09144: \Delta y \approx d y=2 x d x
L09145: $$
L09147: Substituting the measured value $x=10$ into this equation yields
L09149: $$
L09150: \begin{equation*}
L09151: d y=20 d x \tag{10}
L09152: \end{equation*}
L09153: $$
L09155: But to say that the measurement error is at most $\pm \frac{1}{32}$ means that
L09157: $$
L09158: -\frac{1}{32} \leq d x \leq \frac{1}{32}
L09159: $$
L09161: Multiplying these inequalities through by 20 and applying (10) yields
L09163: $$
L09164: 20\left(-\frac{1}{32}\right) \leq d y \leq 20\left(\frac{1}{32}\right) \quad \text { or equivalently } \quad-\frac{5}{8} \leq d y \leq \frac{5}{8}
L09165: $$
L09167: Thus, the propagated error in the area is estimated to be within $\pm \frac{5}{8} \mathrm{in}^{2}$.
L09169: Formula (11) tells us that, as a rule of thumb, the percentage error in the computed volume of a sphere is approximately 3 times the percentage error in the measured value of its radius. As a rule of thumb, how is the percentage error in the computed area of a square related to the percentage error in the measured value of a side?
L09171: If the true value of a quantity is $q$ and a measurement or calculation produces an error $\Delta q$, then $\Delta q / q$ is called the relative error in the measurement or calculation; when expressed as a percentage, $\Delta q / q$ is called the percentage error. As a practical matter, the true value $q$ is usually unknown, so that the measured or calculated value of $q$ is used instead; and the relative error is approximated by $d q / q$.
L09173: Example 6 The radius of a sphere is measured with a percentage error within $\pm 0.04 \%$. Estimate the percentage error in the calculated volume of the sphere.
L09175: Solution. The volume $V$ of a sphere is $V=\frac{4}{3} \pi r^{3}$, so
L09177: $$
L09178: \frac{d V}{d r}=4 \pi r^{2}
L09179: $$
L09181: from which it follows that $d V=4 \pi r^{2} d r$. Thus, the relative error in $V$ is approximately
L09183: $$
L09184: \begin{equation*}
L09185: \frac{d V}{V}=\frac{4 \pi r^{2} d r}{\frac{4}{3} \pi r^{3}}=3 \frac{d r}{r} \tag{11}
L09186: \end{equation*}
L09187: $$
L09189: We are given that the relative error in the measured value of $r$ is $\pm 0.04 \%$, which means that
L09191: $$
L09192: -0.0004 \leq \frac{d r}{r} \leq 0.0004
L09193: $$
L09195: Multiplying these inequalities through by 3 and applying (11) yields
L09197: $$
L09198: 3(-0.0004) \leq \frac{d V}{V} \leq 3(0.0004) \quad \text { or equivalently } \quad-0.0012 \leq \frac{d V}{V} \leq 0.0012
L09199: $$
L09201: Thus, we estimate the percentage error in the calculated value of $V$ to be within $\pm 0.12 \%$.
L09203: ## MORE NOTATION; DIFFERENTIAL FORMULAS
L09205: The symbol $d f$ is another common notation for the differential of a function $y=f(x)$. For example, if $f(x)=\sin x$, then we can write $d f=\cos x d x$. We can also view the symbol " $d$ " as an operator that acts on a function to produce the corresponding differential. For example, $d\left[x^{2}\right]=2 x d x, d[\sin x]=\cos x d x$, and so on. All of the general rules of differentiation then have corresponding differential versions:
L09207: | DERIVATIVE FORMULA | DIFFERENTIAL FORMULA |
L09208: | :--- | :--- |
L09209: | $\frac{d}{d x}[c]=0$ | $d[c]=0$ |
L09210: | $\frac{d}{d x}[c f]=c \frac{d f}{d x}$ | $d[c f]=c d f$ |
L09211: | $\frac{d}{d x}[f+g]=\frac{d f}{d x}+\frac{d g}{d x}$ | $d[f+g]=d f+d g$ |
L09212: | $\frac{d}{d x}[f g]=f \frac{d g}{d x}+g \frac{d f}{d x}$ | $d[f g]=f d g+g d f$ |
L09213: | $\frac{d}{d x}\left[\frac{f}{g}\right]=\frac{g \frac{d f}{d x}-f \frac{d g}{d x}}{g^{2}}$ | $d\left[\frac{f}{g}\right]=\frac{g d f-f d g}{g^{2}}$ |
L09215: For example,
L09217: $$
L09218: \begin{aligned}
L09219: d\left[x^{2} \sin x\right] & =\left(x^{2} \cos x+2 x \sin x\right) d x \\
L09220: & =x^{2}(\cos x d x)+(2 x d x) \sin x \\
L09221: & =x^{2} d[\sin x]+(\sin x) d\left[x^{2}\right]
L09222: \end{aligned}
L09223: $$
L09225: illustrates the differential version of the product rule.
L09227: 1. The local linear approximation of $f$ at $x_{0}$ uses the line to the graph of $y=f(x)$ at $x=x_{0}$ to approximate values of $\_\_\_\_$ for values of $x$ near $\_\_\_\_$ .
L09228: 2. Find an equation for the local linear approximation to $y=5-x^{2}$ at $x_{0}=2$.
L09229: 3. Let $y=5-x^{2}$. Find $d y$ and $\Delta y$ at $x=2$ with $d x=\Delta x=0.1$.
L09230: 4. The intensity of light from a light source is a function $I=f(x)$ of the distance $x$ from the light source. Suppose that a small gemstone is measured to be 10 m from a light source, $f(10)=0.2 \mathrm{~W} / \mathrm{m}^{2}$, and $f^{\prime}(10)=-0.04 \mathrm{~W} / \mathrm{m}^{3}$. If the distance $x=10 \mathrm{~m}$ was obtained with a measurement error within $\pm 0.05 \mathrm{~m}$, estimate the percentage error in the calculated intensity of the light on the gemstone.
L09232: ## EXERCISE SET 3.5 Graphing Utility
L09234: 1. (a) Use Formula (1) to obtain the local linear approximation of $x^{3}$ at $x_{0}=1$.
L09235: (b) Use Formula (2) to rewrite the approximation obtained in part (a) in terms of $\Delta x$.
L09236: (c) Use the result obtained in part (a) to approximate $(1.02)^{3}$, and confirm that the formula obtained in part (b) produces the same result.
L09237: 2. (a) Use Formula (1) to obtain the local linear approximation of $1 / x$ at $x_{0}=2$.
L09238: (b) Use Formula (2) to rewrite the approximation obtained in part (a) in terms of $\Delta x$.
L09239: (c) Use the result obtained in part (a) to approximate 1/2.05, and confirm that the formula obtained in part (b) produces the same result.
L09241: ## FOCUS ON CONCEPTS
L09243: 3. (a) Find the local linear approximation of the function $f(x)=\sqrt{1+x}$ at $x_{0}=0$, and use it to approximate $\sqrt{0.9}$ and $\sqrt{1.1}$.
L09244: (b) Graph $f$ and its tangent line at $x_{0}$ together, and use the graphs to illustrate the relationship between the exact values and the approximations of $\sqrt{0.9}$ and $\sqrt{1.1}$.
L09245: 4. A student claims that whenever a local linear approximation is used to approximate the square root of a number, the approximation is too large.
L09246: (a) Write a few sentences that make the student's claim precise, and justify this claim geometrically.
L09247: (b) Verify the student's claim algebraically using approximation (1).
L09249: 5-10 Confirm that the stated formula is the local linear approximation at $x_{0}=0$.
L09250: 5. $(1+x)^{15} \approx 1+15 x$
L09251: 6. $\frac{1}{\sqrt{1-x}} \approx 1+\frac{1}{2} x$
L09252: 7. $\tan x \approx x$
L09253: 8. $\frac{1}{1+x} \approx 1-x$
L09254: 9. $e^{x} \approx 1+x$
L09255: 10. $\ln (1+x) \approx x$
L09257: 11-16 Confirm that the stated formula is the local linear approximation of $f$ at $x_{0}=1$, where $\Delta x=x-1$.
L09258: 11. $f(x)=x^{4} ;(1+\Delta x)^{4} \approx 1+4 \Delta x$
L09259: 12. $f(x)=\sqrt{x} ; \sqrt{1+\Delta x} \approx 1+\frac{1}{2} \Delta x$
L09260: 13. $f(x)=\frac{1}{2+x} ; \frac{1}{3+\Delta x} \approx \frac{1}{3}-\frac{1}{9} \Delta x$
L09261: 14. $f(x)=(4+x)^{3} ;(5+\Delta x)^{3} \approx 125+75 \Delta x$
L09262: 15. $\tan ^{-1} x ; \tan ^{-1}(1+\Delta x) \approx \frac{\pi}{4}+\frac{1}{2} \Delta x$
L09263: 16. $\sin ^{-1}\left(\frac{x}{2}\right) ; \sin ^{-1}\left(\frac{1}{2}+\frac{1}{2} \Delta x\right) \approx \frac{\pi}{6}+\frac{1}{\sqrt{3}} \Delta x$
L09265: 17-20 Confirm that the formula is the local linear approximation at $x_{0}=0$, and use a graphing utility to estimate an interval of $x$-values on which the error is at most $\pm 0.1$.
L09266: 17. $\sqrt{x+3} \approx \sqrt{3}+\frac{1}{2 \sqrt{3}} x$
L09267: 18. $\frac{1}{\sqrt{9-x}} \approx \frac{1}{3}+\frac{1}{54} x$
L09268: 19. $\tan 2 x \approx 2 x$
L09269: 20. $\frac{1}{(1+2 x)^{5}} \approx 1-10 x$
L09270: 21. (a) Use the local linear approximation of $\sin x$ at $x_{0}=0$ obtained in Example 2 to approximate $\sin 1^{\circ}$, and compare the approximation to the result produced directly by your calculating device.
L09271: (b) How would you choose $x_{0}$ to approximate $\sin 44^{\circ}$ ?
L09272: (c) Approximate $\sin 44^{\circ}$; compare the approximation to the result produced directly by your calculating device.
L09273: 22. (a) Use the local linear approximation of $\tan x$ at $x_{0}=0$ to approximate $\tan 2^{\circ}$, and compare the approximation to the result produced directly by your calculating device.
L09274: (b) How would you choose $x_{0}$ to approximate $\tan 61^{\circ}$ ?
L09275: (c) Approximate $\tan 61^{\circ}$; compare the approximation to the result produced directly by your calculating device.
L09277: 23-31 Use an appropriate local linear approximation to estimate the value of the given quantity.
L09278: 23. $(3.02)^{4}$
L09279: 24. $(1.97)^{3}$
L09280: 25. $\sqrt{65}$
L09281: 26. $\sqrt{24}$
L09282: 27. $\sqrt{80.9}$
L09283: 28. $\sqrt{36.03}$
L09284: 29. $\sin 0.1$
L09285: 30. $\tan 0.2$
L09286: 31. $\cos 31^{\circ}$
L09287: 32. $\ln (1.01)$
L09288: 33. $\tan ^{-1}(0.99)$
