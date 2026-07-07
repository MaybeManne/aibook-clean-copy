L03983: One of the crowning achievements of calculus is its ability to capture continuous motion mathematically, allowing that motion to be analyzed instant by instant.
L03985: Many real-world phenomena involve changing quantities-the speed of a rocket, the inflation of currency, the number of bacteria in a culture, the shock intensity of an earthquake, the voltage of an electrical signal, and so forth. In this chapter we will develop the concept of a "derivative," which is the mathematical tool for studying the rate at which one quantity changes relative to another. The study of rates of change is closely related to the geometric concept of a tangent line to a curve, so we will also be discussing the general definition of a tangent line and methods for finding its slope and equation.
L03987: ### 2.1 TANGENT LINES AND RATES OF CHANGE
L03989: > In this section we will discuss three ideas: tangent lines to curves, the velocity of an object moving along a line, and the rate at which one variable changes relative to another. Our goal is to show how these seemingly unrelated ideas are, in actuality, closely linked.
L03991: ## TANGENT LINES
L03993: In Example 1 of Section 1.1, we showed how the notion of a limit could be used to find an equation of a tangent line to a curve. At that stage in the text we did not have precise definitions of tangent lines and limits to work with, so the argument was intuitive and informal. However, now that limits have been defined precisely, we are in a position to give a mathematical definition of the tangent line to a curve $y=f(x)$ at a point $P\left(x_{0}, f\left(x_{0}\right)\right)$ on the curve. As illustrated in Figure 2.1.1, consider a point $Q(x, f(x))$ on the curve that is distinct from $P$, and compute the slope $m_{P Q}$ of the secant line through $P$ and $Q$ :
L03995: $$
L03996: m_{P Q}=\frac{f(x)-f\left(x_{0}\right)}{x-x_{0}}
L03997: $$
L03999: If we let $x$ approach $x_{0}$, then the point $Q$ will move along the curve and approach the point $P$. If the secant line through $P$ and $Q$ approaches a limiting position as $x \rightarrow x_{0}$, then we will regard that position to be the position of the tangent line at $P$. Stated another way, if the slope $m_{P Q}$ of the secant line through $P$ and $Q$ approaches a limit as $x \rightarrow x_{0}$, then we regard that limit to be the slope $m_{\tan }$ of the tangent line at $P$. Thus, we make the following definition.
L04001: Figure 2.1.1
L04002: [FIGURE:d2448215caac1f86 | A graph on an $xy$-plane displays a blue curve, $y=f(x)$. Two points, $P$ and $Q$, are marked on the curve, with $P$ at $(x_0, f(x_0))$ and $Q$ at $(x, f(x))$. A purple secant line connects $P$ and...]
L04004: 2.1.1 DEFINITION Suppose that $x_{0}$ is in the domain of the function $f$. The tangent line to the curve $y=f(x)$ at the point $P\left(x_{0}, f\left(x_{0}\right)\right)$ is the line with equation
L04006: $$
L04007: y-f\left(x_{0}\right)=m_{\tan }\left(x-x_{0}\right)
L04008: $$
L04010: where
L04012: $$
L04013: \begin{equation*}
L04014: m_{\tan }=\lim _{x \rightarrow x_{0}} \frac{f(x)-f\left(x_{0}\right)}{x-x_{0}} \tag{1}
L04015: \end{equation*}
L04016: $$
L04018: provided the limit exists. For simplicity, we will also call this the tangent line to $y=f(x)$ at $x_{0}$.
L04020: Example 1 Use Definition 2.1.1 to find an equation for the tangent line to the parabola $y=x^{2}$ at the point $P(1,1)$, and confirm the result agrees with that obtained in Example 1 of Section 1.1.
L04022: Solution. Applying Formula (1) with $f(x)=x^{2}$ and $x_{0}=1$, we have
L04024: $$
L04025: \begin{aligned}
L04026: m_{\tan } & =\lim _{x \rightarrow 1} \frac{f(x)-f(1)}{x-1} \\
L04027: & =\lim _{x \rightarrow 1} \frac{x^{2}-1}{x-1} \\
L04028: & =\lim _{x \rightarrow 1} \frac{(x-1)(x+1)}{x-1}=\lim _{x \rightarrow 1}(x+1)=2
L04029: \end{aligned}
L04030: $$
L04032: Thus, the tangent line to $y=x^{2}$ at $(1,1)$ has equation
L04034: $$
L04035: y-1=2(x-1) \quad \text { or equivalently } \quad y=2 x-1
L04036: $$
L04038: which agrees with Example 1 of Section 1.1.
L04040: There is an alternative way of expressing Formula (1) that is commonly used. If we let $h$ denote the difference
L04042: $$
L04043: h=x-x_{0}
L04044: $$
L04046: then the statement that $x \rightarrow x_{0}$ is equivalent to the statement $h \rightarrow 0$, so we can rewrite (1) in terms of $x_{0}$ and $h$ as
L04048: $$
L04049: \begin{equation*}
L04050: m_{\tan }=\lim _{h \rightarrow 0} \frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h} \tag{2}
L04051: \end{equation*}
L04052: $$
L04054: Formulas (1) and (2) for $m_{\tan }$ usually lead to indeterminate forms of type $0 / 0$, so you will generally need to perform algebraic simplifications or use other methods to determine limits of such indeterminate forms.
L04056: [FIGURE:dd4847b599cda245 | The figure displays a graph of the function $y = \frac{2}{x}$ in the first quadrant of a Cartesian coordinate system. A straight line, $y = -\frac{1}{2}x + 2$, is shown tangent to the curve at the...]
L04057: - Figure 2.1.3
L04059: Figure 2.1.2 shows how Formula (2) expresses the slope of the tangent line as a limit of slopes of secant lines.
L04061: Figure 2.1.2
L04062: [FIGURE:29a1325658c85b7b | This graph illustrates the geometric interpretation of the derivative as the limit of secant slopes. A curve $y=f(x)$ is shown in an $xy$-coordinate system with two points, $P(x_0, f(x_0))$ and...]
L04064: Example 2 Compute the slope in Example 1 using Formula (2).
L04065: Solution. Applying Formula (2) with $f(x)=x^{2}$ and $x_{0}=1$, we obtain
L04067: $$
L04068: \begin{aligned}
L04069: m_{\tan } & =\lim _{h \rightarrow 0} \frac{f(1+h)-f(1)}{h} \\
L04070: & =\lim _{h \rightarrow 0} \frac{(1+h)^{2}-1^{2}}{h} \\
L04071: & =\lim _{h \rightarrow 0} \frac{1+2 h+h^{2}-1}{h}=\lim _{h \rightarrow 0}(2+h)=2
L04072: \end{aligned}
L04073: $$
L04075: which agrees with the slope found in Example 1.
L04077: Example 3 Find an equation for the tangent line to the curve $y=2 / x$ at the point $(2,1)$ on this curve.
L04079: Solution. First, we will find the slope of the tangent line by applying Formula (2) with $f(x)=2 / x$ and $x_{0}=2$. This yields
L04081: $$
L04082: \begin{aligned}
L04083: m_{\tan } & =\lim _{h \rightarrow 0} \frac{f(2+h)-f(2)}{h} \\
L04084: & =\lim _{h \rightarrow 0} \frac{\frac{2}{2+h}-1}{h}=\lim _{h \rightarrow 0} \frac{\left(\frac{2-(2+h)}{2+h}\right)}{h} \\
L04085: & =\lim _{h \rightarrow 0} \frac{-h}{h(2+h)}=-\left(\lim _{h \rightarrow 0} \frac{1}{2+h}\right)=-\frac{1}{2}
L04086: \end{aligned}
L04087: $$
L04089: Thus, an equation of the tangent line at $(2,1)$ is
L04091: $$
L04092: y-1=-\frac{1}{2}(x-2) \quad \text { or equivalently } \quad y=-\frac{1}{2} x+2
L04093: $$
L04095: (see Figure 2.1.3).
L04097: Example 4 Find the slopes of the tangent lines to the curve $y=\sqrt{x}$ at $x_{0}=1, x_{0}=4$, and $x_{0}=9$.
L04099: Solution. We could compute each of these slopes separately, but it will be more efficient to find the slope for a general value of $x_{0}$ and then substitute the specific numerical values. Proceeding in this way we obtain
L04101: $$
L04102: \begin{aligned}
L04103: m_{\tan } & =\lim _{h \rightarrow 0} \frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h} \\
L04104: & =\lim _{h \rightarrow 0} \frac{\sqrt{x_{0}+h}-\sqrt{x_{0}}}{h} \\
L04105: & =\lim _{h \rightarrow 0} \frac{\sqrt{x_{0}+h}-\sqrt{x_{0}}}{h} \cdot \frac{\sqrt{x_{0}+h}+\sqrt{x_{0}}}{\sqrt{x_{0}+h}+\sqrt{x_{0}}} \quad \begin{array}{l}
L04106: \text { Rationalize the numerator to } \\
L04107: \text { help eliminate the indeterminate } \\
L04108: \text { form of the limit. }
L04109: \end{array} \\
L04110: & =\lim _{h \rightarrow 0} \frac{x_{0}+h-x_{0}}{h\left(\sqrt{x_{0}+h}+\sqrt{x_{0}}\right)} \\
L04111: & =\lim _{h \rightarrow 0} \frac{h}{h\left(\sqrt{x_{0}+h}+\sqrt{x_{0}}\right)} \\
L04112: & =\lim _{h \rightarrow 0} \frac{1}{\sqrt{x_{0}+h}+\sqrt{x_{0}}}=\frac{1}{2 \sqrt{x_{0}}}
L04113: \end{aligned}
L04114: $$
L04116: The slopes at $x_{0}=1,4$, and 9 can now be obtained by substituting these values into our general formula for $m_{\tan }$. Thus,
L04118: $$
L04119: \begin{aligned}
L04120: & \text { slope at } x_{0}=1: \frac{1}{2 \sqrt{1}}=\frac{1}{2} \\
L04121: & \text { slope at } x_{0}=4: \frac{1}{2 \sqrt{4}}=\frac{1}{4} \\
L04122: & \text { slope at } x_{0}=9: \frac{1}{2 \sqrt{9}}=\frac{1}{6}
L04123: \end{aligned}
L04124: $$
L04126: (see Figure 2.1.4).
L04128: Figure 2.1.4
L04129: [FIGURE:7e07ce36df628453 | The figure displays the graph of the function $y = \sqrt{x}$ in the first quadrant of a Cartesian coordinate system. Three points on the curve are highlighted: $(1,1)$, $(4,2)$, and $(9,3)$. At each...]
L04131: ## VELOCITY
L04133: [FIGURE:73b681b91447582b | A white passenger airplane is shown flying directly towards the viewer, centered in the frame, against a bright blue sky with scattered white clouds. The image illustrates the concept of velocity...]
L04135: Carlos Santa Maria/iStockphoto
L04136: The velocity of an airplane describes its speed and direction.
L04138: One of the important themes in calculus is the study of motion. To describe the motion of an object completely, one must specify its speed (how fast it is going) and the direction in which it is moving. The speed and the direction of motion together comprise what is called the velocity of the object. For example, knowing that the speed of an aircraft is 500 $\mathrm{mi} / \mathrm{h}$ tells us how fast it is going, but not which way it is moving. In contrast, knowing that the velocity of the aircraft is $500 \mathrm{mi} / \mathrm{h}$ due south pins down the speed and the direction of motion.
L04140: Later, we will study the motion of objects that move along curves in two- or threedimensional space, but for now we will only consider motion along a line; this is called rectilinear motion. Some examples are a piston moving up and down in a cylinder, a race
L04141: car moving along a straight track, an object dropped from the top of a building and falling straight down, a ball thrown straight up and then falling down along the same line, and so forth.
L04143: For computational purposes, we will assume that a particle in rectilinear motion moves along a coordinate line, which we will call the $s$-axis. A graphical description of rectilinear motion along an $s$-axis can be obtained by making a plot of the $s$-coordinate of the particle versus the elapsed time $t$ from starting time $t=0$. This is called the position versus time curve for the particle. Figure 2.1.5 shows two typical position versus time curves. The first is for a car that starts at the origin and moves only in the positive direction of the $s$-axis. In this case $s$ increases as $t$ increases. The second is for a ball that is thrown straight up in the positive direction of an $s$-axis from some initial height $s_{0}$ and then falls straight down in the negative direction. In this case $s$ increases as the ball moves up and decreases as it moves down.
L04145: [FIGURE:90310bf46b121425 | The figure presents three scenarios illustrating position as a function of time. The left panel shows a clock indicating elapsed time $t$ and a car moving along an $s$-axis in the positive direction...]
L04146: △ Figure 2.1.5
L04148: Show that (4) is also correct for a time interval $\left[t_{0}+h, t_{0}\right], h<0$.
L04150: The change in position
L04152: $$
L04153: f\left(t_{0}+h\right)-f\left(t_{0}\right)
L04154: $$
L04156: is also called the displacement of the particle over the time interval between $t_{0}$ and $t_{0}+h$.
L04158: If a particle in rectilinear motion moves along an $s$-axis so that its position coordinate function of the elapsed time $t$ is
L04160: $$
L04161: \begin{equation*}
L04162: s=f(t) \tag{3}
L04163: \end{equation*}
L04164: $$
L04166: then $f$ is called the position function of the particle; the graph of (3) is the position versus time curve. The average velocity of the particle over a time interval $\left[t_{0}, t_{0}+h\right], h>0$, is defined to be
L04168: $$
L04169: \begin{equation*}
L04170: v_{\text {ave }}=\frac{\text { change in position }}{\text { time elapsed }}=\frac{f\left(t_{0}+h\right)-f\left(t_{0}\right)}{h} \tag{4}
L04171: \end{equation*}
L04172: $$
L04174: Example 5 Suppose that $s=f(t)=1+5 t-2 t^{2}$ is the position function of a particle, where $s$ is in meters and $t$ is in seconds. Find the average velocities of the particle over the time intervals (a) [ 0,2 ] and (b) [ 2,3 ].
L04176: Solution (a). Applying (4) with $t_{0}=0$ and $h=2$, we see that the average velocity is
L04178: $$
L04179: v_{\mathrm{ave}}=\frac{f\left(t_{0}+h\right)-f\left(t_{0}\right)}{h}=\frac{f(2)-f(0)}{2}=\frac{3-1}{2}=\frac{2}{2}=1 \mathrm{~m} / \mathrm{s}
L04180: $$
L04182: Solution (b). Applying (4) with $t_{0}=2$ and $h=1$, we see that the average velocity is
L04184: $$
L04185: v_{\mathrm{ave}}=\frac{f\left(t_{0}+h\right)-f\left(t_{0}\right)}{h}=\frac{f(3)-f(2)}{1}=\frac{-2-3}{1}=\frac{-5}{1}=-5 \mathrm{~m} / \mathrm{s}
L04186: $$
L04188: For a particle in rectilinear motion, average velocity describes its behavior over an interval of time. We are interested in the particle's "instantaneous velocity," which describes
L04190: [FIGURE:70f32753f12e32fe | A graph plots the position $s$ (vertical axis) against time $t$ (horizontal axis) for a particle, representing the function $s = 1 + 5t - 2t^2$. The curve is a downward-opening parabola, starting at...]
L04191: △ Figure 2.1.6
L04193: Table 2.1.1
L04194: | TIME INTERVAL | AVERAGE <br> VELOCITY $(\mathrm{m} / \mathrm{s})$ |
L04195: | :--- | :--- |
L04196: | $2.0 \leq t \leq 3.0$ | -5 |
L04197: | $2.0 \leq t \leq 2.1$ | -3.2 |
L04198: | $2.0 \leq t \leq 2.01$ | -3.02 |
L04199: | $2.0 \leq t \leq 2.001$ | -3.002 |
L04200: | $2.0 \leq t \leq 2.0001$ | -3.0002 |
L04203: Note the negative values for the velocities in Example 6. This is consistent with the fact that the object is moving in the negative direction along the $s$-axis.
L04205: Confirm the solution to Example 5(b) by computing the slope of an appropriate secant line.
L04206: its behavior at a specific instant in time. Formula (4) is not directly applicable for computing instantaneous velocity because the "time elapsed" at a specific instant is zero, so (4) is undefined. One way to circumvent this problem is to compute average velocities for small time intervals between $t=t_{0}$ and $t=t_{0}+h$. These average velocities may be viewed as approximations to the "instantaneous velocity" of the particle at time $t_{0}$. If these average velocities have a limit as $h$ approaches zero, then we can take that limit to be the instantaneous velocity of the particle at time $t_{0}$. Here is an example.
L04208: Example 6 Consider the particle in Example 5, whose position function is
L04210: $$
L04211: s=f(t)=1+5 t-2 t^{2}
L04212: $$
L04214: The position of the particle at time $t=2 \mathrm{~s}$ is $s=3 \mathrm{~m}$ (Figure 2.1.6). Find the particle's instantaneous velocity at time $t=2 \mathrm{~s}$.
L04216: Solution. As a first approximation to the particle's instantaneous velocity at time $t=2$ s , let us recall from Example 5(b) that the average velocity over the time interval from $t=2$ to $t=3$ is $v_{\text {ave }}=-5 \mathrm{~m} / \mathrm{s}$. To improve on this initial approximation we will compute the average velocity over a succession of smaller and smaller time intervals. We leave it to you to verify the results in Table 2.1.1. The average velocities in this table appear to be approaching a limit of $-3 \mathrm{~m} / \mathrm{s}$, providing strong evidence that the instantaneous velocity at time $t=2 \mathrm{~s}$ is $-3 \mathrm{~m} / \mathrm{s}$. To confirm this analytically, we start by computing the object's average velocity over a general time interval between $t=2$ and $t=2+h$ using Formula (4):
L04218: $$
L04219: v_{\mathrm{ave}}=\frac{f(2+h)-f(2)}{h}=\frac{\left[1+5(2+h)-2(2+h)^{2}\right]-3}{h}
L04220: $$
L04222: The object's instantaneous velocity at time $t=2$ is calculated as a limit as $h \rightarrow 0$ :
L04224: $$
L04225: \begin{aligned}
L04226: \text { instantaneous velocity } & =\lim _{h \rightarrow 0} \frac{\left[1+5(2+h)-2(2+h)^{2}\right]-3}{h} \\
L04227: & =\lim _{h \rightarrow 0} \frac{-2+(10+5 h)-\left(8+8 h+2 h^{2}\right)}{h} \\
L04228: & =\lim _{h \rightarrow 0} \frac{-3 h-2 h^{2}}{h}=\lim _{h \rightarrow 0}(-3-2 h)=-3
L04229: \end{aligned}
L04230: $$
L04232: This confirms our numerical conjecture that the instantaneous velocity after 2 s is $-3 \mathrm{~m} / \mathrm{s}$. $\square$
L04234: Consider a particle in rectilinear motion with position function $s=f(t)$. Motivated by Example 6, we define the instantaneous velocity $v_{\text {inst }}$ of the particle at time $t_{0}$ to be the limit as $h \rightarrow 0$ of its average velocities $v_{\text {ave }}$ over time intervals between $t=t_{0}$ and $t=t_{0}+h$. Thus, from (4) we obtain
L04236: $$
L04237: \begin{equation*}
L04238: v_{\mathrm{inst}}=\lim _{h \rightarrow 0} \frac{f\left(t_{0}+h\right)-f\left(t_{0}\right)}{h} \tag{5}
L04239: \end{equation*}
L04240: $$
L04242: Geometrically, the average velocity $v_{\text {ave }}$ between $t=t_{0}$ and $t=t_{0}+h$ is the slope of the secant line through points $P\left(t_{0}, f\left(t_{0}\right)\right)$ and $Q\left(t_{0}+h, f\left(t_{0}+h\right)\right)$ on the position versus time curve, and the instantaneous velocity $v_{\text {inst }}$ at time $t_{0}$ is the slope of the tangent line to the position versus time curve at the point $P\left(t_{0}, f\left(t_{0}\right)\right)$ (Figure 2.1.7).
L04244: Figure 2.1.7
L04245: [FIGURE:e4ad81525fb1a389 | A two-dimensional graph shows a blue curve, $s=f(t)$, representing position as a function of time. Two points, $P$ at $(t_0, f(t_0))$ and $Q$ at $(t_0+h, f(t_0+h))$, are marked on the curve. A purple...]
L04247: [FIGURE:9a6cd420f59fc59f | A coordinate plane shows a straight line with a positive slope, representing the linear equation $y = mx + b$. Three right triangles are drawn along the line, each with a horizontal leg of length 1...]
L04248: - Figure 2.1.8
L04250: A 1 -unit increase in $x$ always produces an $m$-unit change in $y$.
L04252: ## SLOPES AND RATES OF CHANGE
L04254: Velocity can be viewed as rate of change-the rate of change of position with respect to time. Rates of change occur in other applications as well. For example:
L04256: - A microbiologist might be interested in the rate at which the number of bacteria in a colony changes with time.
L04257: - An engineer might be interested in the rate at which the length of a metal rod changes with temperature.
L04258: - An economist might be interested in the rate at which production cost changes with the quantity of a product that is manufactured.
L04259: - A medical researcher might be interested in the rate at which the radius of an artery changes with the concentration of alcohol in the bloodstream.
L04261: Our next objective is to define precisely what is meant by the "rate of change of $y$ with respect to $x$ " when $y$ is a function of $x$. In the case where $y$ is a linear function of $x$, say $y=m x+b$, the slope $m$ is the natural measure of the rate of change of $y$ with respect to $x$. As illustrated in Figure 2.1.8, each 1-unit increase in $x$ anywhere along the line produces an $m$-unit change in $y$, so we see that $y$ changes at a constant rate with respect to $x$ along the line and that $m$ measures this rate of change.
L04263: Example 7 Find the rate of change of $y$ with respect to $x$ if
L04264: (a) $y=2 x-1$
L04265: (b) $y=-5 x+1$
L04267: Solution. In part (a) the rate of change of $y$ with respect to $x$ is $m=2$, so each 1 -unit increase in $x$ produces a 2 -unit increase in $y$. In part (b) the rate of change of $y$ with respect to $x$ is $m=-5$, so each 1 -unit increase in $x$ produces a 5 -unit decrease in $y$.
L04269: In applied problems, changing the units of measurement can change the slope of a line, so it is essential to include the units when calculating the slope and describing rates of change. The following example illustrates this.
L04271: Example 8 Suppose that a uniform rod of length $40 \mathrm{~cm}(=0.4 \mathrm{~m})$ is thermally insulated around the lateral surface and that the exposed ends of the rod are held at constant temperatures of $25^{\circ} \mathrm{C}$ and $5^{\circ} \mathrm{C}$, respectively (Figure 2.1.9a). It is shown in physics that under appropriate conditions the graph of the temperature $T$ versus the distance $x$ from the left-hand end of the rod will be a straight line. Parts ( $b$ ) and ( $c$ ) of Figure 2.1.9 show two
L04273: [FIGURE:e1f828a414ed8048 | Part (a) illustrates a thermally insulated rod, 40 units long, with its left end at $25^ ext{C}$ and its right end at $5^ ext{C}$, showing a temperature gradient from red (hot) to blue (cold). Parts...]
L04274: △ Figure 2.1.9
L04276: [FIGURE:7518c37d4eeec792 | A two-dimensional coordinate system shows an x-axis and a y-axis. A blue curve, labeled $y=f(x)$, starts low, rises to a peak, and then gradually decreases. Along the curve, several right-angled...]
L04277: - Figure 2.1.10
L04279: such graphs: one in which $x$ is measured in centimeters and one in which it is measured in meters. The slopes in the two cases are
L04281: $$
L04282: \begin{align*}
L04283: & m=\frac{5-25}{40-0}=\frac{-20}{40}=-0.5  \tag{6}\\
L04284: & m=\frac{5-25}{0.4-0}=\frac{-20}{0.4}=-50 \tag{7}
L04285: \end{align*}
L04286: $$
L04288: The slope in (6) implies that the temperature decreases at a rate of $0.5^{\circ} \mathrm{C}$ per centimeter of distance from the left end of the rod, and the slope in (7) implies that the temperature decreases at a rate of $50^{\circ} \mathrm{C}$ per meter of distance from the left end of the rod. The two statements are equivalent physically, even though the slopes differ.
L04290: Although the rate of change of $y$ with respect to $x$ is constant along a nonvertical line $y=m x+b$, this is not true for a general curve $y=f(x)$. For example, in Figure 2.1.10 the change in $y$ that results from a 1 -unit increase in $x$ tends to have greater magnitude in regions where the curve rises or falls rapidly than in regions where it rises or falls slowly. As with velocity, we will distinguish between the average rate of change over an interval and the instantaneous rate of change at a specific point.
L04292: If $y=f(x)$, then we define the average rate of change of $y$ with respect to $x$ over the interval $\left[x_{0}, x_{1}\right]$ to be
L04294: $$
L04295: \begin{equation*}
L04296: r_{\mathrm{ave}}=\frac{f\left(x_{1}\right)-f\left(x_{0}\right)}{x_{1}-x_{0}} \tag{8}
L04297: \end{equation*}
L04298: $$
L04300: and we define the instantaneous rate of change of $\boldsymbol{y}$ with respect to $\boldsymbol{x}$ at $\boldsymbol{x}_{\mathbf{0}}$ to be
L04302: $$
L04303: \begin{equation*}
L04304: r_{\mathrm{inst}}=\lim _{x_{1} \rightarrow x_{0}} \frac{f\left(x_{1}\right)-f\left(x_{0}\right)}{x_{1}-x_{0}} \tag{9}
L04305: \end{equation*}
L04306: $$
L04308: Geometrically, the average rate of change of $y$ with respect to $x$ over the interval $\left[x_{0}, x_{1}\right]$ is the slope of the secant line through the points $P\left(x_{0}, f\left(x_{0}\right)\right)$ and $Q\left(x_{1}, f\left(x_{1}\right)\right)$ (Figure 2.1.11), and the instantaneous rate of change of $y$ with respect to $x$ at $x_{0}$ is the slope of the tangent line at the point $P\left(x_{0}, f\left(x_{0}\right)\right)$ (since it is the limit of the slopes of the secant lines through $P$ ).
L04310: - Figure 2.1.11
L04311: [FIGURE:983bc5d558cb8050 | A graph in the $xy$-plane shows a curve $y=f(x)$. Two points, $P(x_0, f(x_0))$ and $Q(x_1, f(x_1))$, are marked on the curve, with dashed lines indicating their coordinates and the differences $x_1 -...]
L04313: If desired, we can let $h=x_{1}-x_{0}$, and rewrite (8) and (9) as
L04315: $$
L04316: \begin{gather*}
L04317: r_{\mathrm{ave}}=\frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h}  \tag{10}\\
L04318: r_{\mathrm{inst}}=\lim _{h \rightarrow 0} \frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h} \tag{11}
L04319: \end{gather*}
L04320: $$
L04322: Perform the calculations in Example 9 using Formulas (10) and (11).
L04324: [FIGURE:4de054cf084734b3 | The graph, titled "Weight Lifting Stress Test", plots cardiac output $V$ in liters (L) on the y-axis against workload $W$ in kilogram-meters (kg·m) on the x-axis. A curve shows that cardiac output...]
L04325: - Figure 2.1.12
L04327: Example 9 Let $y=x^{2}+1$.
L04328: (a) Find the average rate of change of $y$ with respect to $x$ over the interval $[3,5]$.
L04329: (b) Find the instantaneous rate of change of $y$ with respect to $x$ when $x=-4$.
L04331: Solution (a). We will apply Formula (8) with $f(x)=x^{2}+1, x_{0}=3$, and $x_{1}=5$. This yields
L04333: $$
L04334: r_{\mathrm{ave}}=\frac{f\left(x_{1}\right)-f\left(x_{0}\right)}{x_{1}-x_{0}}=\frac{f(5)-f(3)}{5-3}=\frac{26-10}{2}=8
L04335: $$
L04337: Thus, $y$ increases an average of 8 units per unit increase in $x$ over the interval $[3,5]$.
L04338: Solution (b). We will apply Formula (9) with $f(x)=x^{2}+1$ and $x_{0}=-4$. This yields
L04340: $$
L04341: \begin{aligned}
L04342: r_{\mathrm{inst}} & =\lim _{x_{1} \rightarrow x_{0}} \frac{f\left(x_{1}\right)-f\left(x_{0}\right)}{x_{1}-x_{0}}=\lim _{x_{1} \rightarrow-4} \frac{f\left(x_{1}\right)-f(-4)}{x_{1}-(-4)}=\lim _{x_{1} \rightarrow-4} \frac{\left(x_{1}^{2}+1\right)-17}{x_{1}+4} \\
L04343: & =\lim _{x_{1} \rightarrow-4} \frac{x_{1}^{2}-16}{x_{1}+4}=\lim _{x_{1} \rightarrow-4} \frac{\left(x_{1}+4\right)\left(x_{1}-4\right)}{x_{1}+4}=\lim _{x_{1} \rightarrow-4}\left(x_{1}-4\right)=-8
L04344: \end{aligned}
L04345: $$
L04347: Thus, a small increase in $x$ from $x=-4$ will produce approximately an 8 -fold decrease in $y$.
