L07197: The growth and decline of animal populations and natural resources can be modeled using basic functions studied in calculus.
L07199: We begin this chapter by extending the process of differentiation to functions that are either difficult or impossible to differentiate directly. We will discuss a combination of direct and indirect methods of differentiation that will allow us to develop a number of new derivative formulas that include the derivatives of logarithmic, exponential, and inverse trigonometric functions. Later in the chapter, we will consider some applications of the derivative. These will include ways in which different rates of change can be related as well as the use of linear functions to approximate nonlinear functions. Finally, we will discuss L'Hôpital's rule, a powerful tool for evaluating limits.
L07201: ### 3.1 IMPLICIT DIFFERENTIATION
L07203: Up to now we have been concerned with differentiating functions that are given by equations of the form $y=f(x)$. In this section we will consider methods for differentiating functions for which it is inconvenient or impossible to express them in this form.
L07205: ## FUNCTIONS DEFINED EXPLICITLY AND IMPLICITLY
L07207: An equation of the form $y=f(x)$ is said to define y explicitly as a function of $x$ because the variable $y$ appears alone on one side of the equation and does not appear at all on the other side. However, sometimes functions are defined by equations in which $y$ is not alone on one side; for example, the equation
L07209: $$
L07210: \begin{equation*}
L07211: y x+y+1=x \tag{1}
L07212: \end{equation*}
L07213: $$
L07215: is not of the form $y=f(x)$, but it still defines $y$ as a function of $x$ since it can be rewritten as
L07217: $$
L07218: y=\frac{x-1}{x+1}
L07219: $$
L07221: Thus, we say that (1) defines $y$ implicitly as a function of $x$, the function being
L07223: $$
L07224: f(x)=\frac{x-1}{x+1}
L07225: $$
L07227: [FIGURE:bc51d1e7c54e2292 | The figure displays three separate graphs, each illustrating a part of the unit circle on an $xy$-coordinate system. The top graph shows a complete circle centered at the origin, representing the...]
L07228: - Figure 3.1.1
L07230: [FIGURE:ae44a0925577c262 | A graph in the $xy$-plane shows two curves: $y=\sqrt{x}$ in blue, and $y=-\sqrt{x}$ in purple, both originating from the origin and extending to the right. These two curves together represent the...]
L07231: - Figure 3.1.2 The graph of $x=y^{2}$ does not pass the vertical line test, but the graphs of $y=\sqrt{x}$ and $y=-\sqrt{x}$ do.
L07233: An equation in $x$ and $y$ can implicitly define more than one function of $x$. This can occur when the graph of the equation fails the vertical line test, so it is not the graph of a function of $x$. For example, if we solve the equation of the circle
L07235: $$
L07236: \begin{equation*}
L07237: x^{2}+y^{2}=1 \tag{2}
L07238: \end{equation*}
L07239: $$
L07241: for $y$ in terms of $x$, we obtain $y= \pm \sqrt{1-x^{2}}$, so we have found two functions that are defined implicitly by (2), namely,
L07243: $$
L07244: \begin{equation*}
L07245: f_{1}(x)=\sqrt{1-x^{2}} \quad \text { and } \quad f_{2}(x)=-\sqrt{1-x^{2}} \tag{3}
L07246: \end{equation*}
L07247: $$
L07249: The graphs of these functions are the upper and lower semicircles of the circle $x^{2}+y^{2}=1$ (Figure 3.1.1). This leads us to the following definition.
L07251: ### 3.1.1 DEFINITION We will say that a given equation in $x$ and $y$ defines the function $f$ implicitly if the graph of $y=f(x)$ coincides with a portion of the graph of the equation.
L07253: - Example 1 The graph of $x=y^{2}$ is not the graph of a function of $x$, since it does not pass the vertical line test (Figure 3.1.2). However, if we solve this equation for $y$ in terms of $x$, we obtain the equations $y=\sqrt{x}$ and $y=-\sqrt{x}$, whose graphs pass the vertical line test and are portions of the graph of $x=y^{2}$ (Figure 3.1.2). Thus, the equation $x=y^{2}$ implicitly defines the functions
L07255: $$
L07256: f_{1}(x)=\sqrt{x} \quad \text { and } \quad f_{2}(x)=-\sqrt{x}
L07257: $$
L07259: Although it was a trivial matter in the last example to solve the equation $x=y^{2}$ for $y$ in terms of $x$, it is difficult or impossible to do this for some equations. For example, the equation
L07261: $$
L07262: \begin{equation*}
L07263: x^{3}+y^{3}=3 x y \tag{4}
L07264: \end{equation*}
L07265: $$
L07267: can be solved for $y$ in terms of $x$, but the resulting formulas are too complicated to be practical. Other equations, such as $\sin (x y)=y$, cannot be solved for $y$ by any elementary method. Thus, even though an equation may define one or more functions of $x$, it may not be possible or practical to find explicit formulas for those functions.
L07269: Fortunately, CAS programs, such as Mathematica and Maple, have "implicit plotting" capabilities that can graph equations such as (4). The graph of this equation, which is called the Folium of Descartes, is shown in Figure 3.1.3a. Parts (b) and (c) of the figure show the graphs (in blue) of two functions that are defined implicitly by (4).
L07271: [FIGURE:76f368de0696a39b | The figure presents three graphs of the curve defined by the implicit equation $x^3 + y^3 = 3xy$. Graph (a) shows the entire curve in blue, which forms a loop in the first quadrant and a branch...]
L07272: - Figure 3.1.3
L07274: ## IMPLICIT DIFFERENTIATION
L07276: In general, it is not necessary to solve an equation for $y$ in terms of $x$ in order to differentiate the functions defined implicitly by the equation. To illustrate this, let us consider the simple equation
L07278: $$
L07279: \begin{equation*}
L07280: x y=1 \tag{5}
L07281: \end{equation*}
L07282: $$
L07284: One way to find $d y / d x$ is to rewrite this equation as
L07286: $$
L07287: \begin{equation*}
L07288: y=\frac{1}{x} \tag{6}
L07289: \end{equation*}
L07290: $$
L07292: from which it follows that
L07294: $$
L07295: \begin{equation*}
L07296: \frac{d y}{d x}=-\frac{1}{x^{2}} \tag{7}
L07297: \end{equation*}
L07298: $$
L07300: Another way to obtain this derivative is to differentiate both sides of (5) before solving for $y$ in terms of $x$, treating $y$ as a (temporarily unspecified) differentiable function of $x$. With this approach we obtain
L07302: $$
L07303: \begin{aligned}
L07304: & \frac{d}{d x}[x y]=\frac{d}{d x}[1] \\
L07305: & x \frac{d}{d x}[y]+y \frac{d}{d x}[x]=0 \\
L07306: & x \frac{d y}{d x}+y=0 \\
L07307: & \frac{d y}{d x}=-\frac{y}{x}
L07308: \end{aligned}
L07309: $$
L07311: If we now substitute (6) into the last expression, we obtain
L07313: $$
L07314: \frac{d y}{d x}=-\frac{1}{x^{2}}
L07315: $$
L07317: which agrees with Equation (7). This method of obtaining derivatives is called implicit differentiation.
L07319: - Example 2 Use implicit differentiation to find $d y / d x$ if $5 y^{2}+\sin y=x^{2}$.
L07321: $$
L07322: \begin{array}{ll}
L07323: \frac{d}{d x}\left[5 y^{2}+\sin y\right]=\frac{d}{d x}\left[x^{2}\right] & \\
L07324: 5 \frac{d}{d x}\left[y^{2}\right]+\frac{d}{d x}[\sin y]=2 x & \\
L07325: 5\left(2 y \frac{d y}{d x}\right)+(\cos y) \frac{d y}{d x}=2 x & \begin{array}{l}
L07326: \text { The chain rule was used here } \\
L07327: \text { because } y \text { is a function of } x .
L07328: \end{array} \\
L07329: 10 y \frac{d y}{d x}+(\cos y) \frac{d y}{d x}=2 x &
L07330: \end{array}
L07331: $$
L07333: René Descartes (1596-1650) Descartes, a French aristocrat, was the son of a government official. He graduated from the University of Poitiers with a law degree at age 20. After a brief probe into the pleasures of Paris he became a military engineer, first for the Dutch Prince of Nassau and then for the German Duke of Bavaria. It was during his service as a soldier that Descartes began to pursue mathematics seriously and develop his analytic geometry. After the wars, he returned to Paris where he stalked the city as an eccentric, wearing
L07334: a sword in his belt and a plumed hat. He lived in leisure, seldom arose before 11 A.M., and dabbled in the study of human physiology, philosophy, glaciers, meteors, and rainbows. He eventually moved to Holland, where he published his Discourse on the Method, and finally to Sweden where he died while serving as tutor to Queen Christina. Descartes is regarded as a genius of the first magnitude. In addition to major contributions in mathematics and philosophy he is considered, along with William Harvey, to be a founder of modern physiology.
L07336: Solving for $d y / d x$ we obtain
L07338: $$
L07339: \begin{equation*}
L07340: \frac{d y}{d x}=\frac{2 x}{10 y+\cos y} \tag{8}
L07341: \end{equation*}
L07342: $$
L07344: Note that this formula involves both $x$ and $y$. In order to obtain a formula for $d y / d x$ that involves $x$ alone, we would have to solve the original equation for $y$ in terms of $x$ and then substitute in (8). However, it is impossible to do this, so we are forced to leave the formula for $d y / d x$ in terms of $x$ and $y$.
L07346: Example 3 Use implicit differentiation to find $d^{2} y / d x^{2}$ if $4 x^{2}-2 y^{2}=9$.
L07347: Solution. Differentiating both sides of $4 x^{2}-2 y^{2}=9$ with respect to $x$ yields
L07349: $$
L07350: 8 x-4 y \frac{d y}{d x}=0
L07351: $$
L07353: from which we obtain
L07355: $$
L07356: \begin{equation*}
L07357: \frac{d y}{d x}=\frac{2 x}{y} \tag{9}
L07358: \end{equation*}
L07359: $$
L07361: Differentiating both sides of (9) yields
L07363: $$
L07364: \begin{equation*}
L07365: \frac{d^{2} y}{d x^{2}}=\frac{(y)(2)-(2 x)(d y / d x)}{y^{2}} \tag{10}
L07366: \end{equation*}
L07367: $$
L07369: Substituting (9) into (10) and simplifying using the original equation, we obtain
L07371: $$
L07372: \frac{d^{2} y}{d x^{2}}=\frac{2 y-2 x(2 x / y)}{y^{2}}=\frac{2 y^{2}-4 x^{2}}{y^{3}}=-\frac{9}{y^{3}}
L07373: $$
L07375: In Examples 2 and 3, the resulting formulas for $d y / d x$ involved both $x$ and $y$. Although it is usually more desirable to have the formula for $d y / d x$ expressed in terms of $x$ alone, having the formula in terms of $x$ and $y$ is not an impediment to finding slopes and equations of tangent lines provided the $x$-and $y$-coordinates of the point of tangency are known. This is illustrated in the following example.
L07377: [FIGURE:2b34a23b734d3dfd | A Cartesian coordinate system shows two curves, $y = \sqrt{x-1}$ (blue) and $y = -\sqrt{x-1}$ (purple), which together form a parabola opening to the right, starting at $x=1$. A point $(2, 1)$ is...]
L07378: - Figure 3.1.4
L07380: Example 4 Find the slopes of the tangent lines to the curve $y^{2}-x+1=0$ at the points $(2,-1)$ and $(2,1)$.
L07382: Solution. We could proceed by solving the equation for $y$ in terms of $x$, and then evaluating the derivative of $y=\sqrt{x-1}$ at $(2,1)$ and the derivative of $y=-\sqrt{x-1}$ at $(2,-1)$ (Figure 3.1.4). However, implicit differentiation is more efficient since it can be used for the slopes of both tangent lines. Differentiating implicitly yields
L07384: $$
L07385: \begin{aligned}
L07386: & \frac{d}{d x}\left[y^{2}-x+1\right]=\frac{d}{d x}[0] \\
L07387: & \frac{d}{d x}\left[y^{2}\right]-\frac{d}{d x}[x]+\frac{d}{d x}[1]=\frac{d}{d x}[0] \\
L07388: & 2 y \frac{d y}{d x}-1=0 \\
L07389: & \frac{d y}{d x}=\frac{1}{2 y}
L07390: \end{aligned}
L07391: $$
L07393: At $(2,-1)$ we have $y=-1$, and at $(2,1)$ we have $y=1$, so the slopes of the tangent lines to the curve at those points are
L07395: $$
L07396: \left.\frac{d y}{d x}\right|_{\substack{x=2 \\ y=-1}}=-\frac{1}{2} \quad \text { and }\left.\quad \frac{d y}{d x}\right|_{\substack{x=2 \\ y=1}}=\frac{1}{2}
L07397: $$
L07399: Formula (11) cannot be evaluated at $(0,0)$ and hence provides no information about the nature of the Folium of Descartes at the origin. Based on the graphs in Figure 3.1.3, what can you say about the differentiability of the implicitly defined functions graphed in blue in parts (b) and (c) of the figure?
L07401: [FIGURE:83e453bd52b31a77 | A graph in the $xy$-plane displays the Folium of Descartes, a blue curve that passes through the origin, extends into the second and third quadrants, and forms a loop in the first quadrant. A purple...]
L07402: △ Figure 3.1.5
L07404: [FIGURE:3c66185a2a0a1ea2 | A graph displays the Folium of Descartes, a blue curve, on an $x$-$y$ coordinate plane. The curve passes through the origin, extends into the second and fourth quadrants, and forms a loop in the...]
L07405: - Figure 3.1.6
L07407: ## Example 5
L07409: (a) Use implicit differentiation to find $d y / d x$ for the Folium of Descartes $x^{3}+y^{3}=3 x y$.
L07410: (b) Find an equation for the tangent line to the Folium of Descartes at the point $\left(\frac{3}{2}, \frac{3}{2}\right)$.
L07411: (c) At what point(s) in the first quadrant is the tangent line to the Folium of Descartes horizontal?
L07413: Solution (a). Differentiating implicitly yields
L07415: $$
L07416: \begin{align*}
L07417: & \frac{d}{d x}\left[x^{3}+y^{3}\right]=\frac{d}{d x}[3 x y] \\
L07418: & 3 x^{2}+3 y^{2} \frac{d y}{d x}=3 x \frac{d y}{d x}+3 y \\
L07419: & x^{2}+y^{2} \frac{d y}{d x}=x \frac{d y}{d x}+y \\
L07420: & \left(y^{2}-x\right) \frac{d y}{d x}=y-x^{2} \\
L07421: & \frac{d y}{d x}=\frac{y-x^{2}}{y^{2}-x} \tag{11}
L07422: \end{align*}
L07423: $$
L07425: Solution (b). At the point $\left(\frac{3}{2}, \frac{3}{2}\right)$, we have $x=\frac{3}{2}$ and $y=\frac{3}{2}$, so from (11) the slope $m_{\tan }$ of the tangent line at this point is
L07427: $$
L07428: m_{\tan }=\left.\frac{d y}{d x}\right|_{\substack{x=3 / 2 \\ y=3 / 2}}=\frac{(3 / 2)-(3 / 2)^{2}}{(3 / 2)^{2}-(3 / 2)}=-1
L07429: $$
L07431: Thus, the equation of the tangent line at the point $\left(\frac{3}{2}, \frac{3}{2}\right)$ is
L07433: $$
L07434: y-\frac{3}{2}=-1\left(x-\frac{3}{2}\right) \quad \text { or } \quad x+y=3
L07435: $$
L07437: which is consistent with Figure 3.1.5.
L07438: Solution ( $\boldsymbol{c}$ ). The tangent line is horizontal at the points where $d y / d x=0$, and from (11) this occurs only where $y-x^{2}=0$ or
L07440: $$
L07441: \begin{equation*}
L07442: y=x^{2} \tag{12}
L07443: \end{equation*}
L07444: $$
L07446: Substituting this expression for $y$ in the equation $x^{3}+y^{3}=3 x y$ for the curve yields
L07448: $$
L07449: \begin{aligned}
L07450: & x^{3}+\left(x^{2}\right)^{3}=3 x^{3} \\
L07451: & x^{6}-2 x^{3}=0 \\
L07452: & x^{3}\left(x^{3}-2\right)=0
L07453: \end{aligned}
L07454: $$
L07456: whose solutions are $x=0$ and $x=2^{1 / 3}$. From (12), the solutions $x=0$ and $x=2^{1 / 3}$ yield the points $(0,0)$ and $\left(2^{1 / 3}, 2^{2 / 3}\right)$, respectively. Of these two, only $\left(2^{1 / 3}, 2^{2 / 3}\right)$ is in the first quadrant. Substituting $x=2^{1 / 3}, y=2^{2 / 3}$ into (11) yields
L07458: $$
L07459: \left.\frac{d y}{d x}\right|_{\substack{x=2^{1 / 3} \\ y=2^{2 / 3}}}=\frac{0}{2^{4 / 3}-2^{2 / 3}}=0
L07460: $$
L07462: We conclude that $\left(2^{1 / 3}, 2^{2 / 3}\right) \approx(1.26,1.59)$ is the only point on the Folium of Descartes in the first quadrant at which the tangent line is horizontal (Figure 3.1.6).
L07464: ## - DIFFERENTIABILITY OF FUNCTIONS DEFINED IMPLICITLY
L07466: When differentiating implicitly, it is assumed that $y$ represents a differentiable function of $x$. If this is not so, then the resulting calculations may be nonsense. For example, if we differentiate the equation
L07468: $$
L07469: \begin{equation*}
L07470: x^{2}+y^{2}+1=0 \tag{13}
L07471: \end{equation*}
L07472: $$
L07474: we obtain
L07476: $$
L07477: 2 x+2 y \frac{d y}{d x}=0 \quad \text { or } \quad \frac{d y}{d x}=-\frac{x}{y}
L07478: $$
L07480: However, this derivative is meaningless because there are no real values of $x$ and $y$ that satisfy (13) (why?); and hence (13) does not define any real functions implicitly.
L07482: The nonsensical conclusion of these computations conveys the importance of knowing whether an equation in $x$ and $y$ that is to be differentiated implicitly actually defines some differentiable function of $x$ implicitly. Unfortunately, this can be a difficult problem, so we will leave the discussion of such matters for more advanced courses in analysis.
L07484: ## QUICK CHECK EXERCISES 3.1 (See page 192 for answers.)
L07486: 1. The equation $x y+2 y=1$ defines implicitly the function $y=$ $\_\_\_\_$ .
L07487: 2. Use implicit differentiation to find $d y / d x$ for $x^{2}-y^{3}=x y$.
L07488: 3. The slope of the tangent line to the graph of $x+y+x y=3$ at $(1,1)$ is $\_\_\_\_$ .
L07489: 4. Use implicit differentiation to find $d^{2} y / d x^{2}$ for $\sin y=x$.
L07491: ## EXERCISE SET 3.1 C CAS
L07493: ## 1-2
L07495: (a) Find $d y / d x$ by differentiating implicitly.
L07496: (b) Solve the equation for $y$ as a function of $x$, and find $d y / d x$ from that equation.
L07497: (c) Confirm that the two results are consistent by expressing the derivative in part (a) as a function of $x$ alone.
L07499: 1. $x+x y-2 x^{3}=2$
L07500: 2. $\sqrt{y}-\sin x=2$
L07502: 3-12 Find $d y / d x$ by implicit differentiation.
L07503: 3. $x^{2}+y^{2}=100$
L07504: 4. $x^{3}+y^{3}=3 x y^{2}$
L07505: 5. $x^{2} y+3 x y^{3}-x=3$
L07506: 6. $x^{3} y^{2}-5 x^{2} y+x=1$
L07507: 7. $\frac{1}{\sqrt{x}}+\frac{1}{\sqrt{y}}=1$
L07508: 8. $x^{2}=\frac{x+y}{x-y}$
L07509: 9. $\sin \left(x^{2} y^{2}\right)=x$
L07510: 10. $\cos \left(x y^{2}\right)=y$
L07511: 11. $\tan ^{3}\left(x y^{2}+y\right)=x$
L07512: 12. $\frac{x y^{3}}{1+\sec y}=1+y^{4}$
L07514: 13-18 Find $d^{2} y / d x^{2}$ by implicit differentiation.
L07515: 13. $2 x^{2}-3 y^{2}=4$
L07516: 14. $x^{3}+y^{3}=1$
L07517: 15. $x^{3} y^{3}-4=0$
L07518: 16. $x y+y^{2}=2$
L07519: 17. $y+\sin y=x$
L07520: 18. $x \cos y=y$
L07522: 19-20 Find the slope of the tangent line to the curve at the given points in two ways: first by solving for $y$ in terms of $x$ and differentiating and then by implicit differentiation.
L07523: 19. $x^{2}+y^{2}=1 ;(1 / 2, \sqrt{3} / 2),(1 / 2,-\sqrt{3} / 2)$
L07524: 20. $y^{2}-x+1=0 ;(10,3),(10,-3)$
L07526: 21-24 True-False Determine whether the statement is true or false. Explain your answer.
L07527: 21. If an equation in $x$ and $y$ defines a function $y=f(x)$ implicitly, then the graph of the equation and the graph of $f$ are identical.
L07528: 22. The function
L07530: $$
L07531: f(x)=\left\{\begin{array}{rr}
L07532: \sqrt{1-x^{2}}, & 0<x \leq 1 \\
L07533: -\sqrt{1-x^{2}}, & -1 \leq x \leq 0
L07534: \end{array}\right.
L07535: $$
L07537: is defined implicitly by the equation $x^{2}+y^{2}=1$.
L07538: 23. The function $|x|$ is not defined implicitly by the equation $(x+y)(x-y)=0$.
L07539: 24. If $y$ is defined implicitly as a function of $x$ by the equation $x^{2}+y^{2}=1$, then $d y / d x=-x / y$.
L07541: 25-28 Use implicit differentiation to find the slope of the tangent line to the curve at the specified point, and check that your answer is consistent with the accompanying graph on the next page.
L07542: 25. $x^{4}+y^{4}=16 ;(1, \sqrt[4]{15})$ [Lamé's special quartic]
L07543: 26. $y^{3}+y x^{2}+x^{2}-3 y^{2}=0 ;(0,3) \quad[$ trisectrix $]$
L07544: 27. $2\left(x^{2}+y^{2}\right)^{2}=25\left(x^{2}-y^{2}\right) ;(3,1)$ [lemniscate]
L07545: 28. $x^{2 / 3}+y^{2 / 3}=4 ;(-1,3 \sqrt{3})$ [four-cusped hypocycloid]
L07547: [FIGURE:2da14a5ea1156b67 | A graph displays a blue curve in a Cartesian coordinate system with labeled $x$ and $y$ axes. The curve is a rounded square shape, centered at the origin, passing through the points $(\pm 2, 0)$ and...]
L07548: A Figure Ex-25
L07550: [FIGURE:74fd866051ab12c6 | A graph of the trisectrix curve $y^{3}+y x^{2}+x^{2}-3 y^{2}=0$ on a Cartesian coordinate system. The curve passes through the origin $(0,0)$ and forms a loop in the upper half-plane, reaching a...]
L07551: - Figure Ex-26
L07553: [FIGURE:c6050f3e1b2fd8ab | A graph shows a lemniscate curve, resembling an infinity symbol, centered at the origin of a Cartesian coordinate system. The curve passes through the origin, extending horizontally from...]
L07554: - Figure Ex-27
L07556: [FIGURE:0730e20d531a7fa3 | A graph displays a four-cusped hypocycloid centered at the origin in the $xy$-plane. The curve has cusps at $(8,0)$, $(-8,0)$, $(0,8)$, and $(0,-8)$, consistent with the equation $x^{2/3}+y^{2/3}=4$...]
L07557: - Figure Ex-28
L07559: ## FOCUS ON CONCEPTS
L07561: 29. In the accompanying figure, it appears that the ellipse $x^{2}+x y+y^{2}=3$ has horizontal tangent lines at the points of intersection of the ellipse and the line $y=-2 x$. Use implicit differentiation to explain why this is the case.
L07563: [FIGURE:0527836275ca4f64 | The figure displays a Cartesian coordinate system with an x-axis and a y-axis, both ranging from -3 to 3. A blue ellipse, defined by the equation $x^2 + xy + y^2 = 3$, is plotted, centered at the...]
L07564: Figure Ex-29
L07566: 30. (a) A student claims that the ellipse $x^{2}-x y+y^{2}=1$ has a horizontal tangent line at the point $(1,1)$. Without doing any computations, explain why the student's claim must be incorrect.
L07567: (b) Find all points on the ellipse $x^{2}-x y+y^{2}=1$ at which the tangent line is horizontal.
L07569: C 31. (a) Use the implicit plotting capability of a CAS to graph the equation $y^{4}+y^{2}=x(x-1)$.
L07570: (b) Use implicit differentiation to help explain why the graph in part (a) has no horizontal tangent lines.
L07571: (c) Solve the equation $y^{4}+y^{2}=x(x-1)$ for $x$ in terms of $y$ and explain why the graph in part (a) consists of two parabolas.
L07572: 32. Use implicit differentiation to find all points on the graph of $y^{4}+y^{2}=x(x-1)$ at which the tangent line is vertical.
L07574: [FIGURE:4863aa8201a3152e | A Cartesian coordinate system shows two sets of curves. The first set, drawn with solid black lines, consists of three pairs of circles, each pair tangent at the origin and symmetric about the...]
L07575: - Figure Ex-37
L07577: [FIGURE:b39ebe8f6f24dd55 | A Cartesian coordinate system shows the x and y axes. A family of curves is plotted, symmetric with respect to both axes and the origin. The curves resemble hyperbolas, with some (black) closer to...]
L07578: - Figure Ex-38
L07580: 33-34 These exercises deal with the rotated ellipse $C$ whose equation is $x^{2}-x y+y^{2}=4$.
L07581: 33. Show that the line $y=x$ intersects $C$ at two points $P$ and $Q$ and that the tangent lines to $C$ at $P$ and $Q$ are parallel.
L07582: 34. Prove that if $P(a, b)$ is a point on $C$, then so is $Q(-a,-b)$ and that the tangent lines to $C$ through $P$ and through $Q$ are parallel.
L07583: 35. Find the values of $a$ and $b$ for the curve $x^{2} y+a y^{2}=b$ if the point ( 1,1 ) is on its graph and the tangent line at ( 1,1 ) has the equation $4 x+3 y=7$.
L07584: 36. At what point(s) is the tangent line to the curve $y^{3}=2 x^{2}$ perpendicular to the line $x+2 y-2=0$ ?
L07586: 37-38 Two curves are said to be orthogonal if their tangent lines are perpendicular at each point of intersection, and two families of curves are said to be orthogonal trajectories of one another if each member of one family is orthogonal to each member of the other family. This terminology is used in these exercises.
L07587: 37. The accompanying figure shows some typical members of the families of circles $x^{2}+(y-c)^{2}=c^{2}$ (black curves) and $(x-k)^{2}+y^{2}=k^{2}$ (gray curves). Show that these families are orthogonal trajectories of one another. [Hint: For the tangent lines to be perpendicular at a point of intersection, the slopes of those tangent lines must be negative reciprocals of one another.]
L07588: 38. The accompanying figure shows some typical members of the families of hyperbolas $x y=c$ (black curves) and $x^{2}-y^{2}=k$ (gray curves), where $c \neq 0$ and $k \neq 0$. Use the hint in Exercise 37 to show that these families are orthogonal trajectories of one another.
L07589: c 39. (a) Use the implicit plotting capability of a CAS to graph the curve $C$ whose equation is $x^{3}-2 x y+y^{3}=0$.
L07590: (b) Use the graph in part (a) to estimate the $x$-coordinates of a point in the first quadrant that is on $C$ and at which the tangent line to $C$ is parallel to the $x$-axis.
L07591: (c) Find the exact value of the $x$-coordinate in part (b).
L07592: c 40. (a) Use the implicit plotting capability of a CAS to graph the curve $C$ whose equation is $x^{3}-2 x y+y^{3}=0$.
L07593: (b) Use the graph to guess the coordinates of a point in the first quadrant that is on $C$ and at which the tangent line to $C$ is parallel to the line $y=-x$.
L07594: (cont.)
L07595: (c) Use implicit differentiation to verify your conjecture in part (b).
L07596: 41. Prove that for every nonzero rational number $r$, the tangent line to the graph of $x^{r}+y^{r}=2$ at the point $(1,1)$ has slope -1 .
L07597: 42. Find equations for two lines through the origin that are tangent to the ellipse $2 x^{2}-4 x+y^{2}+1=0$.
L07598: 43. Writing Write a paragraph that compares the concept of an explicit definition of a function with that of an implicit definition of a function.
L07599: 44. Writing A student asks: "Suppose implicit differentiation yields an undefined expression at a point. Does this mean that $d y / d x$ is undefined at that point?" Using the equation $x^{2}-2 x y+y^{2}=0$ as a basis for your discussion, write a paragraph that answers the student's question.
