L07914: ## QUICK CHECK ANSWERS 3.2
L07916: 1. $y=\frac{x}{e^{2}}+1$
L07917: 2. (a) $\frac{d y}{d x}=\frac{1}{x}$
L07918: (b) $\frac{d y}{d x}=\frac{1}{2 x}$
L07919: (c) $\frac{d y}{d x}=-\frac{1}{x \ln 10}$
L07920: 3. $\frac{\sqrt{x+1}}{\sqrt[3]{x-1}}\left[\frac{1}{2(x+1)}-\frac{1}{3(x-1)}\right]$
L07921: 4. 1
L07923: ### 3.3 DERIVATIVES OF EXPONENTIAL AND INVERSE TRIGONOMETRIC FUNCTIONS
L07925: See Section 0.4 for a review of one-toone functions and inverse functions.
L07927: [FIGURE:c05bf889b2e49b69 | A graph illustrates a function $y = f(x)$ and its inverse $y = f^{-1}(x)$, reflected across the dashed line $y = x$. The curve $y = f(x)$ passes through point $(2, 1)$ with a tangent line having...]
L07928: - Figure 3.3.1
L07930: [FIGURE:9da660114cd3a75d | The graph displays two curves, one purple and one blue, on an $xy$-coordinate plane with horizontal grid lines. The purple curve is decreasing and concave down, while the blue curve is increasing and...]
L07931: Figure 3.3.2 The graph of an increasing function (blue) or a decreasing function (purple) is cut at most once by any horizontal line.
L07933: In this section we will show how the derivative of a one-to-one function can be used to obtain the derivative of its inverse function. This will provide the tools we need to obtain derivative formulas for exponential functions from the derivative formulas for logarithmic functions and to obtain derivative formulas for inverse trigonometric functions from the derivative formulas for trigonometric functions.
L07935: Our first goal in this section is to obtain a formula relating the derivative of the inverse function $f^{-1}$ to the derivative of the function $f$.
L07937: Example 1 Suppose that $f$ is a one-to-one differentiable function such that $f(2)=1$ and $f^{\prime}(2)=\frac{3}{4}$. Then the tangent line to $y=f(x)$ at the point $(2,1)$ has equation
L07939: $$
L07940: y-1=\frac{3}{4}(x-2)
L07941: $$
L07943: The tangent line to $y=f^{-1}(x)$ at the point $(1,2)$ is the reflection about the line $y=x$ of the tangent line to $y=f(x)$ at the point $(2,1)$ (Figure 3.3.1), and its equation can be obtained by interchanging $x$ and $y$ :
L07945: $$
L07946: x-1=\frac{3}{4}(y-2) \quad \text { or } \quad y-2=\frac{4}{3}(x-1)
L07947: $$
L07949: Notice that the slope of the tangent line to $y=f^{-1}(x)$ at $x=1$ is the reciprocal of the slope of the tangent line to $y=f(x)$ at $x=2$. That is,
L07951: $$
L07952: \begin{equation*}
L07953: \left(f^{-1}\right)^{\prime}(1)=\frac{1}{f^{\prime}(2)}=\frac{4}{3} \tag{1}
L07954: \end{equation*}
L07955: $$
L07957: Since $2=f^{-1}(1)$ for the function $f$ in Example 1, it follows that $f^{\prime}(2)=f^{\prime}\left(f^{-1}(1)\right)$. Thus, Formula (1) can also be expressed as
L07959: $$
L07960: \left(f^{-1}\right)^{\prime}(1)=\frac{1}{f^{\prime}\left(f^{-1}(1)\right)}
L07961: $$
L07963: In general, if $f$ is a differentiable and one-to-one function, then
L07965: $$
L07966: \begin{equation*}
L07967: \left(f^{-1}\right)^{\prime}(x)=\frac{1}{f^{\prime}\left(f^{-1}(x)\right)} \tag{2}
L07968: \end{equation*}
L07969: $$
L07971: provided $f^{\prime}\left(f^{-1}(x)\right) \neq 0$.
L07972: Formula (2) can be confirmed using implicit differentiation. The equation $y=f^{-1}(x)$ is equivalent to $x=f(y)$. Differentiating with respect to $x$ we obtain
L07974: $$
L07975: 1=\frac{d}{d x}[x]=\frac{d}{d x}[f(y)]=f^{\prime}(y) \cdot \frac{d y}{d x}
L07976: $$
L07978: so that
L07980: $$
L07981: \frac{d y}{d x}=\frac{1}{f^{\prime}(y)}=\frac{1}{f^{\prime}\left(f^{-1}(x)\right)}
L07982: $$
L07984: Also from $x=f(y)$ we have $d x / d y=f^{\prime}(y)$, which gives the following alternative version of Formula (2):
L07986: $$
L07987: \begin{equation*}
L07988: \frac{d y}{d x}=\frac{1}{d x / d y} \tag{3}
L07989: \end{equation*}
L07990: $$
L07992: ## INCREASING OR DECREASING FUNCTIONS ARE ONE-TO-ONE
L07994: If the graph of a function $f$ is always increasing or always decreasing over the domain of $f$, then a horizontal line will cut the graph of $f$ in at most one point (Figure 3.3.2), so $f$
L07996: In general, once it is established that $f^{-1}$ is differentiable, one has the option of calculating the derivative of $f^{-1}$ using Formula (2) or (3), or by differentiating implicitly, as in Example 2.
L07997: must have an inverse function (see Section 0.4). We will prove in the next chapter that $f$ is increasing on any interval on which $f^{\prime}(x)>0$ (since the graph has positive slope) and that $f$ is decreasing on any interval on which $f^{\prime}(x)<0$ (since the graph has negative slope). These intuitive observations, together with Formula (2), suggest the following theorem, which we state without formal proof.
L07998: 3.3.1 THEOREM Suppose that the domain of a function $f$ is an open interval on which $f^{\prime}(x)>0$ or on which $f^{\prime}(x)<0$. Then $f$ is one-to-one, $f^{-1}(x)$ is differentiable at all values of $x$ in the range of $f$, and the derivative of $f^{-1}(x)$ is given by Formula (2).
L08000: Example 2 Consider the function $f(x)=x^{5}+x+1$.
L08001: (a) Show that $f$ is one-to-one on the interval $(-\infty,+\infty)$.
L08002: (b) Find a formula for the derivative of $f^{-1}$.
L08003: (c) Compute $\left(f^{-1}\right)^{\prime}(1)$.
L08005: Solution (a). Since
L08007: $$
L08008: f^{\prime}(x)=5 x^{4}+1>0
L08009: $$
L08011: for all real values of $x$, it follows from Theorem 3.3.1 that $f$ is one-to-one on the interval $(-\infty,+\infty)$.
L08013: Solution (b). Let $y=f^{-1}(x)$. Differentiating $x=f(y)=y^{5}+y+1$ implicitly with respect to $x$ yields
L08015: $$
L08016: \begin{align*}
L08017: & \frac{d}{d x}[x]=\frac{d}{d x}\left[y^{5}+y+1\right] \\
L08018: & 1=\left(5 y^{4}+1\right) \frac{d y}{d x} \\
L08019: & \frac{d y}{d x}=\frac{1}{5 y^{4}+1} \tag{4}
L08020: \end{align*}
L08021: $$
L08023: We cannot solve $x=y^{5}+y+1$ for $y$ in terms of $x$, so we leave the expression for $d y / d x$ in Equation (4) in terms of $y$.
L08025: Solution (c). From Equation (4),
L08027: $$
L08028: \left(f^{-1}\right)^{\prime}(1)=\left.\frac{d y}{d x}\right|_{x=1}=\left.\frac{1}{5 y^{4}+1}\right|_{x=1}
L08029: $$
L08031: Thus, we need to know the value of $y=f^{-1}(x)$ at $x=1$, which we can obtain by solving the equation $f(y)=1$ for $y$. This equation is $y^{5}+y+1=1$, which, by inspection, is satisfied by $y=0$. Thus,
L08033: $$
L08034: \left(f^{-1}\right)^{\prime}(1)=\left.\frac{1}{5 y^{4}+1}\right|_{y=0}=1
L08035: $$
L08037: ## DERIVATIVES OF EXPONENTIAL FUNCTIONS
L08039: Our next objective is to show that the general exponential function $b^{x}(b>0, b \neq 1)$ is differentiable everywhere and to find its derivative. To do this, we will use the fact that
L08041: How does the derivation of Formula (5) change if $0<b<1$ ?
L08043: In Section 0.5 we stated that $b=e$ is the only base for which the slope of the tangent line to the curve $y=b^{x}$ at any point $P$ on the curve is the $y$-coordinate at $P$ (see page 54). Verify this statement.
L08045: It is important to distinguish between differentiating an exponential function $b^{x}$ (variable exponent and constant base) and a power function $x^{b}$ (variable base and constant exponent). For example, compare the derivative
L08047: $$
L08048: \frac{d}{d x}\left[x^{2}\right]=2 x
L08049: $$
L08051: to the derivative of $2^{x}$ in Example 3.
L08052: $b^{x}$ is the inverse of the function $f(x)=\log _{b} x$. We will assume that $b>1$. With this assumption we have $\ln b>0$, so
L08054: $$
L08055: f^{\prime}(x)=\frac{d}{d x}\left[\log _{b} x\right]=\frac{1}{x \ln b}>0 \quad \text { for all } x \text { in the interval }(0,+\infty)
L08056: $$
L08058: It now follows from Theorem 3.3.1 that $f^{-1}(x)=b^{x}$ is differentiable for all $x$ in the range of $f(x)=\log _{b} x$. But we know from Table 0.5.3 that the range of $\log _{b} x$ is $(-\infty,+\infty)$, so we have established that $b^{x}$ is differentiable everywhere.
L08060: To obtain a derivative formula for $b^{x}$ we rewrite $y=b^{x}$ as
L08062: $$
L08063: x=\log _{b} y
L08064: $$
L08066: and differentiate implicitly using Formula (5) of Section 3.2 to obtain
L08068: $$
L08069: 1=\frac{1}{y \ln b} \cdot \frac{d y}{d x}
L08070: $$
L08072: Solving for $d y / d x$ and replacing $y$ by $b^{x}$ we have
L08074: $$
L08075: \frac{d y}{d x}=y \ln b=b^{x} \ln b
L08076: $$
L08078: Thus, we have shown that
L08080: $$
L08081: \begin{equation*}
L08082: \frac{d}{d x}\left[b^{x}\right]=b^{x} \ln b \tag{5}
L08083: \end{equation*}
L08084: $$
L08086: In the special case where $b=e$ we have $\ln e=1$, so that (5) becomes
L08088: $$
L08089: \begin{equation*}
L08090: \frac{d}{d x}\left[e^{x}\right]=e^{x} \tag{6}
L08091: \end{equation*}
L08092: $$
L08094: Moreover, if $u$ is a differentiable function of $x$, then it follows from (5) and (6) that
L08096: $$
L08097: \begin{equation*}
L08098: \frac{d}{d x}\left[b^{u}\right]=b^{u} \ln b \cdot \frac{d u}{d x} \quad \text { and } \quad \frac{d}{d x}\left[e^{u}\right]=e^{u} \cdot \frac{d u}{d x} \tag{7-8}
L08099: \end{equation*}
L08100: $$
L08102: Example 3 The following computations use Formulas (7) and (8).
L08104: $$
L08105: \begin{aligned}
L08106: & \frac{d}{d x}\left[2^{x}\right]=2^{x} \ln 2 \\
L08107: & \frac{d}{d x}\left[e^{-2 x}\right]=e^{-2 x} \cdot \frac{d}{d x}[-2 x]=-2 e^{-2 x} \\
L08108: & \frac{d}{d x}\left[e^{x^{3}}\right]=e^{x^{3}} \cdot \frac{d}{d x}\left[x^{3}\right]=3 x^{2} e^{x^{3}} \\
L08109: & \frac{d}{d x}\left[e^{\cos x}\right]=e^{\cos x} \cdot \frac{d}{d x}[\cos x]=-(\sin x) e^{\cos x}
L08110: \end{aligned}
L08111: $$
L08113: Functions of the form $f(x)=u^{v}$ in which $u$ and $v$ are nonconstant functions of $x$ are neither exponential functions nor power functions. Functions of this form can be differentiated using logarithmic differentiation.
L08115: - Example 4 Use logarithmic differentiation to find $\frac{d}{d x}\left[\left(x^{2}+1\right)^{\sin x}\right]$.
L08117: Solution. Setting $y=\left(x^{2}+1\right)^{\sin x}$ we have
L08119: $$
L08120: \ln y=\ln \left[\left(x^{2}+1\right)^{\sin x}\right]=(\sin x) \ln \left(x^{2}+1\right)
L08121: $$
L08123: Differentiating both sides with respect to $x$ yields
L08125: $$
L08126: \begin{aligned}
L08127: \frac{1}{y} \frac{d y}{d x} & =\frac{d}{d x}\left[(\sin x) \ln \left(x^{2}+1\right)\right] \\
L08128: & =(\sin x) \frac{1}{x^{2}+1}(2 x)+(\cos x) \ln \left(x^{2}+1\right)
L08129: \end{aligned}
L08130: $$
L08132: Thus,
L08134: $$
L08135: \begin{aligned}
L08136: \frac{d y}{d x} & =y\left[\frac{2 x \sin x}{x^{2}+1}+(\cos x) \ln \left(x^{2}+1\right)\right] \\
L08137: & =\left(x^{2}+1\right)^{\sin x}\left[\frac{2 x \sin x}{x^{2}+1}+(\cos x) \ln \left(x^{2}+1\right)\right]
L08138: \end{aligned}
L08139: $$
L08141: ## DERIVATIVES OF THE INVERSE TRIGONOMETRIC FUNCTIONS
L08143: To obtain formulas for the derivatives of the inverse trigonometric functions, we will need to use some of the identities given in Formulas (11) to (17) of Section 0.4. Rather than memorize those identities, we recommend that you review the "triangle technique" that we used to obtain them.
L08145: To begin, consider the function $\sin ^{-1} x$. If we let $f(x)=\sin x(-\pi / 2 \leq x \leq \pi / 2)$, then it follows from Formula (2) that $f^{-1}(x)=\sin ^{-1} x$ will be differentiable at any point $x$ where $\cos \left(\sin ^{-1} x\right) \neq 0$. This is equivalent to the condition
L08147: $$
L08148: \sin ^{-1} x \neq-\frac{\pi}{2} \quad \text { and } \quad \sin ^{-1} x \neq \frac{\pi}{2}
L08149: $$
L08151: so it follows that $\sin ^{-1} x$ is differentiable on the interval $(-1,1)$.
L08152: A derivative formula for $\sin ^{-1} x$ on $(-1,1)$ can be obtained by using Formula (2) or (3) or by differentiating implicitly. We will use the latter method. Rewriting the equation
L08154: Observe that $\sin ^{-1} x$ is only differentiable on the interval $(-1,1)$, even though its domain is $[-1,1]$. This is because the graph of $y=\sin x$ has horizontal tangent lines at the points $(\pi / 2,1)$ and $(-\pi / 2,-1)$, so the graph of $y=\sin ^{-1} x$ has vertical tangent lines at $x= \pm 1$.
L08156: [FIGURE:47436ad22cc85f84 | A right-angled triangle is shown with its hypotenuse labeled 1. One acute angle is labeled $\sin^{-1}x$. The side opposite this angle is labeled $x$, and the side adjacent to it is labeled...]
L08157: Δ Figure 3.3.3
L08159: $y=\sin ^{-1} x$ as $x=\sin y$ and differentiating implicitly with respect to $x$, we obtain
L08161: $$
L08162: \begin{aligned}
L08163: & \frac{d}{d x}[x]=\frac{d}{d x}[\sin y] \\
L08164: & 1=\cos y \cdot \frac{d y}{d x} \\
L08165: & \frac{d y}{d x}=\frac{1}{\cos y}=\frac{1}{\cos \left(\sin ^{-1} x\right)}
L08166: \end{aligned}
L08167: $$
L08169: At this point we have succeeded in obtaining the derivative; however, this derivative formula can be simplified using the identity indicated in Figure 3.3.3. This yields
L08171: $$
L08172: \frac{d y}{d x}=\frac{1}{\sqrt{1-x^{2}}}
L08173: $$
L08175: Thus, we have shown that
L08177: $$
L08178: \frac{d}{d x}\left[\sin ^{-1} x\right]=\frac{1}{\sqrt{1-x^{2}}} \quad(-1<x<1)
L08179: $$
L08181: More generally, if $u$ is a differentiable function of $x$, then the chain rule produces the following generalized version of this formula:
L08183: $$
L08184: \frac{d}{d x}\left[\sin ^{-1} u\right]=\frac{1}{\sqrt{1-u^{2}}} \frac{d u}{d x} \quad(-1<u<1)
L08185: $$
L08187: The method used to derive this formula can be used to obtain generalized derivative formulas for the remaining inverse trigonometric functions. The following is a complete list of these
L08189: The appearance of $|u|$ in (13) and (14) will be explained in Exercise 58.
L08190: formulas, each of which is valid on the natural domain of the function that multiplies $d u / d x$.
L08192: $$
L08193: \begin{align*}
L08194: \frac{d}{d x}\left[\sin ^{-1} u\right] & =\frac{1}{\sqrt{1-u^{2}}} \frac{d u}{d x} & \frac{d}{d x}\left[\cos ^{-1} u\right] & =-\frac{1}{\sqrt{1-u^{2}}} \frac{d u}{d x}  \tag{9-10}\\
L08195: \frac{d}{d x}\left[\tan ^{-1} u\right] & =\frac{1}{1+u^{2}} \frac{d u}{d x} & \frac{d}{d x}\left[\cot ^{-1} u\right] & =-\frac{1}{1+u^{2}} \frac{d u}{d x} \\
L08196: \frac{d}{d x}\left[\sec ^{-1} u\right] & =\frac{1}{|u| \sqrt{u^{2}-1}} \frac{d u}{d x} & \frac{d}{d x}\left[\csc ^{-1} u\right] & =-\frac{1}{|u| \sqrt{u^{2}-1}} \frac{d u}{d x} \tag{11-12}
L08197: \end{align*}
L08198: $$
L08200: ## Example 5 Find $d y / d x$ if
L08202: (a) $y=\sin ^{-1}\left(x^{3}\right)$
L08203: (b) $y=\sec ^{-1}\left(e^{x}\right)$
L08205: Solution (a). From (9)
L08207: $$
L08208: \frac{d y}{d x}=\frac{1}{\sqrt{1-\left(x^{3}\right)^{2}}}\left(3 x^{2}\right)=\frac{3 x^{2}}{\sqrt{1-x^{6}}}
L08209: $$
L08211: Solution (b). From (13)
L08213: $$
L08214: \frac{d y}{d x}=\frac{1}{e^{x} \sqrt{\left(e^{x}\right)^{2}-1}}\left(e^{x}\right)=\frac{1}{\sqrt{e^{2 x}-1}}
L08215: $$
L08217: ## QUICK CHECK EXERCISES 3.3 (See page 203 for answers.)
L08219: 1. Suppose that a one-to-one function $f$ has tangent line $y=5 x+3$ at the point ( 1,8 ). Evaluate $\left(f^{-1}\right)^{\prime}(8)$.
L08220: 2. In each case, from the given derivative, determine whether the function $f$ is invertible.
L08221: (a) $f^{\prime}(x)=x^{2}+1$
L08222: (b) $f^{\prime}(x)=x^{2}-1$
L08223: (c) $f^{\prime}(x)=\sin x$
L08224: (d) $f^{\prime}(x)=\frac{\pi}{2}+\tan ^{-1} x$
L08225: 3. Evaluate the derivative.
L08226: (a) $\frac{d}{d x}\left[e^{x}\right]$
L08227: (b) $\frac{d}{d x}\left[7^{x}\right]$
L08228: (c) $\frac{d}{d x}\left[\cos \left(e^{x}+1\right)\right]$
L08229: (d) $\frac{d}{d x}\left[e^{3 x-2}\right]$
L08230: 4. Let $f(x)=e^{x^{3}+x}$. Use $f^{\prime}(x)$ to verify that $f$ is one-to-one.
L08232: ## FOCUS ON CONCEPTS
L08234: 1. Let $f(x)=x^{5}+x^{3}+x$.
L08235: (a) Show that $f$ is one-to-one and confirm that $f(1)=3$.
L08236: (b) Find $\left(f^{-1}\right)^{\prime}(3)$.
L08237: 2. Let $f(x)=x^{3}+2 e^{x}$.
L08238: (a) Show that $f$ is one-to-one and confirm that $f(0)=2$.
L08239: (b) Find $\left(f^{-1}\right)^{\prime}(2)$.
L08241: 3-4 Find $\left(f^{-1}\right)^{\prime}(x)$ using Formula (2), and check your answer by differentiating $f^{-1}$ directly.
L08242: 3. $f(x)=2 /(x+3)$
L08243: 4. $f(x)=\ln (2 x+1)$
L08245: 5-6 Determine whether the function $f$ is one-to-one by examining the sign of $f^{\prime}(x)$.
L08246: 5. (a) $f(x)=x^{2}+8 x+1$
L08247: (b) $f(x)=2 x^{5}+x^{3}+3 x+2$
L08248: (c) $f(x)=2 x+\sin x$
L08249: (d) $f(x)=\left(\frac{1}{2}\right)^{x}$
L08250: 6. (a) $f(x)=x^{3}+3 x^{2}-8$
L08251: (b) $f(x)=x^{5}+8 x^{3}+2 x-1$
L08252: (c) $f(x)=\frac{x}{x+1}$
L08253: (d) $f(x)=\log _{b} x, \quad 0<b<1$
L08255: 7-10 Find the derivative of $f^{-1}$ by using Formula (3), and check your result by differentiating implicitly.
L08256: 7. $f(x)=5 x^{3}+x-7$
L08257: 8. $f(x)=1 / x^{2}, \quad x>0$
L08258: 9. $f(x)=2 x^{5}+x^{3}+1$
L08259: 10. $f(x)=5 x-\sin 2 x, \quad-\frac{\pi}{4}<x<\frac{\pi}{4}$
L08261: ## FOCUS ON CONCEPTS
L08263: 11. Figure 0.4 .8 is a "proof by picture" that the reflection of a point $P(a, b)$ about the line $y=x$ is the point $Q(b, a)$. Establish this result rigorously by completing each part.
L08264: (a) Prove that if $P$ is not on the line $y=x$, then $P$ and $Q$ are distinct, and the line $\overleftrightarrow{P Q}$ is perpendicular to the line $y=x$.
L08265: (b) Prove that if $P$ is not on the line $y=x$, the midpoint of segment $P Q$ is on the line $y=x$.
L08266: (c) Carefully explain what it means geometrically to reflect $P$ about the line $y=x$.
L08267: (d) Use the results of parts (a)-(c) to prove that $Q$ is the reflection of $P$ about the line $y=x$.
L08268: 12. Prove that the reflection about the line $y=x$ of a line with slope $m, m \neq 0$, is a line with slope $1 / m$. [Hint: Apply the result of the previous exercise to a pair of points on the line of slope $m$ and to a corresponding pair of points on the reflection of this line about the line $y=x$.]
L08269: 13. Suppose that $f$ and $g$ are increasing functions. Determine which of the functions $f(x)+g(x), f(x) g(x)$, and $f(g(x))$ must also be increasing.
L08270: 14. Suppose that $f$ and $g$ are one-to-one functions. Determine which of the functions $f(x)+g(x), f(x) g(x)$, and $f(g(x))$ must also be one-to-one.
L08272: 15-26 Find $d y / d x$.
L08273: 15. $y=e^{7 x}$
L08274: 16. $y=e^{-5 x^{2}}$
L08275: 17. $y=x^{3} e^{x}$
L08276: 18. $y=e^{1 / x}$
L08277: 19. $y=\frac{e^{x}-e^{-x}}{e^{x}+e^{-x}}$
L08278: 20. $y=\sin \left(e^{x}\right)$
L08279: 21. $y=e^{x \tan x}$
L08280: 22. $y=\frac{e^{x}}{\ln x}$
L08281: 23. $y=e^{\left(x-e^{3 x}\right)}$
L08282: 24. $y=\exp \left(\sqrt{1+5 x^{3}}\right)$
L08283: 25. $y=\ln \left(1-x e^{-x}\right)$
L08284: 26. $y=\ln \left(\cos e^{x}\right)$
L08286: 27-30 Find $f^{\prime}(x)$ by Formula (7) and then by logarithmic differentiation.
L08287: 27. $f(x)=2^{x}$
L08288: 28. $f(x)=3^{-x}$
L08289: 29. $f(x)=\pi^{\sin x}$
L08290: 30. $f(x)=\pi^{x \tan x}$
L08292: 31-35 Find $d y / d x$ using the method of logarithmic differentiation.
L08293: 31. $y=\left(x^{3}-2 x\right)^{\ln x}$
L08294: 32. $y=x^{\sin x}$
L08295: 33. $y=(\ln x)^{\tan x}$
L08296: 34. $y=\left(x^{2}+3\right)^{\ln x}$
L08297: 35. $y=(\ln x)^{\ln x}$
L08298: 36. (a) Explain why Formula (5) cannot be used to find $(d / d x)\left[x^{x}\right]$.
L08299: (b) Find this derivative by logarithmic differentiation.
L08301: 37-52 Find $d y / d x$.
L08302: 37. $y=\sin ^{-1}(3 x)$
L08303: 38. $y=\cos ^{-1}\left(\frac{x+1}{2}\right)$
L08304: 39. $y=\sin ^{-1}(1 / x)$
L08305: 40. $y=\cos ^{-1}(\cos x)$
L08306: 41. $y=\tan ^{-1}\left(x^{3}\right)$
L08307: 42. $y=\sec ^{-1}\left(x^{5}\right)$
L08308: 43. $y=(\tan x)^{-1}$
L08309: 44. $y=\frac{1}{\tan ^{-1} x}$
L08310: 45. $y=e^{x} \sec ^{-1} x$
L08311: 46. $y=\ln \left(\cos ^{-1} x\right)$
L08312: 47. $y=\sin ^{-1} x+\cos ^{-1} x$
L08313: 48. $y=x^{2}\left(\sin ^{-1} x\right)^{3}$
L08314: 49. $y=\sec ^{-1} x+\csc ^{-1} x$
L08315: 50. $y=\csc ^{-1}\left(e^{x}\right)$
L08316: 51. $y=\cot ^{-1}(\sqrt{x})$
L08317: 52. $y=\sqrt{\cot ^{-1} x}$
L08319: 53-56 True-False Determine whether the statement is true or false. Explain your answer.
L08320: 53. If a function $y=f(x)$ satisfies $d y / d x=y$, then $y=e^{x}$.
L08321: 54. If $y=f(x)$ is a function such that $d y / d x$ is a rational function, then $f(x)$ is also a rational function.
L08322: 55. $\frac{d}{d x}\left(\log _{b}|x|\right)=\frac{1}{x \ln b}$
L08323: 56. We can conclude from the derivatives of $\sin ^{-1} x$ and $\cos ^{-1} x$ that $\sin ^{-1} x+\cos ^{-1} x$ is constant.
L08324: 57. (a) Use Formula (2) to prove that
L08326: $$
L08327: \left.\frac{d}{d x}\left[\cot ^{-1} x\right]\right|_{x=0}=-1
L08328: $$
L08330: (b) Use part (a) above, part (a) of Exercise 48 in Section 0.4 , and the chain rule to show that
L08332: $$
L08333: \frac{d}{d x}\left[\cot ^{-1} x\right]=-\frac{1}{1+x^{2}}
L08334: $$
L08336: for $-\infty<x<+\infty$.
L08337: (c) Conclude from part (b) that
L08339: $$
L08340: \frac{d}{d x}\left[\cot ^{-1} u\right]=-\frac{1}{1+u^{2}} \frac{d u}{d x}
L08341: $$
L08343: for $-\infty<u<+\infty$.
L08344: 58. (a) Use part (c) of Exercise 48 in Section 0.4 and the chain rule to show that
L08346: $$
L08347: \frac{d}{d x}\left[\csc ^{-1} x\right]=-\frac{1}{|x| \sqrt{x^{2}-1}}
L08348: $$
L08350: for $1<|x|$.
L08351: (b) Conclude from part (a) that
L08353: $$
L08354: \frac{d}{d x}\left[\csc ^{-1} u\right]=-\frac{1}{|u| \sqrt{u^{2}-1}} \frac{d u}{d x}
L08355: $$
L08357: for $1<|u|$.
L08358: (cont.)
L08359: (c) Use Equation (11) in Section 0.4 and parts (b) and (c) of Exercise 48 in that section to show that if $|x| \geq 1$ then, $\sec ^{-1} x+\csc ^{-1} x=\pi / 2$. Conclude from part (a) that
L08361: $$
L08362: \frac{d}{d x}\left[\sec ^{-1} x\right]=\frac{1}{|x| \sqrt{x^{2}-1}}
L08363: $$
L08365: (d) Conclude from part (c) that
L08367: $$
L08368: \frac{d}{d x}\left[\sec ^{-1} u\right]=\frac{1}{|u| \sqrt{u^{2}-1}} \frac{d u}{d x}
L08369: $$
L08371: 59-60 Find $d y / d x$ by implicit differentiation.
L08372: 59. $x^{3}+x \tan ^{-1} y=e^{y}$
L08373: 60. $\sin ^{-1}(x y)=\cos ^{-1}(x-y)$
L08374: 61. (a) Show that $f(x)=x^{3}-3 x^{2}+2 x$ is not one-to-one on $(-\infty,+\infty)$.
L08375: (b) Find the largest value of $k$ such that $f$ is one-to-one on the interval $(-k, k)$.
L08376: 62. (a) Show that the function $f(x)=x^{4}-2 x^{3}$ is not one-toone on $(-\infty,+\infty)$.
L08377: (b) Find the smallest value of $k$ such that $f$ is one-to-one on the interval $[k,+\infty)$.
L08378: 63. Let $f(x)=x^{4}+x^{3}+1,0 \leq x \leq 2$.
L08379: (a) Show that $f$ is one-to-one.
L08380: (b) Let $g(x)=f^{-1}(x)$ and define $F(x)=f(2 g(x))$. Find an equation for the tangent line to $y=F(x)$ at $x=3$.
L08381: 64. Let $f(x)=\frac{\exp \left(4-x^{2}\right)}{x}, x>0$.
L08382: (a) Show that $f$ is one-to-one.
L08383: (b) Let $g(x)=f^{-1}(x)$ and define $F(x)=f\left([g(x)]^{2}\right)$. Find $F^{\prime}\left(\frac{1}{2}\right)$.
L08384: 65. Show that for any constants $A$ and $k$, the function $y=A e^{k t}$ satisfies the equation $d y / d t=k y$.
L08385: 66. Show that for any constants $A$ and $B$, the function
L08387: $$
L08388: y=A e^{2 x}+B e^{-4 x}
L08389: $$
L08391: satisfies the equation
L08393: $$
L08394: y^{\prime \prime}+2 y^{\prime}-8 y=0
L08395: $$
L08397: 67. Show that
L08398: (a) $y=x e^{-x}$ satisfies the equation $x y^{\prime}=(1-x) y$
L08399: (b) $y=x e^{-x^{2} / 2}$ satisfies the equation $x y^{\prime}=\left(1-x^{2}\right) y$.
L08400: 68. Show that the rate of change of $y=100 e^{-0.2 x}$ with respect to $x$ is proportional to $y$.
L08401: 69. Show that
L08403: $$
L08404: y=\frac{60}{5+7 e^{-t}} \quad \text { satisfies } \quad \frac{d y}{d t}=r\left(1-\frac{y}{K}\right) y
L08405: $$
L08407: for some constants $r$ and $K$, and determine the values of these constants.
L08408: 70. Suppose that the population of oxygen-dependent bacteria in a pond is modeled by the equation
L08410: $$
L08411: P(t)=\frac{60}{5+7 e^{-t}}
L08412: $$
L08414: where $P(t)$ is the population (in billions) $t$ days after an initial observation at time $t=0$.
L08415: (a) Use a graphing utility to graph the function $P(t)$.
L08416: (b) In words, explain what happens to the population over time. Check your conclusion by finding $\lim _{t \rightarrow+\infty} P(t)$.
L08417: (c) In words, what happens to the rate of population growth over time? Check your conclusion by graphing $P^{\prime}(t)$.
L08419: 71-76 Find the limit by interpreting the expression as an appropriate derivative.
L08420: 71. $\lim _{x \rightarrow 0} \frac{e^{3 x}-1}{x}$
L08421: 72. $\lim _{x \rightarrow 0} \frac{\exp \left(x^{2}\right)-1}{x}$
L08422: 73. $\lim _{h \rightarrow 0} \frac{10^{h}-1}{h}$
L08423: 74. $\lim _{h \rightarrow 0} \frac{\tan ^{-1}(1+h)-\pi / 4}{h}$
L08424: 75. $\lim _{\Delta x \rightarrow 0} \frac{9\left[\sin ^{-1}\left(\frac{\sqrt{3}}{2}+\Delta x\right)\right]^{2}-\pi^{2}}{\Delta x}$
L08425: 76. $\lim _{w \rightarrow 2} \frac{3 \sec ^{-1} w-\pi}{w-2}$
L08426: 77. Writing Let $G$ denote the graph of an invertible function $f$ and consider $G$ as a fixed set of points in the plane. Suppose we relabel the coordinate axes so that the $x$-axis becomes the $y$-axis and vice versa. Carefully explain why now the same set of points $G$ becomes the graph of $f^{-1}$ (with the coordinate axes in a nonstandard position). Use this result to explain Formula (2).
L08427: 78. Writing Suppose that $f$ has an inverse function. Carefully explain the connection between Formula (2) and implicit differentiation of the equation $x=f(y)$.
