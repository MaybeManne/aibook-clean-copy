L06134: 1. 
L06136: (a) $x^{2} f^{\prime}(x)+2 x f(x)$
L06137: (b) $\frac{\left(x^{2}+1\right) f^{\prime}(x)-2 x f(x)}{\left(x^{2}+1\right)^{2}}$
L06138: (c) $\frac{2 x f(x)-\left(x^{2}+1\right) f^{\prime}(x)}{\left[f(x)^{2}\right]}$
L06139: 2. (a) 7
L06140: (b) -4
L06141: (c) 7
L06142: (d) $\frac{5}{9}$
L06144: ### 2.5 DERIVATIVES OF TRIGONOMETRIC FUNCTIONS
L06146: Formulas (1) and (2) and the derivation of Formulas (3) and (4) are only valid if $h$ and $x$ are in radians. See Exercise 49 for how Formulas (3) and (4) change when $x$ is measured in degrees.
L06148: The main objective of this section is to obtain formulas for the derivatives of the six basic trigonometric functions. If needed, you will find a review of trigonometric functions in Appendix $B$.
L06150: We will assume in this section that the variable $x$ in the trigonometric functions $\sin x, \cos x$, $\tan x, \cot x, \sec x$, and $\csc x$ is measured in radians. Also, we will need the limits in Theorem 1.6.5, but restated as follows using $h$ rather than $x$ as the variable:
L06152: $$
L06153: \begin{equation*}
L06154: \lim _{h \rightarrow 0} \frac{\sin h}{h}=1 \quad \text { and } \quad \lim _{h \rightarrow 0} \frac{1-\cos h}{h}=0 \tag{1-2}
L06155: \end{equation*}
L06156: $$
L06158: Let us start with the problem of differentiating $f(x)=\sin x$. Using the definition of the derivative we obtain
L06160: $$
L06161: \begin{aligned}
L06162: f^{\prime}(x) & =\lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h} \\
L06163: & =\lim _{h \rightarrow 0} \frac{\sin (x+h)-\sin x}{h} \\
L06164: & =\lim _{h \rightarrow 0} \frac{\sin x \cos h+\cos x \sin h-\sin x}{h} \\
L06165: & =\lim _{h \rightarrow 0}\left[\sin x\left(\frac{\cos h-1}{h}\right)+\cos x\left(\frac{\sin h}{h}\right)\right] \\
L06166: & =\lim _{h \rightarrow 0}\left[\cos x\left(\frac{\sin h}{h}\right)-\sin x\left(\frac{1-\cos h}{h}\right)\right] \\
L06167: & =\lim _{h \rightarrow 0} \cos x \cdot \lim _{h \rightarrow 0} \frac{\sin h}{h}-\lim _{h \rightarrow 0} \sin x \cdot \lim _{h \rightarrow 0} \frac{1-\cos h}{h} \\
L06168: & =\left(\lim _{h \rightarrow 0} \cos x\right)(1)-\left(\lim _{h \rightarrow 0} \sin x\right)(0) \quad \text { Algebraic reorganization } \\
L06169: & =\lim _{h \rightarrow 0} \cos x=\cos x \quad \begin{array}{l}
L06170: \cos x \text { does not involve the variable } h \text { and hence } \\
L06171: \text { is treated as a constant in the limit computation. }
L06172: \end{array}
L06173: \end{aligned}
L06174: $$
L06176: Thus, we have shown that
L06178: $$
L06179: \begin{equation*}
L06180: \frac{d}{d x}[\sin x]=\cos x \tag{3}
L06181: \end{equation*}
L06182: $$
L06184: In the exercises we will ask you to use the same method to derive the following formula for the derivative of $\cos x$ :
L06186: $$
L06187: \begin{equation*}
L06188: \frac{d}{d x}[\cos x]=-\sin x \tag{4}
L06189: \end{equation*}
L06190: $$
L06192: Since Formulas (3) and (4) are valid only if $x$ is in radians, the same is true for Formulas (5)-(8).
L06194: When finding the value of a derivative at a specific point $x=x_{0}$, it is important to substitute $x_{0}$ after the derivative is obtained. Thus, in Example 3 we made the substitution $x=\pi / 4$ after $f^{\prime \prime}$ was calculated. What would have happened had we incorrectly substituted $x=\pi / 4$ into $f^{\prime}(x)$ before calculating $f^{\prime \prime}$ ?
L06196: Example 1 Find $d y / d x$ if $y=x \sin x$.
L06197: Solution. Using Formula (3) and the product rule we obtain
L06199: $$
L06200: \begin{aligned}
L06201: \frac{d y}{d x} & =\frac{d}{d x}[x \sin x] \\
L06202: & =x \frac{d}{d x}[\sin x]+\sin x \frac{d}{d x}[x] \\
L06203: & =x \cos x+\sin x
L06204: \end{aligned}
L06205: $$
L06207: ## Example 2 Find $d y / d x$ if $y=\frac{\sin x}{1+\cos x}$.
L06209: Solution. Using the quotient rule together with Formulas (3) and (4) we obtain
L06211: $$
L06212: \begin{aligned}
L06213: \frac{d y}{d x} & =\frac{(1+\cos x) \cdot \frac{d}{d x}[\sin x]-\sin x \cdot \frac{d}{d x}[1+\cos x]}{(1+\cos x)^{2}} \\
L06214: & =\frac{(1+\cos x)(\cos x)-(\sin x)(-\sin x)}{(1+\cos x)^{2}} \\
L06215: & =\frac{\cos x+\cos ^{2} x+\sin ^{2} x}{(1+\cos x)^{2}}=\frac{\cos x+1}{(1+\cos x)^{2}}=\frac{1}{1+\cos x}
L06216: \end{aligned}
L06217: $$
L06219: The derivatives of the remaining trigonometric functions are
L06221: $$
L06222: \begin{align*}
L06223: \frac{d}{d x}[\tan x] & =\sec ^{2} x & \frac{d}{d x}[\sec x] & =\sec x \tan x  \tag{5-6}\\
L06224: \frac{d}{d x}[\cot x] & =-\csc ^{2} x & \frac{d}{d x}[\csc x] & =-\csc x \cot x \tag{7-8}
L06225: \end{align*}
L06226: $$
L06228: These can all be obtained using the definition of the derivative, but it is easier to use Formulas (3) and (4) and apply the quotient rule to the relationships
L06230: $$
L06231: \tan x=\frac{\sin x}{\cos x}, \quad \cot x=\frac{\cos x}{\sin x}, \quad \sec x=\frac{1}{\cos x}, \quad \csc x=\frac{1}{\sin x}
L06232: $$
L06234: For example,
L06236: $$
L06237: \begin{aligned}
L06238: \frac{d}{d x}[\tan x] & =\frac{d}{d x}\left[\frac{\sin x}{\cos x}\right]=\frac{\cos x \cdot \frac{d}{d x}[\sin x]-\sin x \cdot \frac{d}{d x}[\cos x]}{\cos ^{2} x} \\
L06239: & =\frac{\cos x \cdot \cos x-\sin x \cdot(-\sin x)}{\cos ^{2} x}=\frac{\cos ^{2} x+\sin ^{2} x}{\cos ^{2} x}=\frac{1}{\cos ^{2} x}=\sec ^{2} x
L06240: \end{aligned}
L06241: $$
L06243: Example 3 Find $f^{\prime \prime}(\pi / 4)$ if $f(x)=\sec x$.
L06245: $$
L06246: \begin{aligned}
L06247: f^{\prime}(x) & =\sec x \tan x \\
L06248: f^{\prime \prime}(x) & =\sec x \cdot \frac{d}{d x}[\tan x]+\tan x \cdot \frac{d}{d x}[\sec x] \\
L06249: & =\sec x \cdot \sec ^{2} x+\tan x \cdot \sec x \tan x \\
L06250: & =\sec ^{3} x+\sec x \tan ^{2} x
L06251: \end{aligned}
L06252: $$
L06254: Thus,
L06256: $$
L06257: \begin{aligned}
L06258: f^{\prime \prime}(\pi / 4) & =\sec ^{3}(\pi / 4)+\sec (\pi / 4) \tan ^{2}(\pi / 4) \\
L06259: & =(\sqrt{2})^{3}+(\sqrt{2})(1)^{2}=3 \sqrt{2}
L06260: \end{aligned}
L06261: $$
L06263: [FIGURE:a430879ae87c4260 | A diagram illustrates a 50-foot tall flagpole with an American flag flying from its top. The sun, depicted in the upper left, casts a shadow from the flagpole onto the ground. A right-angled triangle...]
L06264: △ Figure 2.5.1
L06266: [FIGURE:69f41ef97d7f93e7 | Three diagrams illustrate a mass-spring system with a vertical coordinate axis $s$ in centimeters. In the first diagram, a mass $M$ hangs freely from a spring, with its bottom edge defining the...]
L06267: △ Figure 2.5.2
L06269: [FIGURE:85353779712a24ab | A 2D graph plots two sinusoidal curves, position $s$ and velocity $v$, against time $t$. The horizontal axis is labeled $t$ with tick marks at $0, \pi/2, \pi, 3\pi/2, 2\pi$. The vertical axis is...]
L06270: Figure 2.5.3
L06272: In Example 5, the top of the mass has its maximum speed when it passes through its rest position. Why? What is that maximum speed?
L06274: Example 4 On a sunny day, a 50 ft flagpole casts a shadow that changes with the angle of elevation of the Sun. Let $s$ be the length of the shadow and $\theta$ the angle of elevation of the Sun (Figure 2.5.1). Find the rate at which the length of the shadow is changing with respect to $\theta$ when $\theta=45^{\circ}$. Express your answer in units of feet/degree.
L06276: Solution. The variables $s$ and $\theta$ are related by $\tan \theta=50 / s$ or, equivalently,
L06278: $$
L06279: \begin{equation*}
L06280: s=50 \cot \theta \tag{9}
L06281: \end{equation*}
L06282: $$
L06284: If $\theta$ is measured in radians, then Formula (7) is applicable, which yields
L06286: $$
L06287: \frac{d s}{d \theta}=-50 \csc ^{2} \theta
L06288: $$
L06290: which is the rate of change of shadow length with respect to the elevation angle $\theta$ in units of feet/radian. When $\theta=45^{\circ}$ (or equivalently $\theta=\pi / 4$ radians), we obtain
L06292: $$
L06293: \left.\frac{d s}{d \theta}\right|_{\theta=\pi / 4}=-50 \csc ^{2}(\pi / 4)=-100 \text { feet } / \text { radian }
L06294: $$
L06296: Converting radians (rad) to degrees (deg) yields
L06298: $$
L06299: -100 \frac{\mathrm{ft}}{\mathrm{rad}} \cdot \frac{\pi}{180} \frac{\mathrm{rad}}{\mathrm{deg}}=-\frac{5}{9} \pi \frac{\mathrm{ft}}{\mathrm{deg}} \approx-1.75 \mathrm{ft} / \mathrm{deg}
L06300: $$
L06302: Thus, when $\theta=45^{\circ}$, the shadow length is decreasing (because of the minus sign) at an approximate rate of $1.75 \mathrm{ft} / \mathrm{deg}$ increase in the angle of elevation.
L06304: Example 5 As illustrated in Figure 2.5.2, suppose that a spring with an attached mass $M$ is stretched 3 cm beyond its rest position and released at time $t=0$. Assuming that the position function of the top of the attached mass is
L06306: $$
L06307: \begin{equation*}
L06308: s=-3 \cos t \tag{10}
L06309: \end{equation*}
L06310: $$
L06312: where $s$ is in centimeters and $t$ is in seconds, find the velocity function and discuss the motion of the attached mass.
L06314: Solution. The velocity function is
L06316: $$
L06317: v=\frac{d s}{d t}=\frac{d}{d t}[-3 \cos t]=3 \sin t
L06318: $$
L06320: Figure 2.5.3 shows the graphs of the position and velocity functions. The position function tells us that the top of the mass oscillates between a low point of $s=-3$ and a high point of $s=3$ with one complete oscillation occurring every $2 \pi$ seconds [the period of (10)]. The top of the mass is moving up (the positive $s$-direction) when $v$ is positive, is moving down when $v$ is negative, and is at a high or low point when $v=0$. Thus, for example, the top of the mass moves up from time $t=0$ to time $t=\pi$, at which time it reaches the high point $s=3$ and then moves down until time $t=2 \pi$, at which time it reaches the low point of $s=-3$. The motion then repeats periodically.
L06322: ## QUICK CHECK EXERCISES 2.5 (See page 174 for answers.)
L06324: 1. Find $d y / d x$.
L06325: (a) $y=\sin x$
L06326: (b) $y=\cos x$
L06327: (c) $y=\tan x$
L06328: (d) $y=\sec x$
L06329: 2. Find $f^{\prime}(x)$ and $f^{\prime}(\pi / 3)$ if $f(x)=\sin x \cos x$.
L06330: 3. Use a derivative to evaluate each limit.
L06331: (a) $\lim _{h \rightarrow 0} \frac{\sin \left(\frac{\pi}{2}+h\right)-1}{h}$
L06332: (b) $\lim _{h \rightarrow 0} \frac{\csc (x+h)-\csc x}{h}$
L06334: EXERCISE SET 2.5 Graphing Utility
L06336: 1-18 Find $f^{\prime}(x)$.
L06338: 1. $f(x)=4 \cos x+2 \sin x$
L06339: 2. $f(x)=\frac{5}{x^{2}}+\sin x$
L06340: 3. $f(x)=-4 x^{2} \cos x$
L06341: 4. $f(x)=2 \sin ^{2} x$
L06342: 5. $f(x)=\frac{5-\cos x}{5+\sin x}$
L06343: 6. $f(x)=\frac{\sin x}{x^{2}+\sin x}$
L06344: 7. $f(x)=\sec x-\sqrt{2} \tan x$
L06345: 8. $f(x)=\left(x^{2}+1\right) \sec x$
L06346: 9. $f(x)=4 \csc x-\cot x$
L06347: 10. $f(x)=\cos x-x \csc x$
L06348: 11. $f(x)=\sec x \tan x$
L06349: 12. $f(x)=\csc x \cot x$
L06350: 13. $f(x)=\frac{\cot x}{1+\csc x}$
L06351: 14. $f(x)=\frac{\sec x}{1+\tan x}$
L06352: 15. $f(x)=\sin ^{2} x+\cos ^{2} x$
L06353: 16. $f(x)=\sec ^{2} x-\tan ^{2} x$
L06354: 17. $f(x)=\frac{\sin x \sec x}{1+x \tan x}$
L06355: 18. $f(x)=\frac{\left(x^{2}+1\right) \cot x}{3-\cos x \csc x}$
L06357: 19-24 Find $d^{2} y / d x^{2}$. □
L06358: 19. $y=x \cos x$
L06359: 20. $y=\csc x$
L06360: 21. $y=x \sin x-3 \cos x$
L06361: 22. $y=x^{2} \cos x+4 \sin x$
L06362: 23. $y=\sin x \cos x$
L06363: 24. $y=\tan x$
L06364: 25. Find the equation of the line tangent to the graph of $\tan x$ at
L06365: (a) $x=0$
L06366: (b) $x=\pi / 4$
L06367: (c) $x=-\pi / 4$.
L06368: 26. Find the equation of the line tangent to the graph of $\sin x$ at
L06369: (a) $x=0$
L06370: (b) $x=\pi$
L06371: (c) $x=\pi / 4$.
L06372: 27. (a) Show that $y=x \sin x$ is a solution to $y^{\prime \prime}+y=2 \cos x$.
L06373: (b) Show that $y=x \sin x$ is a solution of the equation $y^{(4)}+y^{\prime \prime}=-2 \cos x$.
L06374: 28. (a) Show that $y=\cos x$ and $y=\sin x$ are solutions of the equation $y^{\prime \prime}+y=0$.
L06375: (b) Show that $y=A \sin x+B \cos x$ is a solution of the equation $y^{\prime \prime}+y=0$ for all constants $A$ and $B$.
L06376: 29. Find all values in the interval $[-2 \pi, 2 \pi]$ at which the graph of $f$ has a horizontal tangent line.
L06377: (a) $f(x)=\sin x$
L06378: (b) $f(x)=x+\cos x$
L06379: (c) $f(x)=\tan x$
L06380: (d) $f(x)=\sec x$
L06381: 30. (a) Use a graphing utility to make rough estimates of the values in the interval $[0,2 \pi]$ at which the graph of $y=\sin x \cos x$ has a horizontal tangent line.
L06382: (b) Find the exact locations of the points where the graph has a horizontal tangent line.
L06383: 31. A 10 ft ladder leans against a wall at an angle $\theta$ with the horizontal, as shown in the accompanying figure. The top of the ladder is $x$ feet above the ground. If the bottom of the ladder is pushed toward the wall, find the rate at which $x$ changes with respect to $\theta$ when $\theta=60^{\circ}$. Express the answer in units of feet/degree.
L06385: [FIGURE:ef15736a3a70fd4d | A diagram illustrates a 10-foot long ladder leaning against a vertical brick wall, with its base on horizontal ground. The angle between the ladder and the ground is labeled $\theta$, and the height...]
L06386: Figure Ex-31
L06388: 32. An airplane is flying on a horizontal path at a height of 3800 ft , as shown in the accompanying figure. At what rate is the distance $s$ between the airplane and the fixed point $P$ changing with respect to $\theta$ when $\theta=30^{\circ}$ ? Express the answer in units of feet/degree.
L06390: [FIGURE:a4305faef82162d2 | A diagram illustrates an airplane flying at an altitude of $3800 \text{ ft}$ above the ground. A blue line, labeled $s$, connects a point $P$ on the ground to the airplane. An angle $\theta$ is...]
L06391: Figure Ex-32
L06393: 33. A searchlight is trained on the side of a tall building. As the light rotates, the spot it illuminates moves up and down the side of the building. That is, the distance $D$ between ground level and the illuminated spot on the side of the building is a function of the angle $\theta$ formed by the light beam and the horizontal (see the accompanying figure). If the searchlight is located 50 m from the building, find the rate at which $D$ is changing with respect to $\theta$ when $\theta=45^{\circ}$. Express your answer in units of meters/degree.
L06395: [FIGURE:9a53b114340bb7d4 | A diagram depicts a spotlight on the ground, shining a beam of light onto a vertical brick wall. The horizontal distance from the spotlight to the wall is 50 m. The light beam forms an angle $\theta$...]
L06396: Figure Ex-33
L06398: 34. An Earth-observing satellite can see only a portion of the Earth's surface. The satellite has horizon sensors that can detect the angle $\theta$ shown in the accompanying figure. Let $r$ be the radius of the Earth (assumed spherical) and $h$ the distance of the satellite from the Earth's surface.
L06399: (a) Show that $h=r(\csc \theta-1)$.
L06400: (b) Using $r=6378 \mathrm{~km}$, find the rate at which $h$ is changing with respect to $\theta$ when $\theta=30^{\circ}$. Express the answer in units of kilometers/degree.
L06401: Source: Adapted from Space Mathematics, NASA, 1985.
L06403: [FIGURE:55db5063ce7c82c6 | A diagram illustrates a satellite orbiting Earth, showing a right triangle formed by the Earth's center, a tangent point on the Earth's surface, and the satellite. The right angle is at the tangent...]
L06404: -Figure Ex-34
L06406: 35-38 True-False Determine whether the statement is true or false. Explain your answer.
L06407: 35. If $g(x)=f(x) \sin x$, then $g^{\prime}(x)=f^{\prime}(x) \cos x$.
L06408: 36. If $g(x)=f(x) \sin x$, then $g^{\prime}(0)=f(0)$.
L06409: 37. If $f(x) \cos x=\sin x$, then $f^{\prime}(x)=\sec ^{2} x$.
L06410: 38. Suppose that $g(x)=f(x) \sec x$, where $f(0)=8$ and $f^{\prime}(0)=-2$. Then
L06412: $$
L06413: \begin{aligned}
L06414: g^{\prime}(0) & =\lim _{h \rightarrow 0} \frac{f(h) \sec h-f(0)}{h}=\lim _{h \rightarrow 0} \frac{8(\sec h-1)}{h} \\
L06415: & =\left.8 \cdot \frac{d}{d x}[\sec x]\right|_{x=0}=8 \sec 0 \tan 0=0
L06416: \end{aligned}
L06417: $$
L06419: 39-40 Make a conjecture about the derivative by calculating the first few derivatives and observing the resulting pattern.
L06420: 39. $\frac{d^{87}}{d x^{87}}[\sin x]$
L06421: 40. $\frac{d^{100}}{d x^{100}}[\cos x]$
L06422: 41. Let $f(x)=\cos x$. Find all positive integers $n$ for which $f^{(n)}(x)=\sin x$.
L06423: 42. Let $f(x)=\sin x$. Find all positive integers $n$ for which $f^{(n)}(x)=\sin x$.
L06425: ## FOCUS ON CONCEPTS
L06427: 43. In each part, determine where $f$ is differentiable.
L06428: (a) $f(x)=\sin x$
L06429: (b) $f(x)=\cos x$
L06430: (c) $f(x)=\tan x$
L06431: (d) $f(x)=\cot x$
L06432: (e) $f(x)=\sec x$
L06433: (f) $f(x)=\csc x$
L06434: (g) $f(x)=\frac{1}{1+\cos x}$
L06435: (h) $f(x)=\frac{1}{\sin x \cos x}$
L06436: (i) $f(x)=\frac{\cos x}{2-\sin x}$
L06437: 44. (a) Derive Formula (4) using the definition of a derivative.
L06438: (b) Use Formulas (3) and (4) to obtain (7).
L06439: (c) Use Formula (4) to obtain (6).
L06440: (d) Use Formula (3) to obtain (8).
L06441: 45. Use Formula (1), the alternative form for the definition of derivative given in Formula (13) of Section 2.2, that is,
L06443: $$
L06444: f^{\prime}(x)=\lim _{w \rightarrow x} \frac{f(w)-f(x)}{w-x}
L06445: $$
L06447: and the difference identity
L06449: $$
L06450: \sin \alpha-\sin \beta=2 \sin \left(\frac{\alpha-\beta}{2}\right) \cos \left(\frac{\alpha+\beta}{2}\right)
L06451: $$
L06453: to show that $\frac{d}{d x}[\sin x]=\cos x$.
L06454: 46. Follow the directions of Exercise 45 using the difference identity
L06456: $$
L06457: \cos \alpha-\cos \beta=-2 \sin \left(\frac{\alpha-\beta}{2}\right) \sin \left(\frac{\alpha+\beta}{2}\right)
L06458: $$
L06460: to show that $\frac{d}{d x}[\cos x]=-\sin x$.
L06461: 47. (a) Show that $\lim _{h \rightarrow 0} \frac{\tan h}{h}=1$.
L06462: (b) Use the result in part (a) to help derive the formula for the derivative of $\tan x$ directly from the definition of a derivative.
L06463: 48. Without using any trigonometric identities, find
L06465: $$
L06466: \lim _{x \rightarrow 0} \frac{\tan (x+y)-\tan y}{x}
L06467: $$
L06469: [Hint: Relate the given limit to the definition of the derivative of an appropriate function of $y$.]
L06470: 49. The derivative formulas for $\sin x, \cos x, \tan x, \cot x, \sec x$, and $\csc x$ were obtained under the assumption that $x$ is measured in radians. If $x$ is measured in degrees, then
L06472: $$
L06473: \lim _{x \rightarrow 0} \frac{\sin x}{x}=\frac{\pi}{180}
L06474: $$
L06476: (See Exercise 49 of Section 1.6). Use this result to prove that if $x$ is measured in degrees, then
L06477: (a) $\frac{d}{d x}[\sin x]=\frac{\pi}{180} \cos x$
L06478: (b) $\frac{d}{d x}[\cos x]=-\frac{\pi}{180} \sin x$.
L06479: 50. Writing Suppose that $f$ is a function that is differentiable everywhere. Explain the relationship, if any, between the periodicity of $f$ and that of $f^{\prime}$. That is, if $f$ is periodic, must $f^{\prime}$ also be periodic? If $f^{\prime}$ is periodic, must $f$ also be periodic?
L06481: ## QUICK CHECK ANSWERS 2.5
L06483: 1. 
L06485: (a) $\cos x$ (b) $-\sin x$ (c) $\sec ^{2} x$ (d) $\sec x \tan x \quad$ 2. $f^{\prime}(x)=\cos ^{2} x-\sin ^{2} x, f^{\prime}(\pi / 3)=-\frac{1}{2}$
L06486: 3. (a) $\left.\frac{d}{d x}[\sin x]\right|_{x=\pi / 2}=0$
L06487: (b) $\frac{d}{d x}[\csc x]=-\csc x \cot x$
