L13199: [FIGURE:dc00b374823bde2a | A geometric diagram illustrates a slanted line, such as a ladder, leaning against a vertical wall and horizontal ground. The line passes through a fixed point, which is the apex of a shaded triangle...]
L13200: - Figure Ex-58
L13202: 59. Suppose that the intensity of a point light source is directly proportional to the strength of the source and inversely proportional to the square of the distance from the source. Two point light sources with strengths of $S$ and $8 S$ are separated by a distance of 90 cm . Where on the line segment between the two sources is the total intensity a minimum?
L13203: 60. Given points $A(2,1)$ and $B(5,4)$, find the point $P$ in the interval $[2,5]$ on the $x$-axis that maximizes angle $A P B$.
L13204: 61. The lower edge of a painting, 10 ft in height, is 2 ft above an observer's eye level. Assuming that the best view is obtained when the angle subtended at the observer's eye by the painting is maximum, how far from the wall should the observer stand?
L13206: ## FOCUS ON CONCEPTS
L13208: 62. Fermat's principle (biography on p.275) in optics states that light traveling from one point to another follows that path for which the total travel time is minimum. In a uniform medium, the paths of "minimum time" and "shortest distance" turn out to be the same, so that light, if unobstructed, travels along a straight line. Assume that we have a light source, a flat mirror, and an observer in a uniform medium. If a light ray leaves the source, bounces off the mirror, and travels on to the observer, then its path will consist of two line segments, as shown in Figure Ex-62. According to Fermat's principle, the path will be such that the total travel time $t$ is minimum or, since the medium is uniform, the path will be such that the total distance traveled from $A$ to $P$ to $B$ is as small as possible. Assuming the minimum occurs when $d t / d x=0$, show that the light ray will strike the mirror at the point $P$ where the "angle of incidence" $\theta_{1}$ equals the "angle of reflection" $\theta_{2}$.
L13210: [FIGURE:fd16be718b49e310 | A diagram illustrates the reflection of light from a source at point A to an observer at point B via a horizontal mirror. Point A, labeled "Source" and depicted as a candle, is at a vertical height...]
L13211: Figure Ex-62
L13213: [FIGURE:dd07345a05aaf8e8 | A diagram illustrates the refraction of a light ray from a source A in Medium 1 to an observer B in Medium 2. The ray travels in a straight line from A to point P on the interface, then refracts and...]
L13214: - Figure Ex-63
L13216: [FIGURE:a327b26914f1415a | The diagram illustrates a house and a barn positioned on opposite sides of a river, with a path connecting them via the river. The house is $1/4$ mi from the river, and the barn is $3/4$ mi from the...]
L13217: - Figure Ex-64
L13219: 63. Fermat's principle (Exercise 62) also explains why light rays traveling between air and water undergo bending (refraction). Imagine that we have two uniform media (such as air and water) and a light ray traveling from a source $A$ in one medium to an observer $B$ in the other medium (Figure Ex-63). It is known that light travels at a constant speed in a uniform medium, but more slowly in a dense medium (such as water) than in a thin medium (such as air). Consequently, the path of shortest time from $A$ to $B$ is not necessarily a straight line, but rather some broken line path $A$ to $P$ to $B$ allowing the light to take greatest advantage of its higher speed through the thin medium. Snell's law of refraction (biography on p. 288) states that the path of the light ray will be such that
L13221: $$
L13222: \frac{\sin \theta_{1}}{v_{1}}=\frac{\sin \theta_{2}}{v_{2}}
L13223: $$
L13225: where $v_{1}$ is the speed of light in the first medium, $v_{2}$ is the speed of light in the second medium, and $\theta_{1}$ and $\theta_{2}$ are the angles shown in Figure Ex-63. Show that this follows from the assumption that the path of minimum time occurs when $d t / d x=0$.
L13226: 64. A farmer wants to walk at a constant rate from her barn to a straight river, fill her pail, and carry it to her house in the least time.
L13227: (a) Explain how this problem relates to Fermat's principle and the light-reflection problem in Exercise 62.
L13228: (b) Use the result of Exercise 62 to describe geometrically the best path for the farmer to take.
L13229: (c) Use part (b) to determine where the farmer should fill her pail if her house and barn are located as in Figure Ex-64.
L13230: 65. If an unknown physical quantity $x$ is measured $n$ times, the measurements $x_{1}, x_{2}, \ldots, x_{n}$ often vary because of uncontrollable factors such as temperature, atmospheric pressure, and so forth. Thus, a scientist is often faced with the problem of using $n$ different observed measurements to obtain an estimate $\bar{x}$ of an unknown quantity $x$. One method for making such an estimate is based on the least squares principle, which states that the estimate $\bar{x}$
L13231: should be chosen to minimize
L13233: $$
L13234: s=\left(x_{1}-\bar{x}\right)^{2}+\left(x_{2}-\bar{x}\right)^{2}+\cdots+\left(x_{n}-\bar{x}\right)^{2}
L13235: $$
L13237: which is the sum of the squares of the deviations between the estimate $\bar{x}$ and the measured values. Show that the estimate resulting from the least squares principle is
L13239: $$
L13240: \bar{x}=\frac{1}{n}\left(x_{1}+x_{2}+\cdots+x_{n}\right)
L13241: $$
L13243: that is, $\bar{x}$ is the arithmetic average of the observed values.
L13244: 66. Prove: If $f(x) \geq 0$ on an interval and if $f(x)$ has a maximum value on that interval at $x_{0}$, then $\sqrt{f(x)}$ also has a maximum value at $x_{0}$. Similarly for minimum values. [Hint: Use the fact that $\sqrt{x}$ is an increasing function on the interval $[0,+\infty)$.]
L13245: 67. Writing Discuss the importance of finding intervals of possible values imposed by physical restrictions on variables in an applied maximum or minimum problem.
L13247: ## QUICK CHECK ANSWERS 4.5
L13249: 1. $x+\frac{1}{x} ;(0,+\infty)$
L13250: 2. $x(10-x) ;[0,10]$
L13251: 3. $x\left(-\frac{4}{3} x+4\right)=-\frac{4}{3} x^{2}+4 x ;[0,3]$
L13252: 4. $x(20-2 x)(32-2 x)=4 x^{3}-104 x^{2}+640 x$; [0,10]
L13254: ### 4.6 RECTILINEAR MOTION
L13256: In this section we will continue the study of rectilinear motion that we began in Section 2.1. We will define the notion of "acceleration" mathematically, and we will show how the tools of calculus developed earlier in this chapter can be used to analyze rectilinear motion in more depth.
L13258: [FIGURE:a5ab23349dfc9132 | A two-dimensional graph plots position $s$ on the vertical axis against time $t$ on the horizontal axis. A blue curve, representing the particle's position over time, starts at a positive value $s_0$...]
L13259: - Figure 4.6.1
L13261: ## REVIEW OF TERMINOLOGY
L13263: Recall from Section 2.1 that a particle that can move in either direction along a coordinate line is said to be in rectilinear motion. The line might be an $x$-axis, a $y$-axis, or a coordinate line inclined at some angle. In general discussions we will designate the coordinate line as the $s$-axis. We will assume that units are chosen for measuring distance and time and that we begin observing the motion of the particle at time $t=0$. As the particle moves along the $s$-axis, its coordinate $s$ will be some function of time, say $s=s(t)$. We call $s(t)$ the position function of the particle,* and we call the graph of $s$ versus $t$ the position versus time curve. If the coordinate of a particle at time $t_{1}$ is $s\left(t_{1}\right)$ and the coordinate at a later time $t_{2}$ is $s\left(t_{2}\right)$, then $s\left(t_{2}\right)-s\left(t_{1}\right)$ is called the displacement of the particle over the time interval $\left[t_{1}, t_{2}\right]$. The displacement describes the change in position of the particle.
L13265: Figure 4.6.1 shows a typical position versus time curve for a particle in rectilinear motion. We can tell from that graph that the coordinate of the particle at time $t=0$ is $s_{0}$, and we can tell from the sign of $s$ when the particle is on the negative or the positive side of the origin as it moves along the coordinate line.
L13267: [^3]Willebrord van Roijen Snell (1591-1626) Dutch mathematician. Snell, who succeeded his father to the post of Professor of Mathematics at the University of Leiden in 1613, is most famous for the result of light refraction that bears his name. Although this phenomenon was studied as far back as the ancient Greek astronomer
L13269: Ptolemy, until Snell's work the relationship was incorrectly thought to be $\theta_{1} / v_{1}=\theta_{2} / v_{2}$. Snell's law was published by Descartes in 1638 without giving proper credit to Snell. Snell also discovered a method for determining distances by triangulation that founded the modern technique of mapmaking.
L13271: We should more properly call $v(t)$ the instantaneous velocity function to distinguish instantaneous velocity from average velocity. However, we will follow the standard practice of referring to it as the "velocity function," leaving it understood that it describes instantaneous velocity.
L13273: Example 1 Figure 4.6.2 $a$ shows the position versus time curve for a particle moving along an $s$-axis. In words, describe how the position of the particle changes with time.
L13275: Solution. The particle is at $s=-3$ at time $t=0$. It moves in the positive direction until time $t=4$, since $s$ is increasing. At time $t=4$ the particle is at position $s=3$. At that time it turns around and travels in the negative direction until time $t=7$, since $s$ is decreasing. At time $t=7$ the particle is at position $s=-1$, and it remains stationary thereafter, since $s$ is constant for $t>7$. This is illustrated schematically in Figure 4.6.2b.
L13277: [FIGURE:b3b4bc816ad1a1f1 | The figure consists of two parts: (a) a graph of position $s$ versus time $t$, and (b) a diagram illustrating the particle's motion along the $s$-axis. In graph (a), the curve starts at $(t, s) = (0...]
L13278: △ Figure 4.6.2
L13280: ## VELOCITY AND SPEED
L13282: Recall from Formula (5) of Section 2.1 and Formula (4) of Section 2.2 that the instantaneous velocity of a particle in rectilinear motion is the derivative of the position function. Thus, if a particle in rectilinear motion has position function $s(t)$, then we define its velocity function $v(t)$ to be
L13284: $$
L13285: \begin{equation*}
L13286: v(t)=s^{\prime}(t)=\frac{d s}{d t} \tag{1}
L13287: \end{equation*}
L13288: $$
L13290: The sign of the velocity tells which way the particle is moving-a positive value for $v(t)$ means that $s$ is increasing with time, so the particle is moving in the positive direction, and a negative value for $v(t)$ means that $s$ is decreasing with time, so the particle is moving in the negative direction. If $v(t)=0$, then the particle has momentarily stopped.
L13292: For a particle in rectilinear motion it is important to distinguish between its velocity, which describes how fast and in what direction the particle is moving, and its speed, which describes only how fast the particle is moving. We make this distinction by defining speed to be the absolute value of velocity. Thus a particle with a velocity of $2 \mathrm{~m} / \mathrm{s}$ has a speed of $2 \mathrm{~m} / \mathrm{s}$ and is moving in the positive direction, while a particle with a velocity of $-2 \mathrm{~m} / \mathrm{s}$ also has a speed of $2 \mathrm{~m} / \mathrm{s}$ but is moving in the negative direction.
L13294: Since the instantaneous speed of a particle is the absolute value of its instantaneous velocity, we define its speed function to be
L13296: $$
L13297: \begin{equation*}
L13298: |v(t)|=\left|s^{\prime}(t)\right|=\left|\frac{d s}{d t}\right| \tag{2}
L13299: \end{equation*}
L13300: $$
L13302: The speed function, which is always nonnegative, tells us how fast the particle is moving but not its direction of motion.
L13304: - Example 2 Let $s(t)=t^{3}-6 t^{2}$ be the position function of a particle moving along an $s$-axis, where $s$ is in meters and $t$ is in seconds. Find the velocity and speed functions, and show the graphs of position, velocity, and speed versus time.
L13306: Solution. From (1) and (2), the velocity and speed functions are given by
L13308: $$
L13309: v(t)=\frac{d s}{d t}=3 t^{2}-12 t \quad \text { and } \quad|v(t)|=\left|3 t^{2}-12 t\right|
L13310: $$
L13312: [FIGURE:c6db19bc0ee01c5d | A graph plots position $s$ on the vertical axis against time $t$ on the horizontal axis. The curve starts at the origin $(0,0)$, decreases to a minimum around $s=-30$ at $t=4$, then increases...]
L13314: [FIGURE:691c8e0309c192e3 | The graph displays the velocity $v$ as a function of time $t$, corresponding to the function $v(t) = 3t^2 - 12t$. The horizontal axis is labeled $t$ and the vertical axis is labeled $v$. The...]
L13315: Velocity versus time
L13317: Velocity versus time
L13318: [FIGURE:22d529a6365b5210 | A graph plots speed, $|v|$, on the vertical axis against time, $t$, on the horizontal axis. The blue curve, representing the speed function $|v(t)| = |3t^2 - 12t|$, starts at the origin $(0,0)$...]
L13320: - Figure 4.6.3
L13322: [FIGURE:458b9732cfae7234 | A graph plots acceleration $a$ on the vertical axis against time $t$ on the horizontal axis. A straight blue line represents the acceleration function, starting at $(t, a) = (0, -20)$, crossing the...]
L13323: Acceleration versus time
L13325: △ Figure 4.6.4
L13327: The graphs of position, velocity, and speed versus time are shown in Figure 4.6.3. Observe that velocity and speed both have units of meters per second (m/s), since $s$ is in meters (m) and time is in seconds (s).
L13329: The graphs in Figure 4.6.3 provide a wealth of visual information about the motion of the particle. For example, the position versus time curve tells us that the particle is on the negative side of the origin for $0<t<6$, is on the positive side of the origin for $t>6$, and is at the origin at times $t=0$ and $t=6$. The velocity versus time curve tells us that the particle is moving in the negative direction if $0<t<4$, is moving in the positive direction if $t>4$, and is momentarily stopped at times $t=0$ and $t=4$ (the velocity is zero at those times). The speed versus time curve tells us that the speed of the particle is increasing for $0<t<2$, decreasing for $2<t<4$, and increasing again for $t>4$.
L13331: ## ACCELERATION
L13333: In rectilinear motion, the rate at which the instantaneous velocity of a particle changes with time is called its instantaneous acceleration. Thus, if a particle in rectilinear motion has velocity function $v(t)$, then we define its acceleration function to be
L13335: $$
L13336: \begin{equation*}
L13337: a(t)=v^{\prime}(t)=\frac{d v}{d t} \tag{3}
L13338: \end{equation*}
L13339: $$
L13341: Alternatively, we can use the fact that $v(t)=s^{\prime}(t)$ to express the acceleration function in terms of the position function as
L13343: $$
L13344: \begin{equation*}
L13345: a(t)=s^{\prime \prime}(t)=\frac{d^{2} s}{d t^{2}} \tag{4}
L13346: \end{equation*}
L13347: $$
L13349: Example 3 Let $s(t)=t^{3}-6 t^{2}$ be the position function of a particle moving along an $s$-axis, where $s$ is in meters and $t$ is in seconds. Find the acceleration function $a(t)$, and show the graph of acceleration versus time.
L13351: Solution. From Example 2, the velocity function of the particle is $v(t)=3 t^{2}-12 t$, so the acceleration function is
L13353: $$
L13354: a(t)=\frac{d v}{d t}=6 t-12
L13355: $$
L13357: and the acceleration versus time curve is the line shown in Figure 4.6.4. Note that in this example the acceleration has units of $\mathrm{m} / \mathrm{s}^{2}$, since $v$ is in meters per second ( $\mathrm{m} / \mathrm{s}$ ) and time is in seconds (s).
L13359: ## SPEEDING UP AND SLOWING DOWN
L13361: We will say that a particle in rectilinear motion is speeding up when its speed is increasing and is slowing down when its speed is decreasing. In everyday language an object that is speeding up is said to be "accelerating" and an object that is slowing down is said to be "decelerating"; thus, one might expect that a particle in rectilinear motion will be speeding up when its acceleration is positive and slowing down when it is negative. Although this is true for a particle moving in the positive direction, it is not true for a particle moving in the
L13363: If $a(t)=0$ over a certain time interval, what does this tell you about the motion of the particle during that time?
L13364: negative direction-a particle with negative velocity is speeding up when its acceleration is negative and slowing down when its acceleration is positive. This is because a positive acceleration implies an increasing velocity, and increasing a negative velocity decreases its absolute value; similarly, a negative acceleration implies a decreasing velocity, and decreasing a negative velocity increases its absolute value.
L13366: The preceding informal discussion can be summarized as follows (Exercise 41):
L13368: > INTERPRETING THE SIGN OF ACCELERATION A particle in rectilinear motion is speeding up when its velocity and acceleration have the same sign and slowing down when they have opposite signs.
L13370: Example 4 In Examples 2 and 3 we found the velocity versus time curve and the acceleration versus time curve for a particle with position function $s(t)=t^{3}-6 t^{2}$. Use those curves to determine when the particle is speeding up and slowing down, and confirm that your results are consistent with the speed versus time curve obtained in Example 2.
L13372: Solution. Over the time interval $0<t<2$ the velocity and acceleration are negative, so the particle is speeding up. This is consistent with the speed versus time curve, since the speed is increasing over this time interval. Over the time interval $2<t<4$ the velocity is negative and the acceleration is positive, so the particle is slowing down. This is also consistent with the speed versus time curve, since the speed is decreasing over this time interval. Finally, on the time interval $t>4$ the velocity and acceleration are positive, so the particle is speeding up, which again is consistent with the speed versus time curve.
L13374: ## ANALYZING THE POSITION VERSUS TIME CURVE
L13376: The position versus time curve contains all of the significant information about the position and velocity of a particle in rectilinear motion:
L13378: - If $s(t)>0$, the particle is on the positive side of the $s$-axis.
L13379: - If $s(t)<0$, the particle is on the negative side of the $s$-axis.
L13380: - The slope of the curve at any time is equal to the instantaneous velocity at that time.
L13381: - Where the curve has positive slope, the velocity is positive and the particle is moving in the positive direction.
L13382: - Where the curve has negative slope, the velocity is negative and the particle is moving in the negative direction.
L13383: - Where the slope of the curve is zero, the velocity is zero, and the particle is momentarily stopped.
L13385: Information about the acceleration of a particle in rectilinear motion can also be deduced from the position versus time curve by examining its concavity. For example, we know that the position versus time curve will be concave up on intervals where $s^{\prime \prime}(t)>0$ and will be concave down on intervals where $s^{\prime \prime}(t)<0$. But we know from (4) that $s^{\prime \prime}(t)$ is the acceleration, so that on intervals where the position versus time curve is concave up the particle has a positive acceleration, and on intervals where it is concave down the particle has a negative acceleration.
L13387: Table 4.6.1 summarizes our observations about the position versus time curve.
L13389: Table 4.6.1
L13390: ANALYSIS OF PARTICLE MOTION
L13392: ## POSITION VERSUS <br> TIME CURVE
L13394: CHARACTERISTICS OF THE
L13395: CURVE AT $t=t_{0}$
L13397: ## BEHAVIOR OF THE PARTICLE <br> AT TIME $t=t_{0}$
L13399: [FIGURE:4aacd72ebc29b8ff | A graph plots position $s$ on the vertical axis against time $t$ on the horizontal axis. A blue curve represents the position $s(t)$, starting above the $t$-axis and increasing with a positive but...]
L13401: - $s\left(t_{0}\right)>0$
L13402: - Curve has positive slope.
L13403: - Curve is concave down.
L13404: - Particle is on the positive side of the origin.
L13405: - Particle is moving in the positive direction.
L13406: - Velocity is decreasing.
L13407: - Particle is slowing down.
L13408: [FIGURE:682963b7f469e7b0 | A graph plots position $s$ on the vertical axis against time $t$ on the horizontal axis. A blue curve, representing $s(t)$, is shown in the first quadrant, starting high and decreasing as time...]
L13409: - $s\left(t_{0}\right)>0$
L13410: - Curve has negative slope.
L13411: - Curve is concave down.
L13412: - Particle is on the positive side of the origin.
L13413: - Particle is moving in the negative direction.
L13414: - Velocity is decreasing.
L13415: - Particle is speeding up.
L13416: [FIGURE:736a1601347daaf1 | The figure is a graph of position $s$ versus time $t$. A blue curve shows $s(t)$ decreasing over time, starting from a positive position, crossing the $t$-axis, and continuing into negative...]
L13417: [FIGURE:db2a61711b4bc4fa | A graph shows position $s$ on the vertical axis versus time $t$ on the horizontal axis. A blue parabolic curve opens downwards, representing the particle's position over time. A vertical dashed red...]
L13418: - $s\left(t_{0}\right)>0$
L13419: - Curve has zero slope.
L13420: - Curve is concave down.
L13421: - Particle is on the negative side of the origin.
L13422: - Particle is moving in the negative direction.
L13423: - Velocity is increasing.
L13424: - Particle is slowing down.
L13426: [FIGURE:8f9ddb487209c0e9 | A position-time graph shows the position $s$ of a particle on the vertical axis as a function of time $t$ on the horizontal axis. The $t$-axis ranges from 0 to 10, and the $s$-axis from -5 to 5. The...]
L13427: △ Figure 4.6.5
L13429: - $s\left(t_{0}\right)<0$
L13430: - Curve has negative slope.
L13431: - Curve is concave up.
L13432: - Particle is on the positive side of the origin.
L13433: - Particle is momentarily stopped.
L13434: - Velocity is decreasing.
L13436: Example 5 Use the position versus time curve in Figure 4.6.5 to determine when the particle in Example 1 is speeding up and slowing down.
L13438: Solution. From $t=0$ to $t=2$, the acceleration and velocity are positive, so the particle is speeding up. From $t=2$ to $t=4$, the acceleration is negative and the velocity is positive, so the particle is slowing down. At $t=4$, the velocity is zero, so the particle has momentarily stopped. From $t=4$ to $t=6$, the acceleration is negative and the velocity is negative, so the particle is speeding up. From $t=6$ to $t=7$, the acceleration is positive and the velocity is negative, so the particle is slowing down. Thereafter, the velocity is zero, so the particle has stopped.
L13440: Example 6 Suppose that the position function of a particle moving on a coordinate line is given by $s(t)=2 t^{3}-21 t^{2}+60 t+3$. Analyze the motion of the particle for $t \geq 0$.
L13442: Solution. The velocity and acceleration functions are
L13444: $$
L13445: \begin{aligned}
L13446: & v(t)=s^{\prime}(t)=6 t^{2}-42 t+60=6(t-2)(t-5) \\
L13447: & a(t)=v^{\prime}(t)=12 t-42=12\left(t-\frac{7}{2}\right)
L13448: \end{aligned}
L13449: $$
L13451: - Direction of motion: The sign analysis of the velocity function in Figure 4.6.6 shows that the particle is moving in the positive direction over the time interval $0 \leq t<2$,
L13452: stops momentarily at time $t=2$, moves in the negative direction over the time interval $2<t<5$, stops momentarily at time $t=5$, and then moves in the positive direction thereafter.
L13454: [FIGURE:7d5ba7c2b24c965a | A number line, labeled $t$, illustrates the sign of the velocity function $v(t) = 6(t-2)(t-5)$ and the corresponding direction of motion. The velocity is positive for $t < 2$ and $t > 5$, indicated...]
L13455: △ Figure 4.6.6
L13457: - Change in speed: A comparison of the signs of the velocity and acceleration functions is shown in Figure 4.6.7. Since the particle is speeding up when the signs are the same and is slowing down when they are opposite, we see that the particle is slowing down over the time interval $0 \leq t<2$ and stops momentarily at time $t=2$. It is then speeding up over the time interval $2<t<\frac{7}{2}$. At time $t=\frac{7}{2}$ the instantaneous acceleration is zero, so the particle is neither speeding up nor slowing down. It is then slowing down over the time interval $\frac{7}{2}<t<5$ and stops momentarily at time $t=5$. Thereafter, it is speeding up.
L13459: [FIGURE:15544e90c91d51ee | The figure displays three number lines illustrating the motion of a particle over time $t$. The top number line shows the sign of the velocity function $v(t) = 6(t-2)(t-5)$, indicating positive...]
L13460: \$ Figure 4.6.7
L13462: Conclusions: The diagram in Figure 4.6.8 summarizes the above information schematically. The curved line is descriptive only; the actual path is back and forth on the coordinate line. The coordinates of the particle at times $t=0, t=2, t=\frac{7}{2}$, and $t=5$ were computed from $s(t)$. Segments in red indicate that the particle is speeding up and segments in blue indicate that it is slowing down.
L13464: - Figure 4.6.8
L13465: [FIGURE:e66674e549fddade | A horizontal number line represents position $s$, with tick marks at 0, 3, 28, 41.5, and 55. Above this line, a path with arrows illustrates the motion of a particle: it starts at $s=3$ at $t=0$...]
