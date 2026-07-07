L04340: $$
L04341: \begin{aligned}
L04342: r_{\mathrm{inst}} & =\lim _{x_{1} \rightarrow x_{0}} \frac{f\left(x_{1}\right)-f\left(x_{0}\right)}{x_{1}-x_{0}}=\lim _{x_{1} \rightarrow-4} \frac{f\left(x_{1}\right)-f(-4)}{x_{1}-(-4)}=\lim _{x_{1} \rightarrow-4} \frac{\left(x_{1}^{2}+1\right)-17}{x_{1}+4} \\
L04343: & =\lim _{x_{1} \rightarrow-4} \frac{x_{1}^{2}-16}{x_{1}+4}=\lim _{x_{1} \rightarrow-4} \frac{\left(x_{1}+4\right)\left(x_{1}-4\right)}{x_{1}+4}=\lim _{x_{1} \rightarrow-4}\left(x_{1}-4\right)=-8
L04344: \end{aligned}
L04345: $$
L04347: Thus, a small increase in $x$ from $x=-4$ will produce approximately an 8 -fold decrease in $y$.
L04349: ## RATES OF CHANGE IN APPLICATIONS
L04351: In applied problems, average and instantaneous rates of change must be accompanied by appropriate units. In general, the units for a rate of change of $y$ with respect to $x$ are obtained by "dividing" the units of $y$ by the units of $x$ and then simplifying according to the standard rules of algebra. Here are some examples:
L04353: - If $y$ is in degrees Fahrenheit ( ${ }^{\circ} \mathrm{F}$ ) and $x$ is in inches (in), then a rate of change of $y$ with respect to $x$ has units of degrees Fahrenheit per inch ( ${ }^{\circ} \mathrm{F} / \mathrm{in}$ ).
L04354: - If $y$ is in feet per second ( $\mathrm{ft} / \mathrm{s}$ ) and $x$ is in seconds (s), then a rate of change of $y$ with respect to $x$ has units of feet per second per second ( $\mathrm{ft} / \mathrm{s} / \mathrm{s}$ ), which would usually be written as $\mathrm{ft} / \mathrm{s}^{2}$.
L04355: - If $y$ is in newton-meters $(\mathrm{N} \cdot \mathrm{m})$ and $x$ is in meters $(\mathrm{m})$, then a rate of change of $y$ with respect to $x$ has units of newtons ( N ), since $\mathrm{N} \cdot \mathrm{m} / \mathrm{m}=\mathrm{N}$.
L04356: - If $y$ is in foot-pounds ( $\mathrm{ft} \cdot \mathrm{lb}$ ) and $x$ is in hours (h), then a rate of change of $y$ with respect to $x$ has units of foot-pounds per hour ( $\mathrm{ft} \cdot \mathrm{lb} / \mathrm{h}$ ).
L04358: Example 10 The limiting factor in athletic endurance is cardiac output, that is, the volume of blood that the heart can pump per unit of time during an athletic competition. Figure 2.1.12 shows a stress-test graph of cardiac output $V$ in liters (L) of blood versus workload $W$ in kilogram-meters ( $\mathrm{kg} \cdot \mathrm{m}$ ) for 1 minute of weight lifting. This graph illustrates the known medical fact that cardiac output increases with the workload, but after reaching a peak value begins to decrease.
L04359: (a) Use the secant line shown in Figure 2.1.13a to estimate the average rate of change of cardiac output with respect to workload as the workload increases from 300 to $1200 \mathrm{~kg} \cdot \mathrm{~m}$.
L04360: (b) Use the line segment shown in Figure 2.1.13b to estimate the instantaneous rate of change of cardiac output with respect to workload at the point where the workload is $300 \mathrm{~kg} \cdot \mathrm{~m}$.
L04362: Solution (a). Using the estimated points $(300,13)$ and $(1200,19)$ to find the slope of the secant line, we obtain
L04364: $$
L04365: r_{\mathrm{ave}} \approx \frac{19-13}{1200-300} \approx 0.0067 \frac{\mathrm{~L}}{\mathrm{~kg} \cdot \mathrm{~m}}
L04366: $$
L04368: This means that on average a 1 -unit increase in workload produced a 0.0067 L increase in cardiac output over the interval.
L04370: Solution (b). We estimate the slope of the cardiac output curve at $W=300$ by sketching a line that appears to meet the curve at $W=300$ with slope equal to that of the curve (Figure 2.1.13b). Estimating points $(0,7)$ and $(900,25)$ on this line, we obtain
L04372: $$
L04373: r_{\mathrm{inst}} \approx \frac{25-7}{900-0}=0.02 \frac{\mathrm{~L}}{\mathrm{~kg} \cdot \mathrm{~m}}
L04374: $$
L04376: - Figure 2.1.13
L04378: [FIGURE:513ac48bcc657dff | A graph plots cardiac output $V$ (L) on the y-axis against workload $W$ (kg·m) on the x-axis. A black curve shows cardiac output increasing with workload, peaking around $W=900$ kg·m at $V=20$ L...]
L04379: (a)
L04381: [FIGURE:61c8df2aed1f10fa | A graph plots Cardiac output $V$ in liters on the y-axis against Workload $W$ in kg$\cdot$m on the x-axis. The x-axis ranges from 0 to 1500, and the y-axis from 0 to 25. A black curve, representing...]
L04382: (b)
L04384: ## QUICK CHECK EXERCISES 2.1 (See page 143 for answers.)
L04386: 1. The slope $m_{\tan }$ of the tangent line to the curve $y=f(x)$ at the point $P\left(x_{0}, f\left(x_{0}\right)\right)$ is given by
L04388: $$
L04389: m_{\tan }=\lim _{x \rightarrow x_{0}} \square=\lim _{h \rightarrow 0}
L04390: $$
L04392: 2. The tangent line to the curve $y=(x-1)^{2}$ at the point $(-1,4)$ has equation $4 x+y=0$. Thus, the value of the limit
L04394: $$
L04395: \lim _{x \rightarrow-1} \frac{x^{2}-2 x-3}{x+1}
L04396: $$
L04398: is $\_\_\_\_$ .
L04399: 3. A particle is moving along an $s$-axis, where $s$ is in feet. During the first 5 seconds of motion, the position of the particle is given by
L04401: $$
L04402: s=10-(3-t)^{2}, \quad 0 \leq t \leq 5
L04403: $$
L04405: Use this position function to complete each part.
L04406: (a) Initially, the particle moves a distance of __ ft in the (positive/negative) __ direction; then it reverses direction, traveling a distance of ___ ft during the remainder of the 5 -second period.
L04407: (b) The average velocity of the particle over the 5 -second period is $\_\_\_\_$ .
L04408: 4. Let $s=f(t)$ be the equation of a position versus time curve for a particle in rectilinear motion, where $s$ is in meters and $t$ is in seconds. Assume that $s=-1$ when $t=2$ and that the instantaneous velocity of the particle at this instant is 3 $\mathrm{m} / \mathrm{s}$. The equation of the tangent line to the position versus time curve at time $t=2$ is $\_\_\_\_$ .
L04409: 5. Suppose that $y=x^{2}+x$.
L04410: (a) The average rate of change of $y$ with respect to $x$ over the interval $2 \leq x \leq 5$ is $\_\_\_\_$ .
L04411: (b) The instantaneous rate of change of $y$ with respect to $x$ at $x=2, r_{\text {inst }}$, is given by the limit $\_\_\_\_$ .
L04413: ## EXERCISE SET 2.1
L04415: 1. The accompanying figure on the next page shows the position versus time curve for an elevator that moves upward a distance of 60 m and then discharges its passengers.
L04416: (a) Estimate the instantaneous velocity of the elevator at $t=10 \mathrm{~s}$.
L04417: (b) Sketch a velocity versus time curve for the motion of the elevator for $0 \leq t \leq 20$.
L04419: [FIGURE:826f81b08ac080bf | A graph plots Distance in meters on the y-axis against Time in seconds on the x-axis. The x-axis ranges from 0 to 20 seconds, and the y-axis from 0 to 70 meters. A single curve shows the particle's...]
L04420: Figure Ex-1
L04422: 2. The accompanying figure shows the position versus time curve for an automobile over a period of time of 10 s . Use the line segments shown in the figure to estimate the instantaneous velocity of the automobile at time $t=4 \mathrm{~s}$ and again at time $t=8 \mathrm{~s}$.
L04424: [FIGURE:209daf516c55b6b8 | The graph plots Distance (m) on the y-axis against Time (s) on the x-axis. A black curve, representing position versus time, starts at the origin $(0,0)$ and increases quadratically. Two points are...]
L04425: Figure Ex-2
L04427: 3. The accompanying figure shows the position versus time curve for a certain particle moving along a straight line. Estimate each of the following from the graph:
L04428: (a) the average velocity over the interval $0 \leq t \leq 3$
L04429: (b) the values of $t$ at which the instantaneous velocity is zero
L04430: (c) the values of $t$ at which the instantaneous velocity is either a maximum or a minimum
L04431: (d) the instantaneous velocity when $t=3 \mathrm{~s}$.
L04433: [FIGURE:9ad912e8f6d981af | A graph plots Distance (cm) on the y-axis against Time (s) on the x-axis. The x-axis ranges from 0 to 8 seconds, and the y-axis ranges from 0 to 20 centimeters. A single curve starts at $(0, 10)$...]
L04434: <Figure Ex-3
L04436: 4. The accompanying figure shows the position versus time curves of four different particles moving on a straight line. For each particle, determine whether its instantaneous velocity is increasing or decreasing with time.
L04438: [FIGURE:694a45cc1da22c8e | The figure presents four separate graphs, labeled (a) through (d), each plotting position $s$ on the vertical axis against time $t$ on the horizontal axis. Graph (a) shows a curve where $s$ increases...]
L04439: - Figure Ex-4
L04441: ## FOCUS ON CONCEPTS
L04443: 5. If a particle moves at constant velocity, what can you say about its position versus time curve?
L04444: 6. An automobile, initially at rest, begins to move along a straight track. The velocity increases steadily until suddenly the driver sees a concrete barrier in the road and applies the brakes sharply at time $t_{0}$. The car decelerates rapidly, but it is too late-the car crashes into the barrier at time $t_{1}$ and instantaneously comes to rest. Sketch a position versus time curve that might represent the motion of the car. Indicate how characteristics of your curve correspond to the events of this scenario.
L04446: 7-10 For each exercise, sketch a curve and a line $L$ satisfying the stated conditions.
L04447: 7. $L$ is tangent to the curve and intersects the curve in at least two points.
L04448: 8. $L$ intersects the curve in exactly one point, but $L$ is not tangent to the curve.
L04449: 9. $L$ is tangent to the curve at two different points.
L04450: 10. $L$ is tangent to the curve at two different points and intersects the curve at a third point.
L04452: 11-14 A function $y=f(x)$ and values of $x_{0}$ and $x_{1}$ are given.
L04453: (a) Find the average rate of change of $y$ with respect to $x$ over the interval $\left[x_{0}, x_{1}\right]$.
L04454: (b) Find the instantaneous rate of change of $y$ with respect to $x$ at the specified value of $x_{0}$.
L04455: (c) Find the instantaneous rate of change of $y$ with respect to $x$ at an arbitrary value of $x_{0}$.
L04456: (d) The average rate of change in part (a) is the slope of a certain secant line, and the instantaneous rate of change in part (b) is the slope of a certain tangent line. Sketch the graph of $y=f(x)$ together with those two lines.
L04457: 11. $y=2 x^{2} ; x_{0}=0, x_{1}=1$
L04458: 12. $y=x^{3} ; x_{0}=1, x_{1}=2$
L04459: 13. $y=1 / x ; ~ x_{0}=2, ~ x_{1}=3$
L04460: 14. $y=1 / x^{2} ; x_{0}=1, x_{1}=2$
L04462: 15-18 A function $y=f(x)$ and an $x$-value $x_{0}$ are given.
L04463: (a) Find a formula for the slope of the tangent line to the graph of $f$ at a general point $x=x_{0}$.
L04464: (b) Use the formula obtained in part (a) to find the slope of the tangent line for the given value of $x_{0}$. □
L04465: 15. $f(x)=x^{2}-1 ; x_{0}=-1$
L04466: 16. $f(x)=x^{2}+3 x+2 ; x_{0}=2$
L04467: 17. $f(x)=x+\sqrt{x} ; x_{0}=1$
L04468: 18. $f(x)=1 / \sqrt{x} ; x_{0}=4$
L04470: 19-22 True-False Determine whether the statement is true or false. Explain your answer.
L04471: 19. If $\lim _{x \rightarrow 1} \frac{f(x)-f(1)}{x-1}=3$, then $\lim _{h \rightarrow 0} \frac{f(1+h)-f(1)}{h}=3$.
L04472: 20. A tangent line to a curve $y=f(x)$ is a particular kind of secant line to the curve.
L04473: 21. The velocity of an object represents a change in the object's position.
L04474: 22. A 50 -foot horizontal metal beam is supported on either end by concrete pillars and a weight is placed on the middle of the beam. If $f(x)$ models how many inches the center of the beam sags when the weight measures $x$ tons, then the units of the rate of change of $y=f(x)$ with respect to $x$ are inches/ton.
L04475: 23. Suppose that the outside temperature versus time curve over a 24 -hour period is as shown in the accompanying figure.
L04476: (a) Estimate the maximum temperature and the time at which it occurs.
L04477: (b) The temperature rise is fairly linear from 8 A.M. to 2 P.M. Estimate the rate at which the temperature is increasing during this time period.
L04478: (c) Estimate the time at which the temperature is decreasing most rapidly. Estimate the instantaneous rate of change of temperature with respect to time at this instant.
L04480: [FIGURE:95617952ec19163b | A line graph displays temperature in degrees Fahrenheit on the vertical axis against time over a 24-hour period on the horizontal axis. The temperature curve starts at approximately 40°F at 12 A.M...]
L04481: - Figure Ex-23
L04483: 24. The accompanying figure shows the graph of the pressure $p$ in atmospheres (atm) versus the volume $V$ in liters (L) of 1 mole of an ideal gas at a constant temperature of 300 K (kelvins). Use the line segments shown in the figure to estimate the rate of change of pressure with respect to volume at the points where $V=10 \mathrm{~L}$ and $V=25 \mathrm{~L}$.
L04485: [FIGURE:316b7ca5561341d6 | A graph shows pressure $p$ in atmospheres on the vertical axis versus volume $V$ in liters on the horizontal axis. A black curve, representing an inverse relationship between pressure and volume, is...]
L04486: -Figure Ex-24
L04488: 25. The accompanying figure shows the graph of the height $h$ in centimeters versus the age $t$ in years of an individual from birth to age 20.
L04489: (a) When is the growth rate greatest?
L04490: (b) Estimate the growth rate at age 5.
L04491: (c) At approximately what age between 10 and 20 is the growth rate greatest? Estimate the growth rate at this age.
L04492: (d) Draw a rough graph of the growth rate versus age.
L04494: [FIGURE:d6e55d360731c2cb | A graph plots height $h$ in centimeters versus age $t$ in years. The curve begins at approximately $h=50$ cm at $t=0$ years, showing an initial rapid increase in height that gradually slows. A...]
L04495: \& Figure Ex-25
L04497: 26. An object is released from rest (its initial velocity is zero) from the Empire State Building at a height of 1250 ft above street level (Figure Ex-26). The height of the object can be modeled by the position function $s=f(t)=1250-16 t^{2}$.
L04498: (a) Verify that the object is still falling at $t=5 \mathrm{~s}$.
L04499: (b) Find the average velocity of the object over the time interval from $t=5$ to $t=6 \mathrm{~s}$.
L04500: (c) Find the object's instantaneous velocity at time $t=5 \mathrm{~s}$.
L04502: [FIGURE:9e883567d442e08f | A diagram shows a tall skyscraper on the left, resembling the Empire State Building. To its right, a vertical axis labeled $s$ points upwards, with its origin $0$ aligned with the base of the...]
L04503: -Figure Ex-26
L04505: 27. During the first 40 s of a rocket flight, the rocket is propelled straight up so that in $t$ seconds it reaches a height of $s=0.3 t^{3} \mathrm{ft}$.
L04506: (a) How high does the rocket travel in 40 s ?
L04507: (b) What is the average velocity of the rocket during the first 40 s ?
L04508: (c) What is the average velocity of the rocket during the first 1000 ft of its flight?
L04509: (d) What is the instantaneous velocity of the rocket at the end of 40 s ?
L04510: 28. An automobile is driven down a straight highway such that after $0 \leq t \leq 12$ seconds it is $s=4.5 t^{2}$ feet from its initial position.
L04511: (cont.)
L04512: (a) Find the average velocity of the car over the interval [0,12].
L04513: (b) Find the instantaneous velocity of the car at $t=6$.
L04514: 29. Writing Discuss how the tangent line to the graph of a function $y=f(x)$ at a point $P\left(x_{0}, f\left(x_{0}\right)\right)$ is defined in terms of secant lines to the graph through point $P$.
L04515: 30. Writing A particle is in rectilinear motion during the time interval $0 \leq t \leq 2$. Explain the connection between the instantaneous velocity of the particle at time $t=1$ and the average velocities of the particle during portions of the interval $0 \leq t \leq 2$.
L04517: ## QUICK CHECK ANSWERS 2.1
L04519: 1. $\frac{f(x)-f\left(x_{0}\right)}{x-x_{0}} ; \frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h}$
L04520: 2. -4
L04521: 3. (a) 9; positive; 4
L04522: (b) $1 \mathrm{ft} / \mathrm{s}$
L04523: 4. $s=3 t-7$
L04524: 5. (a) 8 (b) $\lim _{x \rightarrow 2} \frac{\left(x^{2}+x\right)-6}{x-2}$ or $\lim _{h \rightarrow 0} \frac{\left[(2+h)^{2}+(2+h)\right]-6}{h}$.
