L00001: [FIGURE:33d1836b7e862c7c | A skydiver, wearing a dark jumpsuit and goggles, smiles widely while freefalling, looking directly at the camera. Below them, a vast landscape of mountains and urban areas stretches out under a clear...]
L00003: ## LIMITS AND CONTINUITY
L00005: Joe McBride/Stone/Getty Images
L00007: Air resistance prevents the velocity of a skydiver from increasing indefinitely. The velocity approaches a limit, called the "terminal velocity."
L00009: The development of calculus in the seventeenth century by Newton and Leibniz provided scientists with their first real understanding of what is meant by an "instantaneous rate of change" such as velocity and acceleration. Once the idea was understood conceptually, efficient computational methods followed, and science took a quantum leap forward. The fundamental building block on which rates of change rest is the concept of a "limit," an idea that is so important that all other calculus concepts are now based on it.
L00011: In this chapter we will develop the concept of a limit in stages, proceeding from an informal, intuitive notion to a precise mathematical definition. We will also develop theorems and procedures for calculating limits, and we will conclude the chapter by using the limits to study "continuous" curves.
L00013: ### 1.1 LIMITS (AN INTUITIVE APPROACH)
L00015: The concept of a "limit" is the fundamental building block on which all calculus concepts are based. In this section we will study limits informally, with the goal of developing an intuitive feel for the basic ideas. In the next three sections we will focus on computational methods and precise definitions.
L00017: [FIGURE:9fcde6e7d2336e4b | A graph displays a blue curve, labeled $y = f(x)$, in a Cartesian coordinate system with x and y axes. A specific point on the curve is marked as $P(x_0, y_0)$. A straight purple line, labeled...]
L00018: A Figure 1.1.1
L00020: Many of the ideas of calculus originated with the following two geometric problems:
L00022: > THE TANGENT LINE PROBLEM Given a function $f$ and a point $P\left(x_{0}, y_{0}\right)$ on its graph, find an equation of the line that is tangent to the graph at $P$ (Figure 1.1.1).
L00024: THE AREA PROBLEM Given a function $f$, find the area between the graph of $f$ and an interval $[a, b]$ on the $x$-axis (Figure 1.1.2).
L00026: Traditionally, that portion of calculus arising from the tangent line problem is called differential calculus and that arising from the area problem is called integral calculus. However, we will see later that the tangent line and area problems are so closely related that the distinction between differential and integral calculus is somewhat artificial.
L00028: [FIGURE:934a9da0e050dfb1 | A two-dimensional graph shows a coordinate system with an x-axis and a y-axis. A smooth curve, labeled $y=f(x)$, is drawn in the first quadrant. Vertical lines extend from the x-axis to the curve at...]
L00029: - Figure 1.1.2
L00031: [FIGURE:9da16d732c4f0c0a | Two diagrams illustrate tangent lines to curves. Diagram (a) shows a magenta line tangent to a blue circle at a single blue point. Diagram (b) shows a horizontal magenta line tangent to a blue curve...]
L00032: Δ Figure 1.1.3
L00034: [FIGURE:ec827389bfdb0cae | A blue, smooth, oscillating curve is depicted, intersected by a horizontal purple line. A single intersection point on the left side of the figure, where the blue curve is increasing, is highlighted...]
L00035: Δ Figure 1.1.3
L00037: - Figure 1.1.4
L00039: Why are we requiring that $P$ and $Q$ be distinct?
L00041: ## TANGENT LINES AND LIMITS
L00043: In plane geometry, a line is called tangent to a circle if it meets the circle at precisely one point (Figure 1.1.3a). Although this definition is adequate for circles, it is not appropriate for more general curves. For example, in Figure 1.1.3b, the line meets the curve exactly once but is obviously not what we would regard to be a tangent line; and in Figure 1.1.3c, the line appears to be tangent to the curve, yet it intersects the curve more than once.
L00045: To obtain a definition of a tangent line that applies to curves other than circles, we must view tangent lines another way. For this purpose, suppose that we are interested in the tangent line at a point $P$ on a curve in the $x y$-plane and that $Q$ is any point that lies on the curve and is different from $P$. The line through $P$ and $Q$ is called a secant line for the curve at $P$. Intuition suggests that if we move the point $Q$ along the curve toward $P$, then the secant line will rotate toward a limiting position. The line in this limiting position is what we will consider to be the tangent line at $P$ (Figure 1.1.4a). As suggested by Figure 1.1.4b, this new concept of a tangent line coincides with the traditional concept when applied to circles.
L00046: [FIGURE:b0509e2d0853005a | The figure consists of two diagrams, (a) and (b), illustrating the concept of a tangent line as the limit of secant lines. In (a), a blue curve is shown on an $x$-$y$ coordinate system with a point...]
L00048: Example 1 Find an equation for the tangent line to the parabola $y=x^{2}$ at the point $P(1,1)$.
L00050: Solution. If we can find the slope $m_{\tan }$ of the tangent line at $P$, then we can use the point $P$ and the point-slope formula for a line (Web Appendix G) to write the equation of the tangent line as
L00052: $$
L00053: \begin{equation*}
L00054: y-1=m_{\tan }(x-1) \tag{1}
L00055: \end{equation*}
L00056: $$
L00058: To find the slope $m_{\text {tan }}$, consider the secant line through $P$ and a point $Q\left(x, x^{2}\right)$ on the parabola that is distinct from $P$. The slope $m_{\text {sec }}$ of this secant line is
L00060: $$
L00061: \begin{equation*}
L00062: m_{\mathrm{sec}}=\frac{x^{2}-1}{x-1} \tag{2}
L00063: \end{equation*}
L00064: $$
L00066: Figure 1.1.4a suggests that if we now let $Q$ move along the parabola, getting closer and closer to $P$, then the limiting position of the secant line through $P$ and $Q$ will coincide with that of the tangent line at $P$. This in turn suggests that the value of $m_{\mathrm{sec}}$ will get closer and closer to the value of $m_{\tan }$ as $P$ moves toward $Q$ along the curve. However, to say that $Q\left(x, x^{2}\right)$ gets closer and closer to $P(1,1)$ is algebraically equivalent to saying that $x$ gets closer and closer to 1 . Thus, the problem of finding $m_{\tan }$ reduces to finding the "limiting value" of $m_{\text {sec }}$ in Formula (2) as $x$ gets closer and closer to 1 (but with $x \neq 1$ to ensure that $P$ and $Q$ remain distinct).
L00068: [FIGURE:134839e73258cc63 | A graph in a Cartesian coordinate system shows the parabola $y=x^2$ in blue and the line $y=2x-1$ in purple. The line is tangent to the parabola at the point $P(1,1)$, which is marked with a blue...]
L00069: - Figure 1.1.5
L00071: [FIGURE:63559c4dfcf0643c | The image displays two diagrams illustrating area decomposition. The left diagram shows an L-shaped region composed of two rectangles, labeled $A_1$ and $A_2$. The right diagram shows a pentagon...]
L00072: Δ Figure 1.1.6
L00074: We can rewrite (2) as
L00076: $$
L00077: m_{\mathrm{sec}}=\frac{x^{2}-1}{x-1}=\frac{(x-1)(x+1)}{(x-1)}=x+1
L00078: $$
L00080: where the cancellation of the factor $(x-1)$ is allowed because $x \neq 1$. It is now evident that $m_{\text {sec }}$ gets closer and closer to 2 as $x$ gets closer and closer to 1 . Thus, $m_{\tan }=2$ and (1) implies that the equation of the tangent line is
L00082: $$
L00083: y-1=2(x-1) \quad \text { or equivalently } \quad y=2 x-1
L00084: $$
L00086: Figure 1.1.5 shows the graph of $y=x^{2}$ and this tangent line. $\square$
L00088: ## AREAS AND LIMITS
L00090: Just as the general notion of a tangent line leads to the concept of limit, so does the general notion of area. For plane regions with straight-line boundaries, areas can often be calculated by subdividing the region into rectangles or triangles and adding the areas of the constituent parts (Figure 1.1.6). However, for regions with curved boundaries, such as that in Figure 1.1.7a, a more general approach is needed. One such approach is to begin by approximating the area of the region by inscribing a number of rectangles of equal width under the curve and adding the areas of these rectangles (Figure 1.1.7b). Intuition suggests that if we repeat that approximation process using more and more rectangles, then the rectangles will tend to fill in the gaps under the curve, and the approximations will get closer and closer to the exact area under the curve (Figure 1.1.7c). This suggests that we can define the area under the curve to be the limiting value of these approximations. This idea will be considered in detail later, but the point to note here is that once again the concept of a limit comes into play.
L00092: [FIGURE:45d085599a7857ee | The figure consists of three graphs, (a), (b), and (c), each showing a blue curve $y=f(x)$ above the x-axis, bounded by vertical lines at $x=a$ and $x=b$. Graph (a) depicts the exact area under the...]
L00093: \$ Figure 1.1.7
L00095: [FIGURE:81e8d08a03ce6933 | The image displays the Mandelbrot set, a fractal shape, rendered in black with a golden-yellow boundary against a dark blue background. The boundary exhibits intricate, self-similar patterns at...]
L00096: © James Oakley/Alamy
L00097: This figure shows a region called the Mandelbrot Set. It illustrates how complicated a region in the plane can be and why the notion of area requires careful definition.
L00099: ## DECIMALS AND LIMITS
L00101: Limits also arise in the familiar context of decimals. For example, the decimal expansion of the fraction $\frac{1}{3}$ is
L00103: $$
L00104: \begin{equation*}
L00105: \frac{1}{3}=0.33333 \ldots \tag{3}
L00106: \end{equation*}
L00107: $$
L00109: in which the dots indicate that the digit 3 repeats indefinitely. Although you may not have thought about decimals in this way, we can write (3) as
L00111: $$
L00112: \begin{equation*}
L00113: \frac{1}{3}=0.33333 \ldots=0.3+0.03+0.003+0.0003+0.00003+\cdots \tag{4}
L00114: \end{equation*}
L00115: $$
L00117: which is a sum with "infinitely many" terms. As we will discuss in more detail later, we interpret (4) to mean that the succession of finite sums
L00119: $$
L00120: 0.3, \quad 0.3+0.03, \quad 0.3+0.03+0.003, \quad 0.3+0.03+0.003+0.0003, \ldots
L00121: $$
L00123: gets closer and closer to a limiting value of $\frac{1}{3}$ as more and more terms are included. Thus, limits even occur in the familiar context of decimal representations of real numbers.
L00125: ## LIMITS
L00127: Now that we have seen how limits arise in various ways, let us focus on the limit concept itself.
L00129: The most basic use of limits is to describe how a function behaves as the independent variable approaches a given value. For example, let us examine the behavior of the function
L00131: $$
L00132: f(x)=x^{2}-x+1
L00133: $$
L00135: for $x$-values closer and closer to 2 . It is evident from the graph and table in Figure 1.1.8 that the values of $f(x)$ get closer and closer to 3 as values of $x$ are selected closer and closer to 2 on either the left or the right side of 2 . We describe this by saying that the "limit of $x^{2}-x+1$ is 3 as $x$ approaches 2 from either side," and we write
L00137: $$
L00138: \begin{equation*}
L00139: \lim _{x \rightarrow 2}\left(x^{2}-x+1\right)=3 \tag{5}
L00140: \end{equation*}
L00141: $$
L00143: [FIGURE:18d8152e99082931 | A graph displays the function $y = f(x) = x^2 - x + 1$ in a Cartesian coordinate system. As the independent variable $x$ approaches 2 from both the left and the right, indicated by red arrows on the...]
L00144: - Figure 1.1.8
L00146: | $x$ | 1.0 | 1.5 | 1.9 | 1.95 | 1.99 | 1.995 | 1.999 | 2 | 2.001 | 2.005 | 2.01 | 2.05 | 2.1 | 2.5 | 3.0 |
L00147: | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
L00148: | $f(x)$ | 1.000000 | 1.750000 | 2.710000 | 2.852500 | 2.970100 | 2.985025 | 2.997001 |  | 3.003001 | 3.015025 | 3.030100 | 3.152500 | 3.310000 | 4.750000 | 7.000000 |
L00149: | Left side <br> Right side |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
L00151: - Figure 1.1.8
L00153: This leads us to the following general idea.
L00155: Since $x$ is required to be different from $a$ in (6), the value of $f$ at $a$, or even whether $f$ is defined at $a$, has no bearing on the limit $L$. The limit describes the behavior of $f$ close to $a$ but not at $a$.
L00156: 1.1.1 LIMITS (AN INFORMAL VIEW) If the values of $f(x)$ can be made as close as we like to $L$ by taking values of $x$ sufficiently close to $a$ (but not equal to $a$ ), then we write
L00158: $$
L00159: \begin{equation*}
L00160: \lim _{x \rightarrow a} f(x)=L \tag{6}
L00161: \end{equation*}
L00162: $$
L00164: which is read "the limit of $f(x)$ as $x$ approaches $a$ is $L$ " or " $f(x)$ approaches $L$ as $x$ approaches $a$." The expression in (6) can also be written as
L00166: $$
L00167: \begin{equation*}
L00168: f(x) \rightarrow L \quad \text { as } \quad x \rightarrow a \tag{7}
L00169: \end{equation*}
L00170: $$
L00172: ## TECHNOLOGY MASTERY
L00174: Use a graphing utility to generate the graph of the equation $y=f(x)$ for the function in (9). Find a window containing $x=1$ in which all values of $f(x)$ are within 0.5 of $y=2$ and one in which all values of $f(x)$ are within 0.1 of $y=2$.
L00176: Example 2 Use numerical evidence to make a conjecture about the value of
L00178: $$
L00179: \begin{equation*}
L00180: \lim _{x \rightarrow 1} \frac{x-1}{\sqrt{x}-1} \tag{8}
L00181: \end{equation*}
L00182: $$
L00184: Solution. Although the function
L00186: $$
L00187: \begin{equation*}
L00188: f(x)=\frac{x-1}{\sqrt{x}-1} \tag{9}
L00189: \end{equation*}
L00190: $$
L00192: is undefined at $x=1$, this has no bearing on the limit. Table 1.1.1 shows sample $x$-values approaching 1 from the left side and from the right side. In both cases the corresponding values of $f(x)$, calculated to six decimal places, appear to get closer and closer to 2 , and hence we conjecture that
L00194: $$
L00195: \lim _{x \rightarrow 1} \frac{x-1}{\sqrt{x}-1}=2
L00196: $$
L00198: This is consistent with the graph of $f$ shown in Figure 1.1.9. In the next section we will show how to obtain this result algebraically.
L00200: Table 1.1.1
L00201: | $x$ | 0.99 | 0.999 | 0.9999 | 0.99999 | 1.00001 | 1.0001 | 1.001 | 1.01 |
L00202: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
L00203: | $f(x)$ | 1.994987 | 1.999500 | 1.999950 | 1.999995 | 2.000005 | 2.000050 | 2.000500 | 2.004988 |
L00206: [FIGURE:76db3e780755a129 | This graph plots the function $y = f(x) = \frac{x-1}{\sqrt{x}-1}$ on a coordinate plane. The curve is a smooth, increasing line with a hole at the point $(1, 2)$, indicating that the function is...]
L00207: Figure 1.1.9
L00209: Use numerical evidence to determine whether the limit in (11) changes if $x$ is measured in degrees.
L00211: Table 1.1.2
L00212: | $x$ <br> (RADIANS) | $y=\frac{\sin x}{x}$ |
L00213: | :---: | :---: |
L00214: | $\pm 1.0$ | 0.84147 |
L00215: | $\pm 0.9$ | 0.87036 |
L00216: | $\pm 0.8$ | 0.89670 |
L00217: | $\pm 0.7$ | 0.92031 |
L00218: | $\pm 0.6$ | 0.94107 |
L00219: | $\pm 0.5$ | 0.95885 |
L00220: | $\pm 0.4$ | 0.97355 |
L00221: | $\pm 0.3$ | 0.98507 |
L00222: | $\pm 0.2$ | 0.99335 |
L00223: | $\pm 0.1$ | 0.99833 |
L00224: | $\pm 0.01$ | 0.99998 |
L00227: Example 3 Use numerical evidence to make a conjecture about the value of
L00229: $$
L00230: \begin{equation*}
L00231: \lim _{x \rightarrow 0} \frac{\sin x}{x} \tag{10}
L00232: \end{equation*}
L00233: $$
L00235: Solution. With the help of a calculating utility set in radian mode, we obtain Table 1.1.2. The data in the table suggest that
L00237: $$
L00238: \begin{equation*}
L00239: \lim _{x \rightarrow 0} \frac{\sin x}{x}=1 \tag{11}
L00240: \end{equation*}
L00241: $$
L00243: The result is consistent with the graph of $f(x)=(\sin x) / x$ shown in Figure 1.1.10. Later in this chapter we will give a geometric argument to prove that our conjecture is correct. $\square$
L00245: [FIGURE:ba07fcb4e61bf7ba | The graph shows the function $y = f(x) = \frac{\sin x}{x}$ in a Cartesian coordinate system. The curve approaches an open circle at $(0,1)$, illustrating that as $x$ approaches $0$ from either side...]
L00246: Figure 1.1.10
L00248: $$
L00249: \begin{aligned}
L00250: & \text { As } x \text { approaches } 0 \text { from the left } \\
L00251: & \text { or right, } f(x) \text { approaches } 1 \text {. }
L00252: \end{aligned}
L00253: $$
L00255: ## SAMPLING PITFALLS
L00257: Numerical evidence can sometimes lead to incorrect conclusions about limits because of roundoff error or because the sample values chosen do not reveal the true limiting behavior. For example, one might incorrectly conclude from Table 1.1.3 that
L00259: $$
L00260: \lim _{x \rightarrow 0} \sin \left(\frac{\pi}{x}\right)=0
L00261: $$
L00263: The fact that this is not correct is evidenced by the graph of $f$ in Figure 1.1.11. The graph reveals that the values of $f$ oscillate between -1 and 1 with increasing rapidity as $x \rightarrow 0$ and hence do not approach a limit. The data in the table deceived us because the $x$-values selected all happened to be $x$-intercepts for $f(x)$. This points out the need for having alternative methods for corroborating limits conjectured from numerical evidence.
L00265: Table 1.1.3
L00266: | $x$ | $\frac{\pi}{x}$ | $f(x)=\sin \left(\frac{\pi}{x}\right)$ |
L00267: | :--- | :--- | :--- |
L00268: | $x= \pm 1$ | $\pm \pi$ | $\sin ( \pm \pi)=0$ |
L00269: | $x= \pm 0.1$ | $\pm 10 \pi$ | $\sin ( \pm 10 \pi)=0$ |
L00270: | $x= \pm 0.01$ | $\pm 100 \pi$ | $\sin ( \pm 100 \pi)=0$ |
L00271: | $x= \pm 0.001$ | $\pm 1000 \pi$ | $\sin ( \pm 1000 \pi)=0$ |
L00272: | $x= \pm 0.0001$ | $\pm 10,000 \pi$ | $\sin ( \pm 10,000 \pi)=0$ |
L00273: | $\vdots$ | $\vdots$ | $\vdots$ |
L00276: [FIGURE:2528cf2a04941c80 | The graph displays the function $y = \sin(\frac{\pi}{x})$ on a Cartesian coordinate system with x and y axes labeled. The curve oscillates between $y=-1$ and $y=1$, with the frequency of oscillation...]
L00277: - Figure 1.1.11
L00279: [FIGURE:4f18e6a54b824dfc | A graph on an $xy$-coordinate system shows the function $y = \frac{|x|}{x}$. For all $x > 0$, the function has a constant value of $y=1$, represented by a horizontal line segment starting with an...]
L00280: A Figure 1.1.12
L00282: As with two-sided limits, the one-sided limits in (14) and (15) can also be written as
L00284: $$
L00285: f(x) \rightarrow L \quad \text { as } \quad x \rightarrow a^{+}
L00286: $$
L00288: and
L00290: $$
L00291: f(x) \rightarrow L \quad \text { as } \quad x \rightarrow a^{-}
L00292: $$
L00294: respectively.
L00296: ## ONE-SIDED LIMITS
L00298: The limit in (6) is called a two-sided limit because it requires the values of $f(x)$ to get closer and closer to $L$ as values of $x$ are taken from either side of $x=a$. However, some functions exhibit different behaviors on the two sides of an $x$-value $a$, in which case it is necessary to distinguish whether values of $x$ near $a$ are on the left side or on the right side of $a$ for purposes of investigating limiting behavior. For example, consider the function
L00300: $$
L00301: f(x)=\frac{|x|}{x}=\left\{\begin{align*}
L00302: 1, & x>0  \tag{12}\\
L00303: -1, & x<0
L00304: \end{align*}\right.
L00305: $$
L00307: which is graphed in Figure 1.1.12. As $x$ approaches 0 from the right, the values of $f(x)$ approach a limit of 1 [in fact, the values of $f(x)$ are exactly 1 for all such $x$ ], and similarly, as $x$ approaches 0 from the left, the values of $f(x)$ approach a limit of -1 . We denote these limits by writing
L00309: $$
L00310: \begin{equation*}
L00311: \lim _{x \rightarrow 0^{+}} \frac{|x|}{x}=1 \quad \text { and } \quad \lim _{x \rightarrow 0^{-}} \frac{|x|}{x}=-1 \tag{13}
L00312: \end{equation*}
L00313: $$
L00315: With this notation, the superscript "+" indicates a limit from the right and the superscript "-" indicates a limit from the left.
L00317: This leads to the general idea of a one-sided limit.
L00318: 1.1.2 ONE-SIDED LIMITS (AN INFORMAL VIEW) If the values of $f(x)$ can be made as close as we like to $L$ by taking values of $x$ sufficiently close to $a$ (but greater than $a$ ), then we write
L00320: $$
L00321: \begin{equation*}
L00322: \lim _{x \rightarrow a^{+}} f(x)=L \tag{14}
L00323: \end{equation*}
L00324: $$
L00326: and if the values of $f(x)$ can be made as close as we like to $L$ by taking values of $x$ sufficiently close to $a$ (but less than $a$ ), then we write
L00328: $$
L00329: \begin{equation*}
L00330: \lim _{x \rightarrow a^{-}} f(x)=L \tag{15}
L00331: \end{equation*}
L00332: $$
L00334: Expression (14) is read "the limit of $f(x)$ as $x$ approaches $a$ from the right is $L$ " or " $f(x)$ approaches $L$ as $x$ approaches $a$ from the right." Similarly, expression (15) is read "the limit of $f(x)$ as $x$ approaches $a$ from the left is $L$ " or " $f(x)$ approaches $L$ as $x$ approaches $a$ from the left."
L00336: ## THE RELATIONSHIP BETWEEN ONE-SIDED LIMITS AND TWO-SIDED LIMITS
L00338: In general, there is no guarantee that a function $f$ will have a two-sided limit at a given point $a$; that is, the values of $f(x)$ may not get closer and closer to any single real number $L$ as $x \rightarrow a$. In this case we say that
L00340: $$
L00341: \lim _{x \rightarrow a} f(x) \text { does not exist }
L00342: $$
L00344: Similarly, the values of $f(x)$ may not get closer and closer to a single real number $L$ as $x \rightarrow a^{+}$or as $x \rightarrow a^{-}$. In these cases we say that
L00346: $$
L00347: \lim _{x \rightarrow a^{+}} f(x) \text { does not exist }
L00348: $$
L00350: or that
L00352: $$
L00353: \lim _{x \rightarrow a^{-}} f(x) \text { does not exist }
L00354: $$
L00356: In order for the two-sided limit of a function $f(x)$ to exist at a point $a$, the values of $f(x)$ must approach some real number $L$ as $x$ approaches $a$, and this number must be the same regardless of whether $x$ approaches $a$ from the left or the right. This suggests the following result, which we state without formal proof.
L00357: 1.1.3 THE RELATIONSHIP BETWEEN ONE-SIDED AND TWO-SIDED LIMITS The twosided limit of a function $f(x)$ exists at $a$ if and only if both of the one-sided limits exist at $a$ and have the same value; that is,
L00359: $$
L00360: \lim _{x \rightarrow a} f(x)=L \quad \text { if and only if } \quad \lim _{x \rightarrow a^{-}} f(x)=L=\lim _{x \rightarrow a^{+}} f(x)
L00361: $$
L00363: Example 4 Explain why
L00365: $$
L00366: \lim _{x \rightarrow 0} \frac{|x|}{x}
L00367: $$
L00369: does not exist.
L00371: Solution. As $x$ approaches 0 , the values of $f(x)=|x| / x$ approach -1 from the left and approach 1 from the right [see(13)]. Thus, the one-sided limits at 0 are not the same.
L00373: Example 5 For the functions in Figure 1.1.13, find the one-sided and two-sided limits at $x=a$ if they exist.
L00375: Solution. The functions in all three figures have the same one-sided limits as $x \rightarrow a$, since the functions are identical, except at $x=a$. These limits are
L00377: $$
L00378: \lim _{x \rightarrow a^{+}} f(x)=3 \quad \text { and } \quad \lim _{x \rightarrow a^{-}} f(x)=1
L00379: $$
L00381: In all three cases the two-sided limit does not exist as $x \rightarrow a$ because the one-sided limits are not equal.
L00383: - Figure 1.1.13
L00384: [FIGURE:a3d0ebdf31184702 | A graph of a piecewise function $y = f(x)$ on a Cartesian coordinate system. The function approaches $y=1$ as $x$ approaches $a$ from the left (open circle at $(a, 1)$) and approaches $y=3$ as $x$...]
L00386: [FIGURE:eb19a64856804c0b | A graph of a piecewise function $y=f(x)$ on an x-y coordinate system. The function consists of two line segments. The left segment approaches the point $(a, 1)$ from the left, with $f(a)=1$ indicated...]
L00387: [FIGURE:c2b0675cc2b8932b | A graph displays a piecewise function $y = f(x)$ on an $xy$-plane. The left segment of the function approaches an open circle at $(a, 1)$ from the left, indicating that the left-hand limit $\lim_{x...]
L00389: The symbols $+\infty$ and $-\infty$ here are not real numbers; they simply describe particular ways in which the limits fail to exist. Do not make the mistake of manipulating these symbols using rules of algebra. For example, it is incorrect to write $(+\infty)-(+\infty)=0$.
L00391: Example 6 For the functions in Figure 1.1.14, find the one-sided and two-sided limits at $x=a$ if they exist.
L00393: Solution. As in the preceding example, the value of $f$ at $x=a$ has no bearing on the limits as $x \rightarrow a$, so in all three cases we have
L00395: $$
L00396: \lim _{x \rightarrow a^{+}} f(x)=2 \quad \text { and } \quad \lim _{x \rightarrow a^{-}} f(x)=2
L00397: $$
L00399: Since the one-sided limits are equal, the two-sided limit exists and
L00401: $$
L00402: \lim _{x \rightarrow a} f(x)=2
L00403: $$
L00405: [FIGURE:728a0994e870d368 | A graph of a piecewise linear function $y=f(x)$ is shown on an $xy$-coordinate system. The function increases from the origin $(0,0)$ to an open circle at $(a,2)$, then decreases linearly, crossing...]
L00406: - Figure 1.1.14
L00408: [FIGURE:dbb0c3f7837c6bb7 | A graph of a function $y=f(x)$ on an $xy$-coordinate system. The function is composed of two line segments that meet at an open circle at the point $(a, 2)$. A dashed vertical line extends from $x=a$...]
L00409: - Figure 1.1.14
L00411: [FIGURE:8713e2c8a0c149ec | A graph in the $xy$-plane shows a V-shaped curve representing the function $y=f(x)$. The curve starts at the origin, rises linearly to a peak at $x=a$ where $y=2$, and then descends linearly...]
L00412: - Figure 1.1.14
