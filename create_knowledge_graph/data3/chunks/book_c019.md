L06483: 1. 
L06485: (a) $\cos x$ (b) $-\sin x$ (c) $\sec ^{2} x$ (d) $\sec x \tan x \quad$ 2. $f^{\prime}(x)=\cos ^{2} x-\sin ^{2} x, f^{\prime}(\pi / 3)=-\frac{1}{2}$
L06486: 3. (a) $\left.\frac{d}{d x}[\sin x]\right|_{x=\pi / 2}=0$
L06487: (b) $\frac{d}{d x}[\csc x]=-\csc x \cot x$
L06489: ### 2.6 THE CHAIN RULE
L06491: In this section we will derive a formula that expresses the derivative of a composition $f \circ g$ in terms of the derivatives of $f$ and $g$. This formula will enable us to differentiate complicated functions using known derivatives of simpler functions.
L06493: [FIGURE:e69410ac10e457e3 | A bright orange convertible car drives down a tree-lined residential street. The car is angled away from the viewer, showing its rear and right side, with motion blur in the background suggesting...]
L06494: Mike Brinson/Getty Images
L06495: The cost of a car trip is a combination of fuel efficiency and the cost of gasoline.
L06497: [FIGURE:00cfd66b9aa1488f | A diagram illustrating the chain rule for derivatives. Three variables, $y$, $u$, and $x$, are arranged with arrows indicating a dependency chain from $x$ to $u$ to $y$. Above $y$ and $u$ is a box...]
L06498: - Figure 2.6.1
L06500: The name "chain rule" is appropriate because the desired derivative is obtained by a two-link "chain" of simpler derivatives.
L06502: ## DERIVATIVES OF COMPOSITIONS
L06504: Suppose you are traveling to school in your car, which gets 20 miles per gallon of gasoline. The number of miles you can travel in your car without refueling is a function of the number of gallons of gas you have in the gas tank. In symbols, if $y$ is the number of miles you can travel and $u$ is the number of gallons of gas you have initially, then $y$ is a function of $u$, or $y=f(u)$. As you continue your travels, you note that your local service station is selling gasoline for $\$ 4$ per gallon. The number of gallons of gas you have initially is a function of the amount of money you spend for that gas. If $x$ is the number of dollars you spend on gas, then $u=g(x)$. Now 20 miles per gallon is the rate at which your mileage changes with respect to the amount of gasoline you use, so
L06506: $$
L06507: f^{\prime}(u)=\frac{d y}{d u}=20 \text { miles per gallon }
L06508: $$
L06510: Similarly, since gasoline costs $\$ 4$ per gallon, each dollar you spend will give you $1 / 4$ of a gallon of gas, and
L06512: $$
L06513: g^{\prime}(x)=\frac{d u}{d x}=\frac{1}{4} \text { gallons per dollar }
L06514: $$
L06516: Notice that the number of miles you can travel is also a function of the number of dollars you spend on gasoline. This fact is expressible as the composition of functions
L06518: $$
L06519: y=f(u)=f(g(x))
L06520: $$
L06522: You might be interested in how many miles you can travel per dollar, which is $d y / d x$. Intuition suggests that rates of change multiply in this case (see Figure 2.6.1), so
L06524: $$
L06525: \frac{d y}{d x}=\frac{d y}{d u} \cdot \frac{d u}{d x}=\frac{20 \text { miles }}{1 \text { gallon }} \cdot \frac{1 \text { gallons }}{4 \text { dollars }}=\frac{20 \text { miles }}{4 \text { dollars }}=5 \text { miles per dollar }
L06526: $$
L06528: The following theorem, the proof of which is given in Appendix D, formalizes the preceding ideas.
L06529: 2.6.1 THEOREM (The Chain Rule) If $g$ is differentiable at $x$ and $f$ is differentiable at $g(x)$, then the composition $f \circ g$ is differentiable at $x$. Moreover, if
L06531: $$
L06532: y=f(g(x)) \text { and } u=g(x)
L06533: $$
L06535: then $y=f(u)$ and
L06537: $$
L06538: \begin{equation*}
L06539: \frac{d y}{d x}=\frac{d y}{d u} \cdot \frac{d u}{d x} \tag{1}
L06540: \end{equation*}
L06541: $$
L06543: Formula (1) is easy to remember because the left side is exactly what results if we "cancel" the $d u$ 's on the right side. This "canceling" device provides a good way of deducing the correct form of the chain rule when different variables are used. For example, if $w$ is a function of $x$ and $x$ is a function of $t$, then the chain rule takes the form
L06545: $$
L06546: \frac{d w}{d t}=\frac{d w}{d x} \cdot \frac{d x}{d t}
L06547: $$
L06549: Confirm that (2) is an alternative version of (1) by letting $y=f(g(x))$ and $u=g(x)$.
L06551: Example 1 Find $d y / d x$ if $y=\cos \left(x^{3}\right)$.
L06552: Solution. Let $u=x^{3}$ and express $y$ as $y=\cos u$. Applying Formula (1) yields
L06554: $$
L06555: \begin{aligned}
L06556: \frac{d y}{d x} & =\frac{d y}{d u} \cdot \frac{d u}{d x} \\
L06557: & =\frac{d}{d u}[\cos u] \cdot \frac{d}{d x}\left[x^{3}\right] \\
L06558: & =(-\sin u) \cdot\left(3 x^{2}\right) \\
L06559: & =\left(-\sin \left(x^{3}\right)\right) \cdot\left(3 x^{2}\right)=-3 x^{2} \sin \left(x^{3}\right)
L06560: \end{aligned}
L06561: $$
L06563: Example 2 Find $d w / d t$ if $w=\tan x$ and $x=4 t^{3}+t$.
L06564: Solution. In this case the chain rule computations take the form
L06566: $$
L06567: \begin{aligned}
L06568: \frac{d w}{d t} & =\frac{d w}{d x} \cdot \frac{d x}{d t} \\
L06569: & =\frac{d}{d x}[\tan x] \cdot \frac{d}{d t}\left[4 t^{3}+t\right] \\
L06570: & =\left(\sec ^{2} x\right) \cdot\left(12 t^{2}+1\right) \\
L06571: & =\left[\sec ^{2}\left(4 t^{3}+t\right)\right] \cdot\left(12 t^{2}+1\right)=\left(12 t^{2}+1\right) \sec ^{2}\left(4 t^{3}+t\right)
L06572: \end{aligned}
L06573: $$
L06575: ## AN ALTERNATIVE VERSION OF THE CHAIN RULE
L06577: Formula (1) for the chain rule can be unwieldy in some problems because it involves so many variables. As you become more comfortable with the chain rule, you may want to dispense with writing out the dependent variables by expressing (1) in the form
L06579: $$
L06580: \begin{equation*}
L06581: \frac{d}{d x}[f(g(x))]=(f \circ g)^{\prime}(x)=f^{\prime}(g(x)) g^{\prime}(x) \tag{2}
L06582: \end{equation*}
L06583: $$
L06585: A convenient way to remember this formula is to call $f$ the "outside function" and $g$ the "inside function" in the composition $f(g(x))$ and then express (2) in words as:
L06587: The derivative of $f(g(x))$ is the derivative of the outside function evaluated at the inside function times the derivative of the inside function.
L06588: [FIGURE:f8e455fb763ffa68 | The image visually explains the chain rule for derivatives, showing that the derivative of a composite function $\frac{d}{dx}[f(g(x)))$ is equal to the product of two terms. The first term...]
L06590: Example 3 (Example 1 revisited) Find $h^{\prime}(x)$ if $h(x)=\cos \left(x^{3}\right)$.
L06591: Solution. We can think of $h$ as a composition $f(g(x))$ in which $g(x)=x^{3}$ is the inside function and $f(x)=\cos x$ is the outside function. Thus, Formula (2) yields
L06593: \$\$
L06595: \$\$
L06596: which agrees with the result obtained in Example 1.
L06598: ## Example 4
L06600: [FIGURE:e2286fad8528ed96 | An equation demonstrating the chain rule for the derivative of $\tan^2 x$. The equation shows $\frac{d}{dx}[\tan^2 x) = \frac{d}{dx}[(\tan x)^2) = (2 \tan x) \cdot (\sec^2 x) = 2 \tan x \sec^2 x$...]
L06601: [FIGURE:4ea81aa183b7966c | This image illustrates the chain rule applied to the function $\sqrt{x^2+1}$. The derivative $\frac{d}{dx}[\sqrt{x^2+1})$ is shown as $\frac{1}{2\sqrt{x^2+1}} \cdot 2x = \frac{x}{\sqrt{x^2+1}}$. The...]
L06603: ## GENERALIZED DERIVATIVE FORMULAS
L06605: There is a useful third variation of the chain rule that strikes a middle ground between Formulas (1) and (2). If we let $u=g(x)$ in (2), then we can rewrite that formula as
L06607: $$
L06608: \begin{equation*}
L06609: \frac{d}{d x}[f(u)]=f^{\prime}(u) \frac{d u}{d x} \tag{3}
L06610: \end{equation*}
L06611: $$
L06613: This result, called the generalized derivative formula for $f$, provides a way of using the derivative of $f(x)$ to produce the derivative of $f(u)$, where $u$ is a function of $x$. Table 2.6.1 gives some examples of this formula.
L06615: Table 2.6.1
L06616: GENERALIZED DERIVATIVE FORMULAS
L06618: $$
L06619: \begin{array}{rlrl}
L06620: \frac{d}{d x}\left[u^{r}\right]=r u^{r-1} \frac{d u}{d x} \\
L06621: \frac{d}{d x}[\sin u]=\cos u \frac{d u}{d x} & \frac{d}{d x}[\cos u]=-\sin u \frac{d u}{d x} \\
L06622: \frac{d}{d x}[\tan u]=\sec ^{2} u \frac{d u}{d x} & \frac{d}{d x}[\cot u]=-\csc ^{2} u \frac{d u}{d x} \\
L06623: \frac{d}{d x}[\sec u]=\sec u \tan u \frac{d u}{d x} & \frac{d}{d x}[\csc u]=-\csc u \cot u \frac{d u}{d x}
L06624: \end{array}
L06625: $$
L06627: Example 5 Find
L06628: (a) $\frac{d}{d x}[\sin (2 x)]$
L06629: (b) $\frac{d}{d x}\left[\tan \left(x^{2}+1\right)\right]$
L06630: (c) $\frac{d}{d x}\left[\sqrt{x^{3}+\csc x}\right]$
L06631: (d) $\frac{d}{d x}\left[x^{2}-x+2\right]^{3 / 4}$
L06632: (e) $\frac{d}{d x}\left[\left(1+x^{5} \cot x\right)^{-8}\right]$
L06634: Solution (a). Taking $u=2 x$ in the generalized derivative formula for $\sin u$ yields
L06636: $$
L06637: \frac{d}{d x}[\sin (2 x)]=\frac{d}{d x}[\sin u]=\cos u \frac{d u}{d x}=\cos 2 x \cdot \frac{d}{d x}[2 x]=\cos 2 x \cdot 2=2 \cos 2 x
L06638: $$
L06640: Solution (b). Taking $u=x^{2}+1$ in the generalized derivative formula for $\tan u$ yields
L06642: $$
L06643: \begin{aligned}
L06644: \frac{d}{d x}\left[\tan \left(x^{2}+1\right)\right] & =\frac{d}{d x}[\tan u]=\sec ^{2} u \frac{d u}{d x} \\
L06645: & =\sec ^{2}\left(x^{2}+1\right) \cdot \frac{d}{d x}\left[x^{2}+1\right]=\sec ^{2}\left(x^{2}+1\right) \cdot 2 x \\
L06646: & =2 x \sec ^{2}\left(x^{2}+1\right)
L06647: \end{aligned}
L06648: $$
L06650: Solution (c). Taking $u=x^{3}+\csc x$ in the generalized derivative formula for $\sqrt{u}$ yields
L06652: $$
L06653: \begin{aligned}
L06654: \frac{d}{d x}\left[\sqrt{x^{3}+\csc x}\right] & =\frac{d}{d x}[\sqrt{u}]=\frac{1}{2 \sqrt{u}} \frac{d u}{d x}=\frac{1}{2 \sqrt{x^{3}+\csc x}} \cdot \frac{d}{d x}\left[x^{3}+\csc x\right] \\
L06655: & =\frac{1}{2 \sqrt{x^{3}+\csc x}} \cdot\left(3 x^{2}-\csc x \cot x\right)=\frac{3 x^{2}-\csc x \cot x}{2 \sqrt{x^{3}+\csc x}}
L06656: \end{aligned}
L06657: $$
L06659: Solution (d). Taking $u=x^{2}-x+2$ in the generalized derivative formula for $u^{3 / 4}$ yields
L06661: $$
L06662: \begin{aligned}
L06663: \frac{d}{d x}\left[x^{2}-x+2\right]^{3 / 4} & =\frac{d}{d x}\left[u^{3 / 4}\right]=\frac{3}{4} u^{-1 / 4} \frac{d u}{d x} \\
L06664: & =\frac{3}{4}\left(x^{2}-x+2\right)^{-1 / 4} \cdot \frac{d}{d x}\left[x^{2}-x+2\right] \\
L06665: & =\frac{3}{4}\left(x^{2}-x+2\right)^{-1 / 4}(2 x-1)
L06666: \end{aligned}
L06667: $$
L06669: Solution (e). Taking $u=1+x^{5} \cot x$ in the generalized derivative formula for $u^{-8}$ yields
L06671: $$
L06672: \begin{aligned}
L06673: \frac{d}{d x}\left[\left(1+x^{5} \cot x\right)^{-8}\right] & =\frac{d}{d x}\left[u^{-8}\right]=-8 u^{-9} \frac{d u}{d x} \\
L06674: & =-8\left(1+x^{5} \cot x\right)^{-9} \cdot \frac{d}{d x}\left[1+x^{5} \cot x\right] \\
L06675: & =-8\left(1+x^{5} \cot x\right)^{-9} \cdot\left[x^{5}\left(-\csc ^{2} x\right)+5 x^{4} \cot x\right] \\
L06676: & =\left(8 x^{5} \csc ^{2} x-40 x^{4} \cot x\right)\left(1+x^{5} \cot x\right)^{-9}
L06677: \end{aligned}
L06678: $$
L06680: Sometimes you will have to make adjustments in notation or apply the chain rule more than once to calculate a derivative.
L06682: Example 6 Find
L06683: (a) $\frac{d}{d x}[\sin (\sqrt{1+\cos x})]$
L06684: (b) $\frac{d \mu}{d t}$ if $\mu=\sec \sqrt{\omega t} \quad(\omega$ constant $)$
L06686: Solution (a). Taking $u=\sqrt{1+\cos x}$ in the generalized derivative formula for $\sin u$ yields
L06688: $$
L06689: \begin{aligned}
L06690: \frac{d}{d x}[\sin (\sqrt{1+\cos x})] & =\frac{d}{d x}[\sin u]=\cos u \frac{d u}{d x} \\
L06691: & =\cos (\sqrt{1+\cos x}) \cdot \frac{d}{d x}[\sqrt{1+\cos x}] \\
L06692: & =\cos (\sqrt{1+\cos x}) \cdot \frac{-\sin x}{2 \sqrt{1+\cos x}} \quad \begin{array}{l}
L06693: \text { We used the generalized derivative } \\
L06694: \text { formula for } \sqrt{u} \text { with } u=1+\cos x .
L06695: \end{array} \\
L06696: & =-\frac{\sin x \cos (\sqrt{1+\cos x})}{2 \sqrt{1+\cos x}}
L06697: \end{aligned}
L06698: $$
L06700: ## Solution (b).
L06702: $$
L06703: \begin{aligned}
L06704: \frac{d \mu}{d t}=\frac{d}{d t}[\sec \sqrt{\omega t}] & =\sec \sqrt{\omega t} \tan \sqrt{\omega t} \frac{d}{d t}[\sqrt{\omega t}] \\
L06705: & =\sec \sqrt{\omega t} \tan \sqrt{\omega t} \frac{\omega}{2 \sqrt{\omega t}}
L06706: \end{aligned}
L06707: $$
L06709: We used the generalized derivative formula for $\sec u$ with $u=\sqrt{\omega t}$.
L06711: We used the generalized derivative formula for $\sqrt{u}$ with $u=\omega t$.
L06713: ## TECHNOLOGY MASTERY
L06715: If you have a CAS, use it to perform the differentiation in (4).
L06717: ## DIFFERENTIATING USING COMPUTER ALGEBRA SYSTEMS
L06719: Even with the chain rule and other differentiation rules, some derivative computations can be tedious to perform. For complicated derivatives, engineers and scientists often use computer algebra systems such as Mathematica, Maple, or Sage. For example, although we have all the mathematical tools to compute
L06721: $$
L06722: \begin{equation*}
L06723: \frac{d}{d x}\left[\frac{\left(x^{2}+1\right)^{10} \sin ^{3}(\sqrt{x})}{\sqrt{1+\csc x}}\right] \tag{4}
L06724: \end{equation*}
L06725: $$
L06727: by hand, the computation is sufficiently involved that it may be more efficient (and less error-prone) to use a computer algebra system.
L06729: ## QUICK CHECK EXERCISES 2.6 (See page 181 for answers.)
L06731: 1. The chain rule states that the derivative of the composition of two functions is the derivative of the $\_\_\_\_$ function evaluated at the $\_\_\_\_$ function times the derivative of the $\_\_\_\_$ function.
L06732: 2. If $y$ is a differentiable function of $u$, and $u$ is a differentiable function of $x$, then
L06734: $$
L06735: \frac{d y}{d x}=
L06736: $$
L06738: $\_\_\_\_$ . $\_\_\_\_$
L06739: 3. Find $d y / d x$.
L06740: (a) $y=\left(x^{2}+5\right)^{10}$
L06741: (b) $y=\sqrt{1+6 x}$
L06742: 4. Find $d y / d x$.
L06743: (a) $y=\sin (3 x+2)$
L06744: (b) $y=\left(x^{2} \tan x\right)^{4}$
L06745: 5. Suppose that $f(2)=3, f^{\prime}(2)=4, g(3)=6$, and $g^{\prime}(3)=-5$. Evaluate
L06746: (a) $h^{\prime}(2)$, where $h(x)=g(f(x))$
L06747: (b) $k^{\prime}(3)$, where $k(x)=f\left(\frac{1}{3} g(x)\right)$.
L06749: 1. Given that
L06751: $$
L06752: f^{\prime}(0)=2, g(0)=0 \quad \text { and } \quad g^{\prime}(0)=3
L06753: $$
L06755: find $(f \circ g)^{\prime}(0)$.
L06756: 2. Given that
L06758: $$
L06759: f^{\prime}(9)=5, g(2)=9 \quad \text { and } \quad g^{\prime}(2)=-3
L06760: $$
L06762: find $(f \circ g)^{\prime}(2)$.
L06763: 3. Let $f(x)=x^{5}$ and $g(x)=2 x-3$.
L06764: (a) Find $(f \circ g)(x)$ and $(f \circ g)^{\prime}(x)$.
L06765: (b) Find $(g \circ f)(x)$ and $(g \circ f)^{\prime}(x)$.
L06766: 4. Let $f(x)=5 \sqrt{x}$ and $g(x)=4+\cos x$.
L06767: (a) Find $(f \circ g)(x)$ and $(f \circ g)^{\prime}(x)$.
L06768: (b) Find $(g \circ f)(x)$ and $(g \circ f)^{\prime}(x)$.
L06770: ## FOCUS ON CONCEPTS
L06772: 5. Given the following table of values, find the indicated derivatives in parts (a) and (b).
L06774: | $x$ | $f(x)$ | $f^{\prime}(x)$ | $g(x)$ | $g^{\prime}(x)$ |
L06775: | :---: | :---: | :---: | :---: | :---: |
L06776: | 3 | 5 | -2 | 5 | 7 |
L06777: | 5 | 3 | -1 | 12 | 4 |
L06779: (a) $F^{\prime}(3)$, where $F(x)=f(g(x))$
L06780: (b) $G^{\prime}(3)$, where $G(x)=g(f(x))$
L06781: 6. Given the following table of values, find the indicated derivatives in parts (a) and (b).
L06783: | $x$ | $f(x)$ | $f^{\prime}(x)$ | $g(x)$ | $g^{\prime}(x)$ |
L06784: | ---: | :---: | :---: | :---: | :---: |
L06785: | -1 | 2 | 3 | 2 | -3 |
L06786: | 2 | 0 | 4 | 1 | -5 |
L06788: (a) $F^{\prime}(-1)$, where $F(x)=f(g(x))$
L06789: (b) $G^{\prime}(-1)$, where $G(x)=g(f(x))$
L06791: 7-26 Find $f^{\prime}(x)$.
L06792: 7. $f(x)=\left(x^{3}+2 x\right)^{37}$
L06793: 8. $f(x)=\left(3 x^{2}+2 x-1\right)^{6}$
L06794: 9. $f(x)=\left(x^{3}-\frac{7}{x}\right)^{-2}$
L06795: 10. $f(x)=\frac{1}{\left(x^{5}-x+1\right)^{9}}$
L06796: 11. $f(x)=\frac{4}{\left(3 x^{2}-2 x+1\right)^{3}}$
L06797: 12. $f(x)=\sqrt{x^{3}-2 x+5}$
L06798: 13. $f(x)=\sqrt{4+\sqrt{3 x}}$
L06799: 14. $f(x)=\sqrt[4]{x} \quad(=\sqrt{\sqrt{x}})$
L06800: 15. $f(x)=\sin \left(\frac{1}{x^{2}}\right)$
L06801: 16. $f(x)=\tan \sqrt{x}$
L06802: 17. $f(x)=4 \cos ^{5} x$
L06803: 18. $f(x)=4 x+5 \sin ^{4} x$
L06804: 19. $f(x)=\cos ^{2}(3 \sqrt{x})$
L06805: 20. $f(x)=\tan ^{4}\left(x^{3}\right)$
L06806: 21. $f(x)=2 \sec ^{2}\left(x^{7}\right)$
L06807: 22. $f(x)=\cos ^{3}\left(\frac{x}{x+1}\right)$
L06808: 23. $f(x)=\sqrt{\cos (5 x)}$
L06809: 24. $f(x)=\sqrt{3 x-\sin ^{2}(4 x)}$
L06810: 25. $f(x)=\left[x+\csc \left(x^{3}+3\right)\right]^{-3}$
L06811: 26. $f(x)=\left[x^{4}-\sec \left(4 x^{2}-2\right)\right]^{-4}$
L06813: 27-40 Find $d y / d x$.
L06814: 27. $y=x^{3} \sin ^{2}(5 x)$
L06815: 28. $y=\sqrt{x} \tan ^{3}(\sqrt{x})$
L06816: 29. $y=x^{5} \sec (1 / x)$
L06817: 30. $y=\frac{\sin x}{\sec (3 x+1)}$
L06818: 31. $y=\cos (\cos x)$
L06819: 32. $y=\sin (\tan 3 x)$
L06820: 33. $y=\cos ^{3}(\sin 2 x)$
L06821: 34. $y=\frac{1+\csc \left(x^{2}\right)}{1-\cot \left(x^{2}\right)}$
L06822: 35. $y=(5 x+8)^{7}(1-\sqrt{x})^{6}$
L06823: 36. $y=\left(x^{2}+x\right)^{5} \sin ^{8} x$
L06824: 37. $y=\left(\frac{x-5}{2 x+1}\right)^{3}$
L06825: 38. $y=\left(\frac{1+x^{2}}{1-x^{2}}\right)^{17}$
L06826: 39. $y=\frac{(2 x+3)^{3}}{\left(4 x^{2}-1\right)^{8}}$
L06827: 40. $y=\left[1+\sin ^{3}\left(x^{5}\right)\right]^{12}$
L06829: C 41-42 Use a CAS to find $d y / d x$.
L06830: 41. $y=\left[x \sin 2 x+\tan ^{4}\left(x^{7}\right)\right]^{5}$
L06831: 42. $y=\tan ^{4}\left(2+\frac{(7-x) \sqrt{3 x^{2}+5}}{x^{3}+\sin x}\right)$
L06833: 43-50 Find an equation for the tangent line to the graph at the specified value of $x$.
L06834: 43. $y=x \cos 3 x, x=\pi$
L06835: 44. $y=\sin \left(1+x^{3}\right), x=-3$
L06836: 45. $y=\sec ^{3}\left(\frac{\pi}{2}-x\right), x=-\frac{\pi}{2}$
L06837: 46. $y=\left(x-\frac{1}{x}\right)^{3}, x=2$
L06838: 47. $y=\tan \left(4 x^{2}\right), x=\sqrt{\pi}$
L06839: 48. $y=3 \cot ^{4} x, x=\frac{\pi}{4}$
L06840: 49. $y=x^{2} \sqrt{5-x^{2}}, x=1$
L06841: 50. $y=\frac{x}{\sqrt{1-x^{2}}}, x=0$
L06843: 51-54 Find $d^{2} y / d x^{2}$.
L06844: 51. $y=x \cos (5 x)-\sin ^{2} x$
L06845: 52. $y=\sin \left(3 x^{2}\right)$
L06846: 53. $y=\frac{1+x}{1-x}$
L06847: 54. $y=x \tan \left(\frac{1}{x}\right)$
L06849: 55-58 Find the indicated derivative.
L06850: 55. $y=\cot ^{3}(\pi-\theta)$; find $\frac{d y}{d \theta}$.
L06851: 56. $\lambda=\left(\frac{a u+b}{c u+d}\right)^{6}$; find $\frac{d \lambda}{d u} \quad(a, b, c, d$ constants).
L06852: 57. $\frac{d}{d \omega}\left[a \cos ^{2} \pi \omega+b \sin ^{2} \pi \omega\right] \quad(a, b$ constants $)$
L06853: 58. $x=\csc ^{2}\left(\frac{\pi}{3}-y\right)$; find $\frac{d x}{d y}$.
L06854: 59. (a) Use a graphing utility to obtain the graph of the function $f(x)=x \sqrt{4-x^{2}}$.
L06855: (b) Use the graph in part (a) to make a rough sketch of the graph of $f^{\prime}$.
L06856: (c) Find $f^{\prime}(x)$, and then check your work in part (b) by using the graphing utility to obtain the graph of $f^{\prime}$.
L06857: (d) Find the equation of the tangent line to the graph of $f$ at $x=1$, and graph $f$ and the tangent line together.
L06858: 60. (a) Use a graphing utility to obtain the graph of the function $f(x)=\sin x^{2} \cos x$ over the interval $[-\pi / 2, \pi / 2]$.
L06859: (b) Use the graph in part (a) to make a rough sketch of the graph of $f^{\prime}$ over the interval.
L06860: (c) Find $f^{\prime}(x)$, and then check your work in part (b) by using the graphing utility to obtain the graph of $f^{\prime}$ over the interval.
L06861: (d) Find the equation of the tangent line to the graph of $f$ at $x=1$, and graph $f$ and the tangent line together over the interval.
L06863: 61-64 True-False Determine whether the statement is true or false. Explain your answer. $\square$
L06864: 61. If $y=f(x)$, then $\frac{d}{d x}[\sqrt{y}]=\sqrt{f^{\prime}(x)}$.
L06865: 62. If $y=f(u)$ and $u=g(x)$, then $d y / d x=f^{\prime}(x) \cdot g^{\prime}(x)$.
L06866: 63. If $y=\cos [g(x)]$, then $d y / d x=-\sin \left[g^{\prime}(x)\right]$.
L06867: 64. If $y=\sin ^{3}\left(3 x^{3}\right)$, then $d y / d x=27 x^{2} \sin ^{2}\left(3 x^{3}\right) \cos \left(3 x^{3}\right)$.
L06868: 65. If an object suspended from a spring is displaced vertically from its equilibrium position by a small amount and released, and if the air resistance and the mass of the spring are ignored, then the resulting oscillation of the object is called simple harmonic motion. Under appropriate conditions the displacement $y$ from equilibrium in terms of time $t$ is given by
L06870: $$
L06871: y=A \cos \omega t
L06872: $$
L06874: where $A$ is the initial displacement at time $t=0$, and $\omega$ is a constant that depends on the mass of the object and the stiffness of the spring (see the accompanying figure). The constant $|A|$ is called the amplitude of the motion and $\omega$ the angular frequency.
L06875: (a) Show that
L06877: $$
L06878: \frac{d^{2} y}{d t^{2}}=-\omega^{2} y
L06879: $$
L06881: (b) The period $T$ is the time required to make one complete oscillation. Show that $T=2 \pi / \omega$.
L06882: (c) The frequency $f$ of the vibration is the number of oscillations per unit time. Find $f$ in terms of the period $T$.
L06883: (d) Find the amplitude, period, and frequency of an object that is executing simple harmonic motion given by $y=0.6 \cos 15 t$, where $t$ is in seconds and $y$ is in centimeters.
L06885: [FIGURE:291e8c97f16d6403 | The figure displays a graph of displacement $y$ versus time $t$ for simple harmonic motion, specifically the function $y = A \cos \omega t$. A blue cosine curve oscillates between $y=A$ and $y=-A$...]
L06886: Figure Ex-65
L06888: 66. Find the value of the constant $A$ so that $y=A \sin 3 t$ satisfies the equation
L06890: $$
L06891: \frac{d^{2} y}{d t^{2}}+2 y=4 \sin 3 t
L06892: $$
L06894: ## FOCUS ON CONCEPTS
L06896: 67. Use the graph of the function $f$ in the accompanying figure to evaluate
L06898: $$
L06899: \left.\frac{d}{d x}[\sqrt{x+f(x)}]\right|_{x=-1}
L06900: $$
L06902: [FIGURE:d624e7462b68e0fa | A graph of the piecewise linear function $y=f(x)$ is shown on a Cartesian coordinate system. The function's graph connects the points $(-3, 1)$, $(0, 5)$, and $(2, 0)$, forming a V-shape with its...]
L06903: Figure Ex-67
L06905: 68. Using the function $f$ in Exercise 67, evaluate
L06907: $$
L06908: \left.\frac{d}{d x}[f(2 \sin x)]\right|_{x=\pi / 6}
L06909: $$
L06911: 69. The accompanying figure shows the graph of atmospheric pressure $p\left(\mathrm{lb} / \mathrm{in}^{2}\right)$ versus the altitude $h(\mathrm{mi})$ above sea level.
L06912: (a) From the graph and the tangent line at $h=2$ shown on the graph, estimate the values of $p$ and $d p / d h$ at an altitude of 2 mi .
L06913: (b) If the altitude of a space vehicle is increasing at the rate of $0.3 \mathrm{mi} / \mathrm{s}$ at the instant when it is 2 mi above sea level, how fast is the pressure changing with time at this instant?
L06915: [FIGURE:2e8c714f0e921d00 | A graph shows atmospheric pressure $P$ (in lb/in$^2$) as a function of altitude $h$ (in mi). The dark curve decreases from $P \approx 15$ at $h=0$ to $P \approx 4$ at $h=7$. A point is marked on the...]
L06916: < Figure Ex-69
L06918: 70. The force $F$ (in pounds) acting at an angle $\theta$ with the horizontal that is needed to drag a crate weighing $W$ pounds along a horizontal surface at a constant velocity is given by
L06920: $$
L06921: F=\frac{\mu W}{\cos \theta+\mu \sin \theta}
L06922: $$
L06924: where $\mu$ is a constant called the coefficient of sliding friction between the crate and the surface (see the accompanying figure). Suppose that the crate weighs 150 lb and that $\mu=0.3$.
L06925: (a) Find $d F / d \theta$ when $\theta=30^{\circ}$. Express the answer in units of pounds/degree.
L06926: (b) Find $d F / d t$ when $\theta=30^{\circ}$ if $\theta$ is decreasing at the rate of $0.5^{\circ} / \mathrm{s}$ at this instant.
L06928: [FIGURE:61006db1f6892b20 | A diagram illustrates a person pulling a large wooden crate along a horizontal surface using a rope. A purple arrow labeled $F$ represents the force applied along the rope, which forms an angle...]
L06929: Figure Ex-70
L06931: 71. Recall that
L06933: $$
L06934: \frac{d}{d x}(|x|)=\left\{\begin{aligned}
L06935: 1, & x>0 \\
L06936: -1, & x<0
L06937: \end{aligned}\right.
L06938: $$
L06940: Use this result and the chain rule to find
L06942: $$
L06943: \frac{d}{d x}(|\sin x|)
L06944: $$
L06946: for nonzero $x$ in the interval $(-\pi, \pi)$.
L06947: 72. Use the derivative formula for $\sin x$ and the identity
L06949: $$
L06950: \cos x=\sin \left(\frac{\pi}{2}-x\right)
L06951: $$
L06953: to obtain the derivative formula for $\cos x$.
L06954: 73. Let
L06956: $$
L06957: f(x)= \begin{cases}x \sin \frac{1}{x}, & x \neq 0 \\ 0, & x=0\end{cases}
L06958: $$
L06960: (a) Show that $f$ is continuous at $x=0$.
L06961: (b) Use Definition 2.2.1 to show that $f^{\prime}(0)$ does not exist.
L06962: (c) Find $f^{\prime}(x)$ for $x \neq 0$.
L06963: (d) Determine whether $\lim _{x \rightarrow 0} f^{\prime}(x)$ exists.
L06964: 74. Let
L06966: $$
L06967: f(x)= \begin{cases}x^{2} \sin \frac{1}{x}, & x \neq 0 \\ 0, & x=0\end{cases}
L06968: $$
L06970: (a) Show that $f$ is continuous at $x=0$.
L06971: (b) Use Definition 2.2.1 to find $f^{\prime}(0)$.
L06972: (c) Find $f^{\prime}(x)$ for $x \neq 0$.
L06973: (d) Show that $f^{\prime}$ is not continuous at $x=0$.
L06974: 75. Given the following table of values, find the indicated derivatives in parts (a) and (b).
L06976: | $x$ | $f(x)$ | $f^{\prime}(x)$ |
L06977: | :---: | :---: | :---: |
L06978: | 2 | 1 | 7 |
L06979: | 8 | 5 | -3 |
L06981: (a) $g^{\prime}(2)$, where $g(x)=[f(x)]^{3}$
L06982: (b) $h^{\prime}(2)$, where $h(x)=f\left(x^{3}\right)$
L06983: 76. Given that $f^{\prime}(x)=\sqrt{3 x+4}$ and $g(x)=x^{2}-1$, find $F^{\prime}(x)$ if $F(x)=f(g(x))$.
L06984: 77. Given that $f^{\prime}(x)=\frac{x}{x^{2}+1}$ and $g(x)=\sqrt{3 x-1}$, find $F^{\prime}(x)$ if $F(x)=f(g(x))$.
L06985: 78. Find $f^{\prime}\left(x^{2}\right)$ if $\frac{d}{d x}\left[f\left(x^{2}\right)\right]=x^{2}$.
L06986: 79. Find $\frac{d}{d x}[f(x)]$ if $\frac{d}{d x}[f(3 x)]=6 x$.
L06987: 80. Recall that a function $f$ is even if $f(-x)=f(x)$ and odd if $f(-x)=-f(x)$, for all $x$ in the domain of $f$. Assuming that $f$ is differentiable, prove:
L06988: (a) $f^{\prime}$ is odd if $f$ is even
L06989: (b) $f^{\prime}$ is even if $f$ is odd.
L06990: 81. Draw some pictures to illustrate the results in Exercise 80, and write a paragraph that gives an informal explanation of why the results are true.
L06991: 82. Let $y=f_{1}(u), u=f_{2}(v), v=f_{3}(w)$, and $w=f_{4}(x)$. Express $d y / d x$ in terms of $d y / d u, d w / d x, d u / d v$, and $d v / d w$.
L06992: 83. Find a formula for
L06994: $$
L06995: \frac{d}{d x}[f(g(h(x)))]
L06996: $$
L06998: 84. Writing The "co" in "cosine" comes from "complementary," since the cosine of an angle is the sine of the complementary angle, and vice versa:
L07000: $$
L07001: \cos x=\sin \left(\frac{\pi}{2}-x\right) \quad \text { and } \quad \sin x=\cos \left(\frac{\pi}{2}-x\right)
L07002: $$
L07004: Suppose that we define a function $g$ to be a cofunction of a function $f$ if
L07006: $$
L07007: g(x)=f\left(\frac{\pi}{2}-x\right) \quad \text { for all } x
L07008: $$
L07010: Thus, cosine and sine are cofunctions of each other, as are cotangent and tangent, and also cosecant and secant. If $g$ is the cofunction of $f$, state a formula that relates $g^{\prime}$ and the cofunction of $f^{\prime}$. Discuss how this relationship is exhibited by the derivatives of the cosine, cotangent, and cosecant functions.
