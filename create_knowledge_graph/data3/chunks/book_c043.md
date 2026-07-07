L14748: $$
L14749: \frac{d}{d x}\left(x^{6}-2 x^{2}+x\right)=6 x^{5}-4 x+1
L14750: $$
L14752: to show that the equation $6 x^{5}-4 x+1=0$ has at least one solution in the interval $(0,1)$.
L14753: 78. Let $g(x)=x^{3}-4 x+6$. Find $f(x)$ so that $f^{\prime}(x)=g^{\prime}(x)$ and $f(1)=2$.
L14755: ## CHAPTER 4 MAKING CONNECTIONS
L14757: 1. Suppose that $g(x)$ is a function that is defined and differentiable for all real numbers $x$ and that $g(x)$ has the following properties:
L14758: (i) $g(0)=2$ and $g^{\prime}(0)=-\frac{2}{3}$.
L14759: (ii) $g(4)=3$ and $g^{\prime}(4)=3$.
L14760: (iii) $g(x)$ is concave up for $x<4$ and concave down for $x>4$.
L14761: (iv) $g(x) \geq-10$ for all $x$.
L14763: Use these properties to answer the following questions.
L14764: (a) How many zeros does $g$ have?
L14765: (b) How many zeros does $g^{\prime}$ have?
L14766: (c) Exactly one of the following limits is possible:
L14768: $$
L14769: \lim _{x \rightarrow+\infty} g^{\prime}(x)=-5, \quad \lim _{x \rightarrow+\infty} g^{\prime}(x)=0, \quad \lim _{x \rightarrow+\infty} g^{\prime}(x)=5
L14770: $$
L14772: Identify which of these results is possible and draw a rough sketch of the graph of such a function $g(x)$. Explain why the other two results are impossible.
L14773: 2. The two graphs in the accompanying figure depict a function $r(x)$ and its derivative $r^{\prime}(x)$.
L14774: (a) Approximate the coordinates of each inflection point on the graph of $y=r(x)$.
L14775: (b) Suppose that $f(x)$ is a function that is continuous everywhere and whose derivative satisfies
L14777: $$
L14778: f^{\prime}(x)=\left(x^{2}-4\right) \cdot r(x)
L14779: $$
L14781: What are the critical points for $f(x)$ ? At each critical point, identify whether $f(x)$ has a (relative) maximum, minimum, or neither a maximum or minimum. Approximate $f^{\prime \prime}(1)$.
L14782: [FIGURE:3616af0a94aef1e9 | A graph of the function $y=r(x)$ is plotted on a coordinate plane with the x-axis ranging from -6 to 6 and the y-axis from -1 to 6. The curve descends from the left, reaches a local minimum near...]
L14784: [FIGURE:c4e1a8dfbc7d1fd6 | A graph displays the function $y = r'(x)$ on a coordinate plane with x-values from -6 to 6 and y-values from -3 to 3. The curve crosses the x-axis at approximately $x=-4.2$, $x=-0.2$, and $x=3.5$. It...]
L14785: Figure Ex-2
L14787: 3. With the function $r(x)$ as provided in Exercise 2, let $g(x)$ be a function that is continuous everywhere such that $g^{\prime}(x)=x-r(x)$. For which values of $x$ does $g(x)$ have an inflection point?
L14788: 4. Suppose that $f$ is a function whose derivative is continuous everywhere. Assume that there exists a real number $c$ such that when Newton's Method is applied to $f$, the inequality
L14790: $$
L14791: \left|x_{n}-c\right|<\frac{1}{n}
L14792: $$
L14794: is satisfied for all values of $n=1,2,3, \ldots$.
L14795: (a) Explain why
L14797: $$
L14798: \left|x_{n+1}-x_{n}\right|<\frac{2}{n}
L14799: $$
L14801: for all values of $n=1,2,3, \ldots$.
L14802: (b) Show that there exists a positive constant $M$ such that
L14804: $$
L14805: \left|f\left(x_{n}\right)\right| \leq M\left|x_{n+1}-x_{n}\right|<\frac{2 M}{n}
L14806: $$
L14808: for all values of $n=1,2,3, \ldots$.
L14809: (c) Prove that if $f(c) \neq 0$, then there exists a positive integer $N$ such that
L14811: $$
L14812: \frac{|f(c)|}{2}<\left|f\left(x_{n}\right)\right|
L14813: $$
L14815: if $n>N$. [Hint: Argue that $f(x) \rightarrow f(c)$ as $x \rightarrow c$ and then apply Definition 1.4.1 with $\epsilon=\frac{1}{2}|f(c)|$.]
L14816: (d) What can you conclude from parts (b) and (c)?
L14817: 5. What are the important elements in the argument suggested by Exercise 4? Can you extend this argument to a wider collection of functions?
L14818: 6. A bug crawling on a linoleum floor along the edge of a plush carpet encounters an irregularity in the form of a 2 in by 3 in rectangular section of carpet that juts out into the linoleum as illustrated in Figure Ex-6a on the next page.
L14820: [FIGURE:5c1dd1740727436b | This diagram illustrates a floor plan with a central rectangular carpet area surrounded by a tiled border. The tiled border is 3 inches wide above the carpet and 2 inches wide on both the left and...]
L14821: <Figure Ex-6a
L14823: The bug crawls at $0.7 \mathrm{in} / \mathrm{s}$ on the linoleum, but only at $0.3 \mathrm{in} / \mathrm{s}$ through the carpet, and its goal is to travel from point $A$ to point $B$. Four possible routes from $A$ to $B$ are as follows: (i) crawl on linoleum along the edge of the carpet; (ii) crawl through the carpet to a point on the wider side of the rectangle, and finish the journey on linoleum along the edge of the carpet; (iii) crawl through the carpet to a point on the shorter side of the rectangle, and finish the journey on linoleum along the edge of the carpet; or (iv) crawl through the carpet directly to point $B$. (See Figure Ex-6b.)
L14824: (a) Calculate the times it would take the bug to crawl from $A$ to $B$ via routes (i) and (iv).
L14825: (b) Suppose the bug follows route (ii) and use $x$ to represent the total distance the bug crawls on linoleum. Identify the appropriate interval for $x$ in this case, and determine the shortest time for the bug to complete the journey using route (ii).
L14826: (c) Suppose the bug follows route (iii) and again use $x$ to represent the total distance the bug crawls on linoleum. Identify the appropriate interval for $x$ in this case, and determine the shortest time for the bug to complete the journey using route (iii).
L14827: (d) Which of routes (i), (ii), (iii), or (iv) is quickest? What is the shortest time for the bug to complete the journey?
L14829: [FIGURE:97fe2a134b7f9bc0 | This figure displays four diagrams, labeled (i) through (iv), illustrating different paths a bug might take from point A to point B on a floor with a rectangular carpet section jutting out. In...]
L14830: - Figure Ex-6b
L14833: [^0]:    Explain why an error estimate of at most $\pm \frac{1}{32}$ inch is reasonable for a ruler that is calibrated in sixteenths of an inch.
L14835: [^1]:    ${ }^{*}$ Recall that for $n \geq 1$ the expression $n!$, read $\boldsymbol{n}$-factorial, denotes the product of the first $n$ positive integers.
L14837: [^2]:    4.4.3 THEOREM If $f$ has an absolute extremum on an open interval ( $a, b$ ), then it must occur at a critical point of $f$.
L14839: [^3]:    *In writing $s=s(t)$, rather than the more familiar $s=f(t)$, we are using the letter $s$ both as the dependent variable and the name of the function. This is common practice in engineering and physics.
