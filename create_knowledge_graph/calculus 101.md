![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-001.jpg?height=639&width=680&top_left_y=160&top_left_x=212)

## LIMITS AND CONTINUITY

Joe McBride/Stone/Getty Images

Air resistance prevents the velocity of a skydiver from increasing indefinitely. The velocity approaches a limit, called the "terminal velocity."

The development of calculus in the seventeenth century by Newton and Leibniz provided scientists with their first real understanding of what is meant by an "instantaneous rate of change" such as velocity and acceleration. Once the idea was understood conceptually, efficient computational methods followed, and science took a quantum leap forward. The fundamental building block on which rates of change rest is the concept of a "limit," an idea that is so important that all other calculus concepts are now based on it.

In this chapter we will develop the concept of a limit in stages, proceeding from an informal, intuitive notion to a precise mathematical definition. We will also develop theorems and procedures for calculating limits, and we will conclude the chapter by using the limits to study "continuous" curves.

### 1.1 LIMITS (AN INTUITIVE APPROACH)

The concept of a "limit" is the fundamental building block on which all calculus concepts are based. In this section we will study limits informally, with the goal of developing an intuitive feel for the basic ideas. In the next three sections we will focus on computational methods and precise definitions.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-001.jpg?height=403&width=469&top_left_y=1754&top_left_x=214)
A Figure 1.1.1

Many of the ideas of calculus originated with the following two geometric problems:

> THE TANGENT LINE PROBLEM Given a function $f$ and a point $P\left(x_{0}, y_{0}\right)$ on its graph, find an equation of the line that is tangent to the graph at $P$ (Figure 1.1.1).

THE AREA PROBLEM Given a function $f$, find the area between the graph of $f$ and an interval $[a, b]$ on the $x$-axis (Figure 1.1.2).

Traditionally, that portion of calculus arising from the tangent line problem is called differential calculus and that arising from the area problem is called integral calculus. However, we will see later that the tangent line and area problems are so closely related that the distinction between differential and integral calculus is somewhat artificial.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-002.jpg?height=363&width=477&top_left_y=280&top_left_x=154)
- Figure 1.1.2

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-002.jpg?height=268&width=479&top_left_y=740&top_left_x=152)
Δ Figure 1.1.3

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-002.jpg?height=199&width=297&top_left_y=1017&top_left_x=244)
Δ Figure 1.1.3

- Figure 1.1.4

Why are we requiring that $P$ and $Q$ be distinct?

## TANGENT LINES AND LIMITS

In plane geometry, a line is called tangent to a circle if it meets the circle at precisely one point (Figure 1.1.3a). Although this definition is adequate for circles, it is not appropriate for more general curves. For example, in Figure 1.1.3b, the line meets the curve exactly once but is obviously not what we would regard to be a tangent line; and in Figure 1.1.3c, the line appears to be tangent to the curve, yet it intersects the curve more than once.

To obtain a definition of a tangent line that applies to curves other than circles, we must view tangent lines another way. For this purpose, suppose that we are interested in the tangent line at a point $P$ on a curve in the $x y$-plane and that $Q$ is any point that lies on the curve and is different from $P$. The line through $P$ and $Q$ is called a secant line for the curve at $P$. Intuition suggests that if we move the point $Q$ along the curve toward $P$, then the secant line will rotate toward a limiting position. The line in this limiting position is what we will consider to be the tangent line at $P$ (Figure 1.1.4a). As suggested by Figure 1.1.4b, this new concept of a tangent line coincides with the traditional concept when applied to circles.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-002.jpg?height=571&width=1157&top_left_y=885&top_left_x=704)

Example 1 Find an equation for the tangent line to the parabola $y=x^{2}$ at the point $P(1,1)$.

Solution. If we can find the slope $m_{\tan }$ of the tangent line at $P$, then we can use the point $P$ and the point-slope formula for a line (Web Appendix G) to write the equation of the tangent line as

$$
\begin{equation*}
y-1=m_{\tan }(x-1) \tag{1}
\end{equation*}
$$

To find the slope $m_{\text {tan }}$, consider the secant line through $P$ and a point $Q\left(x, x^{2}\right)$ on the parabola that is distinct from $P$. The slope $m_{\text {sec }}$ of this secant line is

$$
\begin{equation*}
m_{\mathrm{sec}}=\frac{x^{2}-1}{x-1} \tag{2}
\end{equation*}
$$

Figure 1.1.4a suggests that if we now let $Q$ move along the parabola, getting closer and closer to $P$, then the limiting position of the secant line through $P$ and $Q$ will coincide with that of the tangent line at $P$. This in turn suggests that the value of $m_{\mathrm{sec}}$ will get closer and closer to the value of $m_{\tan }$ as $P$ moves toward $Q$ along the curve. However, to say that $Q\left(x, x^{2}\right)$ gets closer and closer to $P(1,1)$ is algebraically equivalent to saying that $x$ gets closer and closer to 1 . Thus, the problem of finding $m_{\tan }$ reduces to finding the "limiting value" of $m_{\text {sec }}$ in Formula (2) as $x$ gets closer and closer to 1 (but with $x \neq 1$ to ensure that $P$ and $Q$ remain distinct).

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-003.jpg?height=541&width=469&top_left_y=198&top_left_x=214)
- Figure 1.1.5

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-003.jpg?height=168&width=467&top_left_y=848&top_left_x=214)
Δ Figure 1.1.6

We can rewrite (2) as

$$
m_{\mathrm{sec}}=\frac{x^{2}-1}{x-1}=\frac{(x-1)(x+1)}{(x-1)}=x+1
$$

where the cancellation of the factor $(x-1)$ is allowed because $x \neq 1$. It is now evident that $m_{\text {sec }}$ gets closer and closer to 2 as $x$ gets closer and closer to 1 . Thus, $m_{\tan }=2$ and (1) implies that the equation of the tangent line is

$$
y-1=2(x-1) \quad \text { or equivalently } \quad y=2 x-1
$$

Figure 1.1.5 shows the graph of $y=x^{2}$ and this tangent line. $\square$

## AREAS AND LIMITS

Just as the general notion of a tangent line leads to the concept of limit, so does the general notion of area. For plane regions with straight-line boundaries, areas can often be calculated by subdividing the region into rectangles or triangles and adding the areas of the constituent parts (Figure 1.1.6). However, for regions with curved boundaries, such as that in Figure 1.1.7a, a more general approach is needed. One such approach is to begin by approximating the area of the region by inscribing a number of rectangles of equal width under the curve and adding the areas of these rectangles (Figure 1.1.7b). Intuition suggests that if we repeat that approximation process using more and more rectangles, then the rectangles will tend to fill in the gaps under the curve, and the approximations will get closer and closer to the exact area under the curve (Figure 1.1.7c). This suggests that we can define the area under the curve to be the limiting value of these approximations. This idea will be considered in detail later, but the point to note here is that once again the concept of a limit comes into play.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-003.jpg?height=351&width=1607&top_left_y=1283&top_left_x=370)
\$ Figure 1.1.7

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-003.jpg?height=393&width=471&top_left_y=1800&top_left_x=212)
© James Oakley/Alamy
This figure shows a region called the Mandelbrot Set. It illustrates how complicated a region in the plane can be and why the notion of area requires careful definition.

## DECIMALS AND LIMITS

Limits also arise in the familiar context of decimals. For example, the decimal expansion of the fraction $\frac{1}{3}$ is

$$
\begin{equation*}
\frac{1}{3}=0.33333 \ldots \tag{3}
\end{equation*}
$$

in which the dots indicate that the digit 3 repeats indefinitely. Although you may not have thought about decimals in this way, we can write (3) as

$$
\begin{equation*}
\frac{1}{3}=0.33333 \ldots=0.3+0.03+0.003+0.0003+0.00003+\cdots \tag{4}
\end{equation*}
$$

which is a sum with "infinitely many" terms. As we will discuss in more detail later, we interpret (4) to mean that the succession of finite sums

$$
0.3, \quad 0.3+0.03, \quad 0.3+0.03+0.003, \quad 0.3+0.03+0.003+0.0003, \ldots
$$

gets closer and closer to a limiting value of $\frac{1}{3}$ as more and more terms are included. Thus, limits even occur in the familiar context of decimal representations of real numbers.

## LIMITS

Now that we have seen how limits arise in various ways, let us focus on the limit concept itself.

The most basic use of limits is to describe how a function behaves as the independent variable approaches a given value. For example, let us examine the behavior of the function

$$
f(x)=x^{2}-x+1
$$

for $x$-values closer and closer to 2 . It is evident from the graph and table in Figure 1.1.8 that the values of $f(x)$ get closer and closer to 3 as values of $x$ are selected closer and closer to 2 on either the left or the right side of 2 . We describe this by saying that the "limit of $x^{2}-x+1$ is 3 as $x$ approaches 2 from either side," and we write

$$
\begin{equation*}
\lim _{x \rightarrow 2}\left(x^{2}-x+1\right)=3 \tag{5}
\end{equation*}
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-004.jpg?height=549&width=562&top_left_y=907&top_left_x=838)
- Figure 1.1.8

| $x$ | 1.0 | 1.5 | 1.9 | 1.95 | 1.99 | 1.995 | 1.999 | 2 | 2.001 | 2.005 | 2.01 | 2.05 | 2.1 | 2.5 | 3.0 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| $f(x)$ | 1.000000 | 1.750000 | 2.710000 | 2.852500 | 2.970100 | 2.985025 | 2.997001 |  | 3.003001 | 3.015025 | 3.030100 | 3.152500 | 3.310000 | 4.750000 | 7.000000 |
| Left side <br> Right side |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |

- Figure 1.1.8

This leads us to the following general idea.

Since $x$ is required to be different from $a$ in (6), the value of $f$ at $a$, or even whether $f$ is defined at $a$, has no bearing on the limit $L$. The limit describes the behavior of $f$ close to $a$ but not at $a$.
1.1.1 LIMITS (AN INFORMAL VIEW) If the values of $f(x)$ can be made as close as we like to $L$ by taking values of $x$ sufficiently close to $a$ (but not equal to $a$ ), then we write

$$
\begin{equation*}
\lim _{x \rightarrow a} f(x)=L \tag{6}
\end{equation*}
$$

which is read "the limit of $f(x)$ as $x$ approaches $a$ is $L$ " or " $f(x)$ approaches $L$ as $x$ approaches $a$." The expression in (6) can also be written as

$$
\begin{equation*}
f(x) \rightarrow L \quad \text { as } \quad x \rightarrow a \tag{7}
\end{equation*}
$$

## TECHNOLOGY MASTERY

Use a graphing utility to generate the graph of the equation $y=f(x)$ for the function in (9). Find a window containing $x=1$ in which all values of $f(x)$ are within 0.5 of $y=2$ and one in which all values of $f(x)$ are within 0.1 of $y=2$.

Example 2 Use numerical evidence to make a conjecture about the value of

$$
\begin{equation*}
\lim _{x \rightarrow 1} \frac{x-1}{\sqrt{x}-1} \tag{8}
\end{equation*}
$$

Solution. Although the function

$$
\begin{equation*}
f(x)=\frac{x-1}{\sqrt{x}-1} \tag{9}
\end{equation*}
$$

is undefined at $x=1$, this has no bearing on the limit. Table 1.1.1 shows sample $x$-values approaching 1 from the left side and from the right side. In both cases the corresponding values of $f(x)$, calculated to six decimal places, appear to get closer and closer to 2 , and hence we conjecture that

$$
\lim _{x \rightarrow 1} \frac{x-1}{\sqrt{x}-1}=2
$$

This is consistent with the graph of $f$ shown in Figure 1.1.9. In the next section we will show how to obtain this result algebraically.

Table 1.1.1
| $x$ | 0.99 | 0.999 | 0.9999 | 0.99999 | 1.00001 | 1.0001 | 1.001 | 1.01 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| $f(x)$ | 1.994987 | 1.999500 | 1.999950 | 1.999995 | 2.000005 | 2.000050 | 2.000500 | 2.004988 |


![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-005.jpg?height=423&width=419&top_left_y=1057&top_left_x=236)
Figure 1.1.9

Use numerical evidence to determine whether the limit in (11) changes if $x$ is measured in degrees.

Table 1.1.2
| $x$ <br> (RADIANS) | $y=\frac{\sin x}{x}$ |
| :---: | :---: |
| $\pm 1.0$ | 0.84147 |
| $\pm 0.9$ | 0.87036 |
| $\pm 0.8$ | 0.89670 |
| $\pm 0.7$ | 0.92031 |
| $\pm 0.6$ | 0.94107 |
| $\pm 0.5$ | 0.95885 |
| $\pm 0.4$ | 0.97355 |
| $\pm 0.3$ | 0.98507 |
| $\pm 0.2$ | 0.99335 |
| $\pm 0.1$ | 0.99833 |
| $\pm 0.01$ | 0.99998 |


Example 3 Use numerical evidence to make a conjecture about the value of

$$
\begin{equation*}
\lim _{x \rightarrow 0} \frac{\sin x}{x} \tag{10}
\end{equation*}
$$

Solution. With the help of a calculating utility set in radian mode, we obtain Table 1.1.2. The data in the table suggest that

$$
\begin{equation*}
\lim _{x \rightarrow 0} \frac{\sin x}{x}=1 \tag{11}
\end{equation*}
$$

The result is consistent with the graph of $f(x)=(\sin x) / x$ shown in Figure 1.1.10. Later in this chapter we will give a geometric argument to prove that our conjecture is correct. $\square$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-005.jpg?height=249&width=776&top_left_y=1724&top_left_x=951)
Figure 1.1.10

$$
\begin{aligned}
& \text { As } x \text { approaches } 0 \text { from the left } \\
& \text { or right, } f(x) \text { approaches } 1 \text {. }
\end{aligned}
$$

## SAMPLING PITFALLS

Numerical evidence can sometimes lead to incorrect conclusions about limits because of roundoff error or because the sample values chosen do not reveal the true limiting behavior. For example, one might incorrectly conclude from Table 1.1.3 that

$$
\lim _{x \rightarrow 0} \sin \left(\frac{\pi}{x}\right)=0
$$

The fact that this is not correct is evidenced by the graph of $f$ in Figure 1.1.11. The graph reveals that the values of $f$ oscillate between -1 and 1 with increasing rapidity as $x \rightarrow 0$ and hence do not approach a limit. The data in the table deceived us because the $x$-values selected all happened to be $x$-intercepts for $f(x)$. This points out the need for having alternative methods for corroborating limits conjectured from numerical evidence.

Table 1.1.3
| $x$ | $\frac{\pi}{x}$ | $f(x)=\sin \left(\frac{\pi}{x}\right)$ |
| :--- | :--- | :--- |
| $x= \pm 1$ | $\pm \pi$ | $\sin ( \pm \pi)=0$ |
| $x= \pm 0.1$ | $\pm 10 \pi$ | $\sin ( \pm 10 \pi)=0$ |
| $x= \pm 0.01$ | $\pm 100 \pi$ | $\sin ( \pm 100 \pi)=0$ |
| $x= \pm 0.001$ | $\pm 1000 \pi$ | $\sin ( \pm 1000 \pi)=0$ |
| $x= \pm 0.0001$ | $\pm 10,000 \pi$ | $\sin ( \pm 10,000 \pi)=0$ |
| $\vdots$ | $\vdots$ | $\vdots$ |


![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-006.jpg?height=340&width=744&top_left_y=524&top_left_x=1171)
- Figure 1.1.11

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-006.jpg?height=417&width=475&top_left_y=1275&top_left_x=154)
A Figure 1.1.12

As with two-sided limits, the one-sided limits in (14) and (15) can also be written as

$$
f(x) \rightarrow L \quad \text { as } \quad x \rightarrow a^{+}
$$

and

$$
f(x) \rightarrow L \quad \text { as } \quad x \rightarrow a^{-}
$$

respectively.

## ONE-SIDED LIMITS

The limit in (6) is called a two-sided limit because it requires the values of $f(x)$ to get closer and closer to $L$ as values of $x$ are taken from either side of $x=a$. However, some functions exhibit different behaviors on the two sides of an $x$-value $a$, in which case it is necessary to distinguish whether values of $x$ near $a$ are on the left side or on the right side of $a$ for purposes of investigating limiting behavior. For example, consider the function

$$
f(x)=\frac{|x|}{x}=\left\{\begin{align*}
1, & x>0  \tag{12}\\
-1, & x<0
\end{align*}\right.
$$

which is graphed in Figure 1.1.12. As $x$ approaches 0 from the right, the values of $f(x)$ approach a limit of 1 [in fact, the values of $f(x)$ are exactly 1 for all such $x$ ], and similarly, as $x$ approaches 0 from the left, the values of $f(x)$ approach a limit of -1 . We denote these limits by writing

$$
\begin{equation*}
\lim _{x \rightarrow 0^{+}} \frac{|x|}{x}=1 \quad \text { and } \quad \lim _{x \rightarrow 0^{-}} \frac{|x|}{x}=-1 \tag{13}
\end{equation*}
$$

With this notation, the superscript "+" indicates a limit from the right and the superscript "-" indicates a limit from the left.

This leads to the general idea of a one-sided limit.
1.1.2 ONE-SIDED LIMITS (AN INFORMAL VIEW) If the values of $f(x)$ can be made as close as we like to $L$ by taking values of $x$ sufficiently close to $a$ (but greater than $a$ ), then we write

$$
\begin{equation*}
\lim _{x \rightarrow a^{+}} f(x)=L \tag{14}
\end{equation*}
$$

and if the values of $f(x)$ can be made as close as we like to $L$ by taking values of $x$ sufficiently close to $a$ (but less than $a$ ), then we write

$$
\begin{equation*}
\lim _{x \rightarrow a^{-}} f(x)=L \tag{15}
\end{equation*}
$$

Expression (14) is read "the limit of $f(x)$ as $x$ approaches $a$ from the right is $L$ " or " $f(x)$ approaches $L$ as $x$ approaches $a$ from the right." Similarly, expression (15) is read "the limit of $f(x)$ as $x$ approaches $a$ from the left is $L$ " or " $f(x)$ approaches $L$ as $x$ approaches $a$ from the left."

## THE RELATIONSHIP BETWEEN ONE-SIDED LIMITS AND TWO-SIDED LIMITS

In general, there is no guarantee that a function $f$ will have a two-sided limit at a given point $a$; that is, the values of $f(x)$ may not get closer and closer to any single real number $L$ as $x \rightarrow a$. In this case we say that

$$
\lim _{x \rightarrow a} f(x) \text { does not exist }
$$

Similarly, the values of $f(x)$ may not get closer and closer to a single real number $L$ as $x \rightarrow a^{+}$or as $x \rightarrow a^{-}$. In these cases we say that

$$
\lim _{x \rightarrow a^{+}} f(x) \text { does not exist }
$$

or that

$$
\lim _{x \rightarrow a^{-}} f(x) \text { does not exist }
$$

In order for the two-sided limit of a function $f(x)$ to exist at a point $a$, the values of $f(x)$ must approach some real number $L$ as $x$ approaches $a$, and this number must be the same regardless of whether $x$ approaches $a$ from the left or the right. This suggests the following result, which we state without formal proof.
1.1.3 THE RELATIONSHIP BETWEEN ONE-SIDED AND TWO-SIDED LIMITS The twosided limit of a function $f(x)$ exists at $a$ if and only if both of the one-sided limits exist at $a$ and have the same value; that is,

$$
\lim _{x \rightarrow a} f(x)=L \quad \text { if and only if } \quad \lim _{x \rightarrow a^{-}} f(x)=L=\lim _{x \rightarrow a^{+}} f(x)
$$

Example 4 Explain why

$$
\lim _{x \rightarrow 0} \frac{|x|}{x}
$$

does not exist.

Solution. As $x$ approaches 0 , the values of $f(x)=|x| / x$ approach -1 from the left and approach 1 from the right [see(13)]. Thus, the one-sided limits at 0 are not the same.

Example 5 For the functions in Figure 1.1.13, find the one-sided and two-sided limits at $x=a$ if they exist.

Solution. The functions in all three figures have the same one-sided limits as $x \rightarrow a$, since the functions are identical, except at $x=a$. These limits are

$$
\lim _{x \rightarrow a^{+}} f(x)=3 \quad \text { and } \quad \lim _{x \rightarrow a^{-}} f(x)=1
$$

In all three cases the two-sided limit does not exist as $x \rightarrow a$ because the one-sided limits are not equal.

- Figure 1.1.13
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-007.jpg?height=315&width=388&top_left_y=2098&top_left_x=712)

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-007.jpg?height=319&width=387&top_left_y=2094&top_left_x=1145)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-007.jpg?height=319&width=390&top_left_y=2094&top_left_x=1577)

The symbols $+\infty$ and $-\infty$ here are not real numbers; they simply describe particular ways in which the limits fail to exist. Do not make the mistake of manipulating these symbols using rules of algebra. For example, it is incorrect to write $(+\infty)-(+\infty)=0$.

Example 6 For the functions in Figure 1.1.14, find the one-sided and two-sided limits at $x=a$ if they exist.

Solution. As in the preceding example, the value of $f$ at $x=a$ has no bearing on the limits as $x \rightarrow a$, so in all three cases we have

$$
\lim _{x \rightarrow a^{+}} f(x)=2 \quad \text { and } \quad \lim _{x \rightarrow a^{-}} f(x)=2
$$

Since the one-sided limits are equal, the two-sided limit exists and

$$
\lim _{x \rightarrow a} f(x)=2
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-008.jpg?height=318&width=384&top_left_y=768&top_left_x=656)
- Figure 1.1.14

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-008.jpg?height=316&width=391&top_left_y=768&top_left_x=1089)
- Figure 1.1.14

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-008.jpg?height=318&width=392&top_left_y=768&top_left_x=1521)
- Figure 1.1.14

## INFINITE LIMITS

Sometimes one-sided or two-sided limits fail to exist because the values of the function increase or decrease without bound. For example, consider the behavior of $f(x)=1 / x$ for values of $x$ near 0 . It is evident from the table and graph in Figure 1.1.15 that as $x$-values are taken closer and closer to 0 from the right, the values of $f(x)=1 / x$ are positive and increase without bound; and as $x$-values are taken closer and closer to 0 from the left, the values of $f(x)=1 / x$ are negative and decrease without bound. We describe these limiting behaviors by writing

$$
\lim _{x \rightarrow 0^{+}} \frac{1}{x}=+\infty \quad \text { and } \quad \lim _{x \rightarrow 0^{-}} \frac{1}{x}=-\infty
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-008.jpg?height=378&width=379&top_left_y=1697&top_left_x=873)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-008.jpg?height=378&width=375&top_left_y=1697&top_left_x=1325)

| $x$ | -1 | -0.1 | -0.01 | -0.001 | -0.0001 | 0 | 0.0001 | 0.001 | 0.01 | 0.1 | 1 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| $\frac{1}{x}$ | -1 | -10 | -100 | -1000 | -10,000 |  | 10,000 | 1000 | 100 | 10 | 1 |
|  |  |  |  |  |  | Right side |  |  |  |  |  |

Figure 1.1.15

### 1.1.4 INFINITE LIMITS (AN INFORMAL VIEW) The expressions

$$
\lim _{x \rightarrow a^{-}} f(x)=+\infty \quad \text { and } \quad \lim _{x \rightarrow a^{+}} f(x)=+\infty
$$

denote that $f(x)$ increases without bound as $x$ approaches $a$ from the left and from the right, respectively. If both are true, then we write

$$
\lim _{x \rightarrow a} f(x)=+\infty
$$

Similarly, the expressions

$$
\lim _{x \rightarrow a^{-}} f(x)=-\infty \quad \text { and } \quad \lim _{x \rightarrow a^{+}} f(x)=-\infty
$$

denote that $f(x)$ decreases without bound as $x$ approaches $a$ from the left and from the right, respectively. If both are true, then we write

$$
\lim _{x \rightarrow a} f(x)=-\infty
$$

- Example 7 For the functions in Figure 1.1.16, describe the limits at $x=a$ in appropriate limit notation.

Solution (a). In Figure 1.1.16a, the function increases without bound as $x$ approaches $a$ from the right and decreases without bound as $x$ approaches $a$ from the left. Thus,

$$
\lim _{x \rightarrow a^{+}} \frac{1}{x-a}=+\infty \quad \text { and } \quad \lim _{x \rightarrow a^{-}} \frac{1}{x-a}=-\infty
$$

Solution (b). In Figure 1.1.16b, the function increases without bound as $x$ approaches $a$ from both the left and right. Thus,

$$
\lim _{x \rightarrow a} \frac{1}{(x-a)^{2}}=\lim _{x \rightarrow a^{+}} \frac{1}{(x-a)^{2}}=\lim _{x \rightarrow a^{-}} \frac{1}{(x-a)^{2}}=+\infty
$$

Solution (c). In Figure 1.1.16c, the function decreases without bound as $x$ approaches $a$ from the right and increases without bound as $x$ approaches $a$ from the left. Thus,

$$
\lim _{x \rightarrow a^{+}} \frac{-1}{x-a}=-\infty \quad \text { and } \quad \lim _{x \rightarrow a^{-}} \frac{-1}{x-a}=+\infty
$$

Solution (d). In Figure 1.1.16d, the function decreases without bound as $x$ approaches $a$ from both the left and right. Thus,

$$
\lim _{x \rightarrow a} \frac{-1}{(x-a)^{2}}=\lim _{x \rightarrow a^{+}} \frac{-1}{(x-a)^{2}}=\lim _{x \rightarrow a^{-}} \frac{-1}{(x-a)^{2}}=-\infty
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-009.jpg?height=377&width=1503&top_left_y=1948&top_left_x=472)
△ Figure 1.1.16

## VERTICAL ASYMPTOTES

Figure 1.1.17 illustrates geometrically what happens when any of the following situations occur:

$$
\lim _{x \rightarrow a^{-}} f(x)=+\infty, \quad \lim _{x \rightarrow a^{+}} f(x)=+\infty, \quad \lim _{x \rightarrow a^{-}} f(x)=-\infty, \quad \lim _{x \rightarrow a^{+}} f(x)=-\infty
$$

In each case the graph of $y=f(x)$ either rises or falls without bound, squeezing closer and closer to the vertical line $x=a$ as $x$ approaches $a$ from the side indicated in the limit. The line $x=a$ is called a vertical asymptote of the curve $y=f(x)$ (from the Greek word asymptotos, meaning "nonintersecting").

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-010.jpg?height=384&width=1465&top_left_y=660&top_left_x=452)
- Figure 1.1.17

For the function in (16), find expressions for the left- and right-hand limits at each asymptote.

Example 8 Referring to Figure 0.5.7 we see that the $y$-axis is a vertical asymptote for $y=\log _{b} x$ if $b>1$ since

$$
\lim _{x \rightarrow 0^{+}} \log _{b} x=-\infty
$$

and referring to Figure 0.3.11 we see that $x=-1$ and $x=1$ are vertical asymptotes of the graph of

$$
\begin{equation*}
f(x)=\frac{x^{2}+2 x}{x^{2}-1} \tag{16}
\end{equation*}
$$

## QUICK CHECK EXERCISES 1.1 (See page 80 for answers.)

1. We write $\lim _{x \rightarrow a} f(x)=L$ provided the values of
$\_\_\_\_$ can be made as close to $\_\_\_\_$ as desired, by taking values of $\_\_\_\_$ sufficiently close to $\_\_\_\_$ but not $\_\_\_\_$ .
2. We write $\lim _{x \rightarrow a^{-}} f(x)=+\infty$ provided $\_\_\_\_$ increases without bound, as $\_\_\_\_$ approaches $\_\_\_\_$ from the left.
3. State what must be true about

$$
\lim _{x \rightarrow a^{-}} f(x) \quad \text { and } \quad \lim _{x \rightarrow a^{+}} f(x)
$$

in order for it to be the case that

$$
\lim _{x \rightarrow a} f(x)=L
$$

4. Use the accompanying graph of $y=f(x)(-\infty<x<3)$ to determine the limits.
(a) $\lim _{x \rightarrow 0} f(x)=$ $\_\_\_\_$
(b) $\lim _{x \rightarrow 2^{-}} f(x)=$ $\_\_\_\_$
(c) $\lim _{x \rightarrow 2^{+}} f(x)=$ $\_\_\_\_$
(d) $\lim _{x \rightarrow 3^{-}} f(x)=$ $\_\_\_\_$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-010.jpg?height=279&width=373&top_left_y=1880&top_left_x=1129)
\& Figure Ex-4

5. The slope of the secant line through $P(2,4)$ and $Q\left(x, x^{2}\right)$ on the parabola $y=x^{2}$ is $m_{\text {sec }}=x+2$. It follows that the slope of the tangent line to this parabola at the point $P$ is
$\_\_\_\_$ .

1-10 In these exercises, make reasonable assumptions about the graph of the indicated function outside of the region depicted. $\square$

1. For the function $g$ graphed in the accompanying figure, find
(a) $\lim _{x \rightarrow 0^{-}} g(x)$
(b) $\lim _{x \rightarrow 0^{+}} g(x)$
(c) $\lim _{x \rightarrow 0} g(x)$
(d) $g(0)$.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-011.jpg?height=219&width=467&top_left_y=602&top_left_x=272)

Figure Ex-1
2. For the function $G$ graphed in the accompanying figure, find
(a) $\lim _{x \rightarrow 0^{-}} G(x)$
(b) $\lim _{x \rightarrow 0^{+}} G(x)$
(c) $\lim _{x \rightarrow 0} G(x)$
(d) $G(0)$.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-011.jpg?height=187&width=473&top_left_y=1043&top_left_x=267)

Figure Ex-2
3. For the function $f$ graphed in the accompanying figure, find
(a) $\lim _{x \rightarrow 3^{-}} f(x)$
(b) $\lim _{x \rightarrow 3^{+}} f(x)$
(c) $\lim _{x \rightarrow 3} f(x)$
(d) $f(3)$.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-011.jpg?height=223&width=463&top_left_y=1453&top_left_x=272)

Figure Ex-3
4. For the function $f$ graphed in the accompanying figure, find
(a) $\lim _{x \rightarrow 2^{-}} f(x)$
(b) $\lim _{x \rightarrow 2^{+}} f(x)$
(c) $\lim _{x \rightarrow 2} f(x)$
(d) $f(2)$.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-011.jpg?height=271&width=475&top_left_y=1910&top_left_x=272)

Figure Ex-4
5. For the function $F$ graphed in the accompanying figure, find
(a) $\lim _{x \rightarrow-2^{-}} F(x)$
(b) $\lim _{x \rightarrow-2^{+}} F(x)$
(c) $\lim _{x \rightarrow-2} F(x)$
(d) $F(-2)$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-011.jpg?height=279&width=435&top_left_y=292&top_left_x=1185)
Figure Ex-5

6. For the function $G$ graphed in the accompanying figure, find
(a) $\lim _{x \rightarrow 0^{-}} G(x)$
(b) $\lim _{x \rightarrow 0^{+}} G(x)$
(c) $\lim _{x \rightarrow 0} G(x)$
(d) $G(0)$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-011.jpg?height=318&width=469&top_left_y=792&top_left_x=1185)
-Figure Ex-6

7. For the function $f$ graphed in the accompanying figure, find
(a) $\lim _{x \rightarrow 3^{-}} f(x)$
(b) $\lim _{x \rightarrow 3^{+}} f(x)$
(c) $\lim _{x \rightarrow 3} f(x)$
(d) $f(3)$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-011.jpg?height=323&width=538&top_left_y=1329&top_left_x=1185)
Figure Ex-7

8. For the function $\phi$ graphed in the accompanying figure, find
(a) $\lim _{x \rightarrow 4^{-}} \phi(x)$
(b) $\lim _{x \rightarrow 4^{+}} \phi(x)$
(c) $\lim _{x \rightarrow 4} \phi(x)$
(d) $\phi(4)$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-011.jpg?height=285&width=538&top_left_y=1876&top_left_x=1185)
Figure Ex-8

9. For the function $f$ graphed in the accompanying figure on the next page, find
(a) $\lim _{x \rightarrow 0^{-}} f(x)$
(b) $\lim _{x \rightarrow 0^{+}} f(x)$
(c) $\lim _{x \rightarrow 0} f(x)$
(d) $f(0)$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-012.jpg?height=367&width=359&top_left_y=196&top_left_x=216)
\& Figure Ex-9

10. For the function $g$ graphed in the accompanying figure, find
(a) $\lim _{x \rightarrow 1^{-}} g(x)$
(b) $\lim _{x \rightarrow 1^{+}} g(x)$
(c) $\lim _{x \rightarrow 1} g(x)$
(d) $g(1)$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-012.jpg?height=496&width=491&top_left_y=764&top_left_x=212)
Figure Ex-10

口 11-12 (i) Complete the table and make a guess about the limit indicated. (ii) Confirm your conclusions about the limit by graphing a function over an appropriate interval. [Note: For the inverse trigonometric function, be sure to put your calculating and graphing utilities in radian mode.]
11. $f(x)=\frac{e^{x}-1}{x} ; \lim _{x \rightarrow 0} f(x)$

| $x$ | -0.01 | -0.001 | -0.0001 | 0.0001 | 0.001 | 0.01 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| $f(x)$ |  |  |  |  |  |  |

## - Table Ex-11

12. $f(x)=\frac{\sin ^{-1} 2 x}{x} ; \lim _{x \rightarrow 0} f(x)$

| $x$ | -0.1 | -0.01 | -0.001 | 0.001 | 0.01 | 0.1 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| $f(x)$ |  |  |  |  |  |  |

- Table Ex-12

C 13-16 (i) Make a guess at the limit (if it exists) by evaluating the function at the specified $x$-values. (ii) Confirm your conclusions about the limit by graphing the function over an appropriate interval. (iii) If you have a CAS, then use it to find the limit. [Note: For the trigonometric functions, be sure to put your calculating and graphing utilities in radian mode.]
13. (a) $\lim _{x \rightarrow 1} \frac{x-1}{x^{3}-1} ; x=2,1.5,1.1,1.01,1.001,0,0.5,0.9$, 0.99, 0.999
(b) $\lim _{x \rightarrow 1^{+}} \frac{x+1}{x^{3}-1} ; x=2,1.5,1.1,1.01,1.001,1.0001$
(c) $\lim _{x \rightarrow 1^{-}} \frac{x+1}{x^{3}-1} ; x=0,0.5,0.9,0.99,0.999,0.9999$
14. (a) $\lim _{x \rightarrow 0} \frac{\sqrt{x+1}-1}{x} ; x= \pm 0.25, \pm 0.1, \pm 0.001$, $\pm 0.0001$
(b) $\lim _{x \rightarrow 0^{+}} \frac{\sqrt{x+1}+1}{x} ; x=0.25,0.1,0.001,0.0001$
(c) $\lim _{x \rightarrow 0^{-}} \frac{\sqrt{x+1}+1}{x} ; x=-0.25,-0.1,-0.001$, -0.0001
15. (a) $\lim _{x \rightarrow 0} \frac{\sin 3 x}{x} ; x= \pm 0.25, \pm 0.1, \pm 0.001, \pm 0.0001$
(b) $\lim _{x \rightarrow-1} \frac{\cos x}{x+1} ; x=0,-0.5,-0.9,-0.99,-0.999$, $-1.5,-1.1,-1.01,-1.001$
16. (a) $\lim _{x \rightarrow-1} \frac{\tan (x+1)}{x+1} ; x=0,-0.5,-0.9,-0.99,-0.999$, $-1.5,-1.1,-1.01,-1.001$
(b) $\lim _{x \rightarrow 0} \frac{\sin (5 x)}{\sin (2 x)} ; x= \pm 0.25, \pm 0.1, \pm 0.001, \pm 0.0001$

17-20 True-False Determine whether the statement is true or false. Explain your answer.
17. If $f(a)=L$, then $\lim _{x \rightarrow a} f(x)=L$.
18. If $\lim _{x \rightarrow a} f(x)$ exists, then so do $\lim _{x \rightarrow a^{-}} f(x)$ and $\lim _{x \rightarrow a^{+}} f(x)$.
19. If $\lim _{x \rightarrow a^{-}} f(x)$ and $\lim _{x \rightarrow a^{+}} f(x)$ exist, then so does $\lim _{x \rightarrow a} f(x)$.
20. If $\lim _{x \rightarrow a^{+}} f(x)=+\infty$, then $f(a)$ is undefined.

21-26 Sketch a possible graph for a function $f$ with the specified properties. (Many different solutions are possible.)
21. (i) the domain of $f$ is $[-1,1]$
(ii) $f(-1)=f(0)=f(1)=0$
(iii) $\lim _{x \rightarrow-1^{+}} f(x)=\lim _{x \rightarrow 0} f(x)=\lim _{x \rightarrow 1^{-}} f(x)=1$
22. (i) the domain of $f$ is $[-2,1]$
(ii) $f(-2)=f(0)=f(1)=0$
(iii) $\lim _{x \rightarrow-2^{+}} f(x)=2, \lim _{x \rightarrow 0} f(x)=0$, and $\lim _{x \rightarrow 1^{-}} f(x)=1$
23. (i) the domain of $f$ is $(-\infty, 0]$
(ii) $f(-2)=f(0)=1$
(iii) $\lim _{x \rightarrow-2} f(x)=+\infty$
24. (i) the domain of $f$ is ( $0,+\infty$ )
(ii) $f(1)=0$
(iii) the $y$-axis is a vertical asymptote for the graph of $f$
(iv) $f(x)<0$ if $0<x<1$
25. (i) $f(-3)=f(0)=f(2)=0$
(ii) $\lim _{x \rightarrow-2^{-}} f(x)=+\infty$ and $\lim _{x \rightarrow-2^{+}} f(x)=-\infty$
(iii) $\lim _{x \rightarrow 1} f(x)=+\infty$
26. (i) $f(-1)=0, f(0)=1, f(1)=0$
(ii) $\lim _{x \rightarrow-1^{-}} f(x)=0$ and $\lim _{x \rightarrow-1^{+}} f(x)=+\infty$
(iii) $\lim _{x \rightarrow 1^{-}} f(x)=1$ and $\lim _{x \rightarrow 1^{+}} f(x)=+\infty$

27-30 Modify the argument of Example 1 to find the equation of the tangent line to the specified graph at the point given.
27. the graph of $y=x^{2}$ at $(-1,1)$
28. the graph of $y=x^{2}$ at $(0,0)$
29. the graph of $y=x^{4}$ at $(1,1)$
30. the graph of $y=x^{4}$ at $(-1,1)$

## FOCUS ON CONCEPTS

31. In the special theory of relativity the length $l$ of a narrow rod moving longitudinally is a function $l=l(v)$ of the rod's speed $v$. The accompanying figure, in which $c$ denotes the speed of light, displays some of the qualitative features of this function.
(a) What is the physical interpretation of $l_{0}$ ?
(b) What is $\lim _{v \rightarrow c^{-}} l(v)$ ? What is the physical significance of this limit?

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-013.jpg?height=319&width=580&top_left_y=1305&top_left_x=292)
Figure Ex-31

32. In the special theory of relativity the mass $m$ of a moving object is a function $m=m(v)$ of the object's speed $v$. The accompanying figure, in which $c$ denotes the speed of light, displays some of the qualitative features of this function.
(a) What is the physical interpretation of $m_{0}$ ?
(b) What is $\lim _{v \rightarrow c^{-}} m(v)$ ? What is the physical significance of this limit?

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-013.jpg?height=311&width=580&top_left_y=2052&top_left_x=292)
Figure Ex-32

33. What do the graphs in Figure 0.5.4 imply about the value of

$$
\lim _{x \rightarrow 0} \frac{e^{x}-1}{x}
$$

Explain your answer.
(c) 34. Let

$$
f(x)=\frac{x-\sin x}{x^{3}}
$$

(a) Make a conjecture about the limit of $f$ as $x \rightarrow 0^{+}$by completing the table.

| $x$ | 0.5 | 0.1 | 0.05 | 0.01 |
| :---: | :---: | :---: | :---: | :---: |
| $f(x)$ |  |  |  |  |

(b) Make another conjecture about the limit of $f$ as $x \rightarrow 0^{+}$ by evaluating $f(x)$ at $x=0.0001,0.00001,0.000001$, 0.0000001, $0.00000001,0.000000001$.
(c) The phenomenon exhibited in part (b) is called catastrophic subtraction. What do you think causes catastrophic subtraction? How does it put restrictions on the use of numerical evidence to make conjectures about limits?
(d) If you have a CAS, use it to show that the exact value of the limit is $\frac{1}{6}$.
35. Let

$$
f(x)=\left(1+x^{2}\right)^{1.1 / x^{2}}
$$

(a) Graph $f$ in the window

$$
[-1,1] \times[2.5,3.5]
$$

and use the calculator's trace feature to make a conjecture about the limit of $f(x)$ as $x \rightarrow 0$.
(b) Graph $f$ in the window

$$
[-0.001,0.001] \times[2.5,3.5]
$$

and use the calculator's trace feature to make a conjecture about the limit of $f(x)$ as $x \rightarrow 0$.
(c) Graph $f$ in the window

$$
[-0.000001,0.000001] \times[2.5,3.5]
$$

and use the calculator's trace feature to make a conjecture about the limit of $f(x)$ as $x \rightarrow 0$.
(d) Later we will be able to show that

$$
\lim _{x \rightarrow 0}\left(1+x^{2}\right)^{1.1 / x^{2}} \approx 3.00416602
$$

What flaw do your graphs reveal about using numerical evidence (as revealed by the graphs you obtained) to make conjectures about limits?
36. Writing Two students are discussing the limit of $\sqrt{x}$ as $x$ approaches 0 . One student maintains that the limit is 0 , while the other claims that the limit does not exist. Write a short paragraph that discusses the pros and cons of each student's position.
37. Writing Given a function $f$ and a real number $a$, explain informally why

$$
\lim _{x \rightarrow 0} f(x+a)=\lim _{x \rightarrow a} f(x)
$$

(Here "equality" means that either both limits exist and are equal or that both limits fail to exist.)

## QUICK CHECK ANSWERS 1.1

1. $f(x) ; L ; x ; a$
2. $f(x) ; x ; a$
3. Both one-sided limits must exist and equal $L$.
4. (a) 0 (b) 1
(c) $+\infty$
(d) $-\infty$
5. 4

### 1.2 COMPUTING LIMITS

In this section we will discuss techniques for computing limits of many functions. We base these results on the informal development of the limit concept discussed in the preceding section. A more formal derivation of these results is possible after Section 1.4.

## SOME BASIC LIMITS

Our strategy for finding limits algebraically has two parts:

- First we will obtain the limits of some simple functions.
- Then we will develop a repertoire of theorems that will enable us to use the limits of those simple functions as building blocks for finding limits of more complicated functions.

We start with the following basic results, which are illustrated in Figure 1.2.1.

### 1.2.1 Theorem Let $a$ and $k$ be real numbers.

(a) $\lim _{x \rightarrow a} k=k$
(b) $\lim _{x \rightarrow a} x=a$
(c) $\lim _{x \rightarrow 0^{-}} \frac{1}{x}=-\infty$
(d) $\lim _{x \rightarrow 0^{+}} \frac{1}{x}=+\infty$
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-014.jpg?height=504&width=1757&top_left_y=1361&top_left_x=160)

Do not confuse the algebraic size of a number with its closeness to zero. For positive numbers, the smaller the number the closer it is to zero, but for negative numbers, the larger the number the closer it is to zero. For example, -2 is larger than -4 , but it is closer to zero.

The following examples explain these results further.

Example 1 If $f(x)=k$ is a constant function, then the values of $f(x)$ remain fixed at $k$ as $x$ varies, which explains why $f(x) \rightarrow k$ as $x \rightarrow a$ for all values of $a$. For example,

$$
\lim _{x \rightarrow-25} 3=3, \quad \lim _{x \rightarrow 0} 3=3, \quad \lim _{x \rightarrow \pi} 3=3
$$

Example 2 If $f(x)=x$, then as $x \rightarrow a$ it must also be true that $f(x) \rightarrow a$. For example,

$$
\lim _{x \rightarrow 0} x=0, \quad \lim _{x \rightarrow-2} x=-2, \quad \lim _{x \rightarrow \pi} x=\pi
$$

Theorem 1.2.2(e) remains valid for $n$ even and $L_{1}=0$, provided $f(x)$ is nonnegative for $x$ near $a$ with $x \neq a$.

Example 3 You should know from your experience with fractions that for a fixed nonzero numerator, the closer the denominator is to zero, the larger the absolute value of the fraction. This fact and the data in Table 1.2.1 suggest why $1 / x \rightarrow+\infty$ as $x \rightarrow 0^{+}$and why $1 / x \rightarrow-\infty$ as $x \rightarrow 0^{-}$.

Table 1.2.1
|  | VALUES |  |  |  |  |  | CONCLUSION |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| $x$ | -1 | -0.1 | -0.01 | -0.001 | -0.0001 | $\cdots$ | As $x \rightarrow 0^{-}$the value of $1 / x$ |
| $1 / x$ | -1 | -10 | -100 | -1000 | $-10,000$ | $\cdots$ | decreases without bound. |
| $x$ | 1 | 0.1 | 0.01 | 0.001 | 0.0001 | $\cdots$ | As $x \rightarrow 0^{+}$the value of $1 / x$ |
| $1 / x$ | 1 | 10 | 100 | 1000 | 10,000 | $\cdots$ | increases without bound. |


The following theorem, parts of which are proved in Appendix D, will be our basic tool for finding limits algebraically.
1.2.2 THEOREM Let a be a real number, and suppose that

$$
\lim _{x \rightarrow a} f(x)=L_{1} \quad \text { and } \quad \lim _{x \rightarrow a} g(x)=L_{2}
$$

That is, the limits exist and have values $L_{1}$ and $L_{2}$, respectively. Then:
(a) $\lim _{x \rightarrow a}[f(x)+g(x)]=\lim _{x \rightarrow a} f(x)+\lim _{x \rightarrow a} g(x)=L_{1}+L_{2}$
(b) $\lim _{x \rightarrow a}[f(x)-g(x)]=\lim _{x \rightarrow a} f(x)-\lim _{x \rightarrow a} g(x)=L_{1}-L_{2}$
(c) $\lim _{x \rightarrow a}[f(x) g(x)]=\left(\lim _{x \rightarrow a} f(x)\right)\left(\lim _{x \rightarrow a} g(x)\right)=L_{1} L_{2}$
(d) $\lim _{x \rightarrow a} \frac{f(x)}{g(x)}=\frac{\lim _{x \rightarrow a} f(x)}{\lim _{x \rightarrow a} g(x)}=\frac{L_{1}}{L_{2}}, \quad$ provided $L_{2} \neq 0$
(e) $\lim _{x \rightarrow a} \sqrt[n]{f(x)}=\sqrt[n]{\lim _{x \rightarrow a} f(x)}=\sqrt[n]{L_{1}}$, provided $L_{1}>0$ if $n$ is even.

Moreover, these statements are also true for the one-sided limits as $x \rightarrow a^{-}$or as $x \rightarrow a^{+}$.

This theorem can be stated informally as follows:
(a) The limit of a sum is the sum of the limits.
(b) The limit of a difference is the difference of the limits.
(c) The limit of a product is the product of the limits.
(d) The limit of a quotient is the quotient of the limits, provided the limit of the denominator is not zero.
(e) The limit of an $n$th root is the $n$th root of the limit.

For the special case of part (c) in which $f(x)=k$ is a constant function, we have

$$
\begin{equation*}
\lim _{x \rightarrow a}(k g(x))=\lim _{x \rightarrow a} k \cdot \lim _{x \rightarrow a} g(x)=k \lim _{x \rightarrow a} g(x) \tag{1}
\end{equation*}
$$

and similarly for one-sided limits. This result can be rephrased as follows:

## A constant factor can be moved through a limit symbol.

Although parts (a) and (c) of Theorem 1.2.2 are stated for two functions, the results hold for any finite number of functions. Moreover, the various parts of the theorem can be used in combination to reformulate expressions involving limits.

## Example 4

$$
\begin{array}{lc}
\lim _{x \rightarrow a}[f(x)-g(x)+2 h(x)]=\lim _{x \rightarrow a} f(x)-\lim _{x \rightarrow a} g(x)+2 \lim _{x \rightarrow a} h(x) \\
\lim _{x \rightarrow a}[f(x) g(x) h(x)]=\left(\lim _{x \rightarrow a} f(x)\right)\left(\lim _{x \rightarrow a} g(x)\right)\left(\lim _{x \rightarrow a} h(x)\right) \\
\lim _{x \rightarrow a}[f(x)]^{3}=\left(\lim _{x \rightarrow a} f(x)\right)^{3} & \text { Take } g(x)=h(x)=f(x) \text { in the last equation. } \\
\lim _{x \rightarrow a}[f(x)]^{n}=\left(\lim _{x \rightarrow a} f(x)\right)^{n} & \begin{array}{l}
\text { The extension of Theorem 1.2.2(c) in which } \\
\text { there are } n \text { factors, each of which is } f(x)
\end{array} \\
\lim _{x \rightarrow a} x^{n}=\left(\lim _{x \rightarrow a} x\right)^{n}=a^{n} & \text { Apply the previous result with } f(x)=x .
\end{array}
$$

## LIMITS OF POLYNOMIALS AND RATIONAL FUNCTIONS AS $\boldsymbol{x} \rightarrow \boldsymbol{a}$

## Example 5 Find $\lim _{x \rightarrow 5}\left(x^{2}-4 x+3\right)$.

## Solution.

$$
\begin{aligned}
\lim _{x \rightarrow 5}\left(x^{2}-4 x+3\right) & =\lim _{x \rightarrow 5} x^{2}-\lim _{x \rightarrow 5} 4 x+\lim _{x \rightarrow 5} 3 \\
& =\lim _{x \rightarrow 5} x^{2}-4 \lim _{x \rightarrow 5} x+\lim _{x \rightarrow 5} 3 \\
& =5^{2}-4(5)+3 \\
& =8
\end{aligned}
$$

Observe that in Example 5 the limit of the polynomial $p(x)=x^{2}-4 x+3$ as $x \rightarrow 5$ turned out to be the same as $p(5)$. This is not an accident. The next result shows that, in general, the limit of a polynomial $p(x)$ as $x \rightarrow a$ is the same as the value of the polynomial at $a$. Knowing this fact allows us to reduce the computation of limits of polynomials to simply evaluating the polynomial at the appropriate point.

### 1.2.3 THEOREM For any polynomial

$$
p(x)=c_{0}+c_{1} x+\cdots+c_{n} x^{n}
$$

and any real number $a$,

$$
\lim _{x \rightarrow a} p(x)=c_{0}+c_{1} a+\cdots+c_{n} a^{n}=p(a)
$$

PROOF

$$
\begin{aligned}
\lim _{x \rightarrow a} p(x) & =\lim _{x \rightarrow a}\left(c_{0}+c_{1} x+\cdots+c_{n} x^{n}\right) \\
& =\lim _{x \rightarrow a} c_{0}+\lim _{x \rightarrow a} c_{1} x+\cdots+\lim _{x \rightarrow a} c_{n} x^{n} \\
& =\lim _{x \rightarrow a} c_{0}+c_{1} \lim _{x \rightarrow a} x+\cdots+c_{n} \lim _{x \rightarrow a} x^{n} \\
& =c_{0}+c_{1} a+\cdots+c_{n} a^{n}=p(a)
\end{aligned}
$$

Example 6 Find $\lim _{x \rightarrow 1}\left(x^{7}-2 x^{5}+1\right)^{35}$.
Solution. The function involved is a polynomial (why?), so the limit can be obtained by evaluating this polynomial at $x=1$. This yields

$$
\lim _{x \rightarrow 1}\left(x^{7}-2 x^{5}+1\right)^{35}=0
$$

Recall that a rational function is a ratio of two polynomials. The following example illustrates how Theorems 1.2.2(d) and 1.2.3 can sometimes be used in combination to compute limits of rational functions.

- Example 7 Find $\lim _{x \rightarrow 2} \frac{5 x^{3}+4}{x-3}$.

Solution.

$$
\begin{aligned}
\lim _{x \rightarrow 2} \frac{5 x^{3}+4}{x-3} & =\frac{\lim _{x \rightarrow 2}\left(5 x^{3}+4\right)}{\lim _{x \rightarrow 2}(x-3)} \\
& =\frac{5 \cdot 2^{3}+4}{2-3}=-44
\end{aligned}
$$

The method used in the last example will not work for rational functions in which the limit of the denominator is zero because Theorem 1.2.2(d) is not applicable. There are two cases of this type to be considered-the case where the limit of the denominator is zero and the limit of the numerator is not, and the case where the limits of the numerator and denominator are both zero. If the limit of the denominator is zero but the limit of the numerator is not, then one can prove that the limit of the rational function does not exist and that one of the following situations occurs:

- The limit may be $-\infty$ from one side and $+\infty$ from the other.
- The limit may be $+\infty$.
- The limit may be $-\infty$.

Figure 1.2.2 illustrates these three possibilities graphically for rational functions of the form $1 /(x-a), 1 /(x-a)^{2}$, and $-1 /(x-a)^{2}$.

Example 8 Find
(a) $\lim _{x \rightarrow 4^{+}} \frac{2-x}{(x-4)(x+2)}$
(b) $\lim _{x \rightarrow 4^{-}} \frac{2-x}{(x-4)(x+2)}$
(c) $\lim _{x \rightarrow 4} \frac{2-x}{(x-4)(x+2)}$

Solution. In all three parts the limit of the numerator is -2 , and the limit of the denominator is 0 , so the limit of the ratio does not exist. To be more specific than this, we need

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-018.jpg?height=199&width=461&top_left_y=865&top_left_x=160)
△ Figure 1.2.3

In Example 9(a), the simplified function $x-3$ is defined at $x=3$, but the original function is not. However, this has no effect on the limit as $x$ approaches 3 since the two functions are identical if $x \neq 3$ (Exercise 50).

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-018.jpg?height=383&width=388&top_left_y=196&top_left_x=656)
△ Figure 1.2.2

$$
\begin{aligned}
& \lim _{x \rightarrow a^{+}} \frac{1}{x-a}=+\infty \\
& \lim _{x \rightarrow a^{-}} \frac{1}{x-a}=-\infty
\end{aligned}
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-018.jpg?height=383&width=389&top_left_y=196&top_left_x=1089)

$$
\lim _{x \rightarrow a} \frac{1}{(x-a)^{2}}=+\infty
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-018.jpg?height=377&width=392&top_left_y=194&top_left_x=1525)

$$
\lim _{x \rightarrow a}-\frac{1}{(x-a)^{2}}=-\infty
$$

to analyze the sign of the ratio. The sign of the ratio, which is given in Figure 1.2.3, is determined by the signs of $2-x, x-4$, and $x+2$. (The method of test points, discussed in Web Appendix E, provides a way of finding the sign of the ratio here.) It follows from this figure that as $x$ approaches 4 from the right, the ratio is always negative; and as $x$ approaches 4 from the left, the ratio is eventually positive. Thus,

$$
\lim _{x \rightarrow 4^{+}} \frac{2-x}{(x-4)(x+2)}=-\infty \quad \text { and } \quad \lim _{x \rightarrow 4^{-}} \frac{2-x}{(x-4)(x+2)}=+\infty
$$

Because the one-sided limits have opposite signs, all we can say about the two-sided limit is that it does not exist.

In the case where $p(x) / q(x)$ is a rational function for which $p(a)=0$ and $q(a)=0$, the numerator and denominator must have one or more common factors of $x-a$. In this case the limit of $p(x) / q(x)$ as $x \rightarrow a$ can be found by canceling all common factors of $x-a$ and using one of the methods already considered to find the limit of the simplified function. Here is an example.

- Example 9 Find
(a) $\lim _{x \rightarrow 3} \frac{x^{2}-6 x+9}{x-3}$
(b) $\lim _{x \rightarrow-4} \frac{2 x+8}{x^{2}+x-12}$
(c) $\lim _{x \rightarrow 5} \frac{x^{2}-3 x-10}{x^{2}-10 x+25}$

Solution ( $\boldsymbol{a}$ ). The numerator and the denominator both have a zero at $x=3$, so there is a common factor of $x-3$. Then

$$
\lim _{x \rightarrow 3} \frac{x^{2}-6 x+9}{x-3}=\lim _{x \rightarrow 3} \frac{(x-3)^{2}}{x-3}=\lim _{x \rightarrow 3}(x-3)=0
$$

Solution (b). The numerator and the denominator both have a zero at $x=-4$, so there is a common factor of $x-(-4)=x+4$. Then

$$
\lim _{x \rightarrow-4} \frac{2 x+8}{x^{2}+x-12}=\lim _{x \rightarrow-4} \frac{2(x+4)}{(x+4)(x-3)}=\lim _{x \rightarrow-4} \frac{2}{x-3}=-\frac{2}{7}
$$

Solution ( $\boldsymbol{c}$ ). The numerator and the denominator both have a zero at $x=5$, so there is a common factor of $x-5$. Then

$$
\lim _{x \rightarrow 5} \frac{x^{2}-3 x-10}{x^{2}-10 x+25}=\lim _{x \rightarrow 5} \frac{(x-5)(x+2)}{(x-5)(x-5)}=\lim _{x \rightarrow 5} \frac{x+2}{x-5}
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-019.jpg?height=195&width=461&top_left_y=456&top_left_x=216)
Figure 1.2.4

Discuss the logical errors in the following statement: An indeterminate form of type $0 / 0$ must have a limit of zero because zero divided by anything is zero.

However,

$$
\lim _{x \rightarrow 5}(x+2)=7 \neq 0 \quad \text { and } \quad \lim _{x \rightarrow 5}(x-5)=0
$$

so

$$
\lim _{x \rightarrow 5} \frac{x^{2}-3 x-10}{x^{2}-10 x+25}=\lim _{x \rightarrow 5} \frac{x+2}{x-5}
$$

does not exist. More precisely, the sign analysis in Figure 1.2.4 implies that

$$
\lim _{x \rightarrow 5^{+}} \frac{x^{2}-3 x-10}{x^{2}-10 x+25}=\lim _{x \rightarrow 5^{+}} \frac{x+2}{x-5}=+\infty
$$

and

$$
\lim _{x \rightarrow 5^{-}} \frac{x^{2}-3 x-10}{x^{2}-10 x+25}=\lim _{x \rightarrow 5^{-}} \frac{x+2}{x-5}=-\infty
$$

A quotient $f(x) / g(x)$ in which the numerator and denominator both have a limit of zero as $x \rightarrow a$ is called an indeterminate form of type $\mathbf{0} / \mathbf{0}$. The problem with such limits is that it is difficult to tell by inspection whether the limit exists, and, if so, its value. Informally stated, this is because there are two conflicting influences at work. The value of $f(x) / g(x)$ would tend to zero as $f(x)$ approached zero if $g(x)$ were to remain at some fixed nonzero value, whereas the value of this ratio would tend to increase or decrease without bound as $g(x)$ approached zero if $f(x)$ were to remain at some fixed nonzero value. But with both $f(x)$ and $g(x)$ approaching zero, the behavior of the ratio depends on precisely how these conflicting tendencies offset one another for the particular $f$ and $g$.

Sometimes, limits of indeterminate forms of type $0 / 0$ can be found by algebraic simplification, as in the last example, but frequently this will not work and other methods must be used. We will study such methods in later sections.

The following theorem summarizes our observations about limits of rational functions.

### 1.2.4 THEOREM Let

$$
f(x)=\frac{p(x)}{q(x)}
$$

be a rational function, and let a be any real number.
(a) If $q(a) \neq 0$, then $\lim _{x \rightarrow a} f(x)=f(a)$.
(b) If $q(a)=0$ but $p(a) \neq 0$, then $\lim _{x \rightarrow a} f(x)$ does not exist.

## LIMITS INVOLVING RADICALS

Example 10 Find $\lim _{x \rightarrow 1} \frac{x-1}{\sqrt{x}-1}$.
Solution. In Example 2 of Section 1.1 we used numerical evidence to conjecture that this limit is 2 . Here we will confirm this algebraically. Since this limit is an indeterminate form of type 0/0, we will need to devise some strategy for making the limit (if it exists) evident. One such strategy is to rationalize the denominator of the function. This yields

$$
\frac{x-1}{\sqrt{x}-1}=\frac{(x-1)(\sqrt{x}+1)}{(\sqrt{x}-1)(\sqrt{x}+1)}=\frac{(x-1)(\sqrt{x}+1)}{x-1}=\sqrt{x}+1 \quad(x \neq 1)
$$

Confirm the limit in Example 10 by factoring the numerator.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-020.jpg?height=411&width=451&top_left_y=1956&top_left_x=164)
△ Figure 1.2.5

Therefore,

$$
\lim _{x \rightarrow 1} \frac{x-1}{\sqrt{x}-1}=\lim _{x \rightarrow 1}(\sqrt{x}+1)=2
$$

## LIMITS OF PIECEWISE-DEFINED FUNCTIONS

For functions that are defined piecewise, a two-sided limit at a point where the formula changes is best obtained by first finding the one-sided limits at that point.

Example 11 Let

$$
f(x)=\left\{\begin{aligned}
& 1 /(x+2), & x & <-2 \\
& x^{2}-5, & -2 & <x \leq 3 \\
& \sqrt{x+13}, & x & >3
\end{aligned}\right.
$$

Find
(a) $\lim _{x \rightarrow-2} f(x)$
(b) $\lim _{x \rightarrow 0} f(x)$
(c) $\lim _{x \rightarrow 3} f(x)$

Solution (a). We will determine the stated two-sided limit by first considering the corresponding one-sided limits. For each one-sided limit, we must use that part of the formula that is applicable on the interval over which $x$ varies. For example, as $x$ approaches -2 from the left, the applicable part of the formula is

$$
f(x)=\frac{1}{x+2}
$$

and as $x$ approaches -2 from the right, the applicable part of the formula near -2 is

$$
f(x)=x^{2}-5
$$

Thus,

$$
\begin{aligned}
\lim _{x \rightarrow-2^{-}} f(x) & =\lim _{x \rightarrow-2^{-}} \frac{1}{x+2}=-\infty \\
\lim _{x \rightarrow-2^{+}} f(x) & =\lim _{x \rightarrow-2^{+}}\left(x^{2}-5\right)=(-2)^{2}-5=-1
\end{aligned}
$$

from which it follows that $\lim _{x \rightarrow-2} f(x)$ does not exist.

Solution (b). The applicable part of the formula is $f(x)=x^{2}-5$ on both sides of 0 , so there is no need to consider one-sided limits here. We see directly that

$$
\lim _{x \rightarrow 0} f(x)=\lim _{x \rightarrow 0}\left(x^{2}-5\right)=0^{2}-5=-5
$$

Solution (c). Using the applicable parts of the formula for $f(x)$, we obtain

$$
\begin{aligned}
& \lim _{x \rightarrow 3^{-}} f(x)=\lim _{x \rightarrow 3^{-}}\left(x^{2}-5\right)=3^{2}-5=4 \\
& \lim _{x \rightarrow 3^{+}} f(x)=\lim _{x \rightarrow 3^{+}} \sqrt{x+13}=\sqrt{\lim _{x \rightarrow 3^{+}}(x+13)}=\sqrt{3+13}=4
\end{aligned}
$$

Since the one-sided limits are equal, we have

$$
\lim _{x \rightarrow 3} f(x)=4
$$

We note that the limit calculations in parts (a), (b), and (c) are consistent with the graph of $f$ shown in Figure 1.2.5.

1. In each part, find the limit by inspection.
(a) $\lim _{x \rightarrow 8} 7=$ $\_\_\_\_$ (b) $\lim _{y \rightarrow 3^{+}} 12 y=$ $\_\_\_\_$
(c) $\lim _{x \rightarrow 0^{-}} \frac{x}{|x|}=$ $\_\_\_\_$
(d) $\lim _{w \rightarrow 5} \frac{w}{|w|}=$ $\_\_\_\_$
(e) $\lim _{z \rightarrow 1^{-}} \frac{1}{1-z}=$ $\_\_\_\_$
2. Given that $\lim _{x \rightarrow a} f(x)=1$ and $\lim _{x \rightarrow a} g(x)=2$, find the limits.
(a) $\lim _{x \rightarrow a}[3 f(x)+2 g(x)]=$ $\_\_\_\_$
(b) $\lim _{x \rightarrow a} \frac{2 f(x)+1}{1-f(x) g(x)}=$ $\_\_\_\_$
(c) $\lim _{x \rightarrow a} \frac{\sqrt{f(x)+3}}{g(x)}=$ $\_\_\_\_$

## EXERCISE SET 1.2

1. Given that

$$
\lim _{x \rightarrow a} f(x)=2, \quad \lim _{x \rightarrow a} g(x)=-4, \quad \lim _{x \rightarrow a} h(x)=0
$$

find the limits.
(a) $\lim _{x \rightarrow a}[f(x)+2 g(x)]$
(b) $\lim _{x \rightarrow a}[h(x)-3 g(x)+1]$
(c) $\lim _{x \rightarrow a}[f(x) g(x)]$
(d) $\lim _{x \rightarrow a}[g(x)]^{2}$
(e) $\lim _{x \rightarrow a} \sqrt[3]{6+f(x)}$
(f) $\lim _{x \rightarrow a} \frac{2}{g(x)}$
2. Use the graphs of $f$ and $g$ in the accompanying figure to find the limits that exist. If the limit does not exist, explain why.
(a) $\lim _{x \rightarrow 2}[f(x)+g(x)]$
(b) $\lim _{x \rightarrow 0}[f(x)+g(x)]$
(c) $\lim _{x \rightarrow 0^{+}}[f(x)+g(x)]$
(d) $\lim _{x \rightarrow 0^{-}}[f(x)+g(x)]$
(e) $\lim _{x \rightarrow 2} \frac{f(x)}{1+g(x)}$
(f) $\lim _{x \rightarrow 2} \frac{1+g(x)}{f(x)}$
(g) $\lim _{x \rightarrow 0^{+}} \sqrt{f(x)}$
(h) $\lim _{x \rightarrow 0^{-}} \sqrt{f(x)}$
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-021.jpg?height=377&width=379&top_left_y=1908&top_left_x=268)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-021.jpg?height=379&width=388&top_left_y=1908&top_left_x=664)

- Figure Ex-2

3-30 Find the limits.
3. Find the limits.
(a) $\lim _{x \rightarrow-1}\left(x^{3}+x^{2}+x\right)^{101}=$ $\_\_\_\_$
(b) $\lim _{x \rightarrow 2^{-}} \frac{(x-1)(x-2)}{x+1}=$ $\_\_\_\_$
(c) $\lim _{x \rightarrow-1^{+}} \frac{(x-1)(x-2)}{x+1}=$ $\_\_\_\_$
(d) $\lim _{x \rightarrow 4} \frac{x^{2}-16}{x-4}=$ $\_\_\_\_$
4. Let

$$
f(x)= \begin{cases}x+1, & x \leq 1 \\ x-1, & x>1\end{cases}
$$

Find the limits that exist.
(a) $\lim _{x \rightarrow 1^{-}} f(x)=$ $\_\_\_\_$
(b) $\lim _{x \rightarrow 1^{+}} f(x)=$ $\_\_\_\_$
(c) $\lim _{x \rightarrow 1} f(x)=$ $\_\_\_\_$
3. $\lim _{x \rightarrow 2} x(x-1)(x+1)$
4. $\lim _{x \rightarrow 3} x^{3}-3 x^{2}+9 x$
5. $\lim _{x \rightarrow 3} \frac{x^{2}-2 x}{x+1}$
6. $\lim _{x \rightarrow 0} \frac{6 x-9}{x^{3}-12 x+3}$
7. $\lim _{x \rightarrow 1^{+}} \frac{x^{4}-1}{x-1}$
8. $\lim _{t \rightarrow-2} \frac{t^{3}+8}{t+2}$
9. $\lim _{x \rightarrow-1} \frac{x^{2}+6 x+5}{x^{2}-3 x-4}$
10. $\lim _{x \rightarrow 2} \frac{x^{2}-4 x+4}{x^{2}+x-6}$
11. $\lim _{x \rightarrow-1} \frac{2 x^{2}+x-1}{x+1}$
12. $\lim _{x \rightarrow 1} \frac{3 x^{2}-x-2}{2 x^{2}+x-3}$
13. $\lim _{t \rightarrow 2} \frac{t^{3}+3 t^{2}-12 t+4}{t^{3}-4 t}$
14. $\lim _{t \rightarrow 1} \frac{t^{3}+t^{2}-5 t+3}{t^{3}-3 t+2}$
15. $\lim _{x \rightarrow 3^{+}} \frac{x}{x-3}$
16. $\lim _{x \rightarrow 3^{-}} \frac{x}{x-3}$
17. $\lim _{x \rightarrow 3} \frac{x}{x-3}$
18. $\lim _{x \rightarrow 2^{+}} \frac{x}{x^{2}-4}$
19. $\lim _{x \rightarrow 2^{-}} \frac{x}{x^{2}-4}$
20. $\lim _{x \rightarrow 2} \frac{x}{x^{2}-4}$
21. $\lim _{y \rightarrow 6^{+}} \frac{y+6}{y^{2}-36}$
22. $\lim _{y \rightarrow 6^{-}} \frac{y+6}{y^{2}-36}$
23. $\lim _{y \rightarrow 6} \frac{y+6}{y^{2}-36}$
24. $\lim _{x \rightarrow 4^{+}} \frac{3-x}{x^{2}-2 x-8}$
25. $\lim _{x \rightarrow 4^{-}} \frac{3-x}{x^{2}-2 x-8}$
26. $\lim _{x \rightarrow 4} \frac{3-x}{x^{2}-2 x-8}$
27. $\lim _{x \rightarrow 2^{+}} \frac{1}{|2-x|}$
28. $\lim _{x \rightarrow 3^{-}} \frac{1}{|x-3|}$
29. $\lim _{x \rightarrow 9} \frac{x-9}{\sqrt{x}-3}$
30. $\lim _{y \rightarrow 4} \frac{4-y}{2-\sqrt{y}}$
31. Let

$$
f(x)=\left\{\begin{array}{rr}
x-1, & x \leq 3 \\
3 x-7, & x>3
\end{array}\right.
$$

Find
(a) $\lim _{x \rightarrow 3^{-}} f(x)$
(b) $\lim _{x \rightarrow 3^{+}} f(x)$
(c) $\lim _{x \rightarrow 3} f(x)$.
32. Let

$$
g(t)= \begin{cases}t-2, & t<0 \\ t^{2}, & 0 \leq t \leq 2 \\ 2 t, & t>2\end{cases}
$$

Find
(a) $\lim _{t \rightarrow 0} g(t)$
(b) $\lim _{t \rightarrow 1} g(t)$
(c) $\lim _{t \rightarrow 2} g(t)$.

33-36 True-False Determine whether the statement is true or false. Explain your answer.
33. If $\lim _{x \rightarrow a} f(x)$ and $\lim _{x \rightarrow a} g(x)$ exist, then so does $\lim _{x \rightarrow a}[f(x)+g(x)]$.
34. If $\lim _{x \rightarrow a} g(x)=0$ and $\lim _{x \rightarrow a} f(x)$ exists, then $\lim _{x \rightarrow a}[f(x) / g(x)]$ does not exist.
35. If $\lim _{x \rightarrow a} f(x)$ and $\lim _{x \rightarrow a} g(x)$ both exist and are equal, then $\lim _{x \rightarrow a}[f(x) / g(x)]=1$.
36. If $f(x)$ is a rational function and $x=a$ is in the domain of $f$, then $\lim _{x \rightarrow a} f(x)=f(a)$.

37-38 First rationalize the numerator and then find the limit.
37. $\lim _{x \rightarrow 0} \frac{\sqrt{x+4}-2}{x}$
38. $\lim _{x \rightarrow 0} \frac{\sqrt{x^{2}+4}-2}{x}$
39. Let

$$
f(x)=\frac{x^{3}-1}{x-1}
$$

(a) Find $\lim _{x \rightarrow 1} f(x)$.
(b) Sketch the graph of $y=f(x)$.
40. Let

$$
f(x)= \begin{cases}\frac{x^{2}-9}{x+3}, & x \neq-3 \\ k, & x=-3\end{cases}
$$

(a) Find $k$ so that $f(-3)=\lim _{x \rightarrow-3} f(x)$.
(b) With $k$ assigned the value $\lim _{x \rightarrow-3} f(x)$, show that $f(x)$ can be expressed as a polynomial.

## FOCUS ON CONCEPTS

41. (a) Explain why the following calculation is incorrect.

$$
\begin{aligned}
\lim _{x \rightarrow 0^{+}}\left(\frac{1}{x}-\frac{1}{x^{2}}\right) & =\lim _{x \rightarrow 0^{+}} \frac{1}{x}-\lim _{x \rightarrow 0^{+}} \frac{1}{x^{2}} \\
& =+\infty-(+\infty)=0
\end{aligned}
$$

(b) Show that $\lim _{x \rightarrow 0^{+}}\left(\frac{1}{x}-\frac{1}{x^{2}}\right)=-\infty$.
42. (a) Explain why the following argument is incorrect.

$$
\begin{aligned}
\lim _{x \rightarrow 0}\left(\frac{1}{x}-\frac{2}{x^{2}+2 x}\right) & =\lim _{x \rightarrow 0} \frac{1}{x}\left(1-\frac{2}{x+2}\right) \\
& =\infty \cdot 0=0
\end{aligned}
$$

(b) Show that $\lim _{x \rightarrow 0}\left(\frac{1}{x}-\frac{2}{x^{2}+2 x}\right)=\frac{1}{2}$.
43. Find all values of $a$ such that

$$
\lim _{x \rightarrow 1}\left(\frac{1}{x-1}-\frac{a}{x^{2}-1}\right)
$$

exists and is finite.
44. (a) Explain informally why

$$
\lim _{x \rightarrow 0^{-}}\left(\frac{1}{x}+\frac{1}{x^{2}}\right)=+\infty
$$

(b) Verify the limit in part (a) algebraically.
45. Let $p(x)$ and $q(x)$ be polynomials, with $q\left(x_{0}\right)=0$. Discuss the behavior of the graph of $y=p(x) / q(x)$ in the vicinity of $x=x_{0}$. Give examples to support your conclusions.
46. Suppose that $f$ and $g$ are two functions such that $\lim _{x \rightarrow a} f(x)$ exists but $\lim _{x \rightarrow a}[f(x)+g(x)]$ does not exist. Use Theorem 1.2.2. to prove that $\lim _{x \rightarrow a} g(x)$ does not exist.
47. Suppose that $f$ and $g$ are two functions such that both $\lim _{x \rightarrow a} f(x)$ and $\lim _{x \rightarrow a}[f(x)+g(x)]$ exist. Use Theorem 1.2.2 to prove that $\lim _{x \rightarrow a} g(x)$ exists.
48. Suppose that $f$ and $g$ are two functions such that

$$
\lim _{x \rightarrow a} g(x)=0 \quad \text { and } \quad \lim _{x \rightarrow a} \frac{f(x)}{g(x)}
$$

exists. Use Theorem 1.2.2 to prove that $\lim _{x \rightarrow a} f(x)=0$.
49. Writing According to Newton's Law of Universal Gravitation, the gravitational force of attraction between two masses is inversely proportional to the square of the distance between them. What results of this section are useful in describing the gravitational force of attraction between the masses as they get closer and closer together?
50. Writing Suppose that $f$ and $g$ are two functions that are equal except at a finite number of points and that $a$ denotes a real number. Explain informally why both

$$
\lim _{x \rightarrow a} f(x) \text { and } \lim _{x \rightarrow a} g(x)
$$

exist and are equal, or why both limits fail to exist. Write a short paragraph that explains the relationship of this result to the use of "algebraic simplification" in the evaluation of a limit.

## QUICK CHECK ANSWERS 1.2

1. (a) 7
(b) 36 (c) -1
(d) 1 (e) $+\infty$
2. (a) 7
(b) -3
(c) 1
3. (a) -1
(b) 0
(c) $+\infty$
(d) 8
4. (a) 2 (b) 0 (c) does not exist

### 1.3 LIMITS AT INFINITY; END BEHAVIOR OF A FUNCTION

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-023.jpg?height=1011&width=395&top_left_y=531&top_left_x=252)
Figure 1.3.1

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-023.jpg?height=770&width=479&top_left_y=1611&top_left_x=208)
△ Figure 1.3.2

Up to now we have been concerned with limits that describe the behavior of a function $f(x)$ as $x$ approaches some real number $a$. In this section we will be concerned with the behavior of $f(x)$ as $x$ increases or decreases without bound.

## LIMITS AT INFINITY AND HORIZONTAL ASYMPTOTES

If the values of a variable $x$ increase without bound, then we write $x \rightarrow+\infty$, and if the values of $x$ decrease without bound, then we write $x \rightarrow-\infty$. The behavior of a function $f(x)$ as $x$ increases without bound or decreases without bound is sometimes called the end behavior of the function. For example,

$$
\begin{equation*}
\lim _{x \rightarrow-\infty} \frac{1}{x}=0 \quad \text { and } \quad \lim _{x \rightarrow+\infty} \frac{1}{x}=0 \tag{1-2}
\end{equation*}
$$

are illustrated numerically in Table 1.3.1 and geometrically in Figure 1.3.1.

Table 1.3.1
|  | VALUES |  |  |  |  |  | CONCLUSION |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| $x$ | -1 | -10 | -100 | -1000 | $-10,000$ | $\cdots$ | As $x \rightarrow-\infty$ the value of $1 / x$ |
| $1 / x$ | -1 | -0.1 | -0.01 | -0.001 | -0.0001 | $\cdots$ | increases toward zero. |
| $x$ | 1 | 10 | 100 | 1000 | 10,000 | $\cdots$ | As $x \rightarrow+\infty$ the value of $1 / x$ |
| $1 / x$ | 1 | 0.1 | 0.01 | 0.001 | 0.0001 | $\cdots$ | decreases toward zero. |


In general, we will use the following notation.
1.3.1 LIMITS AT INFINITY (AN INFORMAL VIEW) If the values of $f(x)$ eventually get as close as we like to a number $L$ as $x$ increases without bound, then we write

$$
\begin{equation*}
\lim _{x \rightarrow+\infty} f(x)=L \quad \text { or } \quad f(x) \rightarrow L \text { as } x \rightarrow+\infty \tag{3}
\end{equation*}
$$

Similarly, if the values of $f(x)$ eventually get as close as we like to a number $L$ as $x$ decreases without bound, then we write

$$
\begin{equation*}
\lim _{x \rightarrow-\infty} f(x)=L \quad \text { or } \quad f(x) \rightarrow L \text { as } x \rightarrow-\infty \tag{4}
\end{equation*}
$$

Figure 1.3.2 illustrates the end behavior of a function $f$ when

$$
\lim _{x \rightarrow+\infty} f(x)=L \quad \text { or } \quad \lim _{x \rightarrow-\infty} f(x)=L
$$

In the first case the graph of $f$ eventually comes as close as we like to the line $y=L$ as $x$ increases without bound, and in the second case it eventually comes as close as we like to the line $y=L$ as $x$ decreases without bound. If either limit holds, we call the line $y=L$ a horizontal asymptote for the graph of $f$.

- Example 1 It follows from (1) and (2) that $y=0$ is a horizontal asymptote for the graph of $f(x)=1 / x$ in both the positive and negative directions. This is consistent with the graph of $y=1 / x$ shown in Figure 1.3.1.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-024.jpg?height=391&width=385&top_left_y=196&top_left_x=200)
- Figure 1.3.3

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-024.jpg?height=316&width=471&top_left_y=700&top_left_x=160)
- Figure 1.3.4

$$
y=\left(1+\frac{1}{x}\right)^{x}
$$

Example 2 Figure 1.3.3 is the graph of $f(x)=\tan ^{-1} x$. As suggested by this graph,

$$
\begin{equation*}
\lim _{x \rightarrow+\infty} \tan ^{-1} x=\frac{\pi}{2} \quad \text { and } \quad \lim _{x \rightarrow-\infty} \tan ^{-1} x=-\frac{\pi}{2} \tag{5-6}
\end{equation*}
$$

so the line $y=\pi / 2$ is a horizontal asymptote for $f$ in the positive direction and the line $y=-\pi / 2$ is a horizontal asymptote in the negative direction. $\square$

Example 3 Figure 1.3.4 is the graph of $f(x)=(1+1 / x)^{x}$. As suggested by this graph,

$$
\begin{equation*}
\lim _{x \rightarrow+\infty}\left(1+\frac{1}{x}\right)^{x}=e \quad \text { and } \quad \lim _{x \rightarrow-\infty}\left(1+\frac{1}{x}\right)^{x}=e \tag{7-8}
\end{equation*}
$$

so the line $y=e$ is a horizontal asymptote for $f$ in both the positive and negative directions. $\square$

## LIMIT LAWS FOR LIMITS AT INFINITY

It can be shown that the limit laws in Theorem 1.2.2 carry over without change to limits at $+\infty$ and $-\infty$. Moreover, it follows by the same argument used in Section 1.2 that if $n$ is a positive integer, then

$$
\begin{equation*}
\lim _{x \rightarrow+\infty}(f(x))^{n}=\left(\lim _{x \rightarrow+\infty} f(x)\right)^{n} \quad \lim _{x \rightarrow-\infty}(f(x))^{n}=\left(\lim _{x \rightarrow-\infty} f(x)\right)^{n} \tag{9-10}
\end{equation*}
$$

provided the indicated limit of $f(x)$ exists. It also follows that constants can be moved through the limit symbols for limits at infinity:

$$
\begin{equation*}
\lim _{x \rightarrow+\infty} k f(x)=k \lim _{x \rightarrow+\infty} f(x) \quad \lim _{x \rightarrow-\infty} k f(x)=k \lim _{x \rightarrow-\infty} f(x) \tag{11-12}
\end{equation*}
$$

provided the indicated limit of $f(x)$ exists.
Finally, if $f(x)=k$ is a constant function, then the values of $f$ do not change as $x \rightarrow+\infty$ or as $x \rightarrow-\infty$, so

$$
\begin{equation*}
\lim _{x \rightarrow+\infty} k=k \quad \lim _{x \rightarrow-\infty} k=k \tag{13-14}
\end{equation*}
$$

## Example 4

(a) It follows from (1), (2), (9), and (10) that if $n$ is a positive integer, then

$$
\lim _{x \rightarrow+\infty} \frac{1}{x^{n}}=\left(\lim _{x \rightarrow+\infty} \frac{1}{x}\right)^{n}=0 \quad \text { and } \quad \lim _{x \rightarrow-\infty} \frac{1}{x^{n}}=\left(\lim _{x \rightarrow-\infty} \frac{1}{x}\right)^{n}=0
$$

(b) It follows from (7) and the extension of Theorem 1.2.2(e) to the case $x \rightarrow+\infty$ that

$$
\begin{aligned}
\lim _{x \rightarrow+\infty}\left(1+\frac{1}{2 x}\right)^{x} & =\lim _{x \rightarrow+\infty}\left[\left(1+\frac{1}{2 x}\right)^{2 x}\right]^{1 / 2} \\
& =\left[\lim _{x \rightarrow+\infty}\left(1+\frac{1}{2 x}\right)^{2 x}\right]^{1 / 2}=e^{1 / 2}=\sqrt{e}
\end{aligned}
$$

## INFINITE LIMITS AT INFINITY

Limits at infinity, like limits at a real number $a$, can fail to exist for various reasons. One such possibility is that the values of $f(x)$ increase or decrease without bound as $x \rightarrow+\infty$ or as $x \rightarrow-\infty$. We will use the following notation to describe this situation.
1.3.2 INFINITE LIMITS AT INFINITY (AN INFORMAL VIEW) If the values of $f(x)$ increase without bound as $x \rightarrow+\infty$ or as $x \rightarrow-\infty$, then we write

$$
\lim _{x \rightarrow+\infty} f(x)=+\infty \quad \text { or } \quad \lim _{x \rightarrow-\infty} f(x)=+\infty
$$

as appropriate; and if the values of $f(x)$ decrease without bound as $x \rightarrow+\infty$ or as $x \rightarrow-\infty$, then we write

$$
\lim _{x \rightarrow+\infty} f(x)=-\infty \quad \text { or } \quad \lim _{x \rightarrow-\infty} f(x)=-\infty
$$

as appropriate.

## LIMITS OF $\boldsymbol{x}^{\boldsymbol{n}}$ AS $\boldsymbol{x} \rightarrow \pm \infty$

Figure 1.3.5 illustrates the end behavior of the polynomials $x^{n}$ for $n=1,2,3$, and 4 . These are special cases of the following general results:

$$
\begin{equation*}
\lim _{x \rightarrow+\infty} x^{n}=+\infty, \quad n=1,2,3, \ldots \tag{15-16}
\end{equation*}
$$

$$
\lim _{x \rightarrow-\infty} x^{n}= \begin{cases}-\infty, & n=1,3,5, \ldots \\ +\infty, & n=2,4,6, \ldots\end{cases}
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-025.jpg?height=629&width=1415&top_left_y=1077&top_left_x=554)
△ Figure 1.3.5

Multiplying $x^{n}$ by a positive real number does not affect limits (15) and (16), but multiplying by a negative real number reverses the sign.

## Example 5

$$
\begin{array}{ll}
\lim _{x \rightarrow+\infty} 2 x^{5}=+\infty, & \lim _{x \rightarrow-\infty} 2 x^{5}=-\infty \\
\lim _{x \rightarrow+\infty}-7 x^{6}=-\infty, & \lim _{x \rightarrow-\infty}-7 x^{6}=-\infty
\end{array}
$$

## - LIMITS OF POLYNOMIALS AS $\boldsymbol{x} \rightarrow \pm \infty$

There is a useful principle about polynomials which, expressed informally, states:

The end behavior of a polynomial matches the end behavior of its highest degree term.

More precisely, if $c_{n} \neq 0$, then

$$
\begin{align*}
\lim _{x \rightarrow-\infty}\left(c_{0}+c_{1} x+\cdots+c_{n} x^{n}\right) & =\lim _{x \rightarrow-\infty} c_{n} x^{n}  \tag{17}\\
\lim _{x \rightarrow+\infty}\left(c_{0}+c_{1} x+\cdots+c_{n} x^{n}\right) & =\lim _{x \rightarrow+\infty} c_{n} x^{n} \tag{18}
\end{align*}
$$

We can motivate these results by factoring out the highest power of $x$ from the polynomial and examining the limit of the factored expression. Thus,

$$
c_{0}+c_{1} x+\cdots+c_{n} x^{n}=x^{n}\left(\frac{c_{0}}{x^{n}}+\frac{c_{1}}{x^{n-1}}+\cdots+c_{n}\right)
$$

As $x \rightarrow-\infty$ or $x \rightarrow+\infty$, it follows from Example 4(a) that all of the terms with positive powers of $x$ in the denominator approach 0 , so (17) and (18) are certainly plausible.

## Example 6

$$
\begin{aligned}
& \lim _{x \rightarrow-\infty}\left(7 x^{5}-4 x^{3}+2 x-9\right)=\lim _{x \rightarrow-\infty} 7 x^{5}=-\infty \\
& \lim _{x \rightarrow-\infty}\left(-4 x^{8}+17 x^{3}-5 x+1\right)=\lim _{x \rightarrow-\infty}-4 x^{8}=-\infty
\end{aligned}
$$

## LIMITS OF RATIONAL FUNCTIONS AS $\boldsymbol{x} \rightarrow \pm \infty$

One technique for determining the end behavior of a rational function is to divide each term in the numerator and denominator by the highest power of $x$ that occurs in the denominator, after which the limiting behavior can be determined using results we have already established. Here are some examples.

Example 7 Find $\lim _{x \rightarrow+\infty} \frac{3 x+5}{6 x-8}$.
Solution. Divide each term in the numerator and denominator by the highest power of $x$ that occurs in the denominator, namely, $x^{1}=x$. We obtain

$$
\begin{aligned}
& \lim _{x \rightarrow+\infty} \frac{3 x+5}{6 x-8}=\lim _{x \rightarrow+\infty} \frac{3+\frac{5}{x}}{6-\frac{8}{x}} \\
&=\frac{\lim _{x \rightarrow+\infty}\left(3+\frac{5}{x}\right)}{\lim _{x \rightarrow+\infty}\left(6-\frac{8}{x}\right)} \quad \text { Divide each term by } x . \\
&=\frac{\lim _{x \rightarrow+\infty} 3+\lim _{x \rightarrow+\infty} \frac{5}{x}}{\lim _{x \rightarrow+\infty} 6-\lim _{x \rightarrow+\infty} \frac{8}{x}} \quad \text { quotient of the limits. } \\
&=\frac{\begin{array}{l}
\text { Limit of a sum is the } \\
\text { sum of the limits. }
\end{array}}{3+5 \lim _{x \rightarrow+\infty} \frac{1}{x}}=\frac{3+0}{6-8 \lim _{x \rightarrow+\infty} \frac{1}{x}}=\frac{1}{2} \quad \text { A constant can be moved through a } \\
& \text { limit symbol; Formulas (2) and (13). }
\end{aligned}
$$

Example 8 Find
(a) $\lim _{x \rightarrow-\infty} \frac{4 x^{2}-x}{2 x^{3}-5}$
(b) $\lim _{x \rightarrow+\infty} \frac{5 x^{3}-2 x^{2}+1}{1-3 x}$

Solution (a). Divide each term in the numerator and denominator by the highest power of $x$ that occurs in the denominator, namely, $x^{3}$. We obtain

$$
\begin{aligned}
\lim _{x \rightarrow-\infty} \frac{4 x^{2}-x}{2 x^{3}-5} & =\lim _{x \rightarrow-\infty} \frac{\frac{4}{x}-\frac{1}{x^{2}}}{2-\frac{5}{x^{3}}} \\
& =\frac{\lim _{x \rightarrow-\infty}\left(\frac{4}{x}-\frac{1}{x^{2}}\right)}{\lim _{x \rightarrow-\infty}\left(2-\frac{5}{x^{3}}\right)} \quad \text { Divide each term by } x^{3} . \\
& =\frac{}{\lim _{x \rightarrow-\infty} \frac{4}{x}-\lim _{x \rightarrow-\infty} \frac{1}{x^{2}}} \quad \begin{array}{l}
\text { Limit of a quotient is the } \\
\text { quotient of the limits. }
\end{array} \\
& \quad \lim _{x \rightarrow-\infty} 2-\lim _{x \rightarrow-\infty} \frac{5}{x^{3}} \\
& =\frac{4 \lim _{x \rightarrow-\infty} \frac{1}{x}-\lim _{x \rightarrow-\infty} \frac{1}{x^{2}}}{2-5 \lim _{x \rightarrow-\infty} \frac{1}{x^{3}}}=\frac{0-0}{2-0}=0 \quad \begin{array}{l}
\text { A constant a difference is the be moved through } \\
\text { a limit symbol; Formula (14) and } \\
\text { Example 4. }
\end{array}
\end{aligned}
$$

Solution (b). Divide each term in the numerator and denominator by the highest power of $x$ that occurs in the denominator, namely, $x^{1}=x$. We obtain

$$
\begin{equation*}
\lim _{x \rightarrow+\infty} \frac{5 x^{3}-2 x^{2}+1}{1-3 x}=\lim _{x \rightarrow+\infty} \frac{5 x^{2}-2 x+\frac{1}{x}}{\frac{1}{x}-3} \tag{19}
\end{equation*}
$$

In this case we cannot argue that the limit of the quotient is the quotient of the limits because the limit of the numerator does not exist. However, we have

$$
\lim _{x \rightarrow+\infty} 5 x^{2}-2 x=+\infty, \quad \lim _{x \rightarrow+\infty} \frac{1}{x}=0, \quad \lim _{x \rightarrow+\infty}\left(\frac{1}{x}-3\right)=-3
$$

Thus, the numerator on the right side of (19) approaches $+\infty$ and the denominator has a finite negative limit. We conclude from this that the quotient approaches $-\infty$; that is,

$$
\lim _{x \rightarrow+\infty} \frac{5 x^{3}-2 x^{2}+1}{1-3 x}=\lim _{x \rightarrow+\infty} \frac{5 x^{2}-2 x+\frac{1}{x}}{\frac{1}{x}-3}=-\infty
$$

## A QUICK METHOD FOR FINDING LIMITS OF RATIONAL FUNCTIONS AS $\boldsymbol{x} \rightarrow+\infty$ OR $\boldsymbol{x} \rightarrow-\infty$

Since the end behavior of a polynomial matches the end behavior of its highest degree term, one can reasonably conclude:

The end behavior of a rational function matches the end behavior of the quotient of the highest degree term in the numerator divided by the highest degree term in the denominator.

## Example 9 Use the preceding observation to compute the limits in Examples 7 and 8.

## Solution.

$$
\begin{aligned}
& \lim _{x \rightarrow+\infty} \frac{3 x+5}{6 x-8}=\lim _{x \rightarrow+\infty} \frac{3 x}{6 x}=\lim _{x \rightarrow+\infty} \frac{1}{2}=\frac{1}{2} \\
& \lim _{x \rightarrow-\infty} \frac{4 x^{2}-x}{2 x^{3}-5}=\lim _{x \rightarrow-\infty} \frac{4 x^{2}}{2 x^{3}}=\lim _{x \rightarrow-\infty} \frac{2}{x}=0 \\
& \lim _{x \rightarrow+\infty} \frac{5 x^{3}-2 x^{2}+1}{1-3 x}=\lim _{x \rightarrow+\infty} \frac{5 x^{3}}{(-3 x)}=\lim _{x \rightarrow+\infty}\left(-\frac{5}{3} x^{2}\right)=-\infty
\end{aligned}
$$

## LIMITS INVOLVING RADICALS

## Example 10 Find

(a) $\lim _{x \rightarrow+\infty} \frac{\sqrt{x^{2}+2}}{3 x-6}$
(b) $\lim _{x \rightarrow-\infty} \frac{\sqrt{x^{2}+2}}{3 x-6}$

In both parts it would be helpful to manipulate the function so that the powers of $x$ are transformed to powers of $1 / x$. This can be achieved in both cases by dividing the numerator and denominator by $|x|$ and using the fact that $\sqrt{x^{2}}=|x|$.
Solution (a). As $x \rightarrow+\infty$, the values of $x$ under consideration are positive, so we can replace $|x|$ by $x$ where helpful. We obtain

$$
\begin{aligned}
\lim _{x \rightarrow+\infty} \frac{\sqrt{x^{2}+2}}{3 x-6} & =\lim _{x \rightarrow+\infty} \frac{\frac{\sqrt{x^{2}+2}}{|x|}}{\frac{3 x-6}{|x|}}=\lim _{x \rightarrow+\infty} \frac{\frac{\sqrt{x^{2}+2}}{\sqrt{x^{2}}}}{\frac{3 x-6}{x}} \\
& =\lim _{x \rightarrow+\infty} \frac{\sqrt{1+\frac{2}{x^{2}}}}{3-\frac{6}{x}}=\frac{\lim _{x \rightarrow+\infty} \sqrt{1+\frac{2}{x^{2}}}}{\lim _{x \rightarrow+\infty}\left(3-\frac{6}{x}\right)} \\
& =\frac{\sqrt{\lim _{x \rightarrow+\infty}\left(1+\frac{2}{x^{2}}\right)}}{\lim _{x \rightarrow+\infty}\left(3-\frac{6}{x}\right)}=\frac{\sqrt{\left(\lim _{x \rightarrow+\infty} 1\right)+\left(2 \lim _{x \rightarrow+\infty} \frac{1}{x^{2}}\right)}}{\left(\lim _{x \rightarrow+\infty} 3\right)-\left(6 \lim _{x \rightarrow+\infty} \frac{1}{x}\right)} \\
& =\frac{\sqrt{1+(2 \cdot 0)}}{3-(6 \cdot 0)}=\frac{1}{3}
\end{aligned}
$$

## TECHNOLOGY MASTERY

It follows from Example 10 that the function

$$
f(x)=\frac{\sqrt{x^{2}+2}}{3 x-6}
$$

has an asymptote of $y=\frac{1}{3}$ in the positive direction and an asymptote of $y=-\frac{1}{3}$ in the negative direction. Confirm this using a graphing utility.

Solution (b). As $x \rightarrow-\infty$, the values of $x$ under consideration are negative, so we can replace $|x|$ by $-x$ where helpful. We obtain

$$
\begin{aligned}
\lim _{x \rightarrow-\infty} \frac{\sqrt{x^{2}+2}}{3 x-6} & =\lim _{x \rightarrow-\infty} \frac{\frac{\sqrt{x^{2}+2}}{|x|}}{\frac{3 x-6}{|x|}}=\lim _{x \rightarrow-\infty} \frac{\frac{\sqrt{x^{2}+2}}{\sqrt{x^{2}}}}{\frac{3 x-6}{(-x)}} \\
& =\lim _{x \rightarrow-\infty} \frac{\sqrt{1+\frac{2}{x^{2}}}}{-3+\frac{6}{x}}=-\frac{1}{3}
\end{aligned}
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-029.jpg?height=1152&width=475&top_left_y=192&top_left_x=210)
Figure 1.3.6

We noted in Section 1.1 that the standard rules of algebra do not apply to the symbols $+\infty$ and $-\infty$. Part (b) of Example 11 illustrates this. The terms $\sqrt{x^{6}+5 x^{3}}$ and $x^{3}$ both approach $+\infty$ as $x \rightarrow+\infty$, but their difference does not approach 0 .

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-029.jpg?height=243&width=459&top_left_y=1794&top_left_x=216)
Figure 1.3.7

$$
\begin{aligned}
& \text { There is no limit as } \\
& x \rightarrow+\infty \text { or } x \rightarrow-\infty \text {. }
\end{aligned}
$$

Example 11 Find
(a) $\lim _{x \rightarrow+\infty}\left(\sqrt{x^{6}+5}-x^{3}\right)$
(b) $\lim _{x \rightarrow+\infty}\left(\sqrt{x^{6}+5 x^{3}}-x^{3}\right)$

Solution. Graphs of the functions $f(x)=\sqrt{x^{6}+5}-x^{3}$, and $g(x)=\sqrt{x^{6}+5 x^{3}}-x^{3}$ for $x \geq 0$, are shown in Figure 1.3.6. From the graphs we might conjecture that the requested limits are 0 and $\frac{5}{2}$, respectively. To confirm this, we treat each function as a fraction with a denominator of 1 and rationalize the numerator.

$$
\begin{aligned}
\lim _{x \rightarrow+\infty}\left(\sqrt{x^{6}+5}-x^{3}\right) & =\lim _{x \rightarrow+\infty}\left(\sqrt{x^{6}+5}-x^{3}\right)\left(\frac{\sqrt{x^{6}+5}+x^{3}}{\sqrt{x^{6}+5}+x^{3}}\right) \\
& =\lim _{x \rightarrow+\infty} \frac{\left(x^{6}+5\right)-x^{6}}{\sqrt{x^{6}+5}+x^{3}}=\lim _{x \rightarrow+\infty} \frac{5}{\sqrt{x^{6}+5}+x^{3}} \\
& =\lim _{x \rightarrow+\infty} \frac{\frac{5}{x^{3}}}{\sqrt{1+\frac{5}{x^{6}}}+1} \\
& =\frac{0}{\sqrt{1+0}+1}=0 \\
\lim _{x \rightarrow+\infty}\left(\sqrt{x^{6}+5 x^{3}}-x^{3}\right) & =\lim _{x \rightarrow+\infty}\left(\sqrt{x^{6}+5 x^{3}}-x^{3}\right) \\
& \left.=\lim _{x \rightarrow+\infty} \frac{\left(x^{6}+5 x^{3}\right)-x^{6}}{\sqrt{x^{6}+5 x^{3}}+x^{3}}=\lim _{x \rightarrow+\infty} \frac{5 x^{3}}{\sqrt{x^{6}+5 x^{3}}+x^{3}}\right) \\
& =\lim _{x \rightarrow+\infty} \frac{5}{\sqrt{1+\frac{5}{x^{3}}}+1} \quad \sqrt{\sqrt{x^{6}}=x^{3} \text { for } x>0} \\
& =\frac{5}{\sqrt{1+0}+1}=\frac{5}{2}
\end{aligned}
$$

## END BEHAVIOR OF TRIGONOMETRIC, EXPONENTIAL, AND LOGARITHMIC FUNCTIONS

Consider the function $f(x)=\sin x$ that is graphed in Figure 1.3.7. For this function the limits as $x \rightarrow+\infty$ and as $x \rightarrow-\infty$ fail to exist not because $f(x)$ increases or decreases without bound, but rather because the values vary between -1 and 1 without approaching some specific real number. In general, the trigonometric functions fail to have limits as $x \rightarrow+\infty$ and as $x \rightarrow-\infty$ because of periodicity. There is no specific notation to denote this kind of behavior.

In Section 0.5 we showed that the functions $e^{x}$ and $\ln x$ both increase without bound as $x \rightarrow+\infty$ (Figures 0.5.8 and 0.5.9). Thus, in limit notation we have

$$
\begin{equation*}
\lim _{x \rightarrow+\infty} \ln x=+\infty \quad \lim _{x \rightarrow+\infty} e^{x}=+\infty \tag{20-21}
\end{equation*}
$$

For reference, we also list the following limits, which are consistent with the graphs in Figure 1.3.8:

$$
\begin{equation*}
\lim _{x \rightarrow-\infty} e^{x}=0 \quad \lim _{x \rightarrow 0^{+}} \ln x=-\infty \tag{22-23}
\end{equation*}
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-030.jpg?height=463&width=472&top_left_y=196&top_left_x=760)
- Figure 1.3.8

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-030.jpg?height=463&width=464&top_left_y=196&top_left_x=1337)
△ Figure 1.3.9

Finally, the following limits can be deduced by noting that the graph of $y=e^{-x}$ is the reflection about the $y$-axis of the graph of $y=e^{x}$ (Figure 1.3.9).

$$
\begin{equation*}
\lim _{x \rightarrow+\infty} e^{-x}=0 \quad \lim _{x \rightarrow-\infty} e^{-x}=+\infty \tag{24-25}
\end{equation*}
$$

## QUICK CHECK EXERCISES 1.3 (See page 100 for answers.)

1. Find the limits.
(a) $\lim _{x \rightarrow-\infty}(3-x)=$ $\_\_\_\_$
(b) $\lim _{x \rightarrow+\infty}\left(5-\frac{1}{x}\right)=$ $\_\_\_\_$
(c) $\lim _{x \rightarrow+\infty} \ln \left(\frac{1}{x}\right)=$ $\_\_\_\_$
(d) $\lim _{x \rightarrow+\infty} \frac{1}{e^{x}}=$ $\_\_\_\_$
2. Find the limits that exist.
(a) $\lim _{x \rightarrow-\infty} \frac{2 x^{2}+x}{4 x^{2}-3}=$ $\_\_\_\_$
(b) $\lim _{x \rightarrow+\infty} \frac{1}{2+\sin x}=$ $\_\_\_\_$
(c) $\lim _{x \rightarrow+\infty}\left(1+\frac{1}{x}\right)^{x}=$ $\_\_\_\_$
3. Given that

$$
\lim _{x \rightarrow+\infty} f(x)=2 \quad \text { and } \quad \lim _{x \rightarrow+\infty} g(x)=-3
$$

find the limits that exist.
(a) $\lim _{x \rightarrow+\infty}[3 f(x)-g(x)]=$ $\_\_\_\_$
(b) $\lim _{x \rightarrow+\infty} \frac{f(x)}{g(x)}=$ $\_\_\_\_$
(c) $\lim _{x \rightarrow+\infty} \frac{2 f(x)+3 g(x)}{3 f(x)+2 g(x)}=$ $\_\_\_\_$
(d) $\lim _{x \rightarrow+\infty} \sqrt{10-f(x) g(x)}=$ $\_\_\_\_$
4. Consider the graphs of $1 / x, \sin x, \ln x, e^{x}$, and $e^{-x}$. Which of these graphs has a horizontal asymptote?

## EXERCISE SET 1.3 Graphing Utility

1-4 In these exercises, make reasonable assumptions about the end behavior of the indicated function.

1. For the function $g$ graphed in the accompanying figure, find
(a) $\lim _{x \rightarrow-\infty} g(x)$
(b) $\lim _{x \rightarrow+\infty} g(x)$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-030.jpg?height=365&width=359&top_left_y=2052&top_left_x=216)
Figure Ex-1

2. For the function $\phi$ graphed in the accompanying figure, find
(a) $\lim _{x \rightarrow-\infty} \phi(x)$
(b) $\lim _{x \rightarrow+\infty} \phi(x)$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-030.jpg?height=335&width=539&top_left_y=2066&top_left_x=1129)
\& Figure Ex-2

3. For the function $\phi$ graphed in the accompanying figure, find
(a) $\lim _{x \rightarrow-\infty} \phi(x)$
(b) $\lim _{x \rightarrow+\infty} \phi(x)$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-031.jpg?height=293&width=539&top_left_y=326&top_left_x=272)
Figure Ex-3

4. For the function $G$ graphed in the accompanying figure, find
(a) $\lim _{x \rightarrow-\infty} G(x)$
(b) $\lim _{x \rightarrow+\infty} G(x)$.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-031.jpg?height=244&width=543&top_left_y=788&top_left_x=268)

Figure Ex-4
5. Given that

$$
\lim _{x \rightarrow+\infty} f(x)=3, \quad \lim _{x \rightarrow+\infty} g(x)=-5, \quad \lim _{x \rightarrow+\infty} h(x)=0
$$

find the limits that exist. If the limit does not exist, explain why.
(a) $\lim _{x \rightarrow+\infty}[f(x)+3 g(x)]$
(b) $\lim _{x \rightarrow+\infty}[h(x)-4 g(x)+1]$
(c) $\lim _{x \rightarrow+\infty}[f(x) g(x)]$
(d) $\lim _{x \rightarrow+\infty}[g(x)]^{2}$
(e) $\lim _{x \rightarrow+\infty} \sqrt[3]{5+f(x)}$
(f) $\lim _{x \rightarrow+\infty} \frac{3}{g(x)}$
(g) $\lim _{x \rightarrow+\infty} \frac{3 h(x)+4}{x^{2}}$
(h) $\lim _{x \rightarrow+\infty} \frac{6 f(x)}{5 f(x)+3 g(x)}$
6. Given that

$$
\lim _{x \rightarrow-\infty} f(x)=7 \quad \text { and } \quad \lim _{x \rightarrow-\infty} g(x)=-6
$$

find the limits that exist. If the limit does not exist, explain why.
(a) $\lim _{x \rightarrow-\infty}[2 f(x)-g(x)]$
(b) $\lim _{x \rightarrow-\infty}[6 f(x)+7 g(x)]$
(c) $\lim _{x \rightarrow-\infty}\left[x^{2}+g(x)\right]$
(d) $\lim _{x \rightarrow-\infty}\left[x^{2} g(x)\right]$
(e) $\lim _{x \rightarrow-\infty} \sqrt[3]{f(x) g(x)}$
(f) $\lim _{x \rightarrow-\infty} \frac{g(x)}{f(x)}$
(g) $\lim _{x \rightarrow-\infty}\left[f(x)+\frac{g(x)}{x}\right]$
(h) $\lim _{x \rightarrow-\infty} \frac{x f(x)}{(2 x+3) g(x)}$
7. (a) Complete the table and make a guess about the limit indicated.

$$
f(x)=\tan ^{-1}\left(\frac{1}{x}\right) \quad \lim _{x \rightarrow 0^{+}} f(x)
$$

| $x$ | 0.1 | 0.01 | 0.001 | 0.0001 | 0.00001 | 0.000001 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| $f(x)$ |  |  |  |  |  |  |

(b) Use Figure 1.3.3 to find the exact value of the limit in part (a).
8. Complete the table and make a guess about the limit indicated.

$$
f(x)=x^{1 / x} \quad \lim _{x \rightarrow+\infty} f(x)
$$

| $x$ | 10 | 100 | 1000 | 10,000 | 100,000 | $1,000,000$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| $f(x)$ |  |  |  |  |  |  |

9-40 Find the limits. $\square$
9. $\lim _{x \rightarrow+\infty}\left(1+2 x-3 x^{5}\right)$
10. $\lim _{x \rightarrow+\infty}\left(2 x^{3}-100 x+5\right)$
11. $\lim _{x \rightarrow+\infty} \sqrt{x}$
12. $\lim _{x \rightarrow-\infty} \sqrt{5-x}$
13. $\lim _{x \rightarrow+\infty} \frac{3 x+1}{2 x-5}$
14. $\lim _{x \rightarrow+\infty} \frac{5 x^{2}-4 x}{2 x^{2}+3}$
15. $\lim _{y \rightarrow-\infty} \frac{3}{y+4}$
16. $\lim _{x \rightarrow+\infty} \frac{1}{x-12}$
17. $\lim _{x \rightarrow-\infty} \frac{x-2}{x^{2}+2 x+1}$
18. $\lim _{x \rightarrow+\infty} \frac{5 x^{2}+7}{3 x^{2}-x}$
19. $\lim _{x \rightarrow+\infty} \frac{7-6 x^{5}}{x+3}$
20. $\lim _{t \rightarrow-\infty} \frac{5-2 t^{3}}{t^{2}+1}$
21. $\lim _{t \rightarrow+\infty} \frac{6-t^{3}}{7 t^{3}+3}$
22. $\lim _{x \rightarrow-\infty} \frac{x+4 x^{3}}{1-x^{2}+7 x^{3}}$
23. $\lim _{x \rightarrow+\infty} \sqrt[3]{\frac{2+3 x-5 x^{2}}{1+8 x^{2}}}$
24. $\lim _{s \rightarrow+\infty} \sqrt[3]{\frac{3 s^{7}-4 s^{5}}{2 s^{7}+1}}$
25. $\lim _{x \rightarrow-\infty} \frac{\sqrt{5 x^{2}-2}}{x+3}$
26. $\lim _{x \rightarrow+\infty} \frac{\sqrt{5 x^{2}-2}}{x+3}$
27. $\lim _{y \rightarrow-\infty} \frac{2-y}{\sqrt{7+6 y^{2}}}$
28. $\lim _{y \rightarrow+\infty} \frac{2-y}{\sqrt{7+6 y^{2}}}$
29. $\lim _{x \rightarrow-\infty} \frac{\sqrt{3 x^{4}+x}}{x^{2}-8}$
30. $\lim _{x \rightarrow+\infty} \frac{\sqrt{3 x^{4}+x}}{x^{2}-8}$
31. $\lim _{x \rightarrow+\infty}\left(\sqrt{x^{2}+3}-x\right)$
32. $\lim _{x \rightarrow+\infty}\left(\sqrt{x^{2}-3 x}-x\right)$
33. $\lim _{x \rightarrow-\infty} \frac{1-e^{x}}{1+e^{x}}$
34. $\lim _{x \rightarrow+\infty} \frac{1-e^{x}}{1+e^{x}}$
35. $\lim _{x \rightarrow+\infty} \frac{e^{x}+e^{-x}}{e^{x}-e^{-x}}$
36. $\lim _{x \rightarrow-\infty} \frac{e^{x}+e^{-x}}{e^{x}-e^{-x}}$
37. $\lim _{x \rightarrow+\infty} \ln \left(\frac{2}{x^{2}}\right)$
38. $\lim _{x \rightarrow 0^{+}} \ln \left(\frac{2}{x^{2}}\right)$
39. $\lim _{x \rightarrow+\infty} \frac{(x+1)^{x}}{x^{x}}$
40. $\lim _{x \rightarrow+\infty}\left(1+\frac{1}{x}\right)^{-x}$

41-44 True-False Determine whether the statement is true or false. Explain your answer.
41. We have $\lim _{x \rightarrow+\infty}\left(1+\frac{1}{x}\right)^{2 x}=(1+0)^{+\infty}=1^{+\infty}=1$.
42. If $y=L$ is a horizontal asymptote for the curve $y=f(x)$, then

$$
\lim _{x \rightarrow-\infty} f(x)=L \quad \text { and } \quad \lim _{x \rightarrow+\infty} f(x)=L
$$

43. If $y=L$ is a horizontal asymptote for the curve $y=f(x)$, then it is possible for the graph of $f$ to intersect the line $y=L$ infinitely many times.
44. If a rational function $p(x) / q(x)$ has a horizontal asymptote, then the degree of $p(x)$ must equal the degree of $q(x)$.

## FOCUS ON CONCEPTS

45. Assume that a particle is accelerated by a constant force. The two curves $v=n(t)$ and $v=e(t)$ in the accompanying figure provide velocity versus time curves for the particle as predicted by classical physics and by the special theory of relativity, respectively. The parameter $c$ represents the speed of light. Using the language of limits, describe the differences in the long-term predictions of the two theories.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-032.jpg?height=325&width=451&top_left_y=1047&top_left_x=236)
Figure Ex-45

46. Let $T=f(t)$ denote the temperature of a baked potato $t$ minutes after it has been removed from a hot oven. The accompanying figure shows the temperature versus time curve for the potato, where $r$ is the temperature of the room.
(a) What is the physical significance of $\lim _{t \rightarrow 0^{+}} f(t)$ ?
(b) What is the physical significance of $\lim _{t \rightarrow+\infty} f(t)$ ?

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-032.jpg?height=328&width=473&top_left_y=1699&top_left_x=236)
Figure Ex-46

47. Let

$$
f(x)= \begin{cases}2 x^{2}+5, & x<0 \\ \frac{3-5 x^{3}}{1+4 x+x^{3}}, & x \geq 0\end{cases}
$$

Find
(a) $\lim _{x \rightarrow-\infty} f(x)$
(b) $\lim _{x \rightarrow+\infty} f(x)$.
48. Let

$$
g(t)= \begin{cases}\frac{2+3 t}{5 t^{2}+6}, & t<1,000,000 \\ \frac{\sqrt{36 t^{2}-100}}{5-t}, & t>1,000,000\end{cases}
$$

Find
(a) $\lim _{t \rightarrow-\infty} g(t)$
(b) $\lim _{t \rightarrow+\infty} g(t)$.
49. Discuss the limits of $p(x)=(1-x)^{n}$ as $x \rightarrow+\infty$ and $x \rightarrow-\infty$ for positive integer values of $n$.
50. In each part, find examples of polynomials $p(x)$ and $q(x)$ that satisfy the stated condition and such that $p(x) \rightarrow+\infty$ and $q(x) \rightarrow+\infty$ as $x \rightarrow+\infty$.
(a) $\lim _{x \rightarrow+\infty} \frac{p(x)}{q(x)}=1$
(b) $\lim _{x \rightarrow+\infty} \frac{p(x)}{q(x)}=0$
(c) $\lim _{x \rightarrow+\infty} \frac{p(x)}{q(x)}=+\infty$
(d) $\lim _{x \rightarrow+\infty}[p(x)-q(x)]=3$
51. (a) Do any of the trigonometric functions $\sin x, \cos x, \tan x$, $\cot x, \sec x$, and $\csc x$ have horizontal asymptotes?
(b) Do any of the trigonometric functions have vertical asymptotes? Where?
52. Find

$$
\lim _{x \rightarrow+\infty} \frac{c_{0}+c_{1} x+\cdots+c_{n} x^{n}}{d_{0}+d_{1} x+\cdots+d_{m} x^{m}}
$$

where $c_{n} \neq 0$ and $d_{m} \neq 0$. [Hint: Your answer will depend on whether $m<n, m=n$, or $m>n$.]

## FOCUS ON CONCEPTS

53-54 These exercises develop some versions of the substitution principle, a useful tool for the evaluation of limits.
53. (a) Explain why we can evaluate $\lim _{x \rightarrow+\infty} e^{x^{2}}$ by making the substitution $t=x^{2}$ and writing

$$
\lim _{x \rightarrow+\infty} e^{x^{2}}=\lim _{t \rightarrow+\infty} e^{t}=+\infty
$$

(b) Suppose $g(x) \rightarrow+\infty$ as $x \rightarrow+\infty$. Given any function $f(x)$, explain why we can evaluate $\lim _{x \rightarrow+\infty} f[g(x)]$ by substituting $t=g(x)$ and writing

$$
\lim _{x \rightarrow+\infty} f[g(x)]=\lim _{t \rightarrow+\infty} f(t)
$$

(Here, "equality" is interpreted to mean that either both limits exist and are equal or that both limits fail to exist.)
(c) Why does the result in part (b) remain valid if $\lim _{x \rightarrow+\infty}$ is replaced everywhere by one of $\lim _{x \rightarrow-\infty}, \lim _{x \rightarrow c}, \lim _{x \rightarrow c^{-}}$, or $\lim _{x \rightarrow c^{+}}$?
54. (a) Explain why we can evaluate $\lim _{x \rightarrow+\infty} e^{-x^{2}}$ by making the substitution $t=-x^{2}$ and writing

$$
\lim _{x \rightarrow+\infty} e^{-x^{2}}=\lim _{t \rightarrow-\infty} e^{t}=0
$$

(cont.)
(b) Suppose $g(x) \rightarrow-\infty$ as $x \rightarrow+\infty$. Given any function $f(x)$, explain why we can evaluate $\lim _{x \rightarrow+\infty} f[g(x)]$ by substituting $t=g(x)$ and writing

$$
\lim _{x \rightarrow+\infty} f[g(x)]=\lim _{t \rightarrow-\infty} f(t)
$$

(Here, "equality" is interpreted to mean that either both limits exist and are equal or that both limits fail to exist.)
(c) Why does the result in part (b) remain valid if $\lim _{x \rightarrow+\infty}$ is replaced everywhere by one of $\lim _{x \rightarrow-\infty}, \lim _{x \rightarrow c}, \lim _{x \rightarrow c^{-}}$, or $\lim _{x \rightarrow c^{+}}$?

55-62 Evaluate the limit using an appropriate substitution.
55. $\lim _{x \rightarrow 0^{+}} e^{1 / x}$
56. $\lim _{x \rightarrow 0^{-}} e^{1 / x}$
57. $\lim _{x \rightarrow 0^{+}} e^{\csc x}$
58. $\lim _{x \rightarrow 0^{-}} e^{\csc x}$
59. $\lim _{x \rightarrow+\infty} \frac{\ln 2 x}{\ln 3 x}$ [Hint: $t=\ln x$ ]
60. $\lim _{x \rightarrow+\infty}\left[\ln \left(x^{2}-1\right)-\ln (x+1)\right][$ Hint: $t=x-1]$
61. $\lim _{x \rightarrow+\infty}\left(1-\frac{1}{x}\right)^{-x}[$ Hint: $t=-x]$
62. $\lim _{x \rightarrow+\infty}\left(1+\frac{2}{x}\right)^{x}$ [Hint: $t=x / 2$ ]
63. Let $f(x)=b^{x}$, where $0<b$. Use the substitution principle to verify the asymptotic behavior of $f$ that is illustrated in Figure 0.5.1. [Hint: $f(x)=b^{x}=\left(e^{\ln b}\right)^{x}=e^{(\ln b) x}$ ]
64. Prove that $\lim _{x \rightarrow 0}(1+x)^{1 / x}=e$ by completing parts (a) and (b).
(a) Use Equation (7) and the substitution $t=1 / x$ to prove that $\lim _{x \rightarrow 0^{+}}(1+x)^{1 / x}=e$.
(b) Use Equation (8) and the substitution $t=1 / x$ to prove that $\lim _{x \rightarrow 0^{-}}(1+x)^{1 / x}=e$.
65. Suppose that the speed $v$ (in $\mathrm{ft} / \mathrm{s}$ ) of a skydiver $t$ seconds after leaping from a plane is given by the equation $v=190\left(1-e^{-0.168 t}\right)$.
(a) Graph $v$ versus $t$.
(b) By evaluating an appropriate limit, show that the graph of $v$ versus $t$ has a horizontal asymptote $v=c$ for an appropriate constant $c$.
(c) What is the physical significance of the constant $c$ in part (b)?
66. The population $p$ of the United States (in millions) in year $t$ may be modeled by the function

$$
p=\frac{50371.7}{151.3+181.626 e^{-0.031636(t-1950)}}
$$

(a) Based on this model, what was the U.S. population in 1950?
(b) Plot $p$ versus $t$ for the 200-year period from 1950 to 2150 .
(c) By evaluating an appropriate limit, show that the graph of $p$ versus $t$ has a horizontal asymptote $p=c$ for an appropriate constant $c$.
(d) What is the significance of the constant $c$ in part (b) for population predicted by this model?
67. (a) Compute the (approximate) values of the terms in the sequence

$$
\begin{aligned}
& 1.01^{101}, 1.001^{1001}, 1.0001^{10001}, 1.00001^{100001} \\
& 1.000001^{1000001}, 1.0000001^{10000001} \ldots
\end{aligned}
$$

What number do these terms appear to be approaching?
(b) Use Equation (7) to verify your answer in part (a).
(c) Let $1 \leq a \leq 9$ denote a positive integer. What number is approached more and more closely by the terms in the following sequence?

$$
\begin{aligned}
& 1.01^{a 0 a}, 1.001^{a 00 a}, 1.0001^{a 000 a}, 1.00001^{a 0000 a} \\
& 1.000001^{a 00000 a}, 1.0000001^{a 000000 a} \ldots
\end{aligned}
$$

(The powers are positive integers that begin and end with the digit $a$ and have 0 's in the remaining positions).
68. Let $f(x)=\left(1+\frac{1}{x}\right)^{x}$.
(a) Prove the identity

$$
f(-x)=\frac{x}{x-1} \cdot f(x-1)
$$

(b) Use Equation (7) and the identity from part (a) to prove Equation (8).
69-73 The notion of an asymptote can be extended to include curves as well as lines. Specifically, we say that curves $y=f(x)$ and $y=g(x)$ are asymptotic as $\boldsymbol{x} \rightarrow+\infty$ provided

$$
\lim _{x \rightarrow+\infty}[f(x)-g(x)]=0
$$

and are asymptotic as $\boldsymbol{x} \rightarrow-\infty$ provided

$$
\lim _{x \rightarrow-\infty}[f(x)-g(x)]=0
$$

In these exercises, determine a simpler function $g(x)$ such that $y=f(x)$ is asymptotic to $y=g(x)$ as $x \rightarrow+\infty$ or $x \rightarrow-\infty$. Use a graphing utility to generate the graphs of $y=f(x)$ and $y=g(x)$ and identify all vertical asymptotes.
69. $f(x)=\frac{x^{2}-2}{x-2}$ [Hint: Divide $x-2$ into $x^{2}-2$.]
70. $f(x)=\frac{x^{3}-x+3}{x}$
71. $f(x)=\frac{-x^{3}+3 x^{2}+x-1}{x-3}$
72. $f(x)=\frac{x^{5}-x^{3}+3}{x^{2}-1}$
73. $f(x)=\sin x+\frac{1}{x-1}$
74. Writing In some models for learning a skill (e.g., juggling), it is assumed that the skill level for an individual increases with practice but cannot become arbitrarily high. How do concepts of this section apply to such a model?
75. Writing In some population models it is assumed that a given ecological system possesses a carrying capacity $L$. Populations greater than the carrying capacity tend to decline toward $L$, while populations less than the carrying
capacity tend to increase toward $L$. Explain why these assumptions are reasonable, and discuss how the concepts of this section apply to such a model.

## QUICK CHECK ANSWERS 1.3

1. (a) $+\infty$
(b) 5
(c) $-\infty$
(d) 0
2. (a) $\frac{1}{2}$
(b) does not exist (c) $e$
3. (a) 9 (b) $-\frac{2}{3}$
(c) does not exist (d) 4
4. $1 / x, e^{x}$, and $e^{-x}$ each has a horizontal asymptote.

### 1.4 LIMITS (DISCUSSED MORE RIGOROUSLY)

In the previous sections of this chapter we focused on the discovery of values of limits, either by sampling selected $x$-values or by applying limit theorems that were stated without proof. Our main goal in this section is to define the notion of a limit precisely, thereby making it possible to establish limits with certainty and to prove theorems about them. This will also provide us with a deeper understanding of some of the more subtle properties of functions.

## MOTIVATION FOR THE DEFINITION OF A TWO-SIDED LIMIT

The statement $\lim _{x \rightarrow a} f(x)=L$ can be interpreted informally to mean that we can make the value of $f(x)$ as close as we like to the real number $L$ by making the value of $x$ sufficiently close to $a$. It is our goal to make the informal phrases "as close as we like to $L$ " and "sufficiently close to $a$ " mathematically precise.

To do this, consider the function $f$ graphed in Figure 1.4.1 a for which $f(x) \rightarrow L$ as $x \rightarrow a$. For visual simplicity we have drawn the graph of $f$ to be increasing on an open interval containing $a$, and we have intentionally placed a hole in the graph at $x=a$ to emphasize that $f$ need not be defined at $x=a$ to have a limit there.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-034.jpg?height=348&width=1361&top_left_y=1693&top_left_x=560)
△ Figure 1.4.1

Next, let us choose any positive number $\epsilon$ and ask how close $x$ must be to $a$ in order for the values of $f(x)$ to be within $\epsilon$ units of $L$. We can answer this geometrically by drawing horizontal lines from the points $L+\epsilon$ and $L-\epsilon$ on the $y$-axis until they meet the curve $y=f(x)$, and then drawing vertical lines from those points on the curve to the $x$-axis (Figure 1.4.1b). As indicated in the figure, let $x_{0}$ and $x_{1}$ be the points where those vertical lines intersect the $x$-axis.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-035.jpg?height=445&width=473&top_left_y=961&top_left_x=212)
Figure 1.4.2

Now imagine that $x$ gets closer and closer to $a$ (from either side). Eventually, $x$ will lie inside the interval $\left(x_{0}, x_{1}\right)$, which is marked in green in Figure 1.4.1c; and when this happens, the value of $f(x)$ will fall between $L-\epsilon$ and $L+\epsilon$, marked in red in the figure. Thus, we conclude:

If $f(x) \rightarrow L$ as $x \rightarrow a$, then for any positive number $\epsilon$, we can find an open interval $\left(x_{0}, x_{1}\right)$ on the $x$-axis that contains $a$ and has the property that for each $x$ in that interval (except possibly for $x=a$ ), the value of $f(x)$ is between $L-\epsilon$ and $L+\epsilon$.

What is important about this result is that it holds no matter how small we make $\epsilon$. However, making $\epsilon$ smaller and smaller forces $f(x)$ closer and closer to $L$-which is precisely the concept we were trying to capture mathematically.

Observe that in Figure 1.4.1 the interval $\left(x_{0}, x_{1}\right)$ extends farther on the right side of $a$ than on the left side. However, for many purposes it is preferable to have an interval that extends the same distance on both sides of $a$. For this purpose, let us choose any positive number $\delta$ that is smaller than both $x_{1}-a$ and $a-x_{0}$, and consider the interval

$$
(a-\delta, a+\delta)
$$

This interval extends the same distance $\delta$ on both sides of $a$ and lies inside of the interval $\left(x_{0}, x_{1}\right)$ (Figure 1.4.2). Moreover, the condition

$$
\begin{equation*}
L-\epsilon<f(x)<L+\epsilon \tag{1}
\end{equation*}
$$

holds for every $x$ in this interval (except possibly $x=a$ ), since this condition holds on the larger interval $\left(x_{0}, x_{1}\right)$.

Since (1) can be expressed as

$$
|f(x)-L|<\epsilon
$$

and the condition that $x$ lies in the interval $(a-\delta, a+\delta)$, but $x \neq a$, can be expressed as

$$
0<|x-a|<\delta
$$

we are led to the following precise definition of a two-sided limit.
1.4.1 LIMIT DEFINITION Let $f(x)$ be defined for all $x$ in some open interval containing the number $a$, with the possible exception that $f(x)$ need not be defined at $a$. We will write

$$
\lim _{x \rightarrow a} f(x)=L
$$

if given any number $\epsilon>0$ we can find a number $\delta>0$ such that

$$
|f(x)-L|<\epsilon \quad \text { if } \quad 0<|x-a|<\delta
$$

This definition, which is attributed to the German mathematician Karl Weierstrass and is commonly called the "epsilon-delta" definition of a two-sided limit, makes the transition from an informal concept of a limit to a precise definition. Specifically, the informal phrase "as close as we like to $L$ " is given quantitative meaning by our ability to choose the positive number $\epsilon$ arbitrarily, and the phrase "sufficiently close to $a$ " is quantified by the positive number $\delta$.

In the preceding sections we illustrated various numerical and graphical methods for guessing at limits. Now that we have a precise definition to work with, we can actually
confirm the validity of those guesses with mathematical proof. Here is a typical example of such a proof.

Example 1 Use Definition 1.4.1 to prove that $\lim _{x \rightarrow 2}(3 x-5)=1$.
Solution. We must show that given any positive number $\epsilon$, we can find a positive number $\delta$ such that

$$
\begin{equation*}
|\underbrace{(3 x-5)}_{f(x)}-\underbrace{1}_{L}|<\epsilon \quad \text { if } \quad 0<|x-\underbrace{2}_{a}|<\delta \tag{2}
\end{equation*}
$$

There are two things to do. First, we must discover a value of $\delta$ for which this statement holds, and then we must prove that the statement holds for that $\delta$. For the discovery part we begin by simplifying (2) and writing it as

$$
|3 x-6|<\epsilon \quad \text { if } \quad 0<|x-2|<\delta
$$

Next we will rewrite this statement in a form that will facilitate the discovery of an appropriate $\delta$ :

$$
\begin{array}{lll}
3|x-2|<\epsilon & \text { if } & 0<|x-2|<\delta \\
|x-2|<\epsilon / 3 & \text { if } & 0<|x-2|<\delta \tag{3}
\end{array}
$$

It should be self-evident that this last statement holds if $\delta=\epsilon / 3$, which completes the discovery portion of our work. Now we need to prove that (2) holds for this choice of $\delta$. However, statement (2) is equivalent to (3), and (3) holds with $\delta=\epsilon / 3$, so (2) also holds with $\delta=\epsilon / 3$. This proves that $\lim _{x \rightarrow 2}(3 x-5)=1$.

This example illustrates the general form of a limit proof: We assume that we are given a positive number $\epsilon$, and we try to prove that we can find a positive number $\delta$ such that

$$
\begin{equation*}
|f(x)-L|<\epsilon \text { if } 0<|x-a|<\delta \tag{4}
\end{equation*}
$$

This is done by first discovering $\delta$, and then proving that the discovered $\delta$ works. Since the argument has to be general enough to work for all positive values of $\epsilon$, the quantity $\delta$ has to be expressed as a function of $\epsilon$. In Example 1 we found the function $\delta=\epsilon / 3$ by some simple algebra; however, most limit proofs require a little more algebraic and logical ingenuity. Thus, if you find our ensuing discussion of " $\epsilon-\delta$ " proofs challenging, do not become discouraged; the concepts and techniques are intrinsically difficult. In fact, a precise understanding of limits evaded the finest mathematical minds for more than 150 years after the basic concepts of calculus were discovered.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-036.jpg?height=229&width=183&top_left_y=1784&top_left_x=120)

Karl Weierstrass (1815-1897) Weierstrass, the son of a customs officer, was born in Ostenfelde, Germany. As a youth Weierstrass showed outstanding skills in languages and mathematics. However, at the urging of his dominant father, Weierstrass entered the law and commerce program at the University of Bonn. To the chagrin of his family, the rugged and congenial young man concentrated instead on fencing and beer drinking. Four years later he returned home without a degree. In 1839 Weierstrass entered the Academy of Münster to study for a career in secondary education, and he met and studied under an excellent mathematician named Christof Gudermann. Gudermann's ideas greatly influenced the work of Weierstrass. After receiving his teaching certificate, Weierstrass spent the next 15 years in secondary education teaching German, geography, and mathematics. In addition, he taught handwriting to small children. During this period much of Weierstrass's mathematical work
was ignored because he was a secondary schoolteacher and not a college professor. Then, in 1854, he published a paper of major importance that created a sensation in the mathematics world and catapulted him to international fame overnight. He was immediately given an honorary Doctorate at the University of Königsberg and began a new career in college teaching at the University of Berlin in 1856. In 1859 the strain of his mathematical research caused a temporary nervous breakdown and led to spells of dizziness that plagued him for the rest of his life. Weierstrass was a brilliant teacher and his classes overflowed with multitudes of auditors. In spite of his fame, he never lost his early beer-drinking congeniality and was always in the company of students, both ordinary and brilliant. Weierstrass was acknowledged as the leading mathematical analyst in the world. He and his students opened the door to the modern school of mathematical analysis.

In Example 2 the limit from the left and the two-sided limit do not exist at $x=0$ because $\sqrt{x}$ is defined only for nonnegative values of $x$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-037.jpg?height=75&width=457&top_left_y=1265&top_left_x=218)
△ Figure 1.4.3

If you are wondering how we knew to make the restriction $\delta \leq 1$, as opposed to $\delta \leq 5$ or $\delta \leq \frac{1}{2}$, for example, the answer is that 1 is merely a convenient choice-any restriction of the form $\delta \leq c$ would work equally well.

Example 2 Prove that $\lim _{x \rightarrow 0^{+}} \sqrt{x}=0$.
Solution. Note that the domain of $\sqrt{x}$ is $0 \leq x$, so it is valid to discuss the limit as $x \rightarrow 0^{+}$. We must show that given $\epsilon>0$, there exists a $\delta>0$ such that

$$
|\sqrt{x}-0|<\epsilon \quad \text { if } \quad 0<x-0<\delta
$$

or more simply,

$$
\begin{equation*}
\sqrt{x}<\epsilon \quad \text { if } \quad 0<x<\delta \tag{5}
\end{equation*}
$$

But, by squaring both sides of the inequality $\sqrt{x}<\epsilon$, we can rewrite (5) as

$$
\begin{equation*}
x<\epsilon^{2} \quad \text { if } \quad 0<x<\delta \tag{6}
\end{equation*}
$$

It should be self-evident that (6) is true if $\delta=\epsilon^{2}$; and since (6) is a reformulation of (5), we have shown that (5) holds with $\delta=\epsilon^{2}$. This proves that $\lim _{x \rightarrow 0^{+}} \sqrt{x}=0$.

## THE VALUE OF $\boldsymbol{\delta}$ IS NOT UNIQUE

In preparation for our next example, we note that the value of $\delta$ in Definition 1.4.1 is not unique; once we have found a value of $\delta$ that fulfills the requirements of the definition, then any smaller positive number $\delta_{1}$ will also fulfill those requirements. That is, if it is true that

$$
|f(x)-L|<\epsilon \quad \text { if } \quad 0<|x-a|<\delta
$$

then it will also be true that

$$
|f(x)-L|<\epsilon \quad \text { if } \quad 0<|x-a|<\delta_{1}
$$

This is because $\left\{x: 0<|x-a|<\delta_{1}\right\}$ is a subset of $\{x: 0<|x-a|<\delta\}$ (Figure 1.4.3), and hence if $|f(x)-L|<\epsilon$ is satisfied for all $x$ in the larger set, then it will automatically be satisfied for all $x$ in the subset. Thus, in Example 1, where we used $\delta=\epsilon / 3$, we could have used any smaller value of $\delta$ such as $\delta=\epsilon / 4, \delta=\epsilon / 5$, or $\delta=\epsilon / 6$.

Example 3 Prove that $\lim _{x \rightarrow 3} x^{2}=9$.
Solution. We must show that given any positive number $\epsilon$, we can find a positive number $\delta$ such that

$$
\begin{equation*}
\left|x^{2}-9\right|<\epsilon \quad \text { if } \quad 0<|x-3|<\delta \tag{7}
\end{equation*}
$$

Because $|x-3|$ occurs on the right side of this "if statement," it will be helpful to factor the left side to introduce a factor of $|x-3|$. This yields the following alternative form of (7):

$$
\begin{equation*}
|x+3||x-3|<\epsilon \quad \text { if } \quad 0<|x-3|<\delta \tag{8}
\end{equation*}
$$

We wish to bound the factor $|x+3|$. If we knew, for example, that $\delta \leq 1$, then we would have $-1<x-3<1$, so $5<x+3<7$, and consequently $|x+3|<7$. Thus, if $\delta \leq 1$ and $0<|x-3|<\delta$, then

$$
|x+3||x-3|<7 \delta
$$

It follows that (8) will be satisfied for any positive $\delta$ such that $\delta \leq 1$ and $7 \delta<\epsilon$. We can achieve this by taking $\delta$ to be the minimum of the numbers 1 and $\epsilon / 7$, which is sometimes written as $\delta=\min (1, \epsilon / 7)$. This proves that $\lim _{x \rightarrow 3} x^{2}=9$.

## LIMITS AS $\boldsymbol{x} \rightarrow \pm \infty$

In Section 1.3 we discussed the limits

$$
\lim _{x \rightarrow+\infty} f(x)=L \quad \text { and } \quad \lim _{x \rightarrow-\infty} f(x)=L
$$

from an intuitive point of view. The first limit can be interpreted to mean that we can make the value of $f(x)$ as close as we like to $L$ by taking $x$ sufficiently large, and the second can be interpreted to mean that we can make the value of $f(x)$ as close as we like to $L$ by taking $x$ sufficiently far to the left of 0 . These ideas are captured in the following definitions and are illustrated in Figure 1.4.4.
1.4.2 DEFINITION Let $f(x)$ be defined for all $x$ in some infinite open interval extending in the positive $x$-direction. We will write

$$
\lim _{x \rightarrow+\infty} f(x)=L
$$

if given any number $\epsilon>0$, there corresponds a positive number $N$ such that

$$
|f(x)-L|<\epsilon \quad \text { if } \quad x>N
$$

1.4.3 DEFINITION Let $f(x)$ be defined for all $x$ in some infinite open interval extending in the negative $x$-direction. We will write

$$
\lim _{x \rightarrow-\infty} f(x)=L
$$

if given any number $\epsilon>0$, there corresponds a negative number $N$ such that

$$
|f(x)-L|<\epsilon \quad \text { if } \quad x<N
$$

To see how these definitions relate to our informal concepts of these limits, suppose that $f(x) \rightarrow L$ as $x \rightarrow+\infty$, and for a given $\epsilon$ let $N$ be the positive number described in Definition 1.4.2. If $x$ is allowed to increase indefinitely, then eventually $x$ will lie in the interval $(N,+\infty)$, which is marked in green in Figure 1.4.4a; when this happens, the value of $f(x)$ will fall between $L-\epsilon$ and $L+\epsilon$, marked in red in the figure. Since this is true for all positive values of $\epsilon$ (no matter how small), we can force the values of $f(x)$ as close as we like to $L$ by making $N$ sufficiently large. This agrees with our informal concept of this limit. Similarly, Figure 1.4.4b illustrates Definition 1.4.3.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-038.jpg?height=540&width=1173&top_left_y=1637&top_left_x=696)
Δ Figure 1.4.4

- Example 4 Prove that $\lim _{x \rightarrow+\infty} \frac{1}{x}=0$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-039.jpg?height=1096&width=461&top_left_y=881&top_left_x=214)
△ Figure 1.4.5

How would you define these limits?

$$
\begin{aligned}
& \lim _{x \rightarrow a^{+}} f(x)=+\infty \\
& \lim _{x \rightarrow a^{-}} f(x)=+\infty \\
& \lim _{x \rightarrow a^{+}} f(x)=-\infty \\
& \lim _{x \rightarrow+\infty} f(x)=+\infty \\
& \lim _{x \rightarrow-\infty} f(x)=-\infty \\
& \lim _{x \rightarrow+\infty} f(x)=-\infty \\
& \lim _{x \rightarrow-\infty} f(x)=-\infty
\end{aligned}
$$

Solution. Applying Definition 1.4.2 with $f(x)=1 / x$ and $L=0$, we must show that given $\epsilon>0$, we can find a number $N>0$ such that

$$
\begin{equation*}
\left|\frac{1}{x}-0\right|<\epsilon \quad \text { if } \quad x>N \tag{9}
\end{equation*}
$$

Because $x \rightarrow+\infty$ we can assume that $x>0$. Thus, we can eliminate the absolute values in this statement and rewrite it as

$$
\frac{1}{x}<\epsilon \quad \text { if } \quad x>N
$$

or, on taking reciprocals,

$$
\begin{equation*}
x>\frac{1}{\epsilon} \quad \text { if } \quad x>N \tag{10}
\end{equation*}
$$

It is self-evident that $N=1 / \epsilon$ satisfies this requirement, and since (10) and (9) are equivalent for $x>0$, the proof is complete. $\square$

## INFINITE LIMITS

In Section 1.1 we discussed limits of the following type from an intuitive viewpoint:

$$
\begin{array}{ll}
\lim _{x \rightarrow a} f(x)=+\infty, & \lim _{x \rightarrow a} f(x)=-\infty \\
\lim _{x \rightarrow a^{+}} f(x)=+\infty, & \lim _{x \rightarrow a^{+}} f(x)=-\infty \\
\lim _{x \rightarrow a^{-}} f(x)=+\infty, & \lim _{x \rightarrow a^{-}} f(x)=-\infty \tag{13}
\end{array}
$$

Recall that each of these expressions describes a particular way in which the limit fails to exist. The $+\infty$ indicates that the limit fails to exist because $f(x)$ increases without bound, and the $-\infty$ indicates that the limit fails to exist because $f(x)$ decreases without bound. These ideas are captured more precisely in the following definitions and are illustrated in Figure 1.4.5.
1.4.4 DEFINITION Let $f(x)$ be defined for all $x$ in some open interval containing $a$, except that $f(x)$ need not be defined at $a$. We will write

$$
\lim _{x \rightarrow a} f(x)=+\infty
$$

if given any positive number $M$, we can find a number $\delta>0$ such that $f(x)$ satisfies

$$
f(x)>M \quad \text { if } \quad 0<|x-a|<\delta
$$

1.4.5 DEFINITION Let $f(x)$ be defined for all $x$ in some open interval containing $a$, except that $f(x)$ need not be defined at $a$. We will write

$$
\lim _{x \rightarrow a} f(x)=-\infty
$$

if given any negative number $M$, we can find a number $\delta>0$ such that $f(x)$ satisfies

$$
f(x)<M \quad \text { if } \quad 0<|x-a|<\delta
$$

To see how these definitions relate to our informal concepts of these limits, suppose that $f(x) \rightarrow+\infty$ as $x \rightarrow a$, and for a given $M$ let $\delta$ be the corresponding positive number described in Definition 1.4.4. Next, imagine that $x$ gets closer and closer to $a$ (from either side). Eventually, $x$ will lie in the interval $(a-\delta, a+\delta)$, which is marked in green in Figure 1.4.5a; when this happens the value of $f(x)$ will be greater than $M$, marked in red in
the figure. Since this is true for any positive value of $M$ (no matter how large), we can force the values of $f(x)$ to be as large as we like by making $x$ sufficiently close to $a$. This agrees with our informal concept of this limit. Similarly, Figure 1.4.5b illustrates Definition 1.4.5.

- Example 5 Prove that $\lim _{x \rightarrow 0} \frac{1}{x^{2}}=+\infty$.

Solution. Applying Definition 1.4.4 with $f(x)=1 / x^{2}$ and $a=0$, we must show that given a number $M>0$, we can find a number $\delta>0$ such that

$$
\begin{equation*}
\frac{1}{x^{2}}>M \quad \text { if } \quad 0<|x-0|<\delta \tag{14}
\end{equation*}
$$

or, on taking reciprocals and simplifying,

$$
\begin{equation*}
x^{2}<\frac{1}{M} \quad \text { if } \quad 0<|x|<\delta \tag{15}
\end{equation*}
$$

But $x^{2}<1 / M$ if $|x|<1 / \sqrt{M}$, so that $\delta=1 / \sqrt{M}$ satisfies (15). Since (14) is equivalent to (15), the proof is complete.

## QUICK CHECK EXERCISES 1.4 (See page 109 for answers.)

1. The definition of a two-sided limit states: $\lim _{x \rightarrow a} f(x)=L$ if given any number $\_\_\_\_$ there is a number $\_\_\_\_$ such that $|f(x)-L|<\epsilon$ if $\_\_\_\_$ .
2. Suppose that $f(x)$ is a function such that for any given $\epsilon>0$, the condition $0<|x-1|<\epsilon / 2$ guarantees that $|f(x)-5|<\epsilon$. What limit results from this property?
3. Suppose that $\epsilon$ is any positive number. Find the largest value of $\delta$ such that $|5 x-10|<\epsilon$ if $0<|x-2|<\delta$.
4. The definition of limit at $+\infty$ states: $\lim _{x \rightarrow+\infty} f(x)=L$ if given any number $\_\_\_\_$ there is a positive number
$\_\_\_\_$ such that $|f(x)-L|<\epsilon$ if $\_\_\_\_$ .
5. Find the smallest positive number $N$ such that for each $x>N$, the value of $f(x)=1 / \sqrt{x}$ is within 0.01 of 0 .

## EXERCISE SET 1.4 Graphing Utility

1. (a) Find the largest open interval, centered at the origin on the $x$-axis, such that for each $x$ in the interval the value of the function $f(x)=x+2$ is within 0.1 unit of the number $f(0)=2$.
(b) Find the largest open interval, centered at $x=3$, such that for each $x$ in the interval the value of the function $f(x)=4 x-5$ is within 0.01 unit of the number $f(3)=7$.
(c) Find the largest open interval, centered at $x=4$, such that for each $x$ in the interval the value of the function $f(x)=x^{2}$ is within 0.001 unit of the number $f(4)=16$.
2. In each part, find the largest open interval, centered at $x=0$, such that for each $x$ in the interval the value of $f(x)=2 x+3$ is within $\epsilon$ units of the number $f(0)=3$.
(a) $\epsilon=0.1$
(b) $\epsilon=0.01$
(c) $\epsilon=0.0012$
3. (a) Find the values of $x_{0}$ and $x_{1}$ in the accompanying figure.
(b) Find a positive number $\delta$ such that $|\sqrt{x}-2|<0.05$ if $0<|x-4|<\delta$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-040.jpg?height=347&width=600&top_left_y=1780&top_left_x=1125)
Not drawn to scale

## - Figure Ex-3

4. (a) Find the values of $x_{0}$ and $x_{1}$ in the accompanying figure on the next page.
(b) Find a positive number $\delta$ such that $|(1 / x)-1|<0.1$ if $0<|x-1|<\delta$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-041.jpg?height=373&width=479&top_left_y=200&top_left_x=268)
Not drawn to scale

Figure Ex-4
5. Generate the graph of $f(x)=x^{3}-4 x+5$ with a graphing utility, and use the graph to find a number $\delta$ such that $|f(x)-2|<0.05$ if $0<|x-1|<\delta$. [Hint: Show that the inequality $|f(x)-2|<0.05$ can be rewritten as $1.95<x^{3}-4 x+5<2.05$, and estimate the values of $x$ for which $x^{3}-4 x+5=1.95$ and $x^{3}-4 x+5=2.05$.]
6. Use the method of Exercise 5 to find a number $\delta$ such that $|\sqrt{5 x+1}-4|<0.5$ if $0<|x-3|<\delta$.
7. Let $f(x)=x+\sqrt{x}$ with $L=\lim _{x \rightarrow 1} f(x)$ and let $\epsilon=0.2$. Use a graphing utility and its trace feature to find a positive number $\delta$ such that $|f(x)-L|<\epsilon$ if $0<|x-1|<\delta$.
8. Let $f(x)=(\sin 2 x) / x$ and use a graphing utility to conjecture the value of $L=\lim _{x \rightarrow 0} f(x)$. Then let $\epsilon=0.1$ and use the graphing utility and its trace feature to find a positive number $\delta$ such that $|f(x)-L|<\epsilon$ if $0<|x|<\delta$.

## FOCUS ON CONCEPTS

9. What is wrong with the following "proof" that $\lim _{x \rightarrow 3} 2 x=6$ ? Suppose that $\epsilon=1$ and $\delta=\frac{1}{2}$. Then if $|x-3|<\frac{1}{2}$, we have

$$
|2 x-6|=2|x-3|<2\left(\frac{1}{2}\right)=1=\epsilon
$$

Therefore, $\lim _{x \rightarrow 3} 2 x=6$.
10. What is wrong with the following "proof" that $\lim _{x \rightarrow 3} 2 x=6$ ? Given any $\delta>0$, choose $\epsilon=2 \delta$. Then if $|x-3|<\delta$, we have

$$
|2 x-6|=2|x-3|<2 \delta=\epsilon
$$

Therefore, $\lim _{x \rightarrow 3} 2 x=6$.
11. Recall from Example 1 that the creation of a limit proof involves two stages. The first is a discovery stage in which $\delta$ is found, and the second is the proof stage in which the discovered $\delta$ is shown to work. Fill in the blanks to give an explicit proof that the choice of $\delta=\epsilon / 3$ in Example 1 works. Suppose that $\epsilon>0$. Set $\delta=\epsilon / 3$ and assume that $0<|x-2|<\delta$. Then

$$
\begin{aligned}
|(3 x-5)-1| & =\mid \\
& =3 \cdot \mid \geq
\end{aligned}
$$

12. Suppose that $f(x)=c$ is a constant function and that $a$ is some fixed real number. Explain why any choice of $\delta>0$ (e.g., $\delta=1$ ) works to prove $\lim _{x \rightarrow a} f(x)=c$.

13-22 Use Definition 1.4.1 to prove that the limit is correct.
13. $\lim _{x \rightarrow 2} 3=3$
14. $\lim _{x \rightarrow 4}(x+2)=6$
15. $\lim _{x \rightarrow 5} 3 x=15$
16. $\lim _{x \rightarrow-1}(7 x+5)=-2$
17. $\lim _{x \rightarrow 0} \frac{2 x^{2}+x}{x}=1$
18. $\lim _{x \rightarrow-3} \frac{x^{2}-9}{x+3}=-6$
19. $\lim _{x \rightarrow 1} f(x)=3$, where $f(x)= \begin{cases}x+2, & x \neq 1 \\ 10, & x=1\end{cases}$
20. $\lim _{x \rightarrow 2} f(x)=5$, where $f(x)= \begin{cases}9-2 x, & x \neq 2 \\ 49, & x=2\end{cases}$
21. $\lim _{x \rightarrow 0}|x|=0$
22. $\lim _{x \rightarrow 2} f(x)=5$, where $f(x)= \begin{cases}9-2 x, & x<2 \\ 3 x-1, & x>2\end{cases}$

23-26 True-False Determine whether the statement is true or false. Explain your answer.
23. Suppose that $f(x)=m x+b, m \neq 0$. To prove that $\lim _{x \rightarrow a} f(x)=f(a)$, we can take $\delta=\epsilon /|m|$.
24. Suppose that $f(x)=m x+b, m \neq 0$. To prove that $\lim _{x \rightarrow a} f(x)=f(a)$, we can take $\delta=\epsilon /(2|m|)$.
25. For certain functions, the same $\delta$ will work for all $\epsilon>0$ in a limit proof.
26. Suppose that $f(x)>0$ for all $x$ in the interval $(-1,1)$. If $\lim _{x \rightarrow 0} f(x)=L$, then $L>0$.

## FOCUS ON CONCEPTS

27. Give rigorous definitions of $\lim _{x \rightarrow a^{+}} f(x)=L$ and $\lim _{x \rightarrow a^{-}} f(x)=L$.
28. Consider the statement that $\lim _{x \rightarrow a}|f(x)-L|=0$.
(a) Using Definition 1.4.1, write down precisely what this limit statement means.
(b) Explain why your answer to part (a) shows that

$$
\lim _{x \rightarrow a}|f(x)-L|=0 \quad \text { if and only if } \quad \lim _{x \rightarrow a} f(x)=L
$$

29. (a) Show that

$$
\left|\left(3 x^{2}+2 x-20\right)-300\right|=|3 x+32| \cdot|x-10|
$$

(b) Find an upper bound for $|3 x+32|$ if $x$ satisfies $|x-10|<1$.
(c) Fill in the blanks to complete a proof that

$$
\lim _{x \rightarrow 10}\left[3 x^{2}+2 x-20\right]=300
$$

Suppose that $\epsilon>0$. Set $\delta=\min (1$, $\_\_\_\_$ ) and assume that $0<|x-10|<\delta$. Then

$$
\begin{aligned}
\left|\left(3 x^{2}+2 x-20\right)-300\right| & =|3 x+32| \cdot|x-10| \\
& <-|x-10| \\
& <- \\
& =\epsilon
\end{aligned}
$$

30. (a) Show that

$$
\left|\frac{28}{3 x+1}-4\right|=\left|\frac{12}{3 x+1}\right| \cdot|x-2|
$$

(b) Is $|12 /(3 x+1)|$ bounded if $|x-2|<4$ ? If not, explain; if so, give a bound.
(c) Is $|12 /(3 x+1)|$ bounded if $|x-2|<1$ ? If not, explain; if so, give a bound.
(d) Fill in the blanks to complete a proof that

$$
\lim _{x \rightarrow 2}\left[\frac{28}{3 x+1}\right]=4
$$

Suppose that $\epsilon>0$. Set $\delta=\min (1$, $\_\_\_\_$ ) and assume that $0<|x-2|<\delta$. Then

$$
\begin{aligned}
\left|\frac{28}{3 x+1}-4\right| & =\left|\frac{12}{3 x+1}\right| \cdot|x-2| \\
& < \\
& < \\
& =\epsilon
\end{aligned}
$$

31-36 Use Definition 1.4.1 to prove that the stated limit is correct. In each case, to show that $\lim _{x \rightarrow a} f(x)=L$, factor $|f(x)-L|$ in the form

$$
|f(x)-L|=\mid \text { "something" }|\cdot| x-a \mid
$$

and then bound the size of |"something"| by putting restrictions on the size of $\delta$.
31. $\lim _{x \rightarrow 1} 2 x^{2}=2$ [Hint: Assume $\delta \leq 1$.]
32. $\lim _{x \rightarrow 3}\left(x^{2}+x\right)=12$ [Hint: Assume $\delta \leq 1$.]
33. $\lim _{x \rightarrow-2} \frac{1}{x+1}=-1$
34. $\lim _{x \rightarrow 1 / 2} \frac{2 x+3}{x}=8$
35. $\lim _{x \rightarrow 4} \sqrt{x}=2$
36. $\lim _{x \rightarrow 2} x^{3}=8$
37. Let

$$
f(x)= \begin{cases}0, & \text { if } x \text { is rational } \\ x, & \text { if } x \text { is irrational }\end{cases}
$$

Use Definition 1.4.1 to prove that $\lim _{x \rightarrow 0} f(x)=0$.
38. Let

$$
f(x)= \begin{cases}0, & \text { if } x \text { is rational } \\ 1, & \text { if } x \text { is irrational }\end{cases}
$$

Use Definition 1.4.1 to prove that $\lim _{x \rightarrow 0} f(x)$ does not exist. [Hint: Assume $\lim _{x \rightarrow 0} f(x)=L$ and apply Definition 1.4.1 with $\epsilon=\frac{1}{2}$ to conclude that $|1-L|<\frac{1}{2}$ and $|L|=|0-L|<\frac{1}{2}$. Then show $1 \leq|1-L|+|L|$ and derive a contradiction.]
39. (a) Find the values of $x_{1}$ and $x_{2}$ in the accompanying figure.
(b) Find a positive number $N$ such that

$$
\left|\frac{x^{2}}{1+x^{2}}-1\right|<\epsilon
$$

for $x>N$.
(c) Find a negative number $N$ such that

$$
\left|\frac{x^{2}}{1+x^{2}}-1\right|<\epsilon
$$

for $x<N$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-042.jpg?height=295&width=475&top_left_y=196&top_left_x=1125)
Not drawn to scale

Figure Ex-39
40. (a) Find the values of $x_{1}$ and $x_{2}$ in the accompanying figure.
(b) Find a positive number $N$ such that

$$
\left|\frac{1}{\sqrt[3]{x}}-0\right|=\left|\frac{1}{\sqrt[3]{x}}\right|<\epsilon
$$

for $x>N$.
(c) Find a negative number $N$ such that

$$
\left|\frac{1}{\sqrt[3]{x}}-0\right|=\left|\frac{1}{\sqrt[3]{x}}\right|<\epsilon
$$

for $x<N$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-042.jpg?height=479&width=469&top_left_y=1037&top_left_x=1127)
Figure Ex-40

41-44 A positive number $\epsilon$ and the limit $L$ of a function $f$ at $+\infty$ are given. Find a positive number $N$ such that $|f(x)-L|<\epsilon$ if $x>N$.
41. $\lim _{x \rightarrow+\infty} \frac{1}{x^{2}}=0 ; \epsilon=0.01$
42. $\lim _{x \rightarrow+\infty} \frac{1}{x+2}=0 ; \epsilon=0.005$
43. $\lim _{x \rightarrow+\infty} \frac{x}{x+1}=1 ; \epsilon=0.001$
44. $\lim _{x \rightarrow+\infty} \frac{4 x-1}{2 x+5}=2 ; \epsilon=0.1$

45-48 Apositive number $\epsilon$ and the limit $L$ of a function $f$ at $-\infty$ are given. Find a negative number $N$ such that $|f(x)-L|<\epsilon$ if $x<N$.
45. $\lim _{x \rightarrow-\infty} \frac{1}{x+2}=0 ; \epsilon=0.005$
46. $\lim _{x \rightarrow-\infty} \frac{1}{x^{2}}=0 ; \epsilon=0.01$
47. $\lim _{x \rightarrow-\infty} \frac{4 x-1}{2 x+5}=2 ; \epsilon=0.1$
48. $\lim _{x \rightarrow-\infty} \frac{x}{x+1}=1 ; \epsilon=0.001$

49-54 Use Definition 1.4.2 or 1.4.3 to prove that the stated limit is correct.
49. $\lim _{x \rightarrow+\infty} \frac{1}{x^{2}}=0$
50. $\lim _{x \rightarrow+\infty} \frac{1}{x+2}=0$
51. $\lim _{x \rightarrow-\infty} \frac{4 x-1}{2 x+5}=2$
52. $\lim _{x \rightarrow-\infty} \frac{x}{x+1}=1$
53. $\lim _{x \rightarrow+\infty} \frac{2 \sqrt{x}}{\sqrt{x}-1}=2$
54. $\lim _{x \rightarrow-\infty} 2^{x}=0$
55. (a) Find the largest open interval, centered at the origin on the $x$-axis, such that for each $x$ in the interval, other than the center, the values of $f(x)=1 / x^{2}$ are greater than 100 .
(b) Find the largest open interval, centered at $x=1$, such that for each $x$ in the interval, other than the center, the values of the function $f(x)=1 /|x-1|$ are greater than 1000 .
(c) Find the largest open interval, centered at $x=3$, such that for each $x$ in the interval, other than the center, the values of the function $f(x)=-1 /(x-3)^{2}$ are less than -1000 .
(d) Find the largest open interval, centered at the origin on the $x$-axis, such that for each $x$ in the interval, other than the center, the values of $f(x)=-1 / x^{4}$ are less than $-10,000$.
56. In each part, find the largest open interval centered at $x=1$, such that for each $x$ in the interval, other than the center, the value of $f(x)=1 /(x-1)^{2}$ is greater than $M$.
(a) $M=10$
(b) $M=1000$
(c) $M=100,000$

57-62 Use Definition 1.4.4 or 1.4.5 to prove that the stated limit is correct.
57. $\lim _{x \rightarrow 3} \frac{1}{(x-3)^{2}}=+\infty$
58. $\lim _{x \rightarrow 3} \frac{-1}{(x-3)^{2}}=-\infty$
59. $\lim _{x \rightarrow 0} \frac{1}{|x|}=+\infty$
60. $\lim _{x \rightarrow 1} \frac{1}{|x-1|}=+\infty$
61. $\lim _{x \rightarrow 0}\left(-\frac{1}{x^{4}}\right)=-\infty$
62. $\lim _{x \rightarrow 0} \frac{1}{x^{4}}=+\infty$

63-68 Use the definitions in Exercise 27 to prove that the stated one-sided limit is correct.
63. $\lim _{x \rightarrow 2^{+}}(x+1)=3$
64. $\lim _{x \rightarrow 1^{-}}(3 x+2)=5$
65. $\lim _{x \rightarrow 4^{+}} \sqrt{x-4}=0$
66. $\lim _{x \rightarrow 0^{-}} \sqrt{-x}=0$
67. $\lim _{x \rightarrow 2^{+}} f(x)=2$, where $f(x)= \begin{cases}x, & x>2 \\ 3 x, & x \leq 2\end{cases}$
68. $\lim _{x \rightarrow 2^{-}} f(x)=6$, where $f(x)= \begin{cases}x, & x>2 \\ 3 x, & x \leq 2\end{cases}$

69-72 Write out the definition for the corresponding limit in the marginal note on page 105, and use your definition to prove that the stated limit is correct.
69.
(a) $\lim _{x \rightarrow 1^{+}} \frac{1}{1-x}=-\infty$
(b) $\lim _{x \rightarrow 1^{-}} \frac{1}{1-x}=+\infty$
70.
(a) $\lim _{x \rightarrow 0^{+}} \frac{1}{x}=+\infty$
(b) $\lim _{x \rightarrow 0^{-}} \frac{1}{x}=-\infty$
71.
(a) $\lim _{x \rightarrow+\infty}(x+1)=+\infty$
(b) $\lim _{x \rightarrow-\infty}(x+1)=-\infty$
72.
(a) $\lim _{x \rightarrow+\infty}\left(x^{2}-3\right)=+\infty$
(b) $\lim _{x \rightarrow-\infty}\left(x^{3}+5\right)=-\infty$
73. According to Ohm's law, when a voltage of $V$ volts is applied across a resistor with a resistance of $R$ ohms, a current of $I=V / R$ amperes flows through the resistor.
(a) How much current flows if a voltage of 3.0 volts is applied across a resistance of 7.5 ohms?
(b) If the resistance varies by $\pm 0.1 \mathrm{ohm}$, and the voltage remains constant at 3.0 volts, what is the resulting range of values for the current?
(c) If temperature variations cause the resistance to vary by $\pm \delta$ from its value of 7.5 ohms, and the voltage remains constant at 3.0 volts, what is the resulting range of values for the current?
(d) If the current is not allowed to vary by more than $\epsilon= \pm 0.001$ ampere at a voltage of 3.0 volts, what variation of $\pm \delta$ from the value of 7.5 ohms is allowable?
(e) Certain alloys become superconductors as their temperature approaches absolute zero $\left(-273^{\circ} \mathrm{C}\right)$, meaning that their resistance approaches zero. If the voltage remains constant, what happens to the current in a superconductor as $R \rightarrow 0^{+}$?
74. Writing Compare informal Definition 1.1.1 with Definition 1.4.1.
(a) What portions of Definition 1.4.1 correspond to the expression "values of $f(x)$ can be made as close as we like to $L$ " in Definition 1.1.1? Explain.
(b) What portions of Definition 1.4.1 correspond to the expression "taking values of $x$ sufficiently close to $a$ (but not equal to $a$ )" in Definition 1.1.1? Explain.
75. Writing Compare informal Definition 1.3.1 with Definition 1.4.2.
(a) What portions of Definition 1.4.2 correspond to the expression "values of $f(x)$ eventually get as close as we like to a number $L$ " in Definition 1.3.1? Explain.
(b) What portions of Definition 1.4.2 correspond to the expression "as $x$ increases without bound" in Definition 1.3.1? Explain.

## QUICK CHECK ANSWERS 1.4

1. $\epsilon>0 ; \delta>0 ; 0<|x-a|<\delta$
2. $\lim _{x \rightarrow 1} f(x)=5$
3. $\delta=\epsilon / 5$
4. $\epsilon>0 ; N ; x>N$
5. $N=10,000$

### 1.5 CONTINUITY

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-044.jpg?height=353&width=427&top_left_y=442&top_left_x=178)
Joseph Helfenberger/iStockphoto

A baseball moves along a "continuous" trajectory after leaving the pitcher's hand.

A thrown baseball cannot vanish at some point and reappear someplace else to continue its motion. Thus, we perceive the path of the ball as an unbroken curve. In this section, we translate "unbroken curve" into a precise mathematical formulation called continuity, translate "unbroken curve" into a precise mathematical formulation called continuity,

## DEFINITION OF CONTINUITY

Intuitively, the graph of a function can be described as a "continuous curve" if it has no breaks or holes. To make this idea more precise we need to understand what properties of a function can cause breaks or holes. Referring to Figure 1.5.1, we see that the graph of a function has a break or hole if any of the following conditions occur:

- The function $f$ is undefined at $c$ (Figure 1.5.1a).
- The limit of $f(x)$ does not exist as $x$ approaches $c$ (Figures 1.5.1b, 1.5.1c).
- The value of the function and the value of the limit at $c$ are different (Figure 1.5.1d).

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-044.jpg?height=403&width=1669&top_left_y=977&top_left_x=260)
△ Figure 1.5.1

The third condition in Definition 1.5.1 actually implies the first two, since it is tacitly understood in the statement

$$
\lim _{x \rightarrow c} f(x)=f(c)
$$

that the limit exists and the function is defined at $c$. Thus, when we want to establish continuity at $c$ our usual procedure will be to verify the third condition only.

This suggests the following definition.
1.5.1 DEFINITION A function $f$ is said to be continuous at $\boldsymbol{x}=\boldsymbol{c}$ provided the following conditions are satisfied:

1. $f(c)$ is defined.
2. $\lim _{x \rightarrow c} f(x)$ exists.
3. $\lim _{x \rightarrow c} f(x)=f(c)$.

If one or more of the conditions of this definition fails to hold, then we will say that $f$ has a discontinuity at $\boldsymbol{x}=\boldsymbol{c}$. Each function drawn in Figure 1.5.1 illustrates a discontinuity at $x=c$. In Figure 1.5.1a, the function is not defined at $c$, violating the first condition of Definition 1.5.1. In Figure 1.5.1b, the one-sided limits of $f(x)$ as $x$ approaches $c$ both exist but are not equal. Thus, $\lim _{x \rightarrow c} f(x)$ does not exist, and this violates the second condition of Definition 1.5.1. We will say that a function like that in Figure 1.5.1 $b$ has a jump discontinuity at $c$. In Figure 1.5.1c, the one-sided limits of $f(x)$ as $x$ approaches $c$ are infinite. Thus, $\lim _{x \rightarrow c} f(x)$ does not exist, and this violates the second condition of Definition 1.5.1. We will say that a function like that in Figure 1.5.1c has an infinite discontinuity at $c$. In Figure 1.5.1d, the function is defined at $c$ and $\lim _{x \rightarrow c} f(x)$ exists, but these two values are not equal, violating the third condition of Definition 1.5.1. We will

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-045.jpg?height=656&width=425&top_left_y=1605&top_left_x=234)
Chris Hondros/Getty Images A poor connection in a transmission cable can cause a discontinuity in the electrical signal it carries.

say that a function like that in Figure 1.5.1d has a removable discontinuity at $c$. Exercises 33 and 34 help to explain why discontinuities of this type are given this name.

Example 1 Determine whether the following functions are continuous at $x=2$.

$$
f(x)=\frac{x^{2}-4}{x-2}, \quad g(x)=\left\{\begin{array}{ll}
\frac{x^{2}-4}{x-2}, & x \neq 2 \\
3, & x=2,
\end{array} \quad h(x)= \begin{cases}\frac{x^{2}-4}{x-2}, & x \neq 2 \\
4, & x=2\end{cases}\right.
$$

Solution. In each case we must determine whether the limit of the function as $x \rightarrow 2$ is the same as the value of the function at $x=2$. In all three cases the functions are identical, except at $x=2$, and hence all three have the same limit at $x=2$, namely,

$$
\lim _{x \rightarrow 2} f(x)=\lim _{x \rightarrow 2} g(x)=\lim _{x \rightarrow 2} h(x)=\lim _{x \rightarrow 2} \frac{x^{2}-4}{x-2}=\lim _{x \rightarrow 2}(x+2)=4
$$

The function $f$ is undefined at $x=2$, and hence is not continuous at $x=2$ (Figure 1.5.2a). The function $g$ is defined at $x=2$, but its value there is $g(2)=3$, which is not the same as the limit as $x$ approaches 2 ; hence, $g$ is also not continuous at $x=2$ (Figure 1.5.2b). The value of the function $h$ at $x=2$ is $h(2)=4$, which is the same as the limit as $x$ approaches 2 ; hence, $h$ is continuous at $x=2$ (Figure 1.5.2c). (Note that the function $h$ could have been written more simply as $h(x)=x+2$, but we wrote it in piecewise form to emphasize its relationship to $f$ and $g$.)

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-045.jpg?height=397&width=1113&top_left_y=1153&top_left_x=784)
△ Figure 1.5.2

## CONTINUITY IN APPLICATIONS

In applications, discontinuities often signal the occurrence of important physical events. For example, Figure 1.5.3a is a graph of voltage versus time for an underground cable that is accidentally cut by a work crew at time $t=t_{0}$ (the voltage drops to zero when the line is cut). Figure 1.5.3b shows the graph of inventory versus time for a company that restocks its warehouse to $y_{1}$ units when the inventory falls to $y_{0}$ units. The discontinuities occur at those times when restocking occurs.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-045.jpg?height=389&width=1271&top_left_y=1990&top_left_x=706)
- Figure 1.5.3

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-046.jpg?height=272&width=393&top_left_y=612&top_left_x=196)
△ Figure 1.5.4

Modify Definition 1.5.2 appropriately so that it applies to intervals of the form $[a,+\infty),(-\infty, b],(a, b]$, and $[a, b)$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-046.jpg?height=287&width=445&top_left_y=1962&top_left_x=170)
△ Figure 1.5.5

$$
f(x)=\sqrt{9-x^{2}}
$$

## CONTINUITY ON AN INTERVAL

If a function $f$ is continuous at each number in an open interval $(a, b)$, then we say that $f$ is continuous on ( $\boldsymbol{a}, \boldsymbol{b}$ ). This definition applies to infinite open intervals of the form ( $a,+\infty$ ), $(-\infty, b)$, and $(-\infty,+\infty)$. In the case where $f$ is continuous on $(-\infty,+\infty)$, we will say that $f$ is continuous everywhere.

Because Definition 1.5.1 involves a two-sided limit, that definition does not generally apply at the endpoints of a closed interval $[a, b]$ or at the endpoint of an interval of the form $[a, b),(a, b],(-\infty, b]$, or $[a,+\infty)$. To remedy this problem, we will agree that a function is continuous at an endpoint of an interval if its value at the endpoint is equal to the appropriate one-sided limit at that endpoint. For example, the function graphed in Figure 1.5.4 is continuous at the right endpoint of the interval $[a, b]$ because

$$
\lim _{x \rightarrow b^{-}} f(x)=f(b)
$$

but it is not continuous at the left endpoint because

$$
\lim _{x \rightarrow a^{+}} f(x) \neq f(a)
$$

In general, we will say a function $f$ is continuous from the left at $c$ if

$$
\lim _{x \rightarrow c^{-}} f(x)=f(c)
$$

and is continuous from the right at $c$ if

$$
\lim _{x \rightarrow c^{+}} f(x)=f(c)
$$

Using this terminology we define continuity on a closed interval as follows.
1.5.2 Definition A function $f$ is said to be continuous on a closed interval $[\boldsymbol{a}, \boldsymbol{b}]$ if the following conditions are satisfied:

1. $f$ is continuous on $(a, b)$.
2. $f$ is continuous from the right at $a$.
3. $f$ is continuous from the left at $b$.

- Example 2 What can you say about the continuity of the function $f(x)=\sqrt{9-x^{2}}$ ?

Solution. Because the natural domain of this function is the closed interval [ $-3,3$ ], we will need to investigate the continuity of $f$ on the open interval $(-3,3)$ and at the two endpoints. If $c$ is any point in the interval $(-3,3)$, then it follows from Theorem 1.2.2(e) that

$$
\lim _{x \rightarrow c} f(x)=\lim _{x \rightarrow c} \sqrt{9-x^{2}}=\sqrt{\lim _{x \rightarrow c}\left(9-x^{2}\right)}=\sqrt{9-c^{2}}=f(c)
$$

which proves $f$ is continuous at each point in the interval $(-3,3)$. The function $f$ is also continuous at the endpoints since

$$
\begin{aligned}
& \lim _{x \rightarrow 3^{-}} f(x)=\lim _{x \rightarrow 3^{-}} \sqrt{9-x^{2}}=\sqrt{\lim _{x \rightarrow 3^{-}}\left(9-x^{2}\right)}=0=f(3) \\
& \lim _{x \rightarrow-3^{+}} f(x)=\lim _{x \rightarrow-3^{+}} \sqrt{9-x^{2}}=\sqrt{\lim _{x \rightarrow-3^{+}}\left(9-x^{2}\right)}=0=f(-3)
\end{aligned}
$$

Thus, $f$ is continuous on the closed interval $[-3,3]$ (Figure 1.5.5).

## SOME PROPERTIES OF CONTINUOUS FUNCTIONS

The following theorem, which is a consequence of Theorem 1.2.2, will enable us to reach conclusions about the continuity of functions that are obtained by adding, subtracting, multiplying, and dividing continuous functions.

### 1.5.3 THEOREM If the functions $f$ and $g$ are continuous at $c$, then

(a) $f+g$ is continuous at $c$.
(b) $f-g$ is continuous at $c$.
(c) $f g$ is continuous at $c$.
(d) $f / g$ is continuous at $c$ if $g(c) \neq 0$ and has a discontinuity at $c$ if $g(c)=0$.

We will prove part (d). The remaining proofs are similar and will be left to the exercises.

PROOF First, consider the case where $g(c)=0$. In this case $f(c) / g(c)$ is undefined, so the function $f / g$ has a discontinuity at $c$.

Next, consider the case where $g(c) \neq 0$. To prove that $f / g$ is continuous at $c$, we must show that

$$
\begin{equation*}
\lim _{x \rightarrow c} \frac{f(x)}{g(x)}=\frac{f(c)}{g(c)} \tag{1}
\end{equation*}
$$

Since $f$ and $g$ are continuous at $c$,

$$
\lim _{x \rightarrow c} f(x)=f(c) \quad \text { and } \quad \lim _{x \rightarrow c} g(x)=g(c)
$$

Thus, by Theorem 1.2.2(d)

$$
\lim _{x \rightarrow c} \frac{f(x)}{g(x)}=\frac{\lim _{x \rightarrow c} f(x)}{\lim _{x \rightarrow c} g(x)}=\frac{f(c)}{g(c)}
$$

which proves (1).

## CONTINUITY OF POLYNOMIALS AND RATIONAL FUNCTIONS

The general procedure for showing that a function is continuous everywhere is to show that it is continuous at an arbitrary point. For example, we know from Theorem 1.2.3 that if $p(x)$ is a polynomial and $a$ is any real number, then

$$
\lim _{x \rightarrow a} p(x)=p(a)
$$

This shows that polynomials are continuous everywhere. Moreover, since rational functions are ratios of polynomials, it follows from part (d) of Theorem 1.5.3 that rational functions are continuous at points other than the zeros of the denominator, and at these zeros they have discontinuities. Thus, we have the following result.

### 1.5.4 THEOREM

(a) A polynomial is continuous everywhere.
(b) A rational function is continuous at every point where the denominator is nonzero, and has discontinuities at the points where the denominator is zero.

## TECHNOLOGY MASTERY

If you use a graphing utility to generate the graph of the equation in Example 3, there is a good chance you will see the discontinuity at $x=2$ but not at $x=3$. Try it, and explain what you think is happening.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-048.jpg?height=568&width=455&top_left_y=562&top_left_x=162)
△ Figure 1.5.6

In words, Theorem 1.5.5 states that a limit symbol can be moved through a function sign provided the limit of the expression inside the function sign exists and the function is continuous at this limit.

Example 3 For what values of $x$ is there a discontinuity in the graph of

$$
y=\frac{x^{2}-9}{x^{2}-5 x+6} ?
$$

Solution. The function being graphed is a rational function, and hence is continuous at every number where the denominator is nonzero. Solving the equation

$$
x^{2}-5 x+6=0
$$

yields discontinuities at $x=2$ and at $x=3$ (Figure 1.5.6).

Example 4 Show that $|x|$ is continuous everywhere (Figure 0.1.9).
Solution. We can write $|x|$ as

$$
|x|=\left\{\begin{array}{rll}
x & \text { if } & x>0 \\
0 & \text { if } & x=0 \\
-x & \text { if } & x<0
\end{array}\right.
$$

so $|x|$ is the same as the polynomial $x$ on the interval ( $0,+\infty$ ) and is the same as the polynomial $-x$ on the interval $(-\infty, 0)$. But polynomials are continuous everywhere, so $x=0$ is the only possible discontinuity for $|x|$. Since $|0|=0$, to prove the continuity at $x=0$ we must show that

$$
\begin{equation*}
\lim _{x \rightarrow 0}|x|=0 \tag{2}
\end{equation*}
$$

Because the piecewise formula for $|x|$ changes at 0 , it will be helpful to consider the onesided limits at 0 rather than the two-sided limit. We obtain

$$
\lim _{x \rightarrow 0^{+}}|x|=\lim _{x \rightarrow 0^{+}} x=0 \quad \text { and } \quad \lim _{x \rightarrow 0^{-}}|x|=\lim _{x \rightarrow 0^{-}}(-x)=0
$$

Thus, (2) holds and $|x|$ is continuous at $x=0$.

## - CONTINUITY OF COMPOSITIONS

The following theorem, whose proof is given in Appendix D, will be useful for calculating limits of compositions of functions.

### 1.5.5 THEOREM If $\lim _{x \rightarrow c} g(x)=L$ and if the function $f$ is continuous at $L$, then $\lim _{x \rightarrow c} f(g(x))=f(L)$. That is, <br> $$
\lim _{x \rightarrow c} f(g(x))=f\left(\lim _{x \rightarrow c} g(x)\right)
$$ <br> This equality remains valid if $\lim _{x \rightarrow c}$ is replaced everywhere by one of $\lim _{x \rightarrow c^{+}}$, $\lim _{x \rightarrow c^{-}}, \lim _{x \rightarrow+\infty}$, or $\lim _{x \rightarrow-\infty}$.

In the special case of this theorem where $f(x)=|x|$, the fact that $|x|$ is continuous everywhere allows us to write

$$
\begin{equation*}
\lim _{x \rightarrow c}|g(x)|=\left|\lim _{x \rightarrow c} g(x)\right| \tag{3}
\end{equation*}
$$

provided $\lim _{x \rightarrow c} g(x)$ exists. Thus, for example,

$$
\lim _{x \rightarrow 3}\left|5-x^{2}\right|=\left|\lim _{x \rightarrow 3}\left(5-x^{2}\right)\right|=|-4|=4
$$

Can the absolute value of a function that is not continuous everywhere be continuous everywhere? Justify your answer.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-049.jpg?height=355&width=467&top_left_y=1157&top_left_x=212)
△ Figure 1.5.7

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-049.jpg?height=380&width=473&top_left_y=1627&top_left_x=210)
Figure 1.5.8

The following theorem is concerned with the continuity of compositions of functions; the first part deals with continuity at a specific number and the second with continuity everywhere.

### 1.5.6 THEOREM

(a) If the function $g$ is continuous at $c$, and the function $f$ is continuous at $g(c)$, then the composition $f \circ g$ is continuous at $c$.
(b) If the function $g$ is continuous everywhere and the function $f$ is continuous everywhere, then the composition $f \circ g$ is continuous everywhere.

PROOF We will prove part (a) only; the proof of part (b) can be obtained by applying part (a) at an arbitrary number $c$. To prove that $f \circ g$ is continuous at $c$, we must show that the value of $f \circ g$ and the value of its limit are the same at $x=c$. But this is so, since we can write

$$
\begin{gathered}
\lim _{x \rightarrow c}(f \circ g)(x)=\lim _{x \rightarrow c} f(g(x))=f\left(\lim _{x \rightarrow c} g(x)\right)=f(g(c))=(f \circ g)(c) \\
\text { Theorem 1.5.5 } g \text { is continuous at } c .
\end{gathered}
$$

We know from Example 4 that the function $|x|$ is continuous everywhere. Thus, if $g(x)$ is continuous at $c$, then by part (a) of Theorem 1.5.6, the function $|g(x)|$ must also be continuous at $c$; and, more generally, if $g(x)$ is continuous everywhere, then so is $|g(x)|$. Stated informally:

The absolute value of a continuous function is continuous.

For example, the polynomial $g(x)=4-x^{2}$ is continuous everywhere, so we can conclude that the function $\left|4-x^{2}\right|$ is also continuous everywhere (Figure 1.5.7).

## THE INTERMEDIATE-VALUE THEOREM

Figure 1.5.8 shows the graph of a function that is continuous on the closed interval $[a, b]$. The figure suggests that if we draw any horizontal line $y=k$, where $k$ is between $f(a)$ and $f(b)$, then that line will cross the curve $y=f(x)$ at least once over the interval $[a, b]$. Stated in numerical terms, if $f$ is continuous on $[a, b]$, then the function $f$ must take on every value $k$ between $f(a)$ and $f(b)$ at least once as $x$ varies from $a$ to $b$. For example, the polynomial $p(x)=x^{5}-x+3$ has a value of 3 at $x=1$ and a value of 33 at $x=2$. Thus, it follows from the continuity of $p$ that the equation $x^{5}-x+3=k$ has at least one solution in the interval $[1,2]$ for every value of $k$ between 3 and 33 . This idea is stated more precisely in the following theorem.

### 1.5.7 THEOREM (Intermediate-Value Theorem) If $f$ is continuous on a closed interval $[a, b]$ and $k$ is any number between $f(a)$ and $f(b)$, inclusive, then there is at least one number $x$ in the interval $[a, b]$ such that $f(x)=k$.

Although this theorem is intuitively obvious, its proof depends on a mathematically precise development of the real number system, which is beyond the scope of this text.

## APPROXIMATING ROOTS USING THE INTERMEDIATE-VALUE THEOREM

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-050.jpg?height=291&width=413&top_left_y=560&top_left_x=184)
△ Figure 1.5.9

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-050.jpg?height=537&width=388&top_left_y=1796&top_left_x=200)
\$ Figure 1.5.10

A variety of problems can be reduced to solving an equation $f(x)=0$ for its roots. Sometimes it is possible to solve for the roots exactly using algebra, but often this is not possible and one must settle for decimal approximations of the roots. One procedure for approximating roots is based on the following consequence of the Intermediate-Value Theorem.

### 1.5.8 THEOREM If $f$ is continuous on $[a, b]$, and if $f(a)$ and $f(b)$ are nonzero and have opposite signs, then there is at least one solution of the equation $f(x)=0$ in the interval ( $a, b$ ).

This result, which is illustrated in Figure 1.5.9, can be proved as follows.
proof Since $f(a)$ and $f(b)$ have opposite signs, 0 is between $f(a)$ and $f(b)$. Thus, by the Intermediate-Value Theorem there is at least one number $x$ in the interval $[a, b]$ such that $f(x)=0$. However, $f(a)$ and $f(b)$ are nonzero, so $x$ must lie in the interval $(a, b)$, which completes the proof.

Before we illustrate how this theorem can be used to approximate roots, it will be helpful to discuss some standard terminology for describing errors in approximations. If $x$ is an approximation to a quantity $x_{0}$, then we call

$$
\epsilon=\left|x-x_{0}\right|
$$

the absolute error or (less precisely) the error in the approximation. The terminology in Table 1.5.1 is used to describe the size of such errors.

Table 1.5.1
| ERROR | DESCRIPTION |
| :--- | :--- |
| $\left\|x-x_{0}\right\| \leq 0.1$ | $x$ approximates $x_{0}$ with an error of at most 0.1 . |
| $\left\|x-x_{0}\right\| \leq 0.01$ | $x$ approximates $x_{0}$ with an error of at most 0.01 . |
| $\left\|x-x_{0}\right\| \leq 0.001$ | $x$ approximates $x_{0}$ with an error of at most 0.001 . |
| $\left\|x-x_{0}\right\| \leq 0.0001$ | $x$ approximates $x_{0}$ with an error of at most 0.0001 . |
| $\left\|x-x_{0}\right\| \leq 0.5$ | $x$ approximates $x_{0}$ to the nearest integer. |
| $\left\|x-x_{0}\right\| \leq 0.05$ | $x$ approximates $x_{0}$ to 1 decimal place (i.e., to the nearest tenth). |
| $\left\|x-x_{0}\right\| \leq 0.005$ | $x$ approximates $x_{0}$ to 2 decimal places (i.e., to the nearest hundredth). |
| $\left\|x-x_{0}\right\| \leq 0.0005$ | $x$ approximates $x_{0}$ to 3 decimal places (i.e., to the nearest thousandth). |


Example 5 The equation

$$
x^{3}-x-1=0
$$

cannot be solved algebraically very easily because the left side has no simple factors. However, if we graph $p(x)=x^{3}-x-1$ with a graphing utility (Figure 1.5.10), then we are led to conjecture that there is one real root and that this root lies inside the interval $[1,2]$. The existence of a root in this interval is also confirmed by Theorem 1.5.8, since $p(1)=-1$ and $p(2)=5$ have opposite signs. Approximate this root to two decimal-place accuracy.

Solution. Our objective is to approximate the unknown root $x_{0}$ with an error of at most 0.005 . It follows that if we can find an interval of length 0.01 that contains the root, then the midpoint of that interval will approximate the root with an error of at most $\frac{1}{2}(0.01)=0.005$, which will achieve the desired accuracy.

We know that the root $x_{0}$ lies in the interval $[1,2]$. However, this interval has length 1 , which is too large. We can pinpoint the location of the root more precisely by dividing the interval $[1,2]$ into 10 equal parts and evaluating $p$ at the points of subdivision using a calculating utility (Table 1.5.2). In this table $p(1.3)$ and $p(1.4)$ have opposite signs, so we know that the root lies in the interval [1.3,1.4]. This interval has length 0.1 , which is still too large, so we repeat the process by dividing the interval [1.3,1.4] into 10 parts and evaluating $p$ at the points of subdivision; this yields Table 1.5.3, which tells us that the root is inside the interval [1.32, 1.33] (Figure 1.5.11). Since this interval has length 0.01, its midpoint 1.325 will approximate the root with an error of at most 0.005 . Thus, $x_{0} \approx 1.325$ to two decimal-place accuracy.

Table 1.5.2
| $x$ | 1 | 1.1 | 1.2 | 1.3 | 1.4 | 1.5 | 1.6 | 1.7 | 1.8 | 1.9 | 2 |
| :---: | ---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| $p(x)$ | -1 | -0.77 | -0.47 | -0.10 | 0.34 | 0.88 | 1.50 | 2.21 | 3.03 | 3.96 | 5 |


![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-051.jpg?height=327&width=467&top_left_y=1009&top_left_x=212)
△ Figure 1.5.11

Table 1.5.3
| $x$ | 1.3 | 1.31 | 1.32 | 1.33 | 1.34 | 1.35 | 1.36 | 1.37 | 1.38 | 1.39 | 1.4 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| $p(x)$ | -0.103 | -0.062 | -0.020 | 0.023 | 0.066 | 0.110 | 0.155 | 0.201 | 0.248 | 0.296 | 0.344 |


## REMARK

## TECHNOLOGY MASTERY

Use a graphing or calculating utility to show that the root $x_{0}$ in Example 5 can be approximated as $x_{0} \approx 1.3245$ to three decimal-place accuracy.

To say that $x$ approximates $x_{0}$ to $n$ decimal places does not mean that the first $n$ decimal places of $x$ and $x_{0}$ will be the same when the numbers are rounded to $n$ decimal places. For example, $x=1.084$ approximates $x_{0}=1.087$ to two decimal places because $\left|x-x_{0}\right|=0.003$ (< 0.005 ). However, if we round these values to two decimal places, then we obtain $x \approx 1.08$ and $x_{0} \approx 1.09$. Thus, if you approximate a number to $n$ decimal places, then you should display that approximation to at least $n+1$ decimal places to preserve the accuracy.

## QUICK CHECK EXERCISES 1.5 (See page 120 for answers.)

1. What three conditions are satisfied if $f$ is continuous at $x=c ?$
2. Suppose that $f$ and $g$ are continuous functions such that $f(2)=1$ and $\lim _{x \rightarrow 2}[f(x)+4 g(x)]=13$. Find
(a) $g(2)$
(b) $\lim _{x \rightarrow 2} g(x)$.
3. Suppose that $f$ and $g$ are continuous functions such that $\lim _{x \rightarrow 3} g(x)=5$ and $f(3)=-2$. Find $\lim _{x \rightarrow 3}[f(x) / g(x)]$.
4. For what values of $x$, if any, is the function

$$
f(x)=\frac{x^{2}-16}{x^{2}-5 x+4}
$$

discontinuous?
5. Suppose that a function $f$ is continuous everywhere and that $f(-2)=3, f(-1)=-1, f(0)=-4, f(1)=1$, and $f(2)=5$. Does the Intermediate-Value Theorem guarantee that $f$ has a root on the following intervals?
(a) $[-2,-1]$
(b) $[-1,0]$
(c) $[-1,1]$
(d) $[0,2]$

1-4 Let $f$ be the function whose graph is shown. On which of the following intervals, if any, is $f$ continuous?
(a) $[1,3]$
(b) $(1,3)$
(c) $[1,2]$
(d) $(1,2)$
(e) $[2,3]$
(f) $(2,3)$

For each interval on which $f$ is not continuous, indicate which conditions for the continuity of $f$ do not hold.

1.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-052.jpg?height=287&width=339&top_left_y=564&top_left_x=212)

2.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-052.jpg?height=289&width=344&top_left_y=564&top_left_x=628)

3.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-052.jpg?height=295&width=339&top_left_y=855&top_left_x=212)

4.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-052.jpg?height=295&width=340&top_left_y=855&top_left_x=628)

5. Consider the functions
$f(x)=\left\{\begin{aligned} 1, & x \neq 4 \\ -1, & x=4\end{aligned}\right.$ and
$g(x)= \begin{cases}4 x-10, & x \neq 4 \\ -6, & x=4\end{cases}$

In each part, is the given function continuous at $x=4$ ?
(a) $f(x)$
(b) $g(x)$
(c) $-g(x)$
(d) $|f(x)|$
(e) $f(x) g(x)$
(f) $g(f(x))$
(g) $g(x)-6 f(x)$
6. Consider the functions

$$
f(x)=\left\{\begin{array}{ll}
1, & 0 \leq x \\
0, & x<0
\end{array} \quad \text { and } \quad g(x)= \begin{cases}0, & 0 \leq x \\
1, & x<0\end{cases}\right.
$$

In each part, is the given function continuous at $x=0$ ?
(a) $f(x)$
(b) $g(x)$
(c) $f(-x)$
(d) $|g(x)|$
(e) $f(x) g(x)$
(f) $g(f(x))$
(g) $f(x)+g(x)$

## FOCUS ON CONCEPTS

7. In each part sketch the graph of a function $f$ that satisfies the stated conditions.
(a) $f$ is continuous everywhere except at $x=3$, at which point it is continuous from the right.
(b) $f$ has a two-sided limit at $x=3$, but it is not continuous at $x=3$.
(c) $f$ is not continuous at $x=3$, but if its value at $x=3$ is changed from $f(3)=1$ to $f(3)=0$, it becomes continuous at $x=3$.
(d) $f$ is continuous on the interval $[0,3)$ and is defined on the closed interval $[0,3]$; but $f$ is not continuous on the interval $[0,3]$.
8. Assume that a function $f$ is defined at $x=c$, and, with the aid of Definition 1.4.1, write down precisely what
condition (involving $\epsilon$ and $\delta$ ) must be satisfied for $f$ to be continuous at $x=c$. Explain why the condition $0<|x-c|<\delta$ can be replaced by $|x-c|<\delta$.
9. A student parking lot at a university charges $\$ 2.00$ for the first half hour (or any part) and $\$ 1.00$ for each subsequent half hour (or any part) up to a daily maximum of $\$ 10.00$.
(a) Sketch a graph of cost as a function of the time parked.
(b) Discuss the significance of the discontinuities in the graph to a student who parks there.
10. In each part determine whether the function is continuous or not, and explain your reasoning.
(a) The Earth's population as a function of time.
(b) Your exact height as a function of time.
(c) The cost of a taxi ride in your city as a function of the distance traveled.
(d) The volume of a melting ice cube as a function of time.

11-22 Find values of $x$, if any, at which $f$ is not continuous.
11. $f(x)=5 x^{4}-3 x+7$
12. $f(x)=\sqrt[3]{x-8}$
13. $f(x)=\frac{x+2}{x^{2}+4}$
14. $f(x)=\frac{x+2}{x^{2}-4}$
15. $f(x)=\frac{x}{2 x^{2}+x}$
16. $f(x)=\frac{2 x+1}{4 x^{2}+4 x+5}$
17. $f(x)=\frac{3}{x}+\frac{x-1}{x^{2}-1}$
18. $f(x)=\frac{5}{x}+\frac{2 x}{x+4}$
19. $f(x)=\frac{x^{2}+6 x+9}{|x|+3}$
20. $f(x)=\left|4-\frac{8}{x^{4}+x}\right|$
21. $f(x)= \begin{cases}2 x+3, & x \leq 4 \\ 7+\frac{16}{x}, & x>4\end{cases}$
22. $f(x)= \begin{cases}\frac{3}{x-1}, & x \neq 1 \\ 3, & x=1\end{cases}$

23-28 True-False Determine whether the statement is true or false. Explain your answer.
23. If $f(x)$ is continuous at $x=c$, then so is $|f(x)|$.
24. If $|f(x)|$ is continuous at $x=c$, then so is $f(x)$.
25. If $f$ and $g$ are discontinuous at $x=c$, then so is $f+g$.
26. If $f$ and $g$ are discontinuous at $x=c$, then so is $f g$.
27. If $\sqrt{f(x)}$ is continuous at $x=c$, then so is $f(x)$.
28. If $f(x)$ is continuous at $x=c$, then so is $\sqrt{f(x)}$.

29-30 Find a value of the constant $k$, if possible, that will make the function continuous everywhere.
29. (a) $f(x)= \begin{cases}7 x-2, & x \leq 1 \\ k x^{2}, & x>1\end{cases}$
(b) $f(x)= \begin{cases}k x^{2}, & x \leq 2 \\ 2 x+k, & x>2\end{cases}$
30. (a) $f(x)= \begin{cases}9-x^{2}, & x \geq-3 \\ k / x^{2}, & x<-3\end{cases}$
(b) $f(x)= \begin{cases}9-x^{2}, & x \geq 0 \\ k / x^{2}, & x<0\end{cases}$
31. Find values of the constants $k$ and $m$, if possible, that will make the function $f$ continuous everywhere.

$$
f(x)=\left\{\begin{aligned}
& x^{2}+5, & x & >2 \\
& m(x+1)+k, & -1 & <x \leq 2 \\
& 2 x^{3}+x+7, & x & \leq-1
\end{aligned}\right.
$$

32. On which of the following intervals is

$$
f(x)=\frac{1}{\sqrt{x-2}}
$$

continuous?
(a) $[2,+\infty)$
(b) $(-\infty,+\infty)$
(c) $(2,+\infty)$
(d) $[1,2)$

33-36 A function $f$ is said to have a removable discontinuity at $x=c$ if $\lim _{x \rightarrow c} f(x)$ exists but $f$ is not continuous at $x=c$, either because $f$ is not defined at $c$ or because the definition for $f(c)$ differs from the value of the limit. This terminology will be needed in these exercises.
33. (a) Sketch the graph of a function with a removable discontinuity at $x=c$ for which $f(c)$ is undefined.
(b) Sketch the graph of a function with a removable discontinuity at $x=c$ for which $f(c)$ is defined.
34. (a) The terminology removable discontinuity is appropriate because a removable discontinuity of a function $f$ at $x=c$ can be "removed" by redefining the value of $f$ appropriately at $x=c$. What value for $f(c)$ removes the discontinuity?
(b) Show that the following functions have removable discontinuities at $x=1$, and sketch their graphs.

$$
f(x)=\frac{x^{2}-1}{x-1} \quad \text { and } \quad g(x)= \begin{cases}1, & x>1 \\ 0, & x=1 \\ 1, & x<1\end{cases}
$$

(c) What values should be assigned to $f(1)$ and $g(1)$ to remove the discontinuities?

35-36 Find the values of $x$ (if any) at which $f$ is not continuous, and determine whether each such value is a removable discontinuity.
35.
(a) $f(x)=\frac{|x|}{x}$
(b) $f(x)=\frac{x^{2}+3 x}{x+3}$
(c) $f(x)=\frac{x-2}{|x|-2}$
36. (a) $f(x)=\frac{x^{2}-4}{x^{3}-8} \quad$ (b) $f(x)= \begin{cases}2 x-3, & x \leq 2 \\ x^{2}, & x>2\end{cases}$
(c) $f(x)= \begin{cases}3 x^{2}+5, & x \neq 1 \\ 6, & x=1\end{cases}$
37. (a) Use a graphing utility to generate the graph of the function $f(x)=(x+3) /\left(2 x^{2}+5 x-3\right)$, and then use the graph to make a conjecture about the number and locations of all discontinuities.
(b) Check your conjecture by factoring the denominator.
38. (a) Use a graphing utility to generate the graph of the function $f(x)=x /\left(x^{3}-x+2\right)$, and then use the graph to make a conjecture about the number and locations of all discontinuities.
(b) Use the Intermediate-Value Theorem to approximate the locations of all discontinuities to two decimal places.
39. Prove that $f(x)=x^{3 / 5}$ is continuous everywhere, carefully justifying each step.
40. Prove that $f(x)=1 / \sqrt{x^{4}+7 x^{2}+1}$ is continuous everywhere, carefully justifying each step.
41. Prove:
(a) part (a) of Theorem 1.5.3
(b) part (b) of Theorem 1.5.3
(c) part (c) of Theorem 1.5.3.
42. Prove part (b) of Theorem 1.5.4.
43. (a) Use Theorem 1.5.5 to prove that if $f$ is continuous at $x=c$, then $\lim _{h \rightarrow 0} f(c+h)=f(c)$.
(b) Prove that if $\lim _{h \rightarrow 0} f(c+h)=f(c)$, then $f$ is continuous at $x=c$. [Hint: What does this limit tell you about the continuity of $g(h)=f(c+h)$ ?]
(c) Conclude from parts (a) and (b) that $f$ is continuous at $x=c$ if and only if $\lim _{h \rightarrow 0} f(c+h)=f(c)$.
44. Prove: If $f$ and $g$ are continuous on $[a, b]$, and $f(a)>g(a)$, $f(b)<g(b)$, then there is at least one solution of the equation $f(x)=g(x)$ in $(a, b)$. [Hint: Consider $f(x)-g(x)$.]

## FOCUS ON CONCEPTS

45. Give an example of a function $f$ that is defined on a closed interval, and whose values at the endpoints have opposite signs, but for which the equation $f(x)=0$ has no solution in the interval.
46. Let $f$ be the function whose graph is shown in Exercise 2. For each interval, determine (i) whether the hypothesis of the Intermediate-Value Theorem is satisfied, and (ii) whether the conclusion of the Intermediate-Value Theorem is satisfied.
(a) $[1,2]$
(b) $[2,3]$
(c) $[1,3]$
47. Show that the equation $x^{3}+x^{2}-2 x=1$ has at least one solution in the interval $[-1,1]$.
48. Prove: If $p(x)$ is a polynomial of odd degree, then the equation $p(x)=0$ has at least one real solution.
49. The accompanying figure shows the graph of the equation $y=x^{4}+x-1$. Use the method of Example 5 to approximate the $x$-intercepts with an error of at most 0.05 .
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-054.jpg?height=267&width=383&top_left_y=432&top_left_x=216)

$$
\begin{gathered}
{[-5,4] \times[-3,6]} \\
x \mathrm{ScI}=1, y \mathrm{ScI}=1
\end{gathered}
$$

<Figure Ex-49
50. The accompanying figure shows the graph of the equation $y=5-x-x^{4}$. Use the method of Example 5 to approximate the roots of the equation $5-x-x^{4}=0$ to two decimal-place accuracy.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-054.jpg?height=267&width=385&top_left_y=993&top_left_x=216)

$$
\begin{gathered}
{[-5,4] \times[-3,6]} \\
x \mathrm{ScI}=1, y \mathrm{ScI}=1
\end{gathered}
$$

Figure Ex-50
51. Use the fact that $\sqrt{5}$ is a solution of $x^{2}-5=0$ to approximate $\sqrt{5}$ with an error of at most 0.005 .
52. A sprinter, who is timed with a stopwatch, runs a hundred yard dash in 10 s . The stopwatch is reset to 0 , and the sprinter is timed jogging back to the starting block. Show that there is at least one point on the track at which the reading on the stopwatch during the sprint is the same as the reading during the return jog. [Hint: Use the result in Exercise 44.]
53. Prove that there exist points on opposite sides of the equator that are at the same temperature. [Hint: Consider the accompanying figure, which shows a view of the equator from a point above the North Pole. Assume that the temperature $T(\theta)$ is a continuous function of the angle $\theta$, and consider the function $f(\theta)=T(\theta+\pi)-T(\theta)$.]

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-054.jpg?height=505&width=708&top_left_y=186&top_left_x=1123)
- Figure Ex-53

54. Let $R$ denote an elliptical region in the $x y$-plane, and define $f(z)$ to be the area within $R$ that is on, or to the left of, the vertical line $x=z$. Prove that $f$ is a continuous function of $z$. [Hint: Assume the ellipse is between the horizontal lines $y=a$ and $y=b, a<b$. Argue that $\left|f\left(z_{1}\right)-f\left(z_{2}\right)\right| \leq(b-a) \cdot\left|z_{1}-z_{2}\right|$.]
55. Let $R$ denote an elliptical region in the plane. For any line $L$, prove there is a line perpendicular to $L$ that divides $R$ in half by area. [Hint: Introduce coordinates so that $L$ is the $x$-axis. Use the result in Exercise 54 and the IntermediateValue Theorem.]
56. Suppose that $f$ is continuous on the interval $[0,1]$ and that $0 \leq f(x) \leq 1$ for all $x$ in this interval.
(a) Sketch the graph of $y=x$ together with a possible graph for $f$ over the interval $[0,1]$.
(b) Use the Intermediate-Value Theorem to help prove that there is at least one number $c$ in the interval $[0,1]$ such that $f(c)=c$.
57. Writing It is often assumed that changing physical quantities such as the height of a falling object or the weight of a melting snowball, are continuous functions of time. Use specific examples to discuss the merits of this assumption.
58. Writing The Intermediate-Value Theorem (Theorem 1.5.7) is an example of what is known as an "existence theorem." In your own words, describe how to recognize an existence theorem, and discuss some of the ways in which an existence theorem can be useful.

## QUICK CHECK ANSWERS 1.5

1. $f(c)$ is defined; $\lim _{x \rightarrow c} f(x)$ exists; $\lim _{x \rightarrow c} f(x)=f(c)$
2. (a) yes (b) no (c) yes (d) yes
3. (a) 3 (b) 3
4. $-2 / 5$
5. $x=1,4$

### 1.6 CONTINUITY OF TRIGONOMETRIC, EXPONENTIAL, AND INVERSE FUNCTIONS

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-055.jpg?height=488&width=449&top_left_y=608&top_left_x=220)
As $x$ approaches $c$ the point $P$ approaches the point $Q$.

- Figure 1.6.1

Theorem 1.6.1 implies that the six basic trigonometric functions are continuous on their domains. In particular, $\sin x$ and $\cos x$ are continuous everywhere.

In this section we will discuss the continuity properties of trigonometric functions, exponential functions, and inverses of various continuous functions. We will also discuss some important limits involving such functions.

## CONTINUITY OF TRIGONOMETRIC FUNCTIONS

Recall from trigonometry that the graphs of $\sin x$ and $\cos x$ are drawn as continuous curves. We will not formally prove that these functions are continuous, but we can motivate this fact by letting $c$ be a fixed angle in radian measure and $x$ a variable angle in radian measure. If, as illustrated in Figure 1.6.1, the angle $x$ approaches the angle $c$, then the point $P(\cos x, \sin x)$ moves along the unit circle toward $Q(\cos c, \sin c)$, and the coordinates of $P$ approach the corresponding coordinates of $Q$. This implies that

$$
\begin{equation*}
\lim _{x \rightarrow c} \sin x=\sin c \quad \text { and } \quad \lim _{x \rightarrow c} \cos x=\cos c \tag{1}
\end{equation*}
$$

Thus, $\sin x$ and $\cos x$ are continuous at the arbitrary point $c$; that is, these functions are continuous everywhere.

The formulas in (1) can be used to find limits of the remaining trigonometric functions by expressing them in terms of $\sin x$ and $\cos x$; for example, if $\cos c \neq 0$, then

$$
\lim _{x \rightarrow c} \tan x=\lim _{x \rightarrow c} \frac{\sin x}{\cos x}=\frac{\sin c}{\cos c}=\tan c
$$

Thus, we are led to the following theorem.
1.6.1 THEOREM If $c$ is any number in the natural domain of the stated trigonometric function, then

$$
\begin{array}{lll}
\lim _{x \rightarrow c} \sin x=\sin c & \lim _{x \rightarrow c} \cos x=\cos c & \lim _{x \rightarrow c} \tan x=\tan c \\
\lim _{x \rightarrow c} \csc x=\csc c & \lim _{x \rightarrow c} \sec x=\sec c & \lim _{x \rightarrow c} \cot x=\cot c
\end{array}
$$

Example 1 Find the limit

$$
\lim _{x \rightarrow 1} \cos \left(\frac{x^{2}-1}{x-1}\right)
$$

Solution. Since the cosine function is continuous everywhere, it follows from Theorem 1.5.5 that

$$
\lim _{x \rightarrow 1} \cos (g(x))=\cos \left(\lim _{x \rightarrow 1} g(x)\right)
$$

provided $\lim _{x \rightarrow 1} g(x)$ exists. Thus,

$$
\lim _{x \rightarrow 1} \cos \left(\frac{x^{2}-1}{x-1}\right)=\lim _{x \rightarrow 1} \cos (x+1)=\cos \left(\lim _{x \rightarrow 1}(x+1)\right)=\cos 2
$$

## - CONTINUITY OF INVERSE FUNCTIONS

Since the graphs of a one-to-one function $f$ and its inverse $f^{-1}$ are reflections of one another about the line $y=x$, it is clear geometrically that if the graph of $f$ has no breaks or holes in it, then neither does the graph of $f^{-1}$. This, and the fact that the range of $f$ is the domain of $f^{-1}$, suggests the following result, which we state without formal proof.

To paraphrase Theorem 1.6.2, the inverse of a continuous function is continuous.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-056.jpg?height=331&width=473&top_left_y=2034&top_left_x=154)
- Figure 1.6.2

1.6.2 THEOREM If $f$ is a one-to-one function that is continuous at each point of its domain, then $f^{-1}$ is continuous at each point of its domain; that is, $f^{-1}$ is continuous at each point in the range of $f$.

- Example 2 Use Theorem 1.6.2 to prove that $\sin ^{-1} x$ is continuous on the interval $[-1,1]$.

Solution. Recall that $\sin ^{-1} x$ is the inverse of the restricted sine function whose domain is the interval $[-\pi / 2, \pi / 2]$ and whose range is the interval $[-1,1]$ (Definition 0.4.6 and Figure 0.4.13). Since $\sin x$ is continuous on the interval $[-\pi / 2, \pi / 2]$, Theorem 1.6.2 implies $\sin ^{-1} x$ is continuous on the interval $[-1,1]$.

Arguments similar to the solution of Example 2 show that each of the inverse trigonometric functions defined in Section 0.4 is continuous at each point of its domain.

When we introduced the exponential function $f(x)=b^{x}$ in Section 0.5, we assumed that its graph is a curve without breaks, gaps, or holes; that is, we assumed that the graph of $y=b^{x}$ is a continuous curve. This assumption and Theorem 1.6.2 imply the following theorem, which we state without formal proof.

### 1.6.3 THEOREM Let $b>0, b \neq 1$.

(a) The function $b^{x}$ is continuous on $(-\infty,+\infty)$.
(b) The function $\log _{b} x$ is continuous on ( $0,+\infty$ ).

- Example 3 Where is the function $f(x)=\frac{\tan ^{-1} x+\ln x}{x^{2}-4}$ continuous?

Solution. The fraction will be continuous at all points where the numerator and denominator are both continuous and the denominator is nonzero. Since $\tan ^{-1} x$ is continuous everywhere and $\ln x$ is continuous if $x>0$, the numerator is continuous if $x>0$. The denominator, being a polynomial, is continuous everywhere, so the fraction will be continuous at all points where $x>0$ and the denominator is nonzero. Thus, $f$ is continuous on the intervals $(0,2)$ and $(2,+\infty)$.

## OBTAINING LIMITS BY SQUEEZING

In Section 1.1 we used numerical evidence to conjecture that

$$
\begin{equation*}
\lim _{x \rightarrow 0} \frac{\sin x}{x}=1 \tag{2}
\end{equation*}
$$

However, this limit is not easy to establish with certainty. The limit is an indeterminate form of type $0 / 0$, and there is no simple algebraic manipulation that one can perform to obtain the limit. Later in the text we will develop general methods for finding limits of indeterminate forms, but in this particular case we can use a technique called squeezing.

The method of squeezing is used to prove that $f(x) \rightarrow L$ as $x \rightarrow c$ by "trapping" or "squeezing" $f$ between two functions, $g$ and $h$, whose limits as $x \rightarrow c$ are known with certainty to be $L$. As illustrated in Figure 1.6.2, this forces $f$ to have a limit of $L$ as well. This is the idea behind the following theorem, which we state without proof.

The Squeezing Theorem also holds for one-sided limits and limits at $+\infty$ and $-\infty$. How do you think the hypotheses would change in those cases?

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-057.jpg?height=644&width=477&top_left_y=770&top_left_x=208)
Figure 1.6.3

Figure 1.6.4

### 1.6.4 THEOREM (The Squeezing Theorem) Let $f, g$, and $h$ be functions satisfying

$$
g(x) \leq f(x) \leq h(x)
$$

for all $x$ in some open interval containing the number $c$, with the possible exception that the inequalities need not hold at $c$. If $g$ and $h$ have the same limit as $x$ approaches $c$, say

$$
\lim _{x \rightarrow c} g(x)=\lim _{x \rightarrow c} h(x)=L
$$

then $f$ also has this limit as $x$ approaches $c$, that is,

$$
\lim _{x \rightarrow c} f(x)=L
$$

To illustrate how the Squeezing Theorem works, we will prove the following results, which are illustrated in Figure 1.6.3.

### 1.6.5 THEOREM

(a) $\lim _{x \rightarrow 0} \frac{\sin x}{x}=1$
(b) $\lim _{x \rightarrow 0} \frac{1-\cos x}{x}=0$

PROOF (a) In this proof we will interpret $x$ as an angle in radian measure, and we will assume to start that $0<x<\pi / 2$. As illustrated in Figure 1.6.4, the area of a sector with central angle $x$ and radius 1 lies between the areas of two triangles, one with area $\frac{1}{2} \tan x$ and the other with area $\frac{1}{2} \sin x$. Since the sector has area $\frac{1}{2} x$ (see marginal note), it follows that

$$
\frac{1}{2} \tan x \geq \frac{1}{2} x \geq \frac{1}{2} \sin x
$$

Multiplying through by $2 /(\sin x)$ and using the fact that $\sin x>0$ for $0<x<\pi / 2$, we obtain

$$
\frac{1}{\cos x} \geq \frac{x}{\sin x} \geq 1
$$

Next, taking reciprocals reverses the inequalities, so we obtain

$$
\begin{equation*}
\cos x \leq \frac{\sin x}{x} \leq 1 \tag{3}
\end{equation*}
$$

which squeezes the function $(\sin x) / x$ between the functions $\cos x$ and 1 . Although we derived these inequalities by assuming that $0<x<\pi / 2$, they also hold for $-\pi / 2<x<0$ [since replacing $x$ by $-x$ and using the identities $\sin (-x)=-\sin x$, and $\cos (-x)=\cos x$
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-057.jpg?height=441&width=1265&top_left_y=1972&top_left_x=708)

Recall that the area $A$ of a sector of radius $r$ and central angle $\theta$ is

$$
A=\frac{1}{2} r^{2} \theta
$$

This can be derived from the relationship

$$
\frac{A}{\pi r^{2}}=\frac{\theta}{2 \pi}
$$

which states that the area of the sector is to the area of the circle as the central angle of the sector is to the central angle of the circle.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-058.jpg?height=346&width=271&top_left_y=722&top_left_x=252)

## TECHNOLOGY MASTERY

Use a graphing utility to confirm the limits in Example 4, and if you have a CAS, use it to obtain the limits.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-058.jpg?height=489&width=397&top_left_y=1878&top_left_x=192)
- Figure 1.6.5

leaves (3) unchanged]. Finally, since

$$
\lim _{x \rightarrow 0} \cos x=1 \quad \text { and } \quad \lim _{x \rightarrow 0} 1=1
$$

the Squeezing Theorem implies that

$$
\lim _{x \rightarrow 0} \frac{\sin x}{x}=1
$$

proof (b) For this proof we will use the limit in part (a), the continuity of the sine function, and the trigonometric identity $\sin ^{2} x=1-\cos ^{2} x$. We obtain

$$
\begin{aligned}
\lim _{x \rightarrow 0} \frac{1-\cos x}{x} & =\lim _{x \rightarrow 0}\left[\frac{1-\cos x}{x} \cdot \frac{1+\cos x}{1+\cos x}\right]=\lim _{x \rightarrow 0} \frac{\sin ^{2} x}{(1+\cos x) x} \\
& =\left(\lim _{x \rightarrow 0} \frac{\sin x}{x}\right)\left(\lim _{x \rightarrow 0} \frac{\sin x}{1+\cos x}\right)=(1)\left(\frac{0}{1+1}\right)=0
\end{aligned}
$$

Example 4 Find
(a) $\lim _{x \rightarrow 0} \frac{\tan x}{x}$
(b) $\lim _{\theta \rightarrow 0} \frac{\sin 2 \theta}{\theta}$
(c) $\lim _{x \rightarrow 0} \frac{\sin 3 x}{\sin 5 x}$

Solution (a).

$$
\lim _{x \rightarrow 0} \frac{\tan x}{x}=\lim _{x \rightarrow 0}\left(\frac{\sin x}{x} \cdot \frac{1}{\cos x}\right)=\left(\lim _{x \rightarrow 0} \frac{\sin x}{x}\right)\left(\lim _{x \rightarrow 0} \frac{1}{\cos x}\right)=(1)(1)=1
$$

Solution (b). The trick is to multiply and divide by 2 , which will make the denominator the same as the argument of the sine function [just as in Theorem 1.6.5(a)]:

$$
\lim _{\theta \rightarrow 0} \frac{\sin 2 \theta}{\theta}=\lim _{\theta \rightarrow 0} 2 \cdot \frac{\sin 2 \theta}{2 \theta}=2 \lim _{\theta \rightarrow 0} \frac{\sin 2 \theta}{2 \theta}
$$

Now make the substitution $x=2 \theta$, and use the fact that $x \rightarrow 0$ as $\theta \rightarrow 0$. This yields

$$
\lim _{\theta \rightarrow 0} \frac{\sin 2 \theta}{\theta}=2 \lim _{\theta \rightarrow 0} \frac{\sin 2 \theta}{2 \theta}=2 \lim _{x \rightarrow 0} \frac{\sin x}{x}=2(1)=2
$$

Solution (c).

$$
\lim _{x \rightarrow 0} \frac{\sin 3 x}{\sin 5 x}=\lim _{x \rightarrow 0} \frac{\frac{\sin 3 x}{x}}{\frac{\sin 5 x}{x}}=\lim _{x \rightarrow 0} \frac{3 \cdot \frac{\sin 3 x}{3 x}}{5 \cdot \frac{\sin 5 x}{5 x}}=\frac{3 \cdot 1}{5 \cdot 1}=\frac{3}{5}
$$

Example 5 Discuss the limits
(a) $\lim _{x \rightarrow 0} \sin \left(\frac{1}{x}\right)$
(b) $\lim _{x \rightarrow 0} x \sin \left(\frac{1}{x}\right)$

Solution (a). Let us view $1 / x$ as an angle in radian measure. As $x \rightarrow 0^{+}$, the angle $1 / x$ approaches $+\infty$, so the values of $\sin (1 / x)$ keep oscillating between -1 and 1 without approaching a limit. Similarly, as $x \rightarrow 0^{-}$, the angle $1 / x$ approaches $-\infty$, so again the values of $\sin (1 / x)$ keep oscillating between -1 and 1 without approaching a limit. These conclusions are consistent with the graph shown in Figure 1.6.5. Note that the oscillations become more and more rapid as $x \rightarrow 0$ because $1 / x$ increases (or decreases) more and more rapidly as $x$ approaches 0 .

Confirm (4) by considering the cases $x>0$ and $x<0$ separately.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-059.jpg?height=501&width=412&top_left_y=391&top_left_x=242)
Figure 1.6.6

Solution (b). Since

$$
-1 \leq \sin \left(\frac{1}{x}\right) \leq 1
$$

it follows that if $x \neq 0$, then

$$
\begin{equation*}
-|x| \leq x \sin \left(\frac{1}{x}\right) \leq|x| \tag{4}
\end{equation*}
$$

Since $|x| \rightarrow 0$ as $x \rightarrow 0$, the inequalities in (4) and the Squeezing Theorem imply that

$$
\lim _{x \rightarrow 0} x \sin \left(\frac{1}{x}\right)=0
$$

This is consistent with the graph shown in Figure 1.6.6. $\square$

It follows from part (b) of this example that the function

$$
f(x)= \begin{cases}x \sin (1 / x), & x \neq 0 \\ 0, & x=0\end{cases}
$$

is continuous at $x=0$, since the value of the function and the value of the limit are the same at 0 . This shows that the behavior of a function can be very complex in the vicinity of $x=c$, even though the function is continuous at $c$.

## QUICK CHECK EXERCISES 1.6 (See page 128 for answers.)

1. In each part, is the given function continuous on the interval $[0, \pi / 2)$ ?
(a) $\sin x$
(b) $\cos x$
(c) $\tan x$
(d) $\csc x$
2. Evaluate
(a) $\lim _{x \rightarrow 0} \frac{\sin x}{x}$
(b) $\lim _{x \rightarrow 0} \frac{1-\cos x}{x}$.
3. Suppose a function $f$ has the property that for all real numbers $x$

$$
3-|x| \leq f(x) \leq 3+|x|
$$

From this we can conclude that $f(x) \rightarrow$ $\_\_\_\_$ as $x \rightarrow$
$\_\_\_\_$ .
4. In each part, give the largest interval on which the function is continuous.
(a) $e^{x}$
(b) $\ln x$
(c) $\sin ^{-1} x$
(d) $\tan ^{-1} x$

## EXERCISE SET 1.6 Graphing Utility

1-8 Find the discontinuities, if any. $\square$

1. $f(x)=\sin \left(x^{2}-2\right)$
2. $f(x)=\cos \left(\frac{x}{x-\pi}\right)$
3. $f(x)=|\cot x|$
4. $f(x)=\sec x$
5. $f(x)=\csc x$
6. $f(x)=\frac{1}{1+\sin ^{2} x}$
7. $f(x)=\frac{1}{1-2 \sin x}$
8. $f(x)=\sqrt{2+\tan ^{2} x}$

9-14 Determine where $f$ is continuous. $\square$
9. $f(x)=\sin ^{-1} 2 x$
10. $f(x)=\cos ^{-1}(\ln x)$
11. $f(x)=\frac{\ln \left(\tan ^{-1} x\right)}{x^{2}-9}$
12. $f(x)=\exp \left(\frac{\sin x}{x}\right)$
13. $f(x)=\frac{\sin ^{-1}(1 / x)}{x}$
14. $f(x)=\ln |x|-2 \ln (x+3)$

15-16 In each part, use Theorem 1.5.6(b) to show that the function is continuous everywhere.
15.
(a) $\sin \left(x^{3}+7 x+1\right)$
(b) $|\sin x|$
(c) $\cos ^{3}(x+1)$
16.
(a) $|3+\sin 2 x|$
(b) $\sin (\sin x)$
(c) $\cos ^{5} x-2 \cos ^{3} x+1$

17-42 Find the limits.
17. $\lim _{x \rightarrow+\infty} \cos \left(\frac{1}{x}\right)$
18. $\lim _{x \rightarrow+\infty} \sin \left(\frac{\pi x}{2-3 x}\right)$
19. $\lim _{x \rightarrow+\infty} \sin ^{-1}\left(\frac{x}{1-2 x}\right)$
20. $\lim _{x \rightarrow+\infty} \ln \left(\frac{x+1}{x}\right)$
21. $\lim _{x \rightarrow 0} e^{\sin x}$
22. $\lim _{x \rightarrow+\infty} \cos \left(2 \tan ^{-1} x\right)$
23. $\lim _{\theta \rightarrow 0} \frac{\sin 3 \theta}{\theta}$
24. $\lim _{h \rightarrow 0} \frac{\sin h}{2 h}$
25. $\lim _{\theta \rightarrow 0^{+}} \frac{\sin \theta}{\theta^{2}}$
26. $\lim _{\theta \rightarrow 0} \frac{\sin ^{2} \theta}{\theta}$
27. $\lim _{x \rightarrow 0} \frac{\tan 7 x}{\sin 3 x}$
28. $\lim _{x \rightarrow 0} \frac{\sin 6 x}{\sin 8 x}$
29. $\lim _{x \rightarrow 0^{+}} \frac{\sin x}{5 \sqrt{x}}$
30. $\lim _{x \rightarrow 0} \frac{\sin ^{2} x}{3 x^{2}}$
31. $\lim _{x \rightarrow 0} \frac{\sin x^{2}}{x}$
32. $\lim _{h \rightarrow 0} \frac{\sin h}{1-\cos h}$
33. $\lim _{t \rightarrow 0} \frac{t^{2}}{1-\cos ^{2} t}$
34. $\lim _{x \rightarrow 0} \frac{x}{\cos \left(\frac{1}{2} \pi-x\right)}$
35. $\lim _{\theta \rightarrow 0} \frac{\theta^{2}}{1-\cos \theta}$
36. $\lim _{h \rightarrow 0} \frac{1-\cos 3 h}{\cos ^{2} 5 h-1}$
37. $\lim _{x \rightarrow 0^{+}} \sin \left(\frac{1}{x}\right)$
38. $\lim _{x \rightarrow 0} \frac{x^{2}-3 \sin x}{x}$
39. $\lim _{x \rightarrow 0} \frac{2-\cos 3 x-\cos 4 x}{x}$
40. $\lim _{x \rightarrow 0} \frac{\tan 3 x^{2}+\sin ^{2} 5 x}{x^{2}}$

41-42 (a) Complete the table and make a guess about the limit indicated. (b) Find the exact value of the limit.
41. $f(x)=\frac{\sin (x-5)}{x^{2}-25} ; \lim _{x \rightarrow 5} f(x)$

| $x$ | 4 | 4.5 | 4.9 | 5.1 | 5.5 | 6 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| $f(x)$ |  |  |  |  |  |  |

Table Ex-41
42. $f(x)=\frac{\sin \left(x^{2}+3 x+2\right)}{x+2} ; \lim _{x \rightarrow-2} f(x)$

| $x$ | -2.1 | -2.01 | -2.001 | -1.999 | -1.99 | -1.9 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| $f(x)$ |  |  |  |  |  |  |

- Table Ex-42

43-46 True-False Determine whether the statement is true or false. Explain your answer. $\square$
43. Suppose that for all real numbers $x$, a function $f$ satisfies

$$
|f(x)+5| \leq|x+1|
$$

Then $\lim _{x \rightarrow-1} f(x)=-5$.
44. For $0<x<\pi / 2$, the graph of $y=\sin x$ lies below the graph of $y=x$ and above the graph of $y=x \cos x$.
45. If an invertible function $f$ is continuous everywhere, then its inverse $f^{-1}$ is also continuous everywhere.
46. Suppose that $M$ is a positive number and that for all real numbers $x$, a function $f$ satisfies

$$
-M \leq f(x) \leq M
$$

Then

$$
\lim _{x \rightarrow 0} x f(x)=0 \quad \text { and } \quad \lim _{x \rightarrow+\infty} \frac{f(x)}{x}=0
$$

## FOCUS ON CONCEPTS

47. In an attempt to verify that $\lim _{x \rightarrow 0}(\sin x) / x=1$, a student constructs the accompanying table.
(a) What mistake did the student make?
(b) What is the exact value of the limit illustrated by this table?

| $x$ | -0.01 | -0.001 | 0.001 | 0.01 |
| :---: | :---: | :---: | :---: | :---: |
| $\sin x / x$ | 0.017453 | 0.017453 | 0.017453 | 0.017453 |

## - Table Ex-47

48. Consider $\lim _{x \rightarrow 0}(1-\cos x) / x$, where $x$ is in degrees. Why is it possible to evaluate this limit with little or no computation?
49. In the circle in the accompanying figure, a central angle of measure $\theta$ radians subtends a chord of length $c(\theta)$ and a circular arc of length $s(\theta)$. Based on your intuition, what would you conjecture is the value of $\lim _{\theta \rightarrow 0^{+}} c(\theta) / s(\theta)$ ? Verify your conjecture by computing the limit.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-060.jpg?height=265&width=299&top_left_y=1938&top_left_x=1149)
-Figure Ex-49

50. What is wrong with the following "proof" that $\lim _{x \rightarrow 0}[(\sin 2 x) / x]=1$ ? Since

$$
\lim _{x \rightarrow 0}(\sin 2 x-x)=\lim _{x \rightarrow 0} \sin 2 x-\lim _{x \rightarrow 0} x=0-0=0
$$

if $x$ is close to 0 , then $\sin 2 x-x \approx 0$ or, equivalently, $\sin 2 x \approx x$. Dividing both sides of this approximate equality by $x$ yields $(\sin 2 x) / x \approx 1$. That is, $\lim _{x \rightarrow 0}[(\sin 2 x) / x]=1$.
51. Find a nonzero value for the constant $k$ that makes

$$
f(x)= \begin{cases}\frac{\tan k x}{x}, & x<0 \\ 3 x+2 k^{2}, & x \geq 0\end{cases}
$$

continuous at $x=0$.
52. Is

$$
f(x)= \begin{cases}\frac{\sin x}{|x|}, & x \neq 0 \\ 1, & x=0\end{cases}
$$

continuous at $x=0$ ? Explain.
53. In parts (a)-(c), find the limit by making the indicated substitution.
(a) $\lim _{x \rightarrow+\infty} x \sin \frac{1}{x} ; \quad t=\frac{1}{x}$
(b) $\lim _{x \rightarrow-\infty} x\left(1-\cos \frac{1}{x}\right) ; \quad t=\frac{1}{x}$
(c) $\lim _{x \rightarrow \pi} \frac{\pi-x}{\sin x} ; \quad t=\pi-x$
54. Find $\lim _{x \rightarrow 2} \frac{\cos (\pi / x)}{x-2}$. [Hint: Let $t=\frac{\pi}{2}-\frac{\pi}{x}$.]
55. Find $\lim _{x \rightarrow 1} \frac{\sin (\pi x)}{x-1}$.
56. Find $\lim _{x \rightarrow \pi / 4} \frac{\tan x-1}{x-\pi / 4}$.
57. Find $\lim _{x \rightarrow \pi / 4} \frac{\cos x-\sin x}{x-\pi / 4}$.
58. Suppose that $f$ is an invertible function, $f(0)=0, f$ is continuous at 0 , and $\lim _{x \rightarrow 0}(f(x) / x)$ exists. Given that $L=\lim _{x \rightarrow 0}(f(x) / x)$, show

$$
\lim _{x \rightarrow 0} \frac{x}{f^{-1}(x)}=L
$$

[Hint: Apply Theorem 1.5.5 to the composition $h \circ g$, where

$$
h(x)= \begin{cases}f(x) / x, & x \neq 0 \\ L, & x=0\end{cases}
$$

and $g(x)=f^{-1}(x)$.]
59-62 Apply the result of Exercise 58, if needed, to find the limits.
59. $\lim _{x \rightarrow 0} \frac{x}{\sin ^{-1} x}$
60. $\lim _{x \rightarrow 0} \frac{\tan ^{-1} x}{x}$
61. $\lim _{x \rightarrow 0} \frac{\sin ^{-1} 5 x}{x}$
62. $\lim _{x \rightarrow 1} \frac{\sin ^{-1}(x-1)}{x^{2}-1}$

## FOCUS ON CONCEPTS

63. In Example 5 we used the Squeezing Theorem to prove that

$$
\lim _{x \rightarrow 0} x \sin \left(\frac{1}{x}\right)=0
$$

Why couldn't we have obtained the same result by writing

$$
\begin{aligned}
\lim _{x \rightarrow 0} x \sin \left(\frac{1}{x}\right) & =\lim _{x \rightarrow 0} x \cdot \lim _{x \rightarrow 0} \sin \left(\frac{1}{x}\right) \\
& =0 \cdot \lim _{x \rightarrow 0} \sin \left(\frac{1}{x}\right)=0 ?
\end{aligned}
$$

64. Sketch the graphs of the curves $y=1-x^{2}, y=\cos x$, and $y=f(x)$, where $f$ is a function that satisfies the inequalities

$$
1-x^{2} \leq f(x) \leq \cos x
$$

for all $x$ in the interval $(-\pi / 2, \pi / 2)$. What can you say about the limit of $f(x)$ as $x \rightarrow 0$ ? Explain.
65. Sketch the graphs of the curves $y=1 / x, y=-1 / x$, and $y=f(x)$, where $f$ is a function that satisfies the inequalities

$$
-\frac{1}{x} \leq f(x) \leq \frac{1}{x}
$$

for all $x$ in the interval $[1,+\infty)$. What can you say about the limit of $f(x)$ as $x \rightarrow+\infty$ ? Explain your reasoning.
66. Draw pictures analogous to Figure 1.6.2 that illustrate the Squeezing Theorem for limits of the forms $\lim _{x \rightarrow+\infty} f(x)$ and $\lim _{x \rightarrow-\infty} f(x)$.
67. (a) Use the Intermediate-Value Theorem to show that the equation $x=\cos x$ has at least one solution in the interval $[0, \pi / 2]$.
(b) Show graphically that there is exactly one solution in the interval.
(c) Approximate the solution to three decimal places.
68. (a) Use the Intermediate-Value Theorem to show that the equation $x+\sin x=1$ has at least one solution in the interval $[0, \pi / 6]$.
(b) Show graphically that there is exactly one solution in the interval.
(c) Approximate the solution to three decimal places.
69. In the study of falling objects near the surface of the Earth, the acceleration $\boldsymbol{g}$ due to gravity is commonly taken to be a constant $9.8 \mathrm{~m} / \mathrm{s}^{2}$. However, the elliptical shape of the Earth and other factors cause variations in this value that depend on latitude. The following formula, known as the World Geodetic System 1984 (WGS 84) Ellipsoidal Gravity Formula, is used to predict the value of $g$ at a latitude of $\phi$ degrees (either north or south of the equator):

$$
g=9.7803253359 \frac{1+0.0019318526461 \sin ^{2} \phi}{\sqrt{1-0.0066943799901 \sin ^{2} \phi}} \mathrm{~m} / \mathrm{s}^{2}
$$

(a) Use a graphing utility to graph the curve $y=g(\phi)$ for $0^{\circ} \leq \phi \leq 90^{\circ}$. What do the values of $g$ at $\phi=0^{\circ}$ and at $\phi=90^{\circ}$ tell you about the WGS 84 ellipsoid model for the Earth?
(b) Show that $g=9.8 \mathrm{~m} / \mathrm{s}^{2}$ somewhere between latitudes of $38^{\circ}$ and $39^{\circ}$.
70. Writing In your own words, explain the practical value of the Squeezing Theorem.
71. Writing A careful examination of the proof of Theorem 1.6.5 raises the issue of whether the proof might actually be a circular argument! Read the article "A Circular Argument" by Fred Richman in the March 1993 issue of The College Mathematics Journal, and write a short report on the author's principal points.

## QUICK CHECK ANSWERS 1.6

1. 

(a) yes
(b) yes
(c) yes
(d) no
2. (a) 1
(b) 0
3. $3 ; 0$
4. (a) $(-\infty,+\infty)$
(b) $(0,+\infty)$
(c) $[-1,1]$
(d) $(-\infty,+\infty)$

## CHAPTER 1 REVIEW EXERCISES

Graphing Utility
c) CAS

1. For the function $f$ graphed in the accompanying figure, find the limit if it exists.
(a) $\lim _{x \rightarrow 1} f(x)$
(b) $\lim _{x \rightarrow 2} f(x)$
(c) $\lim _{x \rightarrow 3} f(x)$
(d) $\lim _{x \rightarrow 4} f(x)$
(e) $\lim _{x \rightarrow+\infty} f(x)$
(f) $\lim _{x \rightarrow-\infty} f(x)$
(g) $\lim _{x \rightarrow 3^{+}} f(x)$
(h) $\lim _{x \rightarrow 3^{-}} f(x)$
(i) $\lim _{x \rightarrow 0} f(x)$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-062.jpg?height=257&width=515&top_left_y=1177&top_left_x=212)
Figure Ex-1

2. In each part, complete the table and make a conjecture about the value of the limit indicated. Confirm your conjecture by finding the limit analytically.
(a) $f(x)=\frac{x-2}{x^{2}-4} ; \lim _{x \rightarrow 2^{+}} f(x)$

| $x$ | 2.00001 | 2.0001 | 2.001 | 2.01 | 2.1 | 2.5 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| $f(x)$ |  |  |  |  |  |  |

(b) $f(x)=\frac{\tan 4 x}{x} ; \lim _{x \rightarrow 0} f(x)$

| $x$ | -0.01 | -0.001 | -0.0001 | 0.0001 | 0.001 | 0.01 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| $f(x)$ |  |  |  |  |  |  |

3. (a) Approximate the value for the limit

$$
\lim _{x \rightarrow 0} \frac{3^{x}-2^{x}}{x}
$$

to three decimal places by constructing an appropriate table of values.
(b) Confirm your approximation using graphical evidence.
c 4. Approximate

$$
\lim _{x \rightarrow 3} \frac{2^{x}-8}{x-3}
$$

both by looking at a graph and by calculating values for some appropriate choices of $x$. Compare your answer with the value produced by a CAS.

5-10 Find the limits.
5. $\lim _{x \rightarrow-1} \frac{x^{3}-x^{2}}{x-1}$
6. $\lim _{x \rightarrow 1} \frac{x^{3}-x^{2}}{x-1}$
7. $\lim _{x \rightarrow-3} \frac{3 x+9}{x^{2}+4 x+3}$
8. $\lim _{x \rightarrow 2^{-}} \frac{x+2}{x-2}$
9. $\lim _{x \rightarrow+\infty} \frac{(2 x-1)^{5}}{\left(3 x^{2}+2 x-7\right)\left(x^{3}-9 x\right)}$
10. $\lim _{x \rightarrow 0} \frac{\sqrt{x^{2}+4}-2}{x^{2}}$
11. In each part, find the horizontal asymptotes, if any.
(a) $y=\frac{2 x-7}{x^{2}-4 x}$
(b) $y=\frac{x^{3}-x^{2}+10}{3 x^{2}-4 x}$
(c) $y=\frac{2 x^{2}-6}{x^{2}+5 x}$
12. In each part, find $\lim _{x \rightarrow a} f(x)$, if it exists, where $a$ is replaced by $0,5^{+},-5^{-},-5,5,-\infty$, and $+\infty$.
(a) $f(x)=\sqrt{5-x}$
(b) $f(x)= \begin{cases}(x-5) /|x-5|, & x \neq 5 \\ 0, & x=5\end{cases}$

13-20 Find the limits.
13. $\lim _{x \rightarrow 0} \frac{\sin 3 x}{\tan 3 x}$
14. $\lim _{x \rightarrow 0} \frac{x \sin x}{1-\cos x}$
15. $\lim _{x \rightarrow 0} \frac{3 x-\sin (k x)}{x}, \quad k \neq 0$
16. $\lim _{\theta \rightarrow 0} \tan \left(\frac{1-\cos \theta}{\theta}\right)$
17. $\lim _{t \rightarrow \pi / 2^{+}} e^{\tan t}$
18. $\lim _{\theta \rightarrow 0^{+}} \ln (\sin 2 \theta)-\ln (\tan \theta)$
19. $\lim _{x \rightarrow+\infty}\left(1+\frac{3}{x}\right)^{-x}$
20. $\lim _{x \rightarrow+\infty}\left(1+\frac{a}{x}\right)^{b x}, \quad a, b>0$
21. If $\$ 1000$ is invested in an account that pays $7 \%$ interest compounded $n$ times each year, then in 10 years there will be $1000(1+0.07 / n)^{10 n}$ dollars in the account. How much money will be in the account in 10 years if the interest is compounded quarterly ( $n=4$ )? Monthly ( $n=12$ )? Daily $(n=365)$ ? Determine the amount of money that will be in the account in 10 years if the interest is compounded continuously, that is, as $n \rightarrow+\infty$.
22. (a) Write a paragraph or two that describes how the limit of a function can fail to exist at $x=a$, and accompany your description with some specific examples.
(b) Write a paragraph or two that describes how the limit of a function can fail to exist as $x \rightarrow+\infty$ or $x \rightarrow-\infty$, and accompany your description with some specific examples.
(c) Write a paragraph or two that describes how a function can fail to be continuous at $x=a$, and accompany your description with some specific examples.
□ 23. (a) Find a formula for a rational function that has a vertical asymptote at $x=1$ and a horizontal asymptote at $y=2$.
(b) Check your work by using a graphing utility to graph the function.
24. Paraphrase the $\epsilon-\delta$ definition for $\lim _{x \rightarrow a} f(x)=L$ in terms of a graphing utility viewing window centered at the point $(a, L)$.
25. Suppose that $f(x)$ is a function and that for any given $\epsilon>0$, the condition $0<|x-2|<\frac{3}{4} \epsilon$ guarantees that $|f(x)-5|<\epsilon$.
(a) What limit is described by this statement?
(b) Find a value of $\delta$ such that $0<|x-2|<\delta$ guarantees that $|8 f(x)-40|<0.048$.
26. The limit

$$
\lim _{x \rightarrow 0} \frac{\sin x}{x}=1
$$

ensures that there is a number $\delta$ such that

$$
\left|\frac{\sin x}{x}-1\right|<0.001
$$

if $0<|x|<\delta$. Estimate the largest such $\delta$.
27. In each part, a positive number $\epsilon$ and the limit $L$ of a function $f$ at $a$ are given. Find a number $\delta$ such that $|f(x)-L|<\epsilon$ if $0<|x-a|<\delta$.
(a) $\lim _{x \rightarrow 2}(4 x-7)=1 ; \epsilon=0.01$
(b) $\lim _{x \rightarrow 3 / 2} \frac{4 x^{2}-9}{2 x-3}=6 ; \epsilon=0.05$
(c) $\lim _{x \rightarrow 4} x^{2}=16 ; \epsilon=0.001$
28. Use Definition 1.4.1 to prove the stated limits are correct.
(a) $\lim _{x \rightarrow 2}(4 x-7)=1$
(b) $\lim _{x \rightarrow 3 / 2} \frac{4 x^{2}-9}{2 x-3}=6$
29. Suppose that $f$ is continuous at $x_{0}$ and that $f\left(x_{0}\right)>0$. Give either an $\epsilon-\delta$ proof or a convincing verbal argument to show that there must be an open interval containing $x_{0}$ on which $f(x)>0$.
30. (a) Let

$$
f(x)=\frac{\sin x-\sin 1}{x-1}
$$

Approximate $\lim _{x \rightarrow 1} f(x)$ by graphing $f$ and calculating values for some appropriate choices of $x$.
(b) Use the identity

$$
\sin \alpha-\sin \beta=2 \sin \frac{\alpha-\beta}{2} \cos \frac{\alpha+\beta}{2}
$$

to find the exact value of $\lim _{x \rightarrow 1} f(x)$.
31. Find values of $x$, if any, at which the given function is not continuous.
(a) $f(x)=\frac{x}{x^{2}-1}$
(b) $f(x)=\left|x^{3}-2 x^{2}\right|$
(c) $f(x)=\frac{x+3}{\left|x^{2}+3 x\right|}$
32. Determine where $f$ is continuous.
(a) $f(x)=\frac{x}{|x|-3}$
(b) $f(x)=\cos ^{-1}\left(\frac{1}{x}\right)$
(c) $f(x)=e^{\ln x}$
33. Suppose that

$$
f(x)=\left\{\begin{aligned}
-x^{4}+3, & x \leq 2 \\
x^{2}+9, & x>2
\end{aligned}\right.
$$

Is $f$ continuous everywhere? Justify your conclusion.
34. One dictionary describes a continuous function as "one whose value at each point is closely approached by its values at neighboring points."
(a) How would you explain the meaning of the terms "neighboring points" and "closely approached" to a nonmathematician?
(b) Write a paragraph that explains why the dictionary definition is consistent with Definition 1.5.1.
35. Show that the conclusion of the Intermediate-Value Theorem may be false if $f$ is not continuous on the interval $[a, b]$.
36. Suppose that $f$ is continuous on the interval $[0,1]$, that $f(0)=2$, and that $f$ has no zeros in the interval. Prove that $f(x)>0$ for all $x$ in $[0,1]$.
37. Show that the equation $x^{4}+5 x^{3}+5 x-1=0$ has at least two real solutions in the interval $[-6,2]$.

## CHAPTER 1 MAKING CONNECTIONS

In Section 1.1 we developed the notion of a tangent line to a graph at a given point by considering it as a limiting position of secant lines through that point (Figure 1.1.4a). In these exercises we will develop an analogous idea in which secant lines are replaced by "secant circles" and the tangent line is replaced by a "tangent circle" (called the osculating circle). We begin with the graph of $y=x^{2}$.

1. Recall that there is a unique circle through any three noncollinear points in the plane. For any positive real number $x$, consider the unique "secant circle" that passes through the fixed point $O(0,0)$ and the variable points $Q\left(-x, x^{2}\right)$ and $P\left(x, x^{2}\right)$ (see the accompanying figure). Use plane geometry to explain why the center of this circle is the intersection of the $y$-axis and the perpendicular bisector of segment $O P$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-064.jpg?height=371&width=439&top_left_y=873&top_left_x=196)
Figure Ex-1

2. (a) Let ( $0, C(x)$ ) denote the center of the circle in Exercise 1 and show that

$$
C(x)=\frac{1}{2} x^{2}+\frac{1}{2}
$$

(b) Show that as $x \rightarrow 0^{+}$, the secant circles approach a limiting position given by the circle that passes through the origin and is centered at $\left(0, \frac{1}{2}\right)$. As shown in the accom-
panying figure, this circle is the osculating circle to the graph of $y=x^{2}$ at the origin.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-064.jpg?height=377&width=443&top_left_y=394&top_left_x=1107)
Figure Ex-2

3. Show that if we replace the curve $y=x^{2}$ by the curve $y=f(x)$, where $f$ is an even function, then the formula for $C(x)$ becomes

$$
C(x)=\frac{1}{2}\left[f(0)+f(x)+\frac{x^{2}}{f(x)-f(0)}\right]
$$

[Here we assume that $f(x) \neq f(0)$ for positive values of $x$ close to 0 .] If $\lim _{x \rightarrow 0^{+}} C(x)=L \neq f(0)$, then we define the osculating circle to the curve $y=f(x)$ at ( $0, f(0)$ ) to be the unique circle through ( $0, f(0)$ ) with center ( $0, L$ ). If $C(x)$ does not have a finite limit different from $f(0)$ as $x \rightarrow 0^{+}$, then we say that the curve has no osculating circle at $(0, f(0))$.
4. In each part, determine the osculating circle to the curve $y=f(x)$ at ( $0, f(0)$ ), if it exists.
(a) $f(x)=4 x^{2}$
(b) $f(x)=x^{2} \cos x$
(c) $f(x)=|x|$
(d) $f(x)=x \sin x$
(e) $f(x)=\cos x$
(f) $f(x)=x^{2} g(x)$, where $g(x)$ is an even continuous function with $g(0) \neq 0$
(g) $f(x)=x^{4}$
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-065.jpg?height=591&width=678&top_left_y=208&top_left_x=214)

2

## THE DERIVATIVE

Photo by Kirby Lee/WireImage/Getty Images

One of the crowning achievements of calculus is its ability to capture continuous motion mathematically, allowing that motion to be analyzed instant by instant.

Many real-world phenomena involve changing quantities-the speed of a rocket, the inflation of currency, the number of bacteria in a culture, the shock intensity of an earthquake, the voltage of an electrical signal, and so forth. In this chapter we will develop the concept of a "derivative," which is the mathematical tool for studying the rate at which one quantity changes relative to another. The study of rates of change is closely related to the geometric concept of a tangent line to a curve, so we will also be discussing the general definition of a tangent line and methods for finding its slope and equation.

### 2.1 TANGENT LINES AND RATES OF CHANGE

> In this section we will discuss three ideas: tangent lines to curves, the velocity of an object moving along a line, and the rate at which one variable changes relative to another. Our goal is to show how these seemingly unrelated ideas are, in actuality, closely linked.

## TANGENT LINES

In Example 1 of Section 1.1, we showed how the notion of a limit could be used to find an equation of a tangent line to a curve. At that stage in the text we did not have precise definitions of tangent lines and limits to work with, so the argument was intuitive and informal. However, now that limits have been defined precisely, we are in a position to give a mathematical definition of the tangent line to a curve $y=f(x)$ at a point $P\left(x_{0}, f\left(x_{0}\right)\right)$ on the curve. As illustrated in Figure 2.1.1, consider a point $Q(x, f(x))$ on the curve that is distinct from $P$, and compute the slope $m_{P Q}$ of the secant line through $P$ and $Q$ :

$$
m_{P Q}=\frac{f(x)-f\left(x_{0}\right)}{x-x_{0}}
$$

If we let $x$ approach $x_{0}$, then the point $Q$ will move along the curve and approach the point $P$. If the secant line through $P$ and $Q$ approaches a limiting position as $x \rightarrow x_{0}$, then we will regard that position to be the position of the tangent line at $P$. Stated another way, if the slope $m_{P Q}$ of the secant line through $P$ and $Q$ approaches a limit as $x \rightarrow x_{0}$, then we regard that limit to be the slope $m_{\tan }$ of the tangent line at $P$. Thus, we make the following definition.

Figure 2.1.1
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-066.jpg?height=473&width=527&top_left_y=198&top_left_x=1019)

2.1.1 DEFINITION Suppose that $x_{0}$ is in the domain of the function $f$. The tangent line to the curve $y=f(x)$ at the point $P\left(x_{0}, f\left(x_{0}\right)\right)$ is the line with equation

$$
y-f\left(x_{0}\right)=m_{\tan }\left(x-x_{0}\right)
$$

where

$$
\begin{equation*}
m_{\tan }=\lim _{x \rightarrow x_{0}} \frac{f(x)-f\left(x_{0}\right)}{x-x_{0}} \tag{1}
\end{equation*}
$$

provided the limit exists. For simplicity, we will also call this the tangent line to $y=f(x)$ at $x_{0}$.

Example 1 Use Definition 2.1.1 to find an equation for the tangent line to the parabola $y=x^{2}$ at the point $P(1,1)$, and confirm the result agrees with that obtained in Example 1 of Section 1.1.

Solution. Applying Formula (1) with $f(x)=x^{2}$ and $x_{0}=1$, we have

$$
\begin{aligned}
m_{\tan } & =\lim _{x \rightarrow 1} \frac{f(x)-f(1)}{x-1} \\
& =\lim _{x \rightarrow 1} \frac{x^{2}-1}{x-1} \\
& =\lim _{x \rightarrow 1} \frac{(x-1)(x+1)}{x-1}=\lim _{x \rightarrow 1}(x+1)=2
\end{aligned}
$$

Thus, the tangent line to $y=x^{2}$ at $(1,1)$ has equation

$$
y-1=2(x-1) \quad \text { or equivalently } \quad y=2 x-1
$$

which agrees with Example 1 of Section 1.1.

There is an alternative way of expressing Formula (1) that is commonly used. If we let $h$ denote the difference

$$
h=x-x_{0}
$$

then the statement that $x \rightarrow x_{0}$ is equivalent to the statement $h \rightarrow 0$, so we can rewrite (1) in terms of $x_{0}$ and $h$ as

$$
\begin{equation*}
m_{\tan }=\lim _{h \rightarrow 0} \frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h} \tag{2}
\end{equation*}
$$

Formulas (1) and (2) for $m_{\tan }$ usually lead to indeterminate forms of type $0 / 0$, so you will generally need to perform algebraic simplifications or use other methods to determine limits of such indeterminate forms.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-067.jpg?height=495&width=475&top_left_y=1840&top_left_x=210)
- Figure 2.1.3

Figure 2.1.2 shows how Formula (2) expresses the slope of the tangent line as a limit of slopes of secant lines.

Figure 2.1.2
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-067.jpg?height=483&width=613&top_left_y=360&top_left_x=1033)

Example 2 Compute the slope in Example 1 using Formula (2).
Solution. Applying Formula (2) with $f(x)=x^{2}$ and $x_{0}=1$, we obtain

$$
\begin{aligned}
m_{\tan } & =\lim _{h \rightarrow 0} \frac{f(1+h)-f(1)}{h} \\
& =\lim _{h \rightarrow 0} \frac{(1+h)^{2}-1^{2}}{h} \\
& =\lim _{h \rightarrow 0} \frac{1+2 h+h^{2}-1}{h}=\lim _{h \rightarrow 0}(2+h)=2
\end{aligned}
$$

which agrees with the slope found in Example 1.

Example 3 Find an equation for the tangent line to the curve $y=2 / x$ at the point $(2,1)$ on this curve.

Solution. First, we will find the slope of the tangent line by applying Formula (2) with $f(x)=2 / x$ and $x_{0}=2$. This yields

$$
\begin{aligned}
m_{\tan } & =\lim _{h \rightarrow 0} \frac{f(2+h)-f(2)}{h} \\
& =\lim _{h \rightarrow 0} \frac{\frac{2}{2+h}-1}{h}=\lim _{h \rightarrow 0} \frac{\left(\frac{2-(2+h)}{2+h}\right)}{h} \\
& =\lim _{h \rightarrow 0} \frac{-h}{h(2+h)}=-\left(\lim _{h \rightarrow 0} \frac{1}{2+h}\right)=-\frac{1}{2}
\end{aligned}
$$

Thus, an equation of the tangent line at $(2,1)$ is

$$
y-1=-\frac{1}{2}(x-2) \quad \text { or equivalently } \quad y=-\frac{1}{2} x+2
$$

(see Figure 2.1.3).

Example 4 Find the slopes of the tangent lines to the curve $y=\sqrt{x}$ at $x_{0}=1, x_{0}=4$, and $x_{0}=9$.

Solution. We could compute each of these slopes separately, but it will be more efficient to find the slope for a general value of $x_{0}$ and then substitute the specific numerical values. Proceeding in this way we obtain

$$
\begin{aligned}
m_{\tan } & =\lim _{h \rightarrow 0} \frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h} \\
& =\lim _{h \rightarrow 0} \frac{\sqrt{x_{0}+h}-\sqrt{x_{0}}}{h} \\
& =\lim _{h \rightarrow 0} \frac{\sqrt{x_{0}+h}-\sqrt{x_{0}}}{h} \cdot \frac{\sqrt{x_{0}+h}+\sqrt{x_{0}}}{\sqrt{x_{0}+h}+\sqrt{x_{0}}} \quad \begin{array}{l}
\text { Rationalize the numerator to } \\
\text { help eliminate the indeterminate } \\
\text { form of the limit. }
\end{array} \\
& =\lim _{h \rightarrow 0} \frac{x_{0}+h-x_{0}}{h\left(\sqrt{x_{0}+h}+\sqrt{x_{0}}\right)} \\
& =\lim _{h \rightarrow 0} \frac{h}{h\left(\sqrt{x_{0}+h}+\sqrt{x_{0}}\right)} \\
& =\lim _{h \rightarrow 0} \frac{1}{\sqrt{x_{0}+h}+\sqrt{x_{0}}}=\frac{1}{2 \sqrt{x_{0}}}
\end{aligned}
$$

The slopes at $x_{0}=1,4$, and 9 can now be obtained by substituting these values into our general formula for $m_{\tan }$. Thus,

$$
\begin{aligned}
& \text { slope at } x_{0}=1: \frac{1}{2 \sqrt{1}}=\frac{1}{2} \\
& \text { slope at } x_{0}=4: \frac{1}{2 \sqrt{4}}=\frac{1}{4} \\
& \text { slope at } x_{0}=9: \frac{1}{2 \sqrt{9}}=\frac{1}{6}
\end{aligned}
$$

(see Figure 2.1.4).

Figure 2.1.4
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-068.jpg?height=300&width=569&top_left_y=1589&top_left_x=999)

## VELOCITY

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-068.jpg?height=315&width=467&top_left_y=2002&top_left_x=156)

Carlos Santa Maria/iStockphoto
The velocity of an airplane describes its speed and direction.

One of the important themes in calculus is the study of motion. To describe the motion of an object completely, one must specify its speed (how fast it is going) and the direction in which it is moving. The speed and the direction of motion together comprise what is called the velocity of the object. For example, knowing that the speed of an aircraft is 500 $\mathrm{mi} / \mathrm{h}$ tells us how fast it is going, but not which way it is moving. In contrast, knowing that the velocity of the aircraft is $500 \mathrm{mi} / \mathrm{h}$ due south pins down the speed and the direction of motion.

Later, we will study the motion of objects that move along curves in two- or threedimensional space, but for now we will only consider motion along a line; this is called rectilinear motion. Some examples are a piston moving up and down in a cylinder, a race
car moving along a straight track, an object dropped from the top of a building and falling straight down, a ball thrown straight up and then falling down along the same line, and so forth.

For computational purposes, we will assume that a particle in rectilinear motion moves along a coordinate line, which we will call the $s$-axis. A graphical description of rectilinear motion along an $s$-axis can be obtained by making a plot of the $s$-coordinate of the particle versus the elapsed time $t$ from starting time $t=0$. This is called the position versus time curve for the particle. Figure 2.1.5 shows two typical position versus time curves. The first is for a car that starts at the origin and moves only in the positive direction of the $s$-axis. In this case $s$ increases as $t$ increases. The second is for a ball that is thrown straight up in the positive direction of an $s$-axis from some initial height $s_{0}$ and then falls straight down in the negative direction. In this case $s$ increases as the ball moves up and decreases as it moves down.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-069.jpg?height=444&width=1575&top_left_y=796&top_left_x=402)
△ Figure 2.1.5

Show that (4) is also correct for a time interval $\left[t_{0}+h, t_{0}\right], h<0$.

The change in position

$$
f\left(t_{0}+h\right)-f\left(t_{0}\right)
$$

is also called the displacement of the particle over the time interval between $t_{0}$ and $t_{0}+h$.

If a particle in rectilinear motion moves along an $s$-axis so that its position coordinate function of the elapsed time $t$ is

$$
\begin{equation*}
s=f(t) \tag{3}
\end{equation*}
$$

then $f$ is called the position function of the particle; the graph of (3) is the position versus time curve. The average velocity of the particle over a time interval $\left[t_{0}, t_{0}+h\right], h>0$, is defined to be

$$
\begin{equation*}
v_{\text {ave }}=\frac{\text { change in position }}{\text { time elapsed }}=\frac{f\left(t_{0}+h\right)-f\left(t_{0}\right)}{h} \tag{4}
\end{equation*}
$$

Example 5 Suppose that $s=f(t)=1+5 t-2 t^{2}$ is the position function of a particle, where $s$ is in meters and $t$ is in seconds. Find the average velocities of the particle over the time intervals (a) [ 0,2 ] and (b) [ 2,3 ].

Solution (a). Applying (4) with $t_{0}=0$ and $h=2$, we see that the average velocity is

$$
v_{\mathrm{ave}}=\frac{f\left(t_{0}+h\right)-f\left(t_{0}\right)}{h}=\frac{f(2)-f(0)}{2}=\frac{3-1}{2}=\frac{2}{2}=1 \mathrm{~m} / \mathrm{s}
$$

Solution (b). Applying (4) with $t_{0}=2$ and $h=1$, we see that the average velocity is

$$
v_{\mathrm{ave}}=\frac{f\left(t_{0}+h\right)-f\left(t_{0}\right)}{h}=\frac{f(3)-f(2)}{1}=\frac{-2-3}{1}=\frac{-5}{1}=-5 \mathrm{~m} / \mathrm{s}
$$

For a particle in rectilinear motion, average velocity describes its behavior over an interval of time. We are interested in the particle's "instantaneous velocity," which describes

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-070.jpg?height=744&width=461&top_left_y=242&top_left_x=160)
△ Figure 2.1.6

Table 2.1.1
| TIME INTERVAL | AVERAGE <br> VELOCITY $(\mathrm{m} / \mathrm{s})$ |
| :--- | :--- |
| $2.0 \leq t \leq 3.0$ | -5 |
| $2.0 \leq t \leq 2.1$ | -3.2 |
| $2.0 \leq t \leq 2.01$ | -3.02 |
| $2.0 \leq t \leq 2.001$ | -3.002 |
| $2.0 \leq t \leq 2.0001$ | -3.0002 |


Note the negative values for the velocities in Example 6. This is consistent with the fact that the object is moving in the negative direction along the $s$-axis.

Confirm the solution to Example 5(b) by computing the slope of an appropriate secant line.
its behavior at a specific instant in time. Formula (4) is not directly applicable for computing instantaneous velocity because the "time elapsed" at a specific instant is zero, so (4) is undefined. One way to circumvent this problem is to compute average velocities for small time intervals between $t=t_{0}$ and $t=t_{0}+h$. These average velocities may be viewed as approximations to the "instantaneous velocity" of the particle at time $t_{0}$. If these average velocities have a limit as $h$ approaches zero, then we can take that limit to be the instantaneous velocity of the particle at time $t_{0}$. Here is an example.

Example 6 Consider the particle in Example 5, whose position function is

$$
s=f(t)=1+5 t-2 t^{2}
$$

The position of the particle at time $t=2 \mathrm{~s}$ is $s=3 \mathrm{~m}$ (Figure 2.1.6). Find the particle's instantaneous velocity at time $t=2 \mathrm{~s}$.

Solution. As a first approximation to the particle's instantaneous velocity at time $t=2$ s , let us recall from Example 5(b) that the average velocity over the time interval from $t=2$ to $t=3$ is $v_{\text {ave }}=-5 \mathrm{~m} / \mathrm{s}$. To improve on this initial approximation we will compute the average velocity over a succession of smaller and smaller time intervals. We leave it to you to verify the results in Table 2.1.1. The average velocities in this table appear to be approaching a limit of $-3 \mathrm{~m} / \mathrm{s}$, providing strong evidence that the instantaneous velocity at time $t=2 \mathrm{~s}$ is $-3 \mathrm{~m} / \mathrm{s}$. To confirm this analytically, we start by computing the object's average velocity over a general time interval between $t=2$ and $t=2+h$ using Formula (4):

$$
v_{\mathrm{ave}}=\frac{f(2+h)-f(2)}{h}=\frac{\left[1+5(2+h)-2(2+h)^{2}\right]-3}{h}
$$

The object's instantaneous velocity at time $t=2$ is calculated as a limit as $h \rightarrow 0$ :

$$
\begin{aligned}
\text { instantaneous velocity } & =\lim _{h \rightarrow 0} \frac{\left[1+5(2+h)-2(2+h)^{2}\right]-3}{h} \\
& =\lim _{h \rightarrow 0} \frac{-2+(10+5 h)-\left(8+8 h+2 h^{2}\right)}{h} \\
& =\lim _{h \rightarrow 0} \frac{-3 h-2 h^{2}}{h}=\lim _{h \rightarrow 0}(-3-2 h)=-3
\end{aligned}
$$

This confirms our numerical conjecture that the instantaneous velocity after 2 s is $-3 \mathrm{~m} / \mathrm{s}$. $\square$

Consider a particle in rectilinear motion with position function $s=f(t)$. Motivated by Example 6, we define the instantaneous velocity $v_{\text {inst }}$ of the particle at time $t_{0}$ to be the limit as $h \rightarrow 0$ of its average velocities $v_{\text {ave }}$ over time intervals between $t=t_{0}$ and $t=t_{0}+h$. Thus, from (4) we obtain

$$
\begin{equation*}
v_{\mathrm{inst}}=\lim _{h \rightarrow 0} \frac{f\left(t_{0}+h\right)-f\left(t_{0}\right)}{h} \tag{5}
\end{equation*}
$$

Geometrically, the average velocity $v_{\text {ave }}$ between $t=t_{0}$ and $t=t_{0}+h$ is the slope of the secant line through points $P\left(t_{0}, f\left(t_{0}\right)\right)$ and $Q\left(t_{0}+h, f\left(t_{0}+h\right)\right)$ on the position versus time curve, and the instantaneous velocity $v_{\text {inst }}$ at time $t_{0}$ is the slope of the tangent line to the position versus time curve at the point $P\left(t_{0}, f\left(t_{0}\right)\right)$ (Figure 2.1.7).

Figure 2.1.7
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-071.jpg?height=477&width=597&top_left_y=198&top_left_x=1041)

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-071.jpg?height=359&width=413&top_left_y=1045&top_left_x=242)
- Figure 2.1.8

A 1 -unit increase in $x$ always produces an $m$-unit change in $y$.

## SLOPES AND RATES OF CHANGE

Velocity can be viewed as rate of change-the rate of change of position with respect to time. Rates of change occur in other applications as well. For example:

- A microbiologist might be interested in the rate at which the number of bacteria in a colony changes with time.
- An engineer might be interested in the rate at which the length of a metal rod changes with temperature.
- An economist might be interested in the rate at which production cost changes with the quantity of a product that is manufactured.
- A medical researcher might be interested in the rate at which the radius of an artery changes with the concentration of alcohol in the bloodstream.

Our next objective is to define precisely what is meant by the "rate of change of $y$ with respect to $x$ " when $y$ is a function of $x$. In the case where $y$ is a linear function of $x$, say $y=m x+b$, the slope $m$ is the natural measure of the rate of change of $y$ with respect to $x$. As illustrated in Figure 2.1.8, each 1-unit increase in $x$ anywhere along the line produces an $m$-unit change in $y$, so we see that $y$ changes at a constant rate with respect to $x$ along the line and that $m$ measures this rate of change.

Example 7 Find the rate of change of $y$ with respect to $x$ if
(a) $y=2 x-1$
(b) $y=-5 x+1$

Solution. In part (a) the rate of change of $y$ with respect to $x$ is $m=2$, so each 1 -unit increase in $x$ produces a 2 -unit increase in $y$. In part (b) the rate of change of $y$ with respect to $x$ is $m=-5$, so each 1 -unit increase in $x$ produces a 5 -unit decrease in $y$.

In applied problems, changing the units of measurement can change the slope of a line, so it is essential to include the units when calculating the slope and describing rates of change. The following example illustrates this.

Example 8 Suppose that a uniform rod of length $40 \mathrm{~cm}(=0.4 \mathrm{~m})$ is thermally insulated around the lateral surface and that the exposed ends of the rod are held at constant temperatures of $25^{\circ} \mathrm{C}$ and $5^{\circ} \mathrm{C}$, respectively (Figure 2.1.9a). It is shown in physics that under appropriate conditions the graph of the temperature $T$ versus the distance $x$ from the left-hand end of the rod will be a straight line. Parts ( $b$ ) and ( $c$ ) of Figure 2.1.9 show two

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-072.jpg?height=1012&width=487&top_left_y=186&top_left_x=148)
△ Figure 2.1.9

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-072.jpg?height=460&width=461&top_left_y=1297&top_left_x=160)
- Figure 2.1.10

such graphs: one in which $x$ is measured in centimeters and one in which it is measured in meters. The slopes in the two cases are

$$
\begin{align*}
& m=\frac{5-25}{40-0}=\frac{-20}{40}=-0.5  \tag{6}\\
& m=\frac{5-25}{0.4-0}=\frac{-20}{0.4}=-50 \tag{7}
\end{align*}
$$

The slope in (6) implies that the temperature decreases at a rate of $0.5^{\circ} \mathrm{C}$ per centimeter of distance from the left end of the rod, and the slope in (7) implies that the temperature decreases at a rate of $50^{\circ} \mathrm{C}$ per meter of distance from the left end of the rod. The two statements are equivalent physically, even though the slopes differ.

Although the rate of change of $y$ with respect to $x$ is constant along a nonvertical line $y=m x+b$, this is not true for a general curve $y=f(x)$. For example, in Figure 2.1.10 the change in $y$ that results from a 1 -unit increase in $x$ tends to have greater magnitude in regions where the curve rises or falls rapidly than in regions where it rises or falls slowly. As with velocity, we will distinguish between the average rate of change over an interval and the instantaneous rate of change at a specific point.

If $y=f(x)$, then we define the average rate of change of $y$ with respect to $x$ over the interval $\left[x_{0}, x_{1}\right]$ to be

$$
\begin{equation*}
r_{\mathrm{ave}}=\frac{f\left(x_{1}\right)-f\left(x_{0}\right)}{x_{1}-x_{0}} \tag{8}
\end{equation*}
$$

and we define the instantaneous rate of change of $\boldsymbol{y}$ with respect to $\boldsymbol{x}$ at $\boldsymbol{x}_{\mathbf{0}}$ to be

$$
\begin{equation*}
r_{\mathrm{inst}}=\lim _{x_{1} \rightarrow x_{0}} \frac{f\left(x_{1}\right)-f\left(x_{0}\right)}{x_{1}-x_{0}} \tag{9}
\end{equation*}
$$

Geometrically, the average rate of change of $y$ with respect to $x$ over the interval $\left[x_{0}, x_{1}\right]$ is the slope of the secant line through the points $P\left(x_{0}, f\left(x_{0}\right)\right)$ and $Q\left(x_{1}, f\left(x_{1}\right)\right)$ (Figure 2.1.11), and the instantaneous rate of change of $y$ with respect to $x$ at $x_{0}$ is the slope of the tangent line at the point $P\left(x_{0}, f\left(x_{0}\right)\right)$ (since it is the limit of the slopes of the secant lines through $P$ ).

- Figure 2.1.11
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-072.jpg?height=484&width=543&top_left_y=1577&top_left_x=1013)

If desired, we can let $h=x_{1}-x_{0}$, and rewrite (8) and (9) as

$$
\begin{gather*}
r_{\mathrm{ave}}=\frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h}  \tag{10}\\
r_{\mathrm{inst}}=\lim _{h \rightarrow 0} \frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h} \tag{11}
\end{gather*}
$$

Perform the calculations in Example 9 using Formulas (10) and (11).

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-073.jpg?height=369&width=473&top_left_y=1932&top_left_x=212)
- Figure 2.1.12

Example 9 Let $y=x^{2}+1$.
(a) Find the average rate of change of $y$ with respect to $x$ over the interval $[3,5]$.
(b) Find the instantaneous rate of change of $y$ with respect to $x$ when $x=-4$.

Solution (a). We will apply Formula (8) with $f(x)=x^{2}+1, x_{0}=3$, and $x_{1}=5$. This yields

$$
r_{\mathrm{ave}}=\frac{f\left(x_{1}\right)-f\left(x_{0}\right)}{x_{1}-x_{0}}=\frac{f(5)-f(3)}{5-3}=\frac{26-10}{2}=8
$$

Thus, $y$ increases an average of 8 units per unit increase in $x$ over the interval $[3,5]$.
Solution (b). We will apply Formula (9) with $f(x)=x^{2}+1$ and $x_{0}=-4$. This yields

$$
\begin{aligned}
r_{\mathrm{inst}} & =\lim _{x_{1} \rightarrow x_{0}} \frac{f\left(x_{1}\right)-f\left(x_{0}\right)}{x_{1}-x_{0}}=\lim _{x_{1} \rightarrow-4} \frac{f\left(x_{1}\right)-f(-4)}{x_{1}-(-4)}=\lim _{x_{1} \rightarrow-4} \frac{\left(x_{1}^{2}+1\right)-17}{x_{1}+4} \\
& =\lim _{x_{1} \rightarrow-4} \frac{x_{1}^{2}-16}{x_{1}+4}=\lim _{x_{1} \rightarrow-4} \frac{\left(x_{1}+4\right)\left(x_{1}-4\right)}{x_{1}+4}=\lim _{x_{1} \rightarrow-4}\left(x_{1}-4\right)=-8
\end{aligned}
$$

Thus, a small increase in $x$ from $x=-4$ will produce approximately an 8 -fold decrease in $y$.

## RATES OF CHANGE IN APPLICATIONS

In applied problems, average and instantaneous rates of change must be accompanied by appropriate units. In general, the units for a rate of change of $y$ with respect to $x$ are obtained by "dividing" the units of $y$ by the units of $x$ and then simplifying according to the standard rules of algebra. Here are some examples:

- If $y$ is in degrees Fahrenheit ( ${ }^{\circ} \mathrm{F}$ ) and $x$ is in inches (in), then a rate of change of $y$ with respect to $x$ has units of degrees Fahrenheit per inch ( ${ }^{\circ} \mathrm{F} / \mathrm{in}$ ).
- If $y$ is in feet per second ( $\mathrm{ft} / \mathrm{s}$ ) and $x$ is in seconds (s), then a rate of change of $y$ with respect to $x$ has units of feet per second per second ( $\mathrm{ft} / \mathrm{s} / \mathrm{s}$ ), which would usually be written as $\mathrm{ft} / \mathrm{s}^{2}$.
- If $y$ is in newton-meters $(\mathrm{N} \cdot \mathrm{m})$ and $x$ is in meters $(\mathrm{m})$, then a rate of change of $y$ with respect to $x$ has units of newtons ( N ), since $\mathrm{N} \cdot \mathrm{m} / \mathrm{m}=\mathrm{N}$.
- If $y$ is in foot-pounds ( $\mathrm{ft} \cdot \mathrm{lb}$ ) and $x$ is in hours (h), then a rate of change of $y$ with respect to $x$ has units of foot-pounds per hour ( $\mathrm{ft} \cdot \mathrm{lb} / \mathrm{h}$ ).

Example 10 The limiting factor in athletic endurance is cardiac output, that is, the volume of blood that the heart can pump per unit of time during an athletic competition. Figure 2.1.12 shows a stress-test graph of cardiac output $V$ in liters (L) of blood versus workload $W$ in kilogram-meters ( $\mathrm{kg} \cdot \mathrm{m}$ ) for 1 minute of weight lifting. This graph illustrates the known medical fact that cardiac output increases with the workload, but after reaching a peak value begins to decrease.
(a) Use the secant line shown in Figure 2.1.13a to estimate the average rate of change of cardiac output with respect to workload as the workload increases from 300 to $1200 \mathrm{~kg} \cdot \mathrm{~m}$.
(b) Use the line segment shown in Figure 2.1.13b to estimate the instantaneous rate of change of cardiac output with respect to workload at the point where the workload is $300 \mathrm{~kg} \cdot \mathrm{~m}$.

Solution (a). Using the estimated points $(300,13)$ and $(1200,19)$ to find the slope of the secant line, we obtain

$$
r_{\mathrm{ave}} \approx \frac{19-13}{1200-300} \approx 0.0067 \frac{\mathrm{~L}}{\mathrm{~kg} \cdot \mathrm{~m}}
$$

This means that on average a 1 -unit increase in workload produced a 0.0067 L increase in cardiac output over the interval.

Solution (b). We estimate the slope of the cardiac output curve at $W=300$ by sketching a line that appears to meet the curve at $W=300$ with slope equal to that of the curve (Figure 2.1.13b). Estimating points $(0,7)$ and $(900,25)$ on this line, we obtain

$$
r_{\mathrm{inst}} \approx \frac{25-7}{900-0}=0.02 \frac{\mathrm{~L}}{\mathrm{~kg} \cdot \mathrm{~m}}
$$

- Figure 2.1.13

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-074.jpg?height=320&width=466&top_left_y=802&top_left_x=804)
(a)

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-074.jpg?height=322&width=466&top_left_y=802&top_left_x=1291)
(b)

## QUICK CHECK EXERCISES 2.1 (See page 143 for answers.)

1. The slope $m_{\tan }$ of the tangent line to the curve $y=f(x)$ at the point $P\left(x_{0}, f\left(x_{0}\right)\right)$ is given by

$$
m_{\tan }=\lim _{x \rightarrow x_{0}} \square=\lim _{h \rightarrow 0}
$$

2. The tangent line to the curve $y=(x-1)^{2}$ at the point $(-1,4)$ has equation $4 x+y=0$. Thus, the value of the limit

$$
\lim _{x \rightarrow-1} \frac{x^{2}-2 x-3}{x+1}
$$

is $\_\_\_\_$ .
3. A particle is moving along an $s$-axis, where $s$ is in feet. During the first 5 seconds of motion, the position of the particle is given by

$$
s=10-(3-t)^{2}, \quad 0 \leq t \leq 5
$$

Use this position function to complete each part.
(a) Initially, the particle moves a distance of __ ft in the (positive/negative) __ direction; then it reverses direction, traveling a distance of ___ ft during the remainder of the 5 -second period.
(b) The average velocity of the particle over the 5 -second period is $\_\_\_\_$ .
4. Let $s=f(t)$ be the equation of a position versus time curve for a particle in rectilinear motion, where $s$ is in meters and $t$ is in seconds. Assume that $s=-1$ when $t=2$ and that the instantaneous velocity of the particle at this instant is 3 $\mathrm{m} / \mathrm{s}$. The equation of the tangent line to the position versus time curve at time $t=2$ is $\_\_\_\_$ .
5. Suppose that $y=x^{2}+x$.
(a) The average rate of change of $y$ with respect to $x$ over the interval $2 \leq x \leq 5$ is $\_\_\_\_$ .
(b) The instantaneous rate of change of $y$ with respect to $x$ at $x=2, r_{\text {inst }}$, is given by the limit $\_\_\_\_$ .

## EXERCISE SET 2.1

1. The accompanying figure on the next page shows the position versus time curve for an elevator that moves upward a distance of 60 m and then discharges its passengers.
(a) Estimate the instantaneous velocity of the elevator at $t=10 \mathrm{~s}$.
(b) Sketch a velocity versus time curve for the motion of the elevator for $0 \leq t \leq 20$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-075.jpg?height=351&width=483&top_left_y=196&top_left_x=268)
Figure Ex-1

2. The accompanying figure shows the position versus time curve for an automobile over a period of time of 10 s . Use the line segments shown in the figure to estimate the instantaneous velocity of the automobile at time $t=4 \mathrm{~s}$ and again at time $t=8 \mathrm{~s}$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-075.jpg?height=356&width=499&top_left_y=796&top_left_x=268)
Figure Ex-2

3. The accompanying figure shows the position versus time curve for a certain particle moving along a straight line. Estimate each of the following from the graph:
(a) the average velocity over the interval $0 \leq t \leq 3$
(b) the values of $t$ at which the instantaneous velocity is zero
(c) the values of $t$ at which the instantaneous velocity is either a maximum or a minimum
(d) the instantaneous velocity when $t=3 \mathrm{~s}$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-075.jpg?height=350&width=475&top_left_y=1569&top_left_x=268)
<Figure Ex-3

4. The accompanying figure shows the position versus time curves of four different particles moving on a straight line. For each particle, determine whether its instantaneous velocity is increasing or decreasing with time.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-075.jpg?height=233&width=790&top_left_y=2132&top_left_x=260)
- Figure Ex-4

## FOCUS ON CONCEPTS

5. If a particle moves at constant velocity, what can you say about its position versus time curve?
6. An automobile, initially at rest, begins to move along a straight track. The velocity increases steadily until suddenly the driver sees a concrete barrier in the road and applies the brakes sharply at time $t_{0}$. The car decelerates rapidly, but it is too late-the car crashes into the barrier at time $t_{1}$ and instantaneously comes to rest. Sketch a position versus time curve that might represent the motion of the car. Indicate how characteristics of your curve correspond to the events of this scenario.

7-10 For each exercise, sketch a curve and a line $L$ satisfying the stated conditions.
7. $L$ is tangent to the curve and intersects the curve in at least two points.
8. $L$ intersects the curve in exactly one point, but $L$ is not tangent to the curve.
9. $L$ is tangent to the curve at two different points.
10. $L$ is tangent to the curve at two different points and intersects the curve at a third point.

11-14 A function $y=f(x)$ and values of $x_{0}$ and $x_{1}$ are given.
(a) Find the average rate of change of $y$ with respect to $x$ over the interval $\left[x_{0}, x_{1}\right]$.
(b) Find the instantaneous rate of change of $y$ with respect to $x$ at the specified value of $x_{0}$.
(c) Find the instantaneous rate of change of $y$ with respect to $x$ at an arbitrary value of $x_{0}$.
(d) The average rate of change in part (a) is the slope of a certain secant line, and the instantaneous rate of change in part (b) is the slope of a certain tangent line. Sketch the graph of $y=f(x)$ together with those two lines.
11. $y=2 x^{2} ; x_{0}=0, x_{1}=1$
12. $y=x^{3} ; x_{0}=1, x_{1}=2$
13. $y=1 / x ; ~ x_{0}=2, ~ x_{1}=3$
14. $y=1 / x^{2} ; x_{0}=1, x_{1}=2$

15-18 A function $y=f(x)$ and an $x$-value $x_{0}$ are given.
(a) Find a formula for the slope of the tangent line to the graph of $f$ at a general point $x=x_{0}$.
(b) Use the formula obtained in part (a) to find the slope of the tangent line for the given value of $x_{0}$. □
15. $f(x)=x^{2}-1 ; x_{0}=-1$
16. $f(x)=x^{2}+3 x+2 ; x_{0}=2$
17. $f(x)=x+\sqrt{x} ; x_{0}=1$
18. $f(x)=1 / \sqrt{x} ; x_{0}=4$

19-22 True-False Determine whether the statement is true or false. Explain your answer.
19. If $\lim _{x \rightarrow 1} \frac{f(x)-f(1)}{x-1}=3$, then $\lim _{h \rightarrow 0} \frac{f(1+h)-f(1)}{h}=3$.
20. A tangent line to a curve $y=f(x)$ is a particular kind of secant line to the curve.
21. The velocity of an object represents a change in the object's position.
22. A 50 -foot horizontal metal beam is supported on either end by concrete pillars and a weight is placed on the middle of the beam. If $f(x)$ models how many inches the center of the beam sags when the weight measures $x$ tons, then the units of the rate of change of $y=f(x)$ with respect to $x$ are inches/ton.
23. Suppose that the outside temperature versus time curve over a 24 -hour period is as shown in the accompanying figure.
(a) Estimate the maximum temperature and the time at which it occurs.
(b) The temperature rise is fairly linear from 8 A.M. to 2 P.M. Estimate the rate at which the temperature is increasing during this time period.
(c) Estimate the time at which the temperature is decreasing most rapidly. Estimate the instantaneous rate of change of temperature with respect to time at this instant.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-076.jpg?height=483&width=652&top_left_y=1101&top_left_x=212)
- Figure Ex-23

24. The accompanying figure shows the graph of the pressure $p$ in atmospheres (atm) versus the volume $V$ in liters (L) of 1 mole of an ideal gas at a constant temperature of 300 K (kelvins). Use the line segments shown in the figure to estimate the rate of change of pressure with respect to volume at the points where $V=10 \mathrm{~L}$ and $V=25 \mathrm{~L}$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-076.jpg?height=303&width=433&top_left_y=1918&top_left_x=212)
-Figure Ex-24

25. The accompanying figure shows the graph of the height $h$ in centimeters versus the age $t$ in years of an individual from birth to age 20.
(a) When is the growth rate greatest?
(b) Estimate the growth rate at age 5.
(c) At approximately what age between 10 and 20 is the growth rate greatest? Estimate the growth rate at this age.
(d) Draw a rough graph of the growth rate versus age.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-076.jpg?height=388&width=501&top_left_y=476&top_left_x=1125)
\& Figure Ex-25

26. An object is released from rest (its initial velocity is zero) from the Empire State Building at a height of 1250 ft above street level (Figure Ex-26). The height of the object can be modeled by the position function $s=f(t)=1250-16 t^{2}$.
(a) Verify that the object is still falling at $t=5 \mathrm{~s}$.
(b) Find the average velocity of the object over the time interval from $t=5$ to $t=6 \mathrm{~s}$.
(c) Find the object's instantaneous velocity at time $t=5 \mathrm{~s}$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-076.jpg?height=488&width=229&top_left_y=1283&top_left_x=1127)
-Figure Ex-26

27. During the first 40 s of a rocket flight, the rocket is propelled straight up so that in $t$ seconds it reaches a height of $s=0.3 t^{3} \mathrm{ft}$.
(a) How high does the rocket travel in 40 s ?
(b) What is the average velocity of the rocket during the first 40 s ?
(c) What is the average velocity of the rocket during the first 1000 ft of its flight?
(d) What is the instantaneous velocity of the rocket at the end of 40 s ?
28. An automobile is driven down a straight highway such that after $0 \leq t \leq 12$ seconds it is $s=4.5 t^{2}$ feet from its initial position.
(cont.)
(a) Find the average velocity of the car over the interval [0,12].
(b) Find the instantaneous velocity of the car at $t=6$.
29. Writing Discuss how the tangent line to the graph of a function $y=f(x)$ at a point $P\left(x_{0}, f\left(x_{0}\right)\right)$ is defined in terms of secant lines to the graph through point $P$.
30. Writing A particle is in rectilinear motion during the time interval $0 \leq t \leq 2$. Explain the connection between the instantaneous velocity of the particle at time $t=1$ and the average velocities of the particle during portions of the interval $0 \leq t \leq 2$.

## QUICK CHECK ANSWERS 2.1

1. $\frac{f(x)-f\left(x_{0}\right)}{x-x_{0}} ; \frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h}$
2. -4
3. (a) 9; positive; 4
(b) $1 \mathrm{ft} / \mathrm{s}$
4. $s=3 t-7$
5. (a) 8 (b) $\lim _{x \rightarrow 2} \frac{\left(x^{2}+x\right)-6}{x-2}$ or $\lim _{h \rightarrow 0} \frac{\left[(2+h)^{2}+(2+h)\right]-6}{h}$.

### 2.2 THE DERIVATIVE FUNCTION

The expression

$$
\frac{f(x+h)-f(x)}{h}
$$

that appears in (2) is commonly called the difference quotient.

In this section we will discuss the concept of a "derivative," which is the primary mathematical tool that is used to calculate and study rates of change.

## DEFINITION OF THE DERIVATIVE FUNCTION

In the last section we showed that if the limit

$$
\lim _{h \rightarrow 0} \frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h}
$$

exists, then it can be interpreted either as the slope of the tangent line to the curve $y=f(x)$ at $x=x_{0}$ or as the instantaneous rate of change of $y$ with respect to $x$ at $x=x_{0}$ [see Formulas (2) and (11) of that section]. This limit is so important that it has a special notation:

$$
\begin{equation*}
f^{\prime}\left(x_{0}\right)=\lim _{h \rightarrow 0} \frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h} \tag{1}
\end{equation*}
$$

You can think of $f^{\prime}$ (read " $f$ prime") as a function whose input is $x_{0}$ and whose output is the number $f^{\prime}\left(x_{0}\right)$ that represents either the slope of the tangent line to $y=f(x)$ at $x=x_{0}$ or the instantaneous rate of change of $y$ with respect to $x$ at $x=x_{0}$. To emphasize this function point of view, we will replace $x_{0}$ by $x$ in (1) and make the following definition.
2.2.1 DEFINITION The function $f^{\prime}$ defined by the formula

$$
\begin{equation*}
f^{\prime}(x)=\lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h} \tag{2}
\end{equation*}
$$

is called the derivative off with respect to $\boldsymbol{x}$. The domain of $f^{\prime}$ consists of all $x$ in the domain of $f$ for which the limit exists.

The term "derivative" is used because the function $f^{\prime}$ is derived from the function $f$ by a limiting process.

Example 1 Find the derivative with respect to $x$ of $f(x)=x^{2}$, and use it to find the equation of the tangent line to $y=x^{2}$ at $x=2$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-078.jpg?height=555&width=443&top_left_y=196&top_left_x=168)
△ Figure 2.2.1

Solution. It follows from (2) that

$$
\begin{aligned}
f^{\prime}(x) & =\lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h}=\lim _{h \rightarrow 0} \frac{(x+h)^{2}-x^{2}}{h} \\
& =\lim _{h \rightarrow 0} \frac{x^{2}+2 x h+h^{2}-x^{2}}{h}=\lim _{h \rightarrow 0} \frac{2 x h+h^{2}}{h} \\
& =\lim _{h \rightarrow 0}(2 x+h)=2 x
\end{aligned}
$$

Thus, the slope of the tangent line to $y=x^{2}$ at $x=2$ is $f^{\prime}(2)=4$. Since $y=4$ if $x=2$, the point-slope form of the tangent line is

$$
y-4=4(x-2)
$$

which we can rewrite in slope-intercept form as $y=4 x-4$ (Figure 2.2.1).

You can think of $f^{\prime}$ as a "slope-producing function" in the sense that the value of $f^{\prime}(x)$ at $x=x_{0}$ is the slope of the tangent line to the graph of $f$ at $x=x_{0}$. This aspect of the derivative is illustrated in Figure 2.2.2, which shows the graphs of $f(x)=x^{2}$ and its derivative $f^{\prime}(x)=2 x$ (obtained in Example 1). The figure illustrates that the values of $f^{\prime}(x)=2 x$ at $x=-2,0$, and 2 correspond to the slopes of the tangent lines to the graph of $f(x)=x^{2}$ at those values of $x$.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-078.jpg?height=596&width=997&top_left_y=1129&top_left_x=786)

In general, if $f^{\prime}(x)$ is defined at $x=x_{0}$, then the point-slope form of the equation of the tangent line to the graph of $y=f(x)$ at $x=x_{0}$ may be found using the following steps.

Finding an Equation for the Tangent Line to $y=f(x)$ at $x=x_{0}$.
Step 1. Evaluate $f\left(x_{0}\right)$; the point of tangency is $\left(x_{0}, f\left(x_{0}\right)\right)$.
Step 2. Find $f^{\prime}(x)$ and evaluate $f^{\prime}\left(x_{0}\right)$, which is the slope $m$ of the line.
Step 3. Substitute the value of the slope $m$ and the point $\left(x_{0}, f\left(x_{0}\right)\right)$ into the point-slope form of the line

$$
y-f\left(x_{0}\right)=f^{\prime}\left(x_{0}\right)\left(x-x_{0}\right)
$$

or, equivalently,

$$
\begin{equation*}
y=f\left(x_{0}\right)+f^{\prime}\left(x_{0}\right)\left(x-x_{0}\right) \tag{3}
\end{equation*}
$$

In Solution (a), the binomial formula is used to expand $(x+h)^{3}$. This formula may be found on the front endpaper.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-079.jpg?height=472&width=459&top_left_y=692&top_left_x=216)
- Figure 2.2.3

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-079.jpg?height=239&width=405&top_left_y=1261&top_left_x=244)
Figure 2.2.4

At each value of $x$ the tangent line has slope $m$.

The result in Example 3 is consistent with our earlier observation that the rate of change of $y$ with respect to $x$ along a line $y=m x+b$ is constant and that constant is $m$.

## Example 2

(a) Find the derivative with respect to $x$ of $f(x)=x^{3}-x$.
(b) Graph $f$ and $f^{\prime}$ together, and discuss the relationship between the two graphs.

Solution (a).

$$
\begin{aligned}
f^{\prime}(x) & =\lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h} \\
& =\lim _{h \rightarrow 0} \frac{\left[(x+h)^{3}-(x+h)\right]-\left[x^{3}-x\right]}{h} \\
& =\lim _{h \rightarrow 0} \frac{\left[x^{3}+3 x^{2} h+3 x h^{2}+h^{3}-x-h\right]-\left[x^{3}-x\right]}{h} \\
& =\lim _{h \rightarrow 0} \frac{3 x^{2} h+3 x h^{2}+h^{3}-h}{h} \\
& =\lim _{h \rightarrow 0}\left[3 x^{2}+3 x h+h^{2}-1\right]=3 x^{2}-1
\end{aligned}
$$

Solution (b). Since $f^{\prime}(x)$ can be interpreted as the slope of the tangent line to the graph of $y=f(x)$ at $x$, it follows that $f^{\prime}(x)$ is positive where the tangent line has positive slope, is negative where the tangent line has negative slope, and is zero where the tangent line is horizontal. We leave it for you to verify that this is consistent with the graphs of $f(x)=x^{3}-x$ and $f^{\prime}(x)=3 x^{2}-1$ shown in Figure 2.2.3.

Example 3 At each value of $x$, the tangent line to a line $y=m x+b$ coincides with the line itself (Figure 2.2.4), and hence all tangent lines have slope $m$. This suggests geometrically that if $f(x)=m x+b$, then $f^{\prime}(x)=m$ for all $x$. This is confirmed by the following computations:

$$
\begin{aligned}
f^{\prime}(x) & =\lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h} \\
& =\lim _{h \rightarrow 0} \frac{[m(x+h)+b]-[m x+b]}{h} \\
& =\lim _{h \rightarrow 0} \frac{m h}{h}=\lim _{h \rightarrow 0} m=m
\end{aligned}
$$

## Example 4

(a) Find the derivative with respect to $x$ of $f(x)=\sqrt{x}$.
(b) Find the slope of the tangent line to $y=\sqrt{x}$ at $x=9$.
(c) Find the limits of $f^{\prime}(x)$ as $x \rightarrow 0^{+}$and as $x \rightarrow+\infty$, and explain what those limits say about the graph of $f$.

Solution (a). Recall from Example 4 of Section 2.1 that the slope of the tangent line to $y=\sqrt{x}$ at $x=x_{0}$ is given by $m_{\tan }=1 /\left(2 \sqrt{x_{0}}\right)$. Thus, $f^{\prime}(x)=1 /(2 \sqrt{x})$.

Solution (b). The slope of the tangent line at $x=9$ is $f^{\prime}(9)$. From part (a), this slope is $f^{\prime}(9)=1 /(2 \sqrt{9})=\frac{1}{6}$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-080.jpg?height=684&width=461&top_left_y=192&top_left_x=160)
△ Figure 2.2.5

Solution (c). The graphs of $f(x)=\sqrt{x}$ and $f^{\prime}(x)=1 /(2 \sqrt{x})$ are shown in Figure 2.2.5. Observe that $f^{\prime}(x)>0$ if $x>0$, which means that all tangent lines to the graph of $y=\sqrt{x}$ have positive slope at all points in this interval. Since

$$
\lim _{x \rightarrow 0^{+}} \frac{1}{2 \sqrt{x}}=+\infty \quad \text { and } \quad \lim _{x \rightarrow+\infty} \frac{1}{2 \sqrt{x}}=0
$$

the graph of $f$ becomes more and more vertical as $x \rightarrow 0^{+}$and more and more horizontal as $x \rightarrow+\infty$. $\square$

## COMPUTING INSTANTANEOUS VELOCITY

It follows from Formula (5) of Section 2.1 (with $t$ replacing $t_{0}$ ) that if $s=f(t)$ is the position function of a particle in rectilinear motion, then the instantaneous velocity at an arbitrary time $t$ is given by

$$
v_{\mathrm{inst}}=\lim _{h \rightarrow 0} \frac{f(t+h)-f(t)}{h}
$$

Since the right side of this equation is the derivative of the function $f$ (with $t$ rather than $x$ as the independent variable), it follows that if $f(t)$ is the position function of a particle in rectilinear motion, then the function

$$
\begin{equation*}
v(t)=f^{\prime}(t)=\lim _{h \rightarrow 0} \frac{f(t+h)-f(t)}{h} \tag{4}
\end{equation*}
$$

represents the instantaneous velocity of the particle at time $t$. Accordingly, we call (4) the instantaneous velocity function or, more simply, the velocity function of the particle.

- Example 5 Recall the particle from Example 5 of Section 2.1 with position function $s=f(t)=1+5 t-2 t^{2}$. Here $f(t)$ is measured in meters and $t$ is measured in seconds. Find the velocity function of the particle.

Solution. It follows from (4) that the velocity function is

$$
\begin{aligned}
v(t) & =\lim _{h \rightarrow 0} \frac{f(t+h)-f(t)}{h}=\lim _{h \rightarrow 0} \frac{\left[1+5(t+h)-2(t+h)^{2}\right]-\left[1+5 t-2 t^{2}\right]}{h} \\
& =\lim _{h \rightarrow 0} \frac{-2\left[t^{2}+2 t h+h^{2}-t^{2}\right]+5 h}{h}=\lim _{h \rightarrow 0} \frac{-4 t h-2 h^{2}+5 h}{h} \\
& =\lim _{h \rightarrow 0}(-4 t-2 h+5)=5-4 t
\end{aligned}
$$

where the units of velocity are meters per second.

## DIFFERENTIABILITY

It is possible that the limit that defines the derivative of a function $f$ may not exist at certain points in the domain of $f$. At such points the derivative is undefined. To account for this possibility we make the following definition.

### 2.2.2 DEFINITION A function $f$ is said to be differentiable at $\boldsymbol{x}_{\mathbf{0}}$ if the limit

$$
\begin{equation*}
f^{\prime}\left(x_{0}\right)=\lim _{h \rightarrow 0} \frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h} \tag{5}
\end{equation*}
$$

exists. If $f$ is differentiable at each point of the open interval ( $a, b$ ), then we say that it is differentiable on $(\boldsymbol{a}, \boldsymbol{b})$, and similarly for open intervals of the form $(a,+\infty),(-\infty, b)$, and $(-\infty,+\infty)$. In the last case we say that $f$ is differentiable everywhere.

Geometrically, a function $f$ is differentiable at $x_{0}$ if the graph of $f$ has a tangent line at $x_{0}$. Thus, $f$ is not differentiable at any point $x_{0}$ where the secant lines from $P\left(x_{0}, f\left(x_{0}\right)\right)$ to points $Q(x, f(x))$ distinct from $P$ do not approach a unique nonvertical limiting position as $x \rightarrow x_{0}$. Figure 2.2.6 illustrates two common ways in which a function that is continuous at $x_{0}$ can fail to be differentiable at $x_{0}$. These can be described informally as

- corner points
- points of vertical tangency

At a corner point, the slopes of the secant lines have different limits from the left and from the right, and hence the two-sided limit that defines the derivative does not exist (Figure 2.2.7). At a point of vertical tangency the slopes of the secant lines approach $+\infty$ or $-\infty$ from the left and from the right (Figure 2.2.8), so again the limit that defines the derivative does not exist.

- Figure 2.2.6

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-081.jpg?height=300&width=365&top_left_y=796&top_left_x=937)
Corner point

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-081.jpg?height=290&width=364&top_left_y=796&top_left_x=1377)

Point of vertical tangency

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-081.jpg?height=411&width=474&top_left_y=1283&top_left_x=474)
△ Figure 2.2.7

There are other less obvious circumstances under which a function may fail to be differentiable. (See Exercise 49, for example.)

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-081.jpg?height=463&width=411&top_left_y=1229&top_left_x=1053)
△ Figure 2.2.8

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-081.jpg?height=453&width=426&top_left_y=1241&top_left_x=1541)

Differentiability at $x_{0}$ can also be described informally in terms of the behavior of the graph of $f$ under increasingly stronger magnification at the point $P\left(x_{0}, f\left(x_{0}\right)\right)$ (Figure 2.2.9). If $f$ is differentiable at $x_{0}$, then under sufficiently strong magnification at $P$ the

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-081.jpg?height=415&width=1651&top_left_y=1958&top_left_x=326)
- Figure 2.2.9

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-082.jpg?height=353&width=467&top_left_y=428&top_left_x=160)
△ Figure 2.2.10

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-082.jpg?height=385&width=467&top_left_y=1271&top_left_x=156)
- Figure 2.2.11

A theorem that says "If statement $A$ is true, then statement $B$ is true" is equivalent to the theorem that says "If statement $B$ is not true, then statement $A$ is not true." The two theorems are called contrapositive forms of one another. Thus, Theorem 2.2.3 can be rewritten in contrapositive form as "If a function $f$ is not continuous at $x_{0}$, then $f$ is not differentiable at $x_{0} .^{\prime \prime}$
graph looks like a nonvertical line (the tangent line); if a corner point occurs at $x_{0}$, then no matter how great the magnification at $P$ the corner persists and the graph never looks like a nonvertical line; and if vertical tangency occurs at $x_{0}$, then the graph of $f$ looks like a vertical line under sufficiently strong magnification at $P$.

- Example 6 The graph of $y=|x|$ in Figure 2.2.10 has a corner at $x=0$, which implies that $f(x)=|x|$ is not differentiable at $x=0$.
(a) Prove that $f(x)=|x|$ is not differentiable at $x=0$ by showing that the limit in Definition 2.2.2 does not exist at $x=0$.
(b) Find a formula for $f^{\prime}(x)$.

Solution (a). From Formula (5) with $x_{0}=0$, the value of $f^{\prime}(0)$, if it were to exist, would be given by

$$
\begin{equation*}
f^{\prime}(0)=\lim _{h \rightarrow 0} \frac{f(0+h)-f(0)}{h}=\lim _{h \rightarrow 0} \frac{f(h)-f(0)}{h}=\lim _{h \rightarrow 0} \frac{|h|-|0|}{h}=\lim _{h \rightarrow 0} \frac{|h|}{h} \tag{6}
\end{equation*}
$$

But

$$
\frac{|h|}{h}=\left\{\begin{aligned}
1, & h>0 \\
-1, & h<0
\end{aligned}\right.
$$

so that

$$
\lim _{h \rightarrow 0^{-}} \frac{|h|}{h}=-1 \quad \text { and } \quad \lim _{h \rightarrow 0^{+}} \frac{|h|}{h}=1
$$

Since these one-sided limits are not equal, the two-sided limit in (5) does not exist, and hence $f$ is not differentiable at $x=0$.

Solution (b). A formula for the derivative of $f(x)=|x|$ can be obtained by writing $|x|$ in piecewise form and treating the cases $x>0$ and $x<0$ separately. If $x>0$, then $f(x)=x$ and $f^{\prime}(x)=1$; if $x<0$, then $f(x)=-x$ and $f^{\prime}(x)=-1$. Thus,

$$
f^{\prime}(x)=\left\{\begin{aligned}
1, & x>0 \\
-1, & x<0
\end{aligned}\right.
$$

The graph of $f^{\prime}$ is shown in Figure 2.2.11. Observe that $f^{\prime}$ is not continuous at $x=0$, so this example shows that a function that is continuous everywhere may have a derivative that fails to be continuous everywhere.

## THE RELATIONSHIP BETWEEN DIFFERENTIABILITY AND CONTINUITY

We already know that functions are not differentiable at corner points and points of vertical tangency. The next theorem shows that functions are not differentiable at points of discontinuity. We will do this by proving that if $f$ is differentiable at a point, then it must be continuous at that point.

### 2.2.3 THEOREM If a function $f$ is differentiable at $x_{0}$, then $f$ is continuous at $x_{0}$.

PROOF We are given that $f$ is differentiable at $x_{0}$, so it follows from (5) that $f^{\prime}\left(x_{0}\right)$ exists and is given by

$$
\begin{equation*}
f^{\prime}\left(x_{0}\right)=\lim _{h \rightarrow 0}\left[\frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h}\right] \tag{7}
\end{equation*}
$$

## WARNING

The converse of Theorem 2.2.3 is false; that is, a function may be continuous at a point but not differentiable at that point. This occurs, for example, at corner points of continuous functions. For instance, $f(x)=|x|$ is continuous at $x=0$ but not differentiable there (Example 6).

To show that $f$ is continuous at $x_{0}$, we must show that $\lim _{x \rightarrow x_{0}} f(x)=f\left(x_{0}\right)$ or, equivalently,

$$
\lim _{x \rightarrow x_{0}}\left[f(x)-f\left(x_{0}\right)\right]=0
$$

Expressing this in terms of the variable $h=x-x_{0}$, we must prove that

$$
\lim _{h \rightarrow 0}\left[f\left(x_{0}+h\right)-f\left(x_{0}\right)\right]=0
$$

However, this can be proved using (7) as follows:

$$
\begin{aligned}
\lim _{h \rightarrow 0}\left[f\left(x_{0}+h\right)-f\left(x_{0}\right)\right] & =\lim _{h \rightarrow 0}\left[\frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h} \cdot h\right] \\
& =\lim _{h \rightarrow 0}\left[\frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h}\right] \cdot \lim _{h \rightarrow 0} h \\
& =f^{\prime}\left(x_{0}\right) \cdot 0=0
\end{aligned}
$$

The relationship between continuity and differentiability was of great historical significance in the development of calculus. In the early nineteenth century mathematicians believed that if a continuous function had many points of nondifferentiability, these points, like the tips of a sawblade, would have to be separated from one another and joined by smooth curve segments (Figure 2.2.12). This misconception was corrected by a series of discoveries beginning in 1834. In that year a Bohemian priest, philosopher, and mathematician named Bernhard Bolzano discovered a procedure for constructing a continuous function that is not differentiable at any point. Later, in 1860, the great German mathematician Karl Weierstrass (biography on p. 102) produced the first formula for such a function. The graphs of such functions are impossible to draw; it is as if the corners are so numerous that any segment of the curve, when suitably enlarged, reveals more corners. The discovery of these functions was important in that it made mathematicians distrustful of their geometric intuition and more reliant on precise mathematical proof. Recently, such functions have started to play a fundamental role in the study of geometric objects called fractals. Fractals have revealed an order to natural phenomena that were previously dismissed as random and chaotic.

- Figure 2.2.12
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-083.jpg?height=250&width=764&top_left_y=1587&top_left_x=957)

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-083.jpg?height=225&width=183&top_left_y=1974&top_left_x=176)

Bernhard Bolzano (1781-1848) Bolzano, the son of an art dealer, was born in Prague, Bohemia (Czech Republic). He was educated at the University of Prague, and eventually won enough mathematical fame to be recommended for a mathematics chair there. However, Bolzano became an ordained Roman Catholic priest, and in 1805 he was appointed to a chair of Philosophy at the University of Prague. Bolzano was a man of great human compassion; he spoke out for educational reform, he voiced the right of individual conscience over government demands, and he lectured on the absurdity
of war and militarism. His views so disenchanted Emperor Franz I of Austria that the emperor pressed the Archbishop of Prague to have Bolzano recant his statements. Bolzano refused and was then forced to retire in 1824 on a small pension. Bolzano's main contribution to mathematics was philosophical. His work helped convince mathematicians that sound mathematics must ultimately rest on rigorous proof rather than intuition. In addition to his work in mathematics, Bolzano investigated problems concerning space, force, and wave propagation.

## DERIVATIVES AT THE ENDPOINTS OF AN INTERVAL

If a function $f$ is defined on a closed interval $[a, b]$ but not outside that interval, then $f^{\prime}$ is not defined at the endpoints of the interval because derivatives are two-sided limits. To deal with this we define left-hand derivatives and right-hand derivatives by

$$
f_{-}^{\prime}(x)=\lim _{h \rightarrow 0^{-}} \frac{f(x+h)-f(x)}{h} \quad \text { and } \quad f_{+}^{\prime}(x)=\lim _{h \rightarrow 0^{+}} \frac{f(x+h)-f(x)}{h}
$$

respectively. These are called one-sided derivatives. Geometrically, $f_{-}^{\prime}(x)$ is the limit of the slopes of the secant lines as $x$ is approached from the left and $f_{+}^{\prime}(x)$ is the limit of the

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-084.jpg?height=278&width=467&top_left_y=578&top_left_x=160)
△ Figure 2.2.13

Later, the symbols $d y$ and $d x$ will be given specific meanings. However, for the time being do not regard $d y / d x$ as a ratio, but rather as a single symbol denoting the derivative. slopes of the secant lines as $x$ is approached from the right. For a closed interval $[a, b]$, we will understand the derivative at the left endpoint to be $f_{+}^{\prime}(a)$ and at the right endpoint to be $f_{-}^{\prime}(b)$ (Figure 2.2.13).

In general, we will say that $f$ is differentiable on an interval of the form $[a, b],[a,+\infty)$, $(-\infty, b],[a, b)$, or $(a, b]$ if it is differentiable at all points inside the interval and the appropriate one-sided derivative exists at each included endpoint.

It can be proved that a function $f$ is continuous from the left at those points where the left-hand derivative exists and is continuous from the right at those points where the right-hand derivative exists.

## OTHER DERIVATIVE NOTATIONS

The process of finding a derivative is called differentiation. You can think of differentiation as an operation on functions that associates a function $f^{\prime}$ with a function $f$. When the independent variable is $x$, the differentiation operation is also commonly denoted by

$$
f^{\prime}(x)=\frac{d}{d x}[f(x)] \quad \text { or } \quad f^{\prime}(x)=D_{x}[f(x)]
$$

In the case where there is a dependent variable $y=f(x)$, the derivative is also commonly denoted by

$$
f^{\prime}(x)=y^{\prime}(x) \quad \text { or } \quad f^{\prime}(x)=\frac{d y}{d x}
$$

With the above notations, the value of the derivative at a point $x_{0}$ can be expressed as

$$
f^{\prime}\left(x_{0}\right)=\left.\frac{d}{d x}[f(x)]\right|_{x=x_{0}}, \quad f^{\prime}\left(x_{0}\right)=\left.D_{x}[f(x)]\right|_{x=x_{0}}, \quad f^{\prime}\left(x_{0}\right)=y^{\prime}\left(x_{0}\right), \quad f^{\prime}\left(x_{0}\right)=\left.\frac{d y}{d x}\right|_{x=x_{0}}
$$

If a variable $w$ changes from some initial value $w_{0}$ to some final value $w_{1}$, then the final value minus the initial value is called an increment in $w$ and is denoted by

$$
\begin{equation*}
\Delta w=w_{1}-w_{0} \tag{8}
\end{equation*}
$$

Increments can be positive or negative, depending on whether the final value is larger or smaller than the initial value. The increment symbol in (8) should not be interpreted as a product; rather, $\Delta w$ should be regarded as a single symbol representing the change in the value of $w$.

It is common to regard the variable $h$ in the derivative formula

$$
\begin{equation*}
f^{\prime}(x)=\lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h} \tag{9}
\end{equation*}
$$

as an increment $\Delta x$ in $x$ and write (9) as

$$
\begin{equation*}
f^{\prime}(x)=\lim _{\Delta x \rightarrow 0} \frac{f(x+\Delta x)-f(x)}{\Delta x} \tag{10}
\end{equation*}
$$

Moreover, if $y=f(x)$, then the numerator in (10) can be regarded as the increment

$$
\begin{equation*}
\Delta y=f(x+\Delta x)-f(x) \tag{11}
\end{equation*}
$$

in which case

$$
\begin{equation*}
\frac{d y}{d x}=\lim _{\Delta x \rightarrow 0} \frac{\Delta y}{\Delta x}=\lim _{\Delta x \rightarrow 0} \frac{f(x+\Delta x)-f(x)}{\Delta x} \tag{12}
\end{equation*}
$$

The geometric interpretations of $\Delta x$ and $\Delta y$ are shown in Figure 2.2.14.
Sometimes it is desirable to express derivatives in a form that does not use increments at all. For example, if we let $w=x+h$ in Formula (9), then $w \rightarrow x$ as $h \rightarrow 0$, so we can rewrite that formula as

$$
\begin{equation*}
f^{\prime}(x)=\lim _{w \rightarrow x} \frac{f(w)-f(x)}{w-x} \tag{13}
\end{equation*}
$$

(Compare Figures 2.2.14 and 2.2.15.)

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-085.jpg?height=587&width=624&top_left_y=861&top_left_x=664)
- Figure 2.2.14

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-085.jpg?height=581&width=568&top_left_y=867&top_left_x=1397)
- Figure 2.2.15

When letters other than $x$ and $y$ are used for the independent and dependent variables, the derivative notations must be adjusted accordingly. Thus, for example, if $s=f(t)$ is the position function for a particle in rectilinear motion, then the velocity function $v(t)$ in (4) can be expressed as

$$
\begin{equation*}
v(t)=\frac{d s}{d t}=\lim _{\Delta t \rightarrow 0} \frac{\Delta s}{\Delta t}=\lim _{\Delta t \rightarrow 0} \frac{f(t+\Delta t)-f(t)}{\Delta t} \tag{14}
\end{equation*}
$$

## QUICK CHECK EXERCISES 2.2 (See page 155 for answers.)

1. The function $f^{\prime}(x)$ is defined by the formula

$$
f^{\prime}(x)=\lim _{h \rightarrow 0}
$$

2. (a) The derivative of $f(x)=x^{2}$ is $f^{\prime}(x)=$ $\_\_\_\_$ .
(b) The derivative of $f(x)=\sqrt{x}$ is $f^{\prime}(x)=$ $\_\_\_\_$ .
3. Suppose that the line $2 x+3 y=5$ is tangent to the graph of $y=f(x)$ at $x=1$. The value of $f(1)$ is $\_\_\_\_$ and the value of $f^{\prime}(1)$ is $\_\_\_\_$ .
4. Which theorem guarantees us that if

$$
\lim _{h \rightarrow 0} \frac{f\left(x_{0}+h\right)-f\left(x_{0}\right)}{h}
$$

exists, then $\lim _{x \rightarrow x_{0}} f(x)=f\left(x_{0}\right)$ ?

1. Use the graph of $y=f(x)$ in the accompanying figure to estimate the value of $f^{\prime}(1), f^{\prime}(3), f^{\prime}(5)$, and $f^{\prime}(6)$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-086.jpg?height=373&width=363&top_left_y=404&top_left_x=196)
Figure Ex-1

2. For the function graphed in the accompanying figure, arrange the numbers $0, f^{\prime}(-3), f^{\prime}(0), f^{\prime}(2)$, and $f^{\prime}(4)$ in increasing order.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-086.jpg?height=353&width=373&top_left_y=973&top_left_x=198)
Figure Ex-2

## FOCUS ON CONCEPTS

3. (a) If you are given an equation for the tangent line at the point ( $a, f(a)$ ) on a curve $y=f(x)$, how would you go about finding $f^{\prime}(a)$ ?
(b) Given that the tangent line to the graph of $y=f(x)$ at the point $(2,5)$ has the equation $y=3 x-1$, find $f^{\prime}(2)$.
(c) For the function $y=f(x)$ in part (b), what is the instantaneous rate of change of $y$ with respect to $x$ at $x=2$ ?
4. Given that the tangent line to $y=f(x)$ at the point $(1,2)$ passes through the point $(-1,-1)$, find $f^{\prime}(1)$.
5. Sketch the graph of a function $f$ for which $f(0)=-1$, $f^{\prime}(0)=0, f^{\prime}(x)<0$ if $x<0$, and $f^{\prime}(x)>0$ if $x>0$.
6. Sketch the graph of a function $f$ for which $f(0)=0$, $f^{\prime}(0)=0$, and $f^{\prime}(x)>0$ if $x<0$ or $x>0$.
7. Given that $f(3)=-1$ and $f^{\prime}(3)=5$, find an equation for the tangent line to the graph of $y=f(x)$ at $x=3$.
8. Given that $f(-2)=3$ and $f^{\prime}(-2)=-4$, find an equation for the tangent line to the graph of $y=f(x)$ at $x=-2$.

9-14 Use Definition 2.2.1 to find $f^{\prime}(x)$, and then find the tangent line to the graph of $y=f(x)$ at $x=a$.
9. $f(x)=2 x^{2} ; a=1$
10. $f(x)=1 / x^{2} ; a=-1$
11. $f(x)=x^{3} ; a=0$
12. $f(x)=2 x^{3}+1 ; a=-1$
13. $f(x)=\sqrt{x+1} ; a=8$
14. $f(x)=\sqrt{2 x+1} ; a=4$

15-20 Use Formula (12) to find $d y / d x$.
15. $y=\frac{1}{x}$
16. $y=\frac{1}{x+1}$
17. $y=x^{2}-x$
18. $y=x^{4}$
19. $y=\frac{1}{\sqrt{x}}$
20. $y=\frac{1}{\sqrt{x-1}}$

21-22 Use Definition 2.2.1 (with appropriate change in notation) to obtain the derivative requested.
21. Find $f^{\prime}(t)$ if $f(t)=4 t^{2}+t$.
22. Find $d V / d r$ if $V=\frac{4}{3} \pi r^{3}$.

## FOCUS ON CONCEPTS

23. Match the graphs of the functions shown in (a)-(f) with the graphs of their derivatives in (A)-(F).

(a)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-086.jpg?height=227&width=225&top_left_y=1253&top_left_x=1125)

(b)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-086.jpg?height=227&width=219&top_left_y=1253&top_left_x=1397)

(c)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-086.jpg?height=227&width=228&top_left_y=1253&top_left_x=1657)

(d)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-086.jpg?height=226&width=221&top_left_y=1547&top_left_x=1127)

(e)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-086.jpg?height=226&width=221&top_left_y=1549&top_left_x=1395)

(f)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-086.jpg?height=230&width=224&top_left_y=1545&top_left_x=1661)

(A)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-086.jpg?height=227&width=219&top_left_y=1838&top_left_x=1129)

(B)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-086.jpg?height=227&width=223&top_left_y=1836&top_left_x=1397)

(C)

(B)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-086.jpg?height=227&width=220&top_left_y=1838&top_left_x=1665)

(D)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-086.jpg?height=225&width=227&top_left_y=2134&top_left_x=1123)

(E)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-086.jpg?height=227&width=225&top_left_y=2134&top_left_x=1395)

(F)

(E)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-086.jpg?height=225&width=220&top_left_y=2134&top_left_x=1665)

24. Let $f(x)=\sqrt{1-x^{2}}$. Use a geometric argument to find $f^{\prime}(\sqrt{2} / 2)$.

25-26 Sketch the graph of the derivative of the function whose graph is shown.
25.

(a)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-087.jpg?height=223&width=219&top_left_y=420&top_left_x=312)

(b)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-087.jpg?height=223&width=217&top_left_y=420&top_left_x=574)

(c)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-087.jpg?height=227&width=220&top_left_y=420&top_left_x=820)

26. 

(a)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-087.jpg?height=230&width=223&top_left_y=676&top_left_x=312)

(b)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-087.jpg?height=226&width=225&top_left_y=678&top_left_x=568)

(c)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-087.jpg?height=228&width=220&top_left_y=676&top_left_x=822)

27-30 True-False Determine whether the statement is true or false. Explain your answer.
27. If a curve $y=f(x)$ has a horizontal tangent line at $x=a$, then $f^{\prime}(a)$ is not defined.
28. If the tangent line to the graph of $y=f(x)$ at $x=-2$ has negative slope, then $f^{\prime}(-2)<0$.
29. If a function $f$ is continuous at $x=0$, then $f$ is differentiable at $x=0$.
30. If a function $f$ is differentiable at $x=0$, then $f$ is continuous at $x=0$.

31-32 The given limit represents $f^{\prime}(a)$ for some function $f$ and some number $a$. Find $f(x)$ and $a$ in each case.
31.
(a) $\lim _{\Delta x \rightarrow 0} \frac{\sqrt{1+\Delta x}-1}{\Delta x} \quad$ (b) $\lim _{x_{1} \rightarrow 3} \frac{x_{1}^{2}-9}{x_{1}-3}$
32.
(a) $\lim _{h \rightarrow 0} \frac{\cos (\pi+h)+1}{h}$
(b) $\lim _{x \rightarrow 1} \frac{x^{7}-1}{x-1}$
33. Find $d y /\left.d x\right|_{x=1}$, given that $y=1-x^{2}$.
34. Find $d y /\left.d x\right|_{x=-2}$, given that $y=(x+2) / x$.
35. Find an equation for the line that is tangent to the curve $y=x^{3}-2 x+1$ at the point $(0,1)$, and use a graphing utility to graph the curve and its tangent line on the same screen.
36. Use a graphing utility to graph the following on the same screen: the curve $y=x^{2} / 4$, the tangent line to this curve at $x=1$, and the secant line joining the points $(0,0)$ and $(2,1)$ on this curve.
37. Let $f(x)=2^{x}$. Estimate $f^{\prime}(1)$ by
(a) using a graphing utility to zoom in at an appropriate point until the graph looks like a straight line, and then estimating the slope
(b) using a calculating utility to estimate the limit in Formula (13) by making a table of values for a succession of values of $w$ approaching 1 .
38. Let $f(x)=\sin x$. Estimate $f^{\prime}(\pi / 4)$ by
(a) using a graphing utility to zoom in at an appropriate point until the graph looks like a straight line, and then estimating the slope
(b) using a calculating utility to estimate the limit in Formula (13) by making a table of values for a succession of values of $w$ approaching $\pi / 4$.

39-40 The function $f$ whose graph is shown below has values as given in the accompanying table.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-087.jpg?height=266&width=313&top_left_y=610&top_left_x=1125)

| $x$ | -1 | 0 | 1 | 2 | 3 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| $f(x)$ | 1.56 | 0.58 | 2.12 | 2.34 | 2.2 |

39. (a) Use data from the table to calculate the difference quotients

$$
\frac{f(3)-f(1)}{3-1}, \quad \frac{f(2)-f(1)}{2-1}, \quad \frac{f(2)-f(0)}{2-0}
$$

(b) Using the graph of $y=f(x)$, indicate which difference quotient in part (a) best approximates $f^{\prime}(1)$ and which difference quotient gives the worst approximation to $f^{\prime}(1)$.
40. Use data from the table to approximate the derivative values.
(a) $f^{\prime}(0.5)$
(b) $f^{\prime}(2.5)$

## FOCUS ON CONCEPTS

41. Suppose that the cost of drilling $x$ feet for an oil well is $C=f(x)$ dollars.
(a) What are the units of $f^{\prime}(x)$ ?
(b) In practical terms, what does $f^{\prime}(x)$ mean in this case?
(c) What can you say about the sign of $f^{\prime}(x)$ ?
(d) Estimate the cost of drilling an additional foot, starting at a depth of 300 ft , given that $f^{\prime}(300)=1000$.
42. A paint manufacturing company estimates that it can sell $g=f(p)$ gallons of paint at a price of $p$ dollars per gallon.
(a) What are the units of $d g / d p$ ?
(b) In practical terms, what does $d g / d p$ mean in this case?
(c) What can you say about the sign of $d g / d p$ ?
(d) Given that $d g /\left.d p\right|_{p=10}=-100$, what can you say about the effect of increasing the price from $\$ 10$ per gallon to $\$ 11$ per gallon?
43. It is a fact that when a flexible rope is wrapped around a rough cylinder, a small force of magnitude $F_{0}$ at one end can resist a large force of magnitude $F$ at the other end. The size of $F$ depends on the angle $\theta$ through which the rope is wrapped around the cylinder (see the
accompanying figure). The figure shows the graph of $F$ (in pounds) versus $\theta$ (in radians), where $F$ is the magnitude of the force that can be resisted by a force with magnitude $F_{0}=10 \mathrm{lb}$ for a certain rope and cylinder.
(a) Estimate the values of $F$ and $d F / d \theta$ when the angle $\theta=10$ radians.
(b) It can be shown that the force $F$ satisfies the equation $d F / d \theta=\mu F$, where the constant $\mu$ is called the coefficient of friction. Use the results in part (a) to estimate the value of $\mu$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-088.jpg?height=458&width=776&top_left_y=610&top_left_x=208)
- Figure Ex-43

44. The accompanying figure shows the velocity versus time curve for a rocket in outer space where the only significant force on the rocket is from its engines. It can be shown that the mass $M(t)$ (in slugs) of the rocket at time $t$ seconds satisfies the equation

$$
M(t)=\frac{T}{d v / d t}
$$

where $T$ is the thrust (in lb ) of the rocket's engines and $v$ is the velocity (in $\mathrm{ft} / \mathrm{s}$ ) of the rocket. The thrust of the first stage of a Saturn V rocket is $T=7,680,982 \mathrm{lb}$. Use this value of $T$ and the line segment in the figure to estimate the mass of the rocket at time $t=100$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-088.jpg?height=328&width=511&top_left_y=1701&top_left_x=236)
\& Figure Ex-44

45. According to Newton's Law of Cooling, the rate of change of an object's temperature is proportional to the difference between the temperature of the object and that of the surrounding medium. The accompanying figure shows the graph of the temperature $T$ (in degrees Fahrenheit) versus time $t$ (in minutes) for a cup of coffee, initially with a temperature of $200^{\circ} \mathrm{F}$, that is allowed to cool in a room with a constant temperature of $75^{\circ} \mathrm{F}$. (a) Estimate $T$ and $d T / d t$ when $t=10 \mathrm{~min}$.
(b) Newton's Law of Cooling can be expressed as

$$
\frac{d T}{d t}=k\left(T-T_{0}\right)
$$

where $k$ is the constant of proportionality and $T_{0}$ is the temperature (assumed constant) of the surrounding medium. Use the results in part (a) to estimate the value of $k$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-088.jpg?height=442&width=463&top_left_y=514&top_left_x=1149)
Figure Ex-45

46. Show that $f(x)$ is continuous but not differentiable at the indicated point. Sketch the graph of $f$.
(a) $f(x)=\sqrt[3]{x}, x=0$
(b) $f(x)=\sqrt[3]{(x-2)^{2}}, x=2$
47. Show that

$$
f(x)= \begin{cases}x^{2}+1, & x \leq 1 \\ 2 x, & x>1\end{cases}
$$

is continuous and differentiable at $x=1$. Sketch the graph of $f$.
48. Show that

$$
f(x)= \begin{cases}x^{2}+2, & x \leq 1 \\ x+2, & x>1\end{cases}
$$

is continuous but not differentiable at $x=1$. Sketch the graph of $f$.
49. Show that

$$
f(x)= \begin{cases}x \sin (1 / x), & x \neq 0 \\ 0, & x=0\end{cases}
$$

is continuous but not differentiable at $x=0$. Sketch the graph of $f$ near $x=0$. (See Figure 1.6.6 and the remark following Example 5 in Section 1.6.)
50. Show that

$$
f(x)= \begin{cases}x^{2} \sin (1 / x), & x \neq 0 \\ 0, & x=0\end{cases}
$$

is continuous and differentiable at $x=0$. Sketch the graph of $f$ near $x=0$.

## FOCUS ON CONCEPTS

51. Suppose that a function $f$ is differentiable at $x_{0}$ and that $f^{\prime}\left(x_{0}\right)>0$. Prove that there exists an open interval containing $x_{0}$ such that if $x_{1}$ and $x_{2}$ are any two points in this interval with $x_{1}<x_{0}<x_{2}$, then $f\left(x_{1}\right)<f\left(x_{0}\right)<f\left(x_{2}\right)$.
52. Suppose that a function $f$ is differentiable at $x_{0}$ and define $g(x)=f(m x+b)$, where $m$ and $b$ are constants. Prove that if $x_{1}$ is a point at which $m x_{1}+b=x_{0}$, then $g(x)$ is differentiable at $x_{1}$ and $g^{\prime}\left(x_{1}\right)=m f^{\prime}\left(x_{0}\right)$.
53. Suppose that a function $f$ is differentiable at $x=0$ with $f(0)=f^{\prime}(0)=0$, and let $y=m x, m \neq 0$, denote any line of nonzero slope through the origin.
(a) Prove that there exists an open interval containing 0 such that for all nonzero $x$ in this interval $|f(x)|<\left|\frac{1}{2} m x\right|$. [Hint: Let $\epsilon=\frac{1}{2}|m|$ and apply Definition 1.4.1 to (5) with $x_{0}=0$.]
(b) Conclude from part (a) and the triangle inequality that there exists an open interval containing 0 such that $|f(x)|<|f(x)-m x|$ for all $x$ in this interval.
(c) Explain why the result obtained in part (b) may be interpreted to mean that the tangent line to the graph
of $f$ at the origin is the best linear approximation to $f$ at that point.
54. Suppose that $f$ is differentiable at $x_{0}$. Modify the argument of Exercise 53 to prove that the tangent line to the graph of $f$ at the point $P\left(x_{0}, f\left(x_{0}\right)\right)$ provides the best linear approximation to $f$ at $P$. [Hint: Suppose that $y=f\left(x_{0}\right)+m\left(x-x_{0}\right)$ is any line through $P\left(x_{0}, f\left(x_{0}\right)\right)$ with slope $m \neq f^{\prime}\left(x_{0}\right)$. Apply Definition 1.4.1 to (5) with $x=x_{0}+h$ and $\epsilon=\frac{1}{2}\left|f^{\prime}\left(x_{0}\right)-m\right|$.]
55. Writing Write a paragraph that explains what it means for a function to be differentiable. Include examples of functions that are not differentiable as well as examples of functions that are differentiable.
56. Writing Explain the relationship between continuity and differentiability.

## QUICK CHECK ANSWERS 2.2

1. $\frac{f(x+h)-f(x)}{h}$
2. (a) $2 x$
(b) $\frac{1}{2 \sqrt{x}}$
3. $1 ;-\frac{2}{3}$
4. Theorem 2.2.3: If $f$ is differentiable at $x_{0}$, then $f$ is continuous at $x_{0}$.

### 2.3 INTRODUCTION TO TECHNIQUES OF DIFFERENTIATION

In the last section we defined the derivative of a function $f$ as a limit, and we used that limit to calculate a few simple derivatives. In this section we will develop some important theorems that will enable us to calculate derivatives more efficiently.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-089.jpg?height=268&width=467&top_left_y=1593&top_left_x=216)
- Figure 2.3.1

The tangent line to the graph of $f(x)=c$ has slope 0 for all $x$.

## DERIVATIVE OF A CONSTANT

The simplest kind of function is a constant function $f(x)=c$. Since the graph of $f$ is a horizontal line of slope 0 , the tangent line to the graph of $f$ has slope 0 for every $x$; and hence we can see geometrically that $f^{\prime}(x)=0$ (Figure 2.3.1). We can also see this algebraically since

$$
f^{\prime}(x)=\lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h}=\lim _{h \rightarrow 0} \frac{c-c}{h}=\lim _{h \rightarrow 0} 0=0
$$

Thus, we have established the following result.
2.3.1 THEOREM The derivative of a constant function is 0 ; that is, if $c$ is any real number, then

$$
\begin{equation*}
\frac{d}{d x}[c]=0 \tag{1}
\end{equation*}
$$

## Example 1

$$
\frac{d}{d x}[1]=0, \quad \frac{d}{d x}[-3]=0, \quad \frac{d}{d x}[\pi]=0, \quad \frac{d}{d x}[-\sqrt{2}]=0
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-090.jpg?height=373&width=373&top_left_y=275&top_left_x=204)
- Figure 2.3.2

The tangent line to the graph of $f(x)=x$ has slope 1 for all $x$.

Verify that Formulas (2), (3), and (4) are the special cases of (5) in which $n=1,2$, and 3 .

The binomial formula can be found on the front endpaper of the text. Replacing $y$ by $h$ in this formula yields the identity used in the proof of Theorem 2.3.2.

## DERIVATIVES OF POWER FUNCTIONS

The simplest power function is $f(x)=x$. Since the graph of $f$ is a line of slope 1 , it follows from Example 3 of Section 2.2 that $f^{\prime}(x)=1$ for all $x$ (Figure 2.3.2). In other words,

$$
\begin{equation*}
\frac{d}{d x}[x]=1 \tag{2}
\end{equation*}
$$

Example 1 of Section 2.2 shows that the power function $f(x)=x^{2}$ has derivative $f^{\prime}(x)= 2 x$. From Example 2 in that section one can infer that the power function $f(x)=x^{3}$ has derivative $f^{\prime}(x)=3 x^{2}$. That is,

$$
\begin{equation*}
\frac{d}{d x}\left[x^{2}\right]=2 x \quad \text { and } \quad \frac{d}{d x}\left[x^{3}\right]=3 x^{2} \tag{3-4}
\end{equation*}
$$

These results are special cases of the following more general result.
2.3.2 THEOREM (The Power Rule) If $n$ is a positive integer, then

$$
\begin{equation*}
\frac{d}{d x}\left[x^{n}\right]=n x^{n-1} \tag{5}
\end{equation*}
$$

proof Let $f(x)=x^{n}$. Thus, from the definition of a derivative and the binomial formula for expanding the expression $(x+h)^{n}$, we obtain

$$
\begin{aligned}
\frac{d}{d x}\left[x^{n}\right] & =f^{\prime}(x)=\lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h}=\lim _{h \rightarrow 0} \frac{(x+h)^{n}-x^{n}}{h} \\
& =\lim _{h \rightarrow 0} \frac{\left[x^{n}+n x^{n-1} h+\frac{n(n-1)}{2!} x^{n-2} h^{2}+\cdots+n x h^{n-1}+h^{n}\right]-x^{n}}{h} \\
& =\lim _{h \rightarrow 0} \frac{n x^{n-1} h+\frac{n(n-1)}{2!} x^{n-2} h^{2}+\cdots+n x h^{n-1}+h^{n}}{h} \\
& =\lim _{h \rightarrow 0}\left[n x^{n-1}+\frac{n(n-1)}{2!} x^{n-2} h+\cdots+n x h^{n-2}+h^{n-1}\right] \\
& =n x^{n-1}+0+\cdots+0+0 \\
& =n x^{n-1}
\end{aligned}
$$

## Example 2

$$
\frac{d}{d x}\left[x^{4}\right]=4 x^{3}, \quad \frac{d}{d x}\left[x^{5}\right]=5 x^{4}, \quad \frac{d}{d t}\left[t^{12}\right]=12 t^{11}
$$

Although our proof of the power rule in Formula (5) applies only to positive integer powers of $x$, it is not difficult to show that the same formula holds for all integer powers of $x$ (Exercise 82). Also, we saw in Example 4 of Section 2.2 that

$$
\begin{equation*}
\frac{d}{d x}[\sqrt{x}]=\frac{1}{2 \sqrt{x}} \tag{6}
\end{equation*}
$$

which can be expressed as

$$
\frac{d}{d x}\left[x^{1 / 2}\right]=\frac{1}{2} x^{-1 / 2}=\frac{1}{2} x^{(1 / 2)-1}
$$

Thus, Formula (5) is valid for $n=\frac{1}{2}$, as well. In fact, it can be shown that this formula holds for any real exponent. We state this more general result for our use now, although we won't be prepared to prove it until Chapter 3.

### 2.3.3 THEOREM (Extended Power Rule) If $r$ is any real number, then

$$
\begin{equation*}
\frac{d}{d x}\left[x^{r}\right]=r x^{r-1} \tag{7}
\end{equation*}
$$

In words, to differentiate a power function, decrease the constant exponent by one and multiply the resulting power function by the original exponent.

## Example 3

$$
\begin{aligned}
& \frac{d}{d x}\left[x^{\pi}\right]=\pi x^{\pi-1} \\
& \frac{d}{d x}\left[\frac{1}{x}\right]=\frac{d}{d x}\left[x^{-1}\right]=(-1) x^{-1-1}=-x^{-2}=-\frac{1}{x^{2}} \\
& \frac{d}{d w}\left[\frac{1}{w^{100}}\right]=\frac{d}{d w}\left[w^{-100}\right]=-100 w^{-101}=-\frac{100}{w^{101}} \\
& \frac{d}{d x}\left[x^{4 / 5}\right]=\frac{4}{5} x^{(4 / 5)-1}=\frac{4}{5} x^{-1 / 5} \\
& \frac{d}{d x}[\sqrt[3]{x}]=\frac{d}{d x}\left[x^{1 / 3}\right]=\frac{1}{3} x^{-2 / 3}=\frac{1}{3 \sqrt[3]{x^{2}}}
\end{aligned}
$$

## DERIVATIVE OF A CONSTANT TIMES A FUNCTION

Formula (8) can also be expressed in function notation as

$$
(c f)^{\prime}=c f^{\prime}
$$

2.3.4 THEOREM (Constant Multiple Rule) If $f$ is differentiable at $x$ and $c$ is any real number, then $c f$ is also differentiable at $x$ and

$$
\begin{equation*}
\frac{d}{d x}[c f(x)]=c \frac{d}{d x}[f(x)] \tag{8}
\end{equation*}
$$

## PROOF

$$
\begin{aligned}
\frac{d}{d x}[c f(x)] & =\lim _{h \rightarrow 0} \frac{c f(x+h)-c f(x)}{h} \\
& =\lim _{h \rightarrow 0} c\left[\frac{f(x+h)-f(x)}{h}\right] \\
& =c \lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h} \quad \begin{array}{l}
\text { A constant factor can be } \\
\text { moved through a limit sign. }
\end{array} \\
& =c \frac{d}{d x}[f(x)]
\end{aligned}
$$

In words, a constant factor can be moved through a derivative sign.

Formulas (9) and (10) can also be expressed as

$$
\begin{aligned}
& (f+g)^{\prime}=f^{\prime}+g^{\prime} \\
& (f-g)^{\prime}=f^{\prime}-g^{\prime}
\end{aligned}
$$

## Example 4

$$
\begin{aligned}
& \frac{d}{d x}\left[4 x^{8}\right]=4 \frac{d}{d x}\left[x^{8}\right]=4\left[8 x^{7}\right]=32 x^{7} \\
& \frac{d}{d x}\left[-x^{12}\right]=(-1) \frac{d}{d x}\left[x^{12}\right]=-12 x^{11} \\
& \frac{d}{d x}\left[\frac{\pi}{x}\right]=\pi \frac{d}{d x}\left[x^{-1}\right]=\pi\left(-x^{-2}\right)=-\frac{\pi}{x^{2}}
\end{aligned}
$$

## DERIVATIVES OF SUMS AND DIFFERENCES

2.3.5 THEOREM (Sum and Difference Rules) If $f$ and $g$ are differentiable at $x$, then so are $f+g$ and $f-g$ and

$$
\begin{align*}
& \frac{d}{d x}[f(x)+g(x)]=\frac{d}{d x}[f(x)]+\frac{d}{d x}[g(x)]  \tag{9}\\
& \frac{d}{d x}[f(x)-g(x)]=\frac{d}{d x}[f(x)]-\frac{d}{d x}[g(x)] \tag{10}
\end{align*}
$$

PROOF Formula (9) can be proved as follows:

$$
\begin{aligned}
\frac{d}{d x}[f(x)+g(x)] & =\lim _{h \rightarrow 0} \frac{[f(x+h)+g(x+h)]-[f(x)+g(x)]}{h} \\
& =\lim _{h \rightarrow 0} \frac{[f(x+h)-f(x)]+[g(x+h)-g(x)]}{h} \\
& =\lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h}+\lim _{h \rightarrow 0} \frac{g(x+h)-g(x)}{h} \quad \begin{array}{l}
\text { The limit of a sum is } \\
\text { the sum of the limits. }
\end{array} \\
& =\frac{d}{d x}[f(x)]+\frac{d}{d x}[g(x)]
\end{aligned}
$$

Formula (10) can be proved in a similar manner or, alternatively, by writing $f(x)-g(x)$ as $f(x)+(-1) g(x)$ and then applying Formulas (8) and (9).

In words, the derivative of a sum equals the sum of the derivatives, and the derivative of a difference equals the difference of the derivatives.

## Example 5

$$
\begin{aligned}
\frac{d}{d x}\left[2 x^{6}+x^{-9}\right] & =\frac{d}{d x}\left[2 x^{6}\right]+\frac{d}{d x}\left[x^{-9}\right]=12 x^{5}+(-9) x^{-10}=12 x^{5}-9 x^{-10} \\
\frac{d}{d x}\left[\frac{\sqrt{x}-2 x}{\sqrt{x}}\right] & =\frac{d}{d x}[1-2 \sqrt{x}] \\
& =\frac{d}{d x}[1]-\frac{d}{d x}[2 \sqrt{x}]=0-2\left(\frac{1}{2 \sqrt{x}}\right)=-\frac{1}{\sqrt{x}} \quad \text { See Formula (6). }
\end{aligned}
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-093.jpg?height=463&width=463&top_left_y=973&top_left_x=216)
△ Figure 2.3.3

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-093.jpg?height=474&width=469&top_left_y=1611&top_left_x=212)
Figure 2.3.4

Although Formulas (9) and (10) are stated for sums and differences of two functions, they can be extended to any finite number of functions. For example, by grouping and applying Formula (9) twice we obtain

$$
(f+g+h)^{\prime}=[(f+g)+h]^{\prime}=(f+g)^{\prime}+h^{\prime}=f^{\prime}+g^{\prime}+h^{\prime}
$$

As illustrated in the following example, the constant multiple rule together with the extended versions of the sum and difference rules can be used to differentiate any polynomial.

Example 6 Find $d y / d x$ if $y=3 x^{8}-2 x^{5}+6 x+1$.
Solution.

$$
\begin{aligned}
\frac{d y}{d x} & =\frac{d}{d x}\left[3 x^{8}-2 x^{5}+6 x+1\right] \\
& =\frac{d}{d x}\left[3 x^{8}\right]-\frac{d}{d x}\left[2 x^{5}\right]+\frac{d}{d x}[6 x]+\frac{d}{d x}[1] \\
& =24 x^{7}-10 x^{4}+6
\end{aligned}
$$

Example 7 At what points, if any, does the graph of $y=x^{3}-3 x+4$ have a horizontal tangent line?

Solution. Horizontal tangent lines have slope zero, so we must find those values of $x$ for which $y^{\prime}(x)=0$. Differentiating yields

$$
y^{\prime}(x)=\frac{d}{d x}\left[x^{3}-3 x+4\right]=3 x^{2}-3
$$

Thus, horizontal tangent lines occur at those values of $x$ for which $3 x^{2}-3=0$, that is, if $x=-1$ or $x=1$. The corresponding points on the curve $y=x^{3}-3 x+4$ are $(-1,6)$ and $(1,2)$ (see Figure 2.3.3).

Example 8 Find the area of the triangle formed from the coordinate axes and the tangent line to the curve $y=5 x^{-1}-\frac{1}{5} x$ at the point $(5,0)$.

Solution. Since the derivative of $y$ with respect to $x$ is

$$
y^{\prime}(x)=\frac{d}{d x}\left[5 x^{-1}-\frac{1}{5} x\right]=\frac{d}{d x}\left[5 x^{-1}\right]-\frac{d}{d x}\left[\frac{1}{5} x\right]=-5 x^{-2}-\frac{1}{5}
$$

the slope of the tangent line at the point $(5,0)$ is $y^{\prime}(5)=-\frac{2}{5}$. Thus, the equation of the tangent line at this point is

$$
y-0=-\frac{2}{5}(x-5) \quad \text { or equivalently } \quad y=-\frac{2}{5} x+2
$$

Since the $y$-intercept of this line is 2 , the right triangle formed from the coordinate axes and the tangent line has legs of length 5 and 2 , so its area is $\frac{1}{2}(5)(2)=5$ (Figure 2.3.4).

## HIGHER DERIVATIVES

The derivative $f^{\prime}$ of a function $f$ is itself a function and hence may have a derivative of its own. If $f^{\prime}$ is differentiable, then its derivative is denoted by $f^{\prime \prime}$ and is called the second derivative of $f$. As long as we have differentiability, we can continue the process
of differentiating to obtain third, fourth, fifth, and even higher derivatives of $f$. These successive derivatives are denoted by

$$
f^{\prime}, \quad f^{\prime \prime}=\left(f^{\prime}\right)^{\prime}, \quad f^{\prime \prime \prime}=\left(f^{\prime \prime}\right)^{\prime}, \quad f^{(4)}=\left(f^{\prime \prime \prime}\right)^{\prime}, \quad f^{(5)}=\left(f^{(4)}\right)^{\prime}, \ldots
$$

If $y=f(x)$, then successive derivatives can also be denoted by

$$
y^{\prime}, \quad y^{\prime \prime}, \quad y^{\prime \prime \prime}, \quad y^{(4)}, \quad y^{(5)}, \ldots
$$

Other common notations are

$$
\begin{aligned}
y^{\prime} & =\frac{d y}{d x}=\frac{d}{d x}[f(x)] \\
y^{\prime \prime} & =\frac{d^{2} y}{d x^{2}}=\frac{d}{d x}\left[\frac{d}{d x}[f(x)]\right]=\frac{d^{2}}{d x^{2}}[f(x)] \\
y^{\prime \prime \prime} & =\frac{d^{3} y}{d x^{3}}=\frac{d}{d x}\left[\frac{d^{2}}{d x^{2}}[f(x)]\right]=\frac{d^{3}}{d x^{3}}[f(x)] \\
\vdots & \vdots
\end{aligned}
$$

These are called, in succession, the first derivative, the second derivative, the third derivative, and so forth. The number of times that $f$ is differentiated is called the order of the derivative. A general $n$th order derivative can be denoted by

$$
\begin{equation*}
\frac{d^{n} y}{d x^{n}}=f^{(n)}(x)=\frac{d^{n}}{d x^{n}}[f(x)] \tag{11}
\end{equation*}
$$

and the value of a general $n$th order derivative at a specific point $x=x_{0}$ can be denoted by

$$
\begin{equation*}
\left.\frac{d^{n} y}{d x^{n}}\right|_{x=x_{0}}=f^{(n)}\left(x_{0}\right)=\left.\frac{d^{n}}{d x^{n}}[f(x)]\right|_{x=x_{0}} \tag{12}
\end{equation*}
$$

- Example 9 If $f(x)=3 x^{4}-2 x^{3}+x^{2}-4 x+2$, then

$$
\begin{aligned}
& f^{\prime}(x)=12 x^{3}-6 x^{2}+2 x-4 \\
& f^{\prime \prime}(x)=36 x^{2}-12 x+2 \\
& f^{\prime \prime \prime}(x)=72 x-12 \\
& f^{(4)}(x)=72 \\
& f^{(5)}(x)=0 \\
& \vdots \\
& f^{(n)}(x)=0 \quad(n \geq 5)
\end{aligned}
$$

We will discuss the significance of second derivatives and those of higher order in later sections.

## QUICK CHECK EXERCISES 2.3 (See page 163 for answers.)

1. In each part, determine $f^{\prime}(x)$.
(a) $f(x)=\sqrt{6}$
(b) $f(x)=\sqrt{6} x$
(c) $f(x)=6 \sqrt{x}$
(d) $f(x)=\sqrt{6 x}$
2. In parts (a)-(d), determine $f^{\prime}(x)$.
(a) $f(x)=x^{3}+5$
(b) $f(x)=x^{2}\left(x^{3}+5\right)$
(c) $f(x)=\frac{x^{3}+5}{2}$
(d) $f(x)=\frac{x^{3}+5}{x^{2}}$
3. The slope of the tangent line to the curve $y=x^{2}+4 x+7$ at $x=1$ is $\_\_\_\_$ .
4. If $f(x)=3 x^{3}-3 x^{2}+x+1$, then $f^{\prime \prime}(x)=$ $\_\_\_\_$

1-8 Find $d y / d x$.

1. $y=4 x^{7}$
2. $y=-3 x^{12}$
3. $y=3 x^{8}+2 x+1$
4. $y=\frac{1}{2}\left(x^{4}+7\right)$
5. $y=\pi^{3}$
6. $y=\sqrt{2} x+(1 / \sqrt{2})$
7. $y=-\frac{1}{3}\left(x^{7}+2 x-9\right)$
8. $y=\frac{x^{2}+1}{5}$

9-16 Find $f^{\prime}(x)$.
9. $f(x)=x^{-3}+\frac{1}{x^{7}}$
10. $f(x)=\sqrt{x}+\frac{1}{x}$
11. $f(x)=-3 x^{-8}+2 \sqrt{x}$
12. $f(x)=7 x^{-6}-5 \sqrt{x}$
13. $f(x)=x^{e}+\frac{1}{x^{\sqrt{10}}}$
14. $f(x)=\sqrt[3]{\frac{8}{x}}$
15. $f(x)=a x^{3}+b x^{2}+c x+d \quad(a, b, c, d$ constant $)$
16. $f(x)=\frac{1}{a}\left(x^{2}+\frac{1}{b} x+c\right) \quad(a, b, c$ constant $)$

17-18 Find $y^{\prime}(1)$.
17. $y=5 x^{2}-3 x+1$
18. $y=\frac{x^{3 / 2}+2}{x}$

19-20 Find $d x / d t$.
19. $x=t^{2}-t$
20. $x=\frac{t^{2}+1}{3 t}$

21-24 Find $d y /\left.d x\right|_{x=1}$.
21. $y=1+x+x^{2}+x^{3}+x^{4}+x^{5}$
22. $y=\frac{1+x+x^{2}+x^{3}+x^{4}+x^{5}+x^{6}}{x^{3}}$
23. $y=(1-x)(1+x)\left(1+x^{2}\right)\left(1+x^{4}\right)$
24. $y=x^{24}+2 x^{12}+3 x^{8}+4 x^{6}$

25-26 Approximate $f^{\prime}(1)$ by considering the difference quotient

$$
\frac{f(1+h)-f(1)}{h}
$$

for values of $h$ near 0 , and then find the exact value of $f^{\prime}(1)$ by differentiating.
25. $f(x)=x^{3}-3 x+1$
26. $f(x)=\frac{1}{x^{2}}$

27-28 Use a graphing utility to estimate the value of $f^{\prime}(1)$ by zooming in on the graph of $f$, and then compare your estimate to the exact value obtained by differentiating.
27. $f(x)=\frac{x^{2}+1}{x}$
28. $f(x)=\frac{x+2 x^{3 / 2}}{\sqrt{x}}$

29-32 Find the indicated derivative.
29. $\frac{d}{d t}\left[16 t^{2}\right]$
30. $\frac{d C}{d r}$, where $C=2 \pi r$
31. $V^{\prime}(r)$, where $V=\pi r^{3}$
32. $\frac{d}{d \alpha}\left[2 \alpha^{-1}+\alpha\right]$

33-36 True-False Determine whether the statement is true or false. Explain your answer.
33. If $f$ and $g$ are differentiable at $x=2$, then

$$
\left.\frac{d}{d x}[f(x)-8 g(x)]\right|_{x=2}=f^{\prime}(2)-8 g^{\prime}(2)
$$

34. If $f(x)$ is a cubic polynomial, then $f^{\prime}(x)$ is a quadratic polynomial.
35. If $f^{\prime}(2)=5$, then

$$
\left.\frac{d}{d x}\left[4 f(x)+x^{3}\right]\right|_{x=2}=\left.\frac{d}{d x}[4 f(x)+8]\right|_{x=2}=4 f^{\prime}(2)=20
$$

36. If $f(x)=x^{2}\left(x^{4}-x\right)$, then

$$
f^{\prime \prime}(x)=\frac{d}{d x}\left[x^{2}\right] \cdot \frac{d}{d x}\left[x^{4}-x\right]=2 x\left(4 x^{3}-1\right)
$$

37. A spherical balloon is being inflated.
(a) Find a general formula for the instantaneous rate of change of the volume $V$ with respect to the radius $r$, given that $V=\frac{4}{3} \pi r^{3}$.
(b) Find the rate of change of $V$ with respect to $r$ at the instant when the radius is $r=5$.
38. Find $\frac{d}{d \lambda}\left[\frac{\lambda \lambda_{0}+\lambda^{6}}{2-\lambda_{0}}\right] \quad$ ( $\lambda_{0}$ is constant).
39. Find an equation of the tangent line to the graph of $y=f(x)$ at $x=-3$ if $f(-3)=2$ and $f^{\prime}(-3)=5$.
40. Find an equation of the tangent line to the graph of $y=f(x)$ at $x=2$ if $f(2)=-2$ and $f^{\prime}(2)=-1$.

41-42 Find $d^{2} y / d x^{2}$. □
41.
(a) $y=7 x^{3}-5 x^{2}+x$
(b) $y=12 x^{2}-2 x+3$
(c) $y=\frac{x+1}{x}$
(d) $y=\left(5 x^{2}-3\right)\left(7 x^{3}+x\right)$
42.
(a) $y=4 x^{7}-5 x^{3}+2 x$
(b) $y=3 x+2$
(c) $y=\frac{3 x-2}{5 x}$
(d) $y=\left(x^{3}-5\right)(2 x+3)$

43-44 Find $y^{\prime \prime \prime}$.
43.
(a) $y=x^{-5}+x^{5}$
(b) $y=1 / x$
(c) $y=a x^{3}+b x+c$
( $a, b, c$ constant)
44.
(a) $y=5 x^{2}-4 x+7$
(b) $y=3 x^{-2}+4 x^{-1}+x$
(c) $y=a x^{4}+b x^{2}+c \quad(a, b, c$ constant $)$
45. Find
(a) $f^{\prime \prime \prime}(2)$, where $f(x)=3 x^{2}-2$
(b) $\left.\frac{d^{2} y}{d x^{2}}\right|_{x=1}$, where $y=6 x^{5}-4 x^{2}$
(c) $\left.\frac{d^{4}}{d x^{4}}\left[x^{-3}\right]\right|_{x=1}$.
46. Find
(a) $y^{\prime \prime \prime}(0)$, where $y=4 x^{4}+2 x^{3}+3$
(b) $\left.\frac{d^{4} y}{d x^{4}}\right|_{x=1}$, where $y=\frac{6}{x^{4}}$.
47. Show that $y=x^{3}+3 x+1$ satisfies $y^{\prime \prime \prime}+x y^{\prime \prime}-2 y^{\prime}=0$.
48. Show that if $x \neq 0$, then $y=1 / x$ satisfies the equation $x^{3} y^{\prime \prime}+x^{2} y^{\prime}-x y=0$.

49-50 Use a graphing utility to make rough estimates of the locations of all horizontal tangent lines, and then find their exact locations by differentiating.
49. $y=\frac{1}{3} x^{3}-\frac{3}{2} x^{2}+2 x \quad$ 50. $y=\frac{x^{2}+9}{x}$

## FOCUS ON CONCEPTS

51. Find a function $y=a x^{2}+b x+c$ whose graph has an $x$-intercept of 1 , a $y$-intercept of -2 , and a tangent line with a slope of -1 at the $y$-intercept.
52. Find $k$ if the curve $y=x^{2}+k$ is tangent to the line $y=2 x$.
53. Find the $x$-coordinate of the point on the graph of $y=x^{2}$ where the tangent line is parallel to the secant line that cuts the curve at $x=-1$ and $x=2$.
54. Find the $x$-coordinate of the point on the graph of $y=\sqrt{x}$ where the tangent line is parallel to the secant line that cuts the curve at $x=1$ and $x=4$.
55. Find the coordinates of all points on the graph of $y=1-x^{2}$ at which the tangent line passes through the point $(2,0)$.
56. Show that any two tangent lines to the parabola $y=a x^{2}$, $a \neq 0$, intersect at a point that is on the vertical line halfway between the points of tangency.
57. Suppose that $L$ is the tangent line at $x=x_{0}$ to the graph of the cubic equation $y=a x^{3}+b x$. Find the $x$-coordinate of the point where $L$ intersects the graph a second time.
58. Show that the segment of the tangent line to the graph of $y=1 / x$ that is cut off by the coordinate axes is bisected by the point of tangency.
59. Show that the triangle that is formed by any tangent line to the graph of $y=1 / x, x>0$, and the coordinate axes has an area of 2 square units.
60. Find conditions on $a, b, c$, and $d$ so that the graph of the polynomial $f(x)=a x^{3}+b x^{2}+c x+d$ has
(a) exactly two horizontal tangents
(b) exactly one horizontal tangent
(c) no horizontal tangents.
61. Newton's Law of Universal Gravitation states that the magnitude $F$ of the force exerted by a point with mass $M$ on a
point with mass $m$ is

$$
F=\frac{G m M}{r^{2}}
$$

where $G$ is a constant and $r$ is the distance between the bodies. Assuming that the points are moving, find a formula for the instantaneous rate of change of $F$ with respect to $r$.
62. In the temperature range between $0^{\circ} \mathrm{C}$ and $700^{\circ} \mathrm{C}$ the resistance $R$ [in ohms $(\Omega)$ ] of a certain platinum resistance thermometer is given by

$$
R=10+0.04124 T-1.779 \times 10^{-5} T^{2}
$$

where $T$ is the temperature in degrees Celsius. Where in the interval from $0^{\circ} \mathrm{C}$ to $700^{\circ} \mathrm{C}$ is the resistance of the thermometer most sensitive and least sensitive to temperature changes? [Hint: Consider the size of $d R / d T$ in the interval $0 \leq T \leq 700$.]

63-64 Use a graphing utility to make rough estimates of the intervals on which $f^{\prime}(x)>0$, and then find those intervals exactly by differentiating.
63. $f(x)=x-\frac{1}{x}$
64. $f(x)=x^{3}-3 x$

65-68 You are asked in these exercises to determine whether a piecewise-defined function $f$ is differentiable at a value $x=x_{0}$, where $f$ is defined by different formulas on different sides of $x_{0}$. You may use without proof the following result, which is a consequence of the Mean-Value Theorem (discussed in Section 4.8). Theorem. Let $f$ be continuous at $x_{0}$ and suppose that $\lim _{x \rightarrow x_{0}} f^{\prime}(x)$ exists. Then $f$ is differentiable at $x_{0}$, and $f^{\prime}\left(x_{0}\right)=\lim _{x \rightarrow x_{0}} f^{\prime}(x)$.
65. Show that

$$
f(x)= \begin{cases}x^{2}+x+1, & x \leq 1 \\ 3 x, & x>1\end{cases}
$$

is continuous at $x=1$. Determine whether $f$ is differentiable at $x=1$. If so, find the value of the derivative there. Sketch the graph of $f$.
66. Let

$$
f(x)= \begin{cases}x^{2}-16 x, & x<9 \\ \sqrt{x}, & x \geq 9\end{cases}
$$

Is $f$ continuous at $x=9$ ? Determine whether $f$ is differentiable at $x=9$. If so, find the value of the derivative there.
67. Let

$$
f(x)= \begin{cases}x^{2}, & x \leq 1 \\ \sqrt{x}, & x>1\end{cases}
$$

Determine whether $f$ is differentiable at $x=1$. If so, find the value of the derivative there.
68. Let

$$
f(x)= \begin{cases}x^{3}+\frac{1}{16}, & x<\frac{1}{2} \\ \frac{3}{4} x^{2}, & x \geq \frac{1}{2}\end{cases}
$$

Determine whether $f$ is differentiable at $x=\frac{1}{2}$. If so, find the value of the derivative there.
69. Find all points where $f$ fails to be differentiable. Justify your answer.
(a) $f(x)=|3 x-2|$
(b) $f(x)=\left|x^{2}-4\right|$
70. In each part, compute $f^{\prime}, f^{\prime \prime}, f^{\prime \prime \prime}$, and then state the formula for $f^{(n)}$.
(a) $f(x)=1 / x$
(b) $f(x)=1 / x^{2}$
[Hint: The expression $(-1)^{n}$ has a value of 1 if $n$ is even and -1 if $n$ is odd. Use this expression in your answer.]
71. (a) Prove:

$$
\begin{aligned}
& \frac{d^{2}}{d x^{2}}[c f(x)]=c \frac{d^{2}}{d x^{2}}[f(x)] \\
& \frac{d^{2}}{d x^{2}}[f(x)+g(x)]=\frac{d^{2}}{d x^{2}}[f(x)]+\frac{d^{2}}{d x^{2}}[g(x)]
\end{aligned}
$$

(b) Do the results in part (a) generalize to $n$th derivatives? Justify your answer.
72. Let $f(x)=x^{8}-2 x+3$; find

$$
\lim _{w \rightarrow 2} \frac{f^{\prime}(w)-f^{\prime}(2)}{w-2}
$$

73. (a) Find $f^{(n)}(x)$ if $f(x)=x^{n}, n=1,2,3, \ldots$.
(b) Find $f^{(n)}(x)$ if $f(x)=x^{k}$ and $n>k$, where $k$ is a positive integer.
(c) Find $f^{(n)}(x)$ if

$$
f(x)=a_{0}+a_{1} x+a_{2} x^{2}+\cdots+a_{n} x^{n}
$$

74. (a) Prove: If $f^{\prime \prime}(x)$ exists for each $x$ in ( $a, b$ ), then both $f$ and $f^{\prime}$ are continuous on $(a, b)$.
(b) What can be said about the continuity of $f$ and its derivatives if $f^{(n)}(x)$ exists for each $x$ in $(a, b)$ ?
75. Let $f(x)=(m x+b)^{n}$, where $m$ and $b$ are constants and $n$ is an integer. Use the result of Exercise 52 in Section 2.2 to prove that $f^{\prime}(x)=n m(m x+b)^{n-1}$.

76-77 Verify the result of Exercise 75 for $f(x)$.
76. $f(x)=(2 x+3)^{2}$
77. $f(x)=(3 x-1)^{3}$

78-81 Use the result of Exercise 75 to compute the derivative of the given function $f(x)$.
78. $f(x)=\frac{1}{x-1}$
79. $f(x)=\frac{3}{(2 x+1)^{2}}$
80. $f(x)=\frac{x}{x+1}$
81. $f(x)=\frac{2 x^{2}+4 x+3}{x^{2}+2 x+1}$
82. The purpose of this exercise is to extend the power rule (Theorem 2.3.2) to any integer exponent. Let $f(x)=x^{n}$, where $n$ is any integer. If $n>0$, then $f^{\prime}(x)=n x^{n-1}$ by Theorem 2.3.2.
(a) Show that the conclusion of Theorem 2.3.2 holds in the case $n=0$.
(b) Suppose that $n<0$ and set $m=-n$ so that

$$
f(x)=x^{n}=x^{-m}=\frac{1}{x^{m}}
$$

Use Definition 2.2.1 and Theorem 2.3.2 to show that

$$
\frac{d}{d x}\left[\frac{1}{x^{m}}\right]=-m x^{m-1} \cdot \frac{1}{x^{2 m}}
$$

and conclude that $f^{\prime}(x)=n x^{n-1}$.

## QUICK CHECK ANSWERS 2.3

1. (a) 0
(b) $\sqrt{6}$
(c) $3 / \sqrt{x}$
(d) $\sqrt{6} /(2 \sqrt{x})$
2. (a) $3 x^{2}$
(b) $5 x^{4}+10 x$
(c) $\frac{3}{2} x^{2}$
(d) $1-10 x^{-3}$
3. 6
4. $18 x-6$

### 2.4 THE PRODUCT AND QUOTIENT RULES

In this section we will develop techniques for differentiating products and quotients of functions whose derivatives are known.

## DERIVATIVE OF A PRODUCT

You might be tempted to conjecture that the derivative of a product of two functions is the product of their derivatives. However, a simple example will show this to be false. Consider the functions

$$
f(x)=x \quad \text { and } \quad g(x)=x^{2}
$$

The product of their derivatives is

$$
f^{\prime}(x) g^{\prime}(x)=(1)(2 x)=2 x
$$

Formula (1) can also be expressed as $(f \cdot g)^{\prime}=f \cdot g^{\prime}+g \cdot f^{\prime}$
but their product is $h(x)=f(x) g(x)=x^{3}$, so the derivative of the product is

$$
h^{\prime}(x)=3 x^{2}
$$

Thus, the derivative of the product is not equal to the product of the derivatives. The correct relationship, which is credited to Leibniz, is given by the following theorem.
2.4.1 THEOREM (The Product Rule) If $f$ and $g$ are differentiable at $x$, then so is the product $f \cdot g$, and

$$
\begin{equation*}
\frac{d}{d x}[f(x) g(x)]=f(x) \frac{d}{d x}[g(x)]+g(x) \frac{d}{d x}[f(x)] \tag{1}
\end{equation*}
$$

PROOF Whereas the proofs of the derivative rules in the last section were straightforward applications of the derivative definition, a key step in this proof involves adding and subtracting the quantity $f(x+h) g(x)$ to the numerator in the derivative definition. This yields

$$
\begin{aligned}
\frac{d}{d x}[f(x) g(x)] & =\lim _{h \rightarrow 0} \frac{f(x+h) \cdot g(x+h)-f(x) \cdot g(x)}{h} \\
& =\lim _{h \rightarrow 0} \frac{f(x+h) g(x+h)-f(x+h) g(x)+f(x+h) g(x)-f(x) g(x)}{h} \\
& =\lim _{h \rightarrow 0}\left[f(x+h) \cdot \frac{g(x+h)-g(x)}{h}+g(x) \cdot \frac{f(x+h)-f(x)}{h}\right] \\
& =\lim _{h \rightarrow 0} f(x+h) \cdot \lim _{h \rightarrow 0} \frac{g(x+h)-g(x)}{h}+\lim _{h \rightarrow 0} g(x) \cdot \lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h} \\
& =\left[\lim _{h \rightarrow 0} f(x+h)\right] \frac{d}{d x}[g(x)]+\left[\lim _{h \rightarrow 0} g(x)\right] \frac{d}{d x}[f(x)] \\
& =f(x) \frac{d}{d x}[g(x)]+g(x) \frac{d}{d x}[f(x)]
\end{aligned}
$$

[Note: In the last step $f(x+h) \rightarrow f(x)$ as $h \rightarrow 0$ because $f$ is continuous at $x$ by Theorem 2.2.3. Also, $g(x) \rightarrow g(x)$ as $h \rightarrow 0$ because $g(x)$ does not involve $h$ and hence is treated as constant for the limit.]

In words, the derivative of a product of two functions is the first function times the derivative of the second plus the second function times the derivative of the first.

Example 1 Find $d y / d x$ if $y=\left(4 x^{2}-1\right)\left(7 x^{3}+x\right)$.
Solution. There are two methods that can be used to find $d y / d x$. We can either use the product rule or we can multiply out the factors in $y$ and then differentiate. We will give both methods.

Formula (2) can also be expressed as

$$
\left(\frac{f}{g}\right)^{\prime}=\frac{g \cdot f^{\prime}-f \cdot g^{\prime}}{g^{2}}
$$

Method 1. (Using the Product Rule)

$$
\begin{aligned}
\frac{d y}{d x} & =\frac{d}{d x}\left[\left(4 x^{2}-1\right)\left(7 x^{3}+x\right)\right] \\
& =\left(4 x^{2}-1\right) \frac{d}{d x}\left[7 x^{3}+x\right]+\left(7 x^{3}+x\right) \frac{d}{d x}\left[4 x^{2}-1\right] \\
& =\left(4 x^{2}-1\right)\left(21 x^{2}+1\right)+\left(7 x^{3}+x\right)(8 x)=140 x^{4}-9 x^{2}-1
\end{aligned}
$$

Method 2. (Multiplying First)

$$
y=\left(4 x^{2}-1\right)\left(7 x^{3}+x\right)=28 x^{5}-3 x^{3}-x
$$

Thus,

$$
\frac{d y}{d x}=\frac{d}{d x}\left[28 x^{5}-3 x^{3}-x\right]=140 x^{4}-9 x^{2}-1
$$

which agrees with the result obtained using the product rule.

Example 2 Find $d s / d t$ if $s=(1+t) \sqrt{t}$.
Solution. Applying the product rule yields

$$
\begin{aligned}
\frac{d s}{d t} & =\frac{d}{d t}[(1+t) \sqrt{t}] \\
& =(1+t) \frac{d}{d t}[\sqrt{t}]+\sqrt{t} \frac{d}{d t}[1+t] \\
& =\frac{1+t}{2 \sqrt{t}}+\sqrt{t}=\frac{1+3 t}{2 \sqrt{t}}
\end{aligned}
$$

## DERIVATIVE OF A QUOTIENT

Just as the derivative of a product is not generally the product of the derivatives, so the derivative of a quotient is not generally the quotient of the derivatives. The correct relationship is given by the following theorem.
2.4.2 THEOREM (The Quotient Rule) If $f$ and $g$ are both differentiable at $x$ and if $g(x) \neq 0$, then $f / g$ is differentiable at $x$ and

$$
\begin{equation*}
\frac{d}{d x}\left[\frac{f(x)}{g(x)}\right]=\frac{g(x) \frac{d}{d x}[f(x)]-f(x) \frac{d}{d x}[g(x)]}{[g(x)]^{2}} \tag{2}
\end{equation*}
$$

PROOF

$$
\frac{d}{d x}\left[\frac{f(x)}{g(x)}\right]=\lim _{h \rightarrow 0} \frac{\frac{f(x+h)}{g(x+h)}-\frac{f(x)}{g(x)}}{h}=\lim _{h \rightarrow 0} \frac{f(x+h) \cdot g(x)-f(x) \cdot g(x+h)}{h \cdot g(x) \cdot g(x+h)}
$$

Sometimes it is better to simplify a function first than to apply the quotient rule immediately. For example, it is easier to differentiate

$$
f(x)=\frac{x^{3 / 2}+x}{\sqrt{x}}
$$

by rewriting it as

$$
f(x)=x+\sqrt{x}
$$

as opposed to using the quotient rule.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-100.jpg?height=467&width=397&top_left_y=1898&top_left_x=192)
- Figure 2.4.1

Adding and subtracting $f(x) \cdot g(x)$ in the numerator yields

$$
\begin{aligned}
\frac{d}{d x}\left[\frac{f(x)}{g(x)}\right] & =\lim _{h \rightarrow 0} \frac{f(x+h) \cdot g(x)-f(x) \cdot g(x)-f(x) \cdot g(x+h)+f(x) \cdot g(x)}{h \cdot g(x) \cdot g(x+h)} \\
& =\lim _{h \rightarrow 0} \frac{\left[g(x) \cdot \frac{f(x+h)-f(x)}{h}\right]-\left[f(x) \cdot \frac{g(x+h)-g(x)}{h}\right]}{g(x) \cdot g(x+h)} \\
& =\frac{\lim _{h \rightarrow 0} g(x) \cdot \lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h}-\lim _{h \rightarrow 0} f(x) \cdot \lim _{h \rightarrow 0} \frac{g(x+h)-g(x)}{h}}{\lim _{h \rightarrow 0} g(x) \cdot \lim _{h \rightarrow 0} g(x+h)} \\
& =\frac{\left[\lim _{h \rightarrow 0} g(x)\right] \cdot \frac{d}{d x}[f(x)]-\left[\lim _{h \rightarrow 0} f(x)\right] \cdot \frac{d}{d x}[g(x)]}{\lim _{h \rightarrow 0} g(x) \cdot \lim _{h \rightarrow 0} g(x+h)} \\
& =\frac{g(x) \frac{d}{d x}[f(x)]-f(x) \frac{d}{d x}[g(x)]}{[g(x)]^{2}}
\end{aligned}
$$

[See the note at the end of the proof of Theorem 2.4.1 for an explanation of the last step.]

In words, the derivative of a quotient of two functions is the denominator times the derivative of the numerator minus the numerator times the derivative of the denominator, all divided by the denominator squared.

Example 3 Find $y^{\prime}(x)$ for $y=\frac{x^{3}+2 x^{2}-1}{x+5}$.
Solution. Applying the quotient rule yields

$$
\begin{aligned}
\frac{d y}{d x}=\frac{d}{d x}\left[\frac{x^{3}+2 x^{2}-1}{x+5}\right] & =\frac{(x+5) \frac{d}{d x}\left[x^{3}+2 x^{2}-1\right]-\left(x^{3}+2 x^{2}-1\right) \frac{d}{d x}[x+5]}{(x+5)^{2}} \\
& =\frac{(x+5)\left(3 x^{2}+4 x\right)-\left(x^{3}+2 x^{2}-1\right)(1)}{(x+5)^{2}} \\
& =\frac{\left(3 x^{3}+19 x^{2}+20 x\right)-\left(x^{3}+2 x^{2}-1\right)}{(x+5)^{2}} \\
& =\frac{2 x^{3}+17 x^{2}+20 x+1}{(x+5)^{2}}
\end{aligned}
$$

- Example 4 Let $f(x)=\frac{x^{2}-1}{x^{4}+1}$.
(a) Graph $y=f(x)$, and use your graph to make rough estimates of the locations of all horizontal tangent lines.
(b) By differentiating, find the exact locations of the horizontal tangent lines.

Solution (a). In Figure 2.4.1 we have shown the graph of the equation $y=f(x)$ in the window $[-2.5,2.5] \times[-1,1]$. This graph suggests that horizontal tangent lines occur at $x=0, x \approx 1.5$, and $x \approx-1.5$.

Derive the following rule for differentiating a reciprocal:

$$
\left(\frac{1}{g}\right)^{\prime}=-\frac{g^{\prime}}{g^{2}}
$$

Use it to find the derivative of

$$
f(x)=\frac{1}{x^{2}+1}
$$

Solution (b). To find the exact locations of the horizontal tangent lines, we must find the points where $d y / d x=0$. We start by finding $d y / d x$ :

$$
\begin{aligned}
\frac{d y}{d x} & =\frac{d}{d x}\left[\frac{x^{2}-1}{x^{4}+1}\right]=\frac{\left(x^{4}+1\right) \frac{d}{d x}\left[x^{2}-1\right]-\left(x^{2}-1\right) \frac{d}{d x}\left[x^{4}+1\right]}{\left(x^{4}+1\right)^{2}} \\
& =\frac{\left(x^{4}+1\right)(2 x)-\left(x^{2}-1\right)\left(4 x^{3}\right)}{\left(x^{4}+1\right)^{2}} \quad \begin{array}{l}
\text { The differentiation is complete. } \\
\text { The rest is simplification. }
\end{array} \\
& =\frac{-2 x^{5}+4 x^{3}+2 x}{\left(x^{4}+1\right)^{2}}=-\frac{2 x\left(x^{4}-2 x^{2}-1\right)}{\left(x^{4}+1\right)^{2}}
\end{aligned}
$$

Now we will set $d y / d x=0$ and solve for $x$. We obtain

$$
-\frac{2 x\left(x^{4}-2 x^{2}-1\right)}{\left(x^{4}+1\right)^{2}}=0
$$

The solutions of this equation are the values of $x$ for which the numerator is 0 , that is,

$$
2 x\left(x^{4}-2 x^{2}-1\right)=0
$$

The first factor yields the solution $x=0$. Other solutions can be found by solving the equation

$$
x^{4}-2 x^{2}-1=0
$$

This can be treated as a quadratic equation in $x^{2}$ and solved by the quadratic formula. This yields

$$
x^{2}=\frac{2 \pm \sqrt{8}}{2}=1 \pm \sqrt{2}
$$

The minus sign yields imaginary values of $x$, which we ignore since they are not relevant to the problem. The plus sign yields the solutions

$$
x= \pm \sqrt{1+\sqrt{2}}
$$

In summary, horizontal tangent lines occur at

$$
x=0, \quad x=\sqrt{1+\sqrt{2}} \approx 1.55, \quad \text { and } \quad x=-\sqrt{1+\sqrt{2}} \approx-1.55
$$

which is consistent with the rough estimates that we obtained graphically in part (a).

## SUMMARY OF DIFFERENTIATION RULES

The following table summarizes the differentiation rules that we have encountered thus far.

Table 2.4.1
RULES FOR DIFFERENTIATION
| $\frac{d}{d x}[c]=0$ | $(f+g)^{\prime}=f^{\prime}+g^{\prime}$ | $(f \cdot g)^{\prime}=f \cdot g^{\prime}+g \cdot f^{\prime}$ | $\left(\frac{1}{g}\right)^{\prime}=-\frac{g^{\prime}}{g^{2}}$ |
| :---: | :---: | :---: | :---: |
| $(c f)^{\prime}=c f^{\prime}$ | $(f-g)^{\prime}=f^{\prime}-g^{\prime}$ | $\left(\frac{f}{g}\right)^{\prime}=\frac{g \cdot f^{\prime}-f \cdot g^{\prime}}{g^{2}}$ | $\frac{d}{d x}\left[x^{r}\right]=r x^{r-1}$ |


## QUICK CHECK EXERCISES 2.4 (See page 169 for answers.)

1. 

(a) $\frac{d}{d x}\left[x^{2} f(x)\right]=$ $\_\_\_\_$ (b) $\frac{d}{d x}\left[\frac{f(x)}{x^{2}+1}\right]=$
(c) $\frac{d}{d x}\left[\frac{x^{2}+1}{f(x)}\right]=$ $\_\_\_\_$
$\_\_\_\_$ 2. Find $F^{\prime}(1)$ given that $f(1)=-1, f^{\prime}(1)=2, g(1)=3$, and $g^{\prime}(1)=-1$.
(a) $F(x)=2 f(x)-3 g(x)$
(b) $F(x)=[f(x)]^{2}$
(c) $F(x)=f(x) g(x)$
(d) $F(x)=f(x) / g(x)$

1-4 Compute the derivative of the given function $f(x)$ by (a) multiplying and then differentiating and (b) using the product rule. Verify that (a) and (b) yield the same result.

1. $f(x)=(x+1)(2 x-1)$
2. $f(x)=\left(3 x^{2}-1\right)\left(x^{2}+2\right)$
3. $f(x)=\left(x^{2}+1\right)\left(x^{2}-1\right)$
4. $f(x)=(x+1)\left(x^{2}-x+1\right)$

5-20 Find $f^{\prime}(x)$.
5. $f(x)=\left(3 x^{2}+6\right)\left(2 x-\frac{1}{4}\right)$
6. $f(x)=\left(2-x-3 x^{3}\right)\left(7+x^{5}\right)$
7. $f(x)=\left(x^{3}+7 x^{2}-8\right)\left(2 x^{-3}+x^{-4}\right)$
8. $f(x)=\left(\frac{1}{x}+\frac{1}{x^{2}}\right)\left(3 x^{3}+27\right)$
9. $f(x)=(x-2)\left(x^{2}+2 x+4\right)$
10. $f(x)=\left(x^{2}+x\right)\left(x^{2}-x\right)$
11. $f(x)=\frac{3 x+4}{x^{2}+1}$
12. $f(x)=\frac{x-2}{x^{4}+x+1}$
13. $f(x)=\frac{x^{2}}{3 x-4}$
14. $f(x)=\frac{2 x^{2}+5}{3 x-4}$
15. $f(x)=\frac{(2 \sqrt{x}+1)(x-1)}{x+3}$
16. $f(x)=(2 \sqrt{x}+1)\left(\frac{2-x}{x^{2}+3 x}\right)$
17. $f(x)=(2 x+1)\left(1+\frac{1}{x}\right)\left(x^{-3}+7\right)$
18. $f(x)=x^{-5}\left(x^{2}+2 x\right)(4-3 x)\left(2 x^{9}+1\right)$
19. $f(x)=\left(x^{7}+2 x-3\right)^{3}$ 20. $f(x)=\left(x^{2}+1\right)^{4}$

21-22 Find $d y /\left.d x\right|_{x=1}$.
21. $y=\left(\frac{3 x+2}{x}\right)\left(x^{-5}+1\right)$
22. $y=\left(2 x^{7}-x^{2}\right)\left(\frac{x-1}{x+1}\right)$

23-24 Use a graphing utility to estimate the value of $f^{\prime}(1)$ by zooming in on the graph of $f$, and then compare your estimate to the exact value obtained by differentiating.
23. $f(x)=\frac{x}{x^{2}+1}$
24. $f(x)=\frac{x^{2}-1}{x^{2}+1}$
25. Find $g^{\prime}(4)$ given that $f(4)=3$ and $f^{\prime}(4)=-5$.
(a) $g(x)=\sqrt{x} f(x)$
(b) $g(x)=\frac{f(x)}{x}$
26. Find $g^{\prime}(3)$ given that $f(3)=-2$ and $f^{\prime}(3)=4$.
(a) $g(x)=3 x^{2}-5 f(x)$
(b) $g(x)=\frac{2 x+1}{f(x)}$
27. In parts (a)-(d), $F(x)$ is expressed in terms of $f(x)$ and $g(x)$. Find $F^{\prime}(2)$ given that $f(2)=-1, f^{\prime}(2)=4, g(2)=1$, and $g^{\prime}(2)=-5$.
(a) $F(x)=5 f(x)+2 g(x)$
(b) $F(x)=f(x)-3 g(x)$
(c) $F(x)=f(x) g(x)$
(d) $F(x)=f(x) / g(x)$
28. Find $F^{\prime}(\pi)$ given that $f(\pi)=10, f^{\prime}(\pi)=-1, g(\pi)=-3$, and $g^{\prime}(\pi)=2$.
(a) $F(x)=6 f(x)-5 g(x)$
(b) $F(x)=x(f(x)+g(x))$
(c) $F(x)=2 f(x) g(x)$
(d) $F(x)=\frac{f(x)}{4+g(x)}$

29-34 Find all values of $x$ at which the tangent line to the given curve satisfies the stated property. □
29. $y=\frac{x^{2}-1}{x+2}$; horizontal 30. $y=\frac{x^{2}+1}{x-1}$; horizontal
31. $y=\frac{x^{2}+1}{x+1}$; parallel to the line $y=x$
32. $y=\frac{x+3}{x+2}$; perpendicular to the line $y=x$
33. $y=\frac{1}{x+4}$; passes through the origin
34. $y=\frac{2 x+5}{x+2} ; y$-intercept 2

## FOCUS ON CONCEPTS

35. (a) What should it mean to say that two curves intersect at right angles?
(b) Show that the curves $y=1 / x$ and $y=1 /(2-x)$ intersect at right angles.
36. Find all values of $a$ such that the curves $y=a /(x-1)$ and $y=x^{2}-2 x+1$ intersect at right angles.
37. Find a general formula for $F^{\prime \prime}(x)$ if $F(x)=x f(x)$ and $f$ and $f^{\prime}$ are differentiable at $x$.
38. Suppose that the function $f$ is differentiable everywhere and $F(x)=x f(x)$.
(a) Express $F^{\prime \prime \prime}(x)$ in terms of $x$ and derivatives of $f$.
(b) For $n \geq 2$, conjecture a formula for $F^{(n)}(x)$.
39. A manufacturer of athletic footwear finds that the sales of their ZipStride brand running shoes is a function $f(p)$ of the selling price $p$ (in dollars) for a pair of shoes. Suppose that $f(120)=9000$ pairs of shoes and $f^{\prime}(120)=-60$ pairs of shoes per dollar. The revenue that the manufacturer will receive for selling $f(p)$ pairs of shoes at $p$ dollars per pair is $R(p)=p \cdot f(p)$. Find $R^{\prime}(120)$. What impact would a small increase in price have on the manufacturer's revenue?
40. Solve the problem in Exercise 39 under the assumption that $f(120)=9000$ and $f^{\prime}(120)=-80$.
41. Use the quotient rule (Theorem 2.4.2) to derive the formula for the derivative of $f(x)=x^{-n}$, where $n$ is a positive integer.

## QUICK CHECK ANSWERS 2.4

1. 

(a) $x^{2} f^{\prime}(x)+2 x f(x)$
(b) $\frac{\left(x^{2}+1\right) f^{\prime}(x)-2 x f(x)}{\left(x^{2}+1\right)^{2}}$
(c) $\frac{2 x f(x)-\left(x^{2}+1\right) f^{\prime}(x)}{\left[f(x)^{2}\right]}$
2. (a) 7
(b) -4
(c) 7
(d) $\frac{5}{9}$

### 2.5 DERIVATIVES OF TRIGONOMETRIC FUNCTIONS

Formulas (1) and (2) and the derivation of Formulas (3) and (4) are only valid if $h$ and $x$ are in radians. See Exercise 49 for how Formulas (3) and (4) change when $x$ is measured in degrees.

The main objective of this section is to obtain formulas for the derivatives of the six basic trigonometric functions. If needed, you will find a review of trigonometric functions in Appendix $B$.

We will assume in this section that the variable $x$ in the trigonometric functions $\sin x, \cos x$, $\tan x, \cot x, \sec x$, and $\csc x$ is measured in radians. Also, we will need the limits in Theorem 1.6.5, but restated as follows using $h$ rather than $x$ as the variable:

$$
\begin{equation*}
\lim _{h \rightarrow 0} \frac{\sin h}{h}=1 \quad \text { and } \quad \lim _{h \rightarrow 0} \frac{1-\cos h}{h}=0 \tag{1-2}
\end{equation*}
$$

Let us start with the problem of differentiating $f(x)=\sin x$. Using the definition of the derivative we obtain

$$
\begin{aligned}
f^{\prime}(x) & =\lim _{h \rightarrow 0} \frac{f(x+h)-f(x)}{h} \\
& =\lim _{h \rightarrow 0} \frac{\sin (x+h)-\sin x}{h} \\
& =\lim _{h \rightarrow 0} \frac{\sin x \cos h+\cos x \sin h-\sin x}{h} \\
& =\lim _{h \rightarrow 0}\left[\sin x\left(\frac{\cos h-1}{h}\right)+\cos x\left(\frac{\sin h}{h}\right)\right] \\
& =\lim _{h \rightarrow 0}\left[\cos x\left(\frac{\sin h}{h}\right)-\sin x\left(\frac{1-\cos h}{h}\right)\right] \\
& =\lim _{h \rightarrow 0} \cos x \cdot \lim _{h \rightarrow 0} \frac{\sin h}{h}-\lim _{h \rightarrow 0} \sin x \cdot \lim _{h \rightarrow 0} \frac{1-\cos h}{h} \\
& =\left(\lim _{h \rightarrow 0} \cos x\right)(1)-\left(\lim _{h \rightarrow 0} \sin x\right)(0) \quad \text { Algebraic reorganization } \\
& =\lim _{h \rightarrow 0} \cos x=\cos x \quad \begin{array}{l}
\cos x \text { does not involve the variable } h \text { and hence } \\
\text { is treated as a constant in the limit computation. }
\end{array}
\end{aligned}
$$

Thus, we have shown that

$$
\begin{equation*}
\frac{d}{d x}[\sin x]=\cos x \tag{3}
\end{equation*}
$$

In the exercises we will ask you to use the same method to derive the following formula for the derivative of $\cos x$ :

$$
\begin{equation*}
\frac{d}{d x}[\cos x]=-\sin x \tag{4}
\end{equation*}
$$

Since Formulas (3) and (4) are valid only if $x$ is in radians, the same is true for Formulas (5)-(8).

When finding the value of a derivative at a specific point $x=x_{0}$, it is important to substitute $x_{0}$ after the derivative is obtained. Thus, in Example 3 we made the substitution $x=\pi / 4$ after $f^{\prime \prime}$ was calculated. What would have happened had we incorrectly substituted $x=\pi / 4$ into $f^{\prime}(x)$ before calculating $f^{\prime \prime}$ ?

Example 1 Find $d y / d x$ if $y=x \sin x$.
Solution. Using Formula (3) and the product rule we obtain

$$
\begin{aligned}
\frac{d y}{d x} & =\frac{d}{d x}[x \sin x] \\
& =x \frac{d}{d x}[\sin x]+\sin x \frac{d}{d x}[x] \\
& =x \cos x+\sin x
\end{aligned}
$$

## Example 2 Find $d y / d x$ if $y=\frac{\sin x}{1+\cos x}$.

Solution. Using the quotient rule together with Formulas (3) and (4) we obtain

$$
\begin{aligned}
\frac{d y}{d x} & =\frac{(1+\cos x) \cdot \frac{d}{d x}[\sin x]-\sin x \cdot \frac{d}{d x}[1+\cos x]}{(1+\cos x)^{2}} \\
& =\frac{(1+\cos x)(\cos x)-(\sin x)(-\sin x)}{(1+\cos x)^{2}} \\
& =\frac{\cos x+\cos ^{2} x+\sin ^{2} x}{(1+\cos x)^{2}}=\frac{\cos x+1}{(1+\cos x)^{2}}=\frac{1}{1+\cos x}
\end{aligned}
$$

The derivatives of the remaining trigonometric functions are

$$
\begin{align*}
\frac{d}{d x}[\tan x] & =\sec ^{2} x & \frac{d}{d x}[\sec x] & =\sec x \tan x  \tag{5-6}\\
\frac{d}{d x}[\cot x] & =-\csc ^{2} x & \frac{d}{d x}[\csc x] & =-\csc x \cot x \tag{7-8}
\end{align*}
$$

These can all be obtained using the definition of the derivative, but it is easier to use Formulas (3) and (4) and apply the quotient rule to the relationships

$$
\tan x=\frac{\sin x}{\cos x}, \quad \cot x=\frac{\cos x}{\sin x}, \quad \sec x=\frac{1}{\cos x}, \quad \csc x=\frac{1}{\sin x}
$$

For example,

$$
\begin{aligned}
\frac{d}{d x}[\tan x] & =\frac{d}{d x}\left[\frac{\sin x}{\cos x}\right]=\frac{\cos x \cdot \frac{d}{d x}[\sin x]-\sin x \cdot \frac{d}{d x}[\cos x]}{\cos ^{2} x} \\
& =\frac{\cos x \cdot \cos x-\sin x \cdot(-\sin x)}{\cos ^{2} x}=\frac{\cos ^{2} x+\sin ^{2} x}{\cos ^{2} x}=\frac{1}{\cos ^{2} x}=\sec ^{2} x
\end{aligned}
$$

Example 3 Find $f^{\prime \prime}(\pi / 4)$ if $f(x)=\sec x$.

$$
\begin{aligned}
f^{\prime}(x) & =\sec x \tan x \\
f^{\prime \prime}(x) & =\sec x \cdot \frac{d}{d x}[\tan x]+\tan x \cdot \frac{d}{d x}[\sec x] \\
& =\sec x \cdot \sec ^{2} x+\tan x \cdot \sec x \tan x \\
& =\sec ^{3} x+\sec x \tan ^{2} x
\end{aligned}
$$

Thus,

$$
\begin{aligned}
f^{\prime \prime}(\pi / 4) & =\sec ^{3}(\pi / 4)+\sec (\pi / 4) \tan ^{2}(\pi / 4) \\
& =(\sqrt{2})^{3}+(\sqrt{2})(1)^{2}=3 \sqrt{2}
\end{aligned}
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-105.jpg?height=435&width=415&top_left_y=396&top_left_x=240)
△ Figure 2.5.1

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-105.jpg?height=545&width=465&top_left_y=995&top_left_x=214)
△ Figure 2.5.2

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-105.jpg?height=418&width=463&top_left_y=1677&top_left_x=214)
Figure 2.5.3

In Example 5, the top of the mass has its maximum speed when it passes through its rest position. Why? What is that maximum speed?

Example 4 On a sunny day, a 50 ft flagpole casts a shadow that changes with the angle of elevation of the Sun. Let $s$ be the length of the shadow and $\theta$ the angle of elevation of the Sun (Figure 2.5.1). Find the rate at which the length of the shadow is changing with respect to $\theta$ when $\theta=45^{\circ}$. Express your answer in units of feet/degree.

Solution. The variables $s$ and $\theta$ are related by $\tan \theta=50 / s$ or, equivalently,

$$
\begin{equation*}
s=50 \cot \theta \tag{9}
\end{equation*}
$$

If $\theta$ is measured in radians, then Formula (7) is applicable, which yields

$$
\frac{d s}{d \theta}=-50 \csc ^{2} \theta
$$

which is the rate of change of shadow length with respect to the elevation angle $\theta$ in units of feet/radian. When $\theta=45^{\circ}$ (or equivalently $\theta=\pi / 4$ radians), we obtain

$$
\left.\frac{d s}{d \theta}\right|_{\theta=\pi / 4}=-50 \csc ^{2}(\pi / 4)=-100 \text { feet } / \text { radian }
$$

Converting radians (rad) to degrees (deg) yields

$$
-100 \frac{\mathrm{ft}}{\mathrm{rad}} \cdot \frac{\pi}{180} \frac{\mathrm{rad}}{\mathrm{deg}}=-\frac{5}{9} \pi \frac{\mathrm{ft}}{\mathrm{deg}} \approx-1.75 \mathrm{ft} / \mathrm{deg}
$$

Thus, when $\theta=45^{\circ}$, the shadow length is decreasing (because of the minus sign) at an approximate rate of $1.75 \mathrm{ft} / \mathrm{deg}$ increase in the angle of elevation.

Example 5 As illustrated in Figure 2.5.2, suppose that a spring with an attached mass $M$ is stretched 3 cm beyond its rest position and released at time $t=0$. Assuming that the position function of the top of the attached mass is

$$
\begin{equation*}
s=-3 \cos t \tag{10}
\end{equation*}
$$

where $s$ is in centimeters and $t$ is in seconds, find the velocity function and discuss the motion of the attached mass.

Solution. The velocity function is

$$
v=\frac{d s}{d t}=\frac{d}{d t}[-3 \cos t]=3 \sin t
$$

Figure 2.5.3 shows the graphs of the position and velocity functions. The position function tells us that the top of the mass oscillates between a low point of $s=-3$ and a high point of $s=3$ with one complete oscillation occurring every $2 \pi$ seconds [the period of (10)]. The top of the mass is moving up (the positive $s$-direction) when $v$ is positive, is moving down when $v$ is negative, and is at a high or low point when $v=0$. Thus, for example, the top of the mass moves up from time $t=0$ to time $t=\pi$, at which time it reaches the high point $s=3$ and then moves down until time $t=2 \pi$, at which time it reaches the low point of $s=-3$. The motion then repeats periodically.

## QUICK CHECK EXERCISES 2.5 (See page 174 for answers.)

1. Find $d y / d x$.
(a) $y=\sin x$
(b) $y=\cos x$
(c) $y=\tan x$
(d) $y=\sec x$
2. Find $f^{\prime}(x)$ and $f^{\prime}(\pi / 3)$ if $f(x)=\sin x \cos x$.
3. Use a derivative to evaluate each limit.
(a) $\lim _{h \rightarrow 0} \frac{\sin \left(\frac{\pi}{2}+h\right)-1}{h}$
(b) $\lim _{h \rightarrow 0} \frac{\csc (x+h)-\csc x}{h}$

EXERCISE SET 2.5 Graphing Utility

1-18 Find $f^{\prime}(x)$.

1. $f(x)=4 \cos x+2 \sin x$
2. $f(x)=\frac{5}{x^{2}}+\sin x$
3. $f(x)=-4 x^{2} \cos x$
4. $f(x)=2 \sin ^{2} x$
5. $f(x)=\frac{5-\cos x}{5+\sin x}$
6. $f(x)=\frac{\sin x}{x^{2}+\sin x}$
7. $f(x)=\sec x-\sqrt{2} \tan x$
8. $f(x)=\left(x^{2}+1\right) \sec x$
9. $f(x)=4 \csc x-\cot x$
10. $f(x)=\cos x-x \csc x$
11. $f(x)=\sec x \tan x$
12. $f(x)=\csc x \cot x$
13. $f(x)=\frac{\cot x}{1+\csc x}$
14. $f(x)=\frac{\sec x}{1+\tan x}$
15. $f(x)=\sin ^{2} x+\cos ^{2} x$
16. $f(x)=\sec ^{2} x-\tan ^{2} x$
17. $f(x)=\frac{\sin x \sec x}{1+x \tan x}$
18. $f(x)=\frac{\left(x^{2}+1\right) \cot x}{3-\cos x \csc x}$

19-24 Find $d^{2} y / d x^{2}$. □
19. $y=x \cos x$
20. $y=\csc x$
21. $y=x \sin x-3 \cos x$
22. $y=x^{2} \cos x+4 \sin x$
23. $y=\sin x \cos x$
24. $y=\tan x$
25. Find the equation of the line tangent to the graph of $\tan x$ at
(a) $x=0$
(b) $x=\pi / 4$
(c) $x=-\pi / 4$.
26. Find the equation of the line tangent to the graph of $\sin x$ at
(a) $x=0$
(b) $x=\pi$
(c) $x=\pi / 4$.
27. (a) Show that $y=x \sin x$ is a solution to $y^{\prime \prime}+y=2 \cos x$.
(b) Show that $y=x \sin x$ is a solution of the equation $y^{(4)}+y^{\prime \prime}=-2 \cos x$.
28. (a) Show that $y=\cos x$ and $y=\sin x$ are solutions of the equation $y^{\prime \prime}+y=0$.
(b) Show that $y=A \sin x+B \cos x$ is a solution of the equation $y^{\prime \prime}+y=0$ for all constants $A$ and $B$.
29. Find all values in the interval $[-2 \pi, 2 \pi]$ at which the graph of $f$ has a horizontal tangent line.
(a) $f(x)=\sin x$
(b) $f(x)=x+\cos x$
(c) $f(x)=\tan x$
(d) $f(x)=\sec x$
30. (a) Use a graphing utility to make rough estimates of the values in the interval $[0,2 \pi]$ at which the graph of $y=\sin x \cos x$ has a horizontal tangent line.
(b) Find the exact locations of the points where the graph has a horizontal tangent line.
31. A 10 ft ladder leans against a wall at an angle $\theta$ with the horizontal, as shown in the accompanying figure. The top of the ladder is $x$ feet above the ground. If the bottom of the ladder is pushed toward the wall, find the rate at which $x$ changes with respect to $\theta$ when $\theta=60^{\circ}$. Express the answer in units of feet/degree.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-106.jpg?height=311&width=263&top_left_y=877&top_left_x=1127)
Figure Ex-31

32. An airplane is flying on a horizontal path at a height of 3800 ft , as shown in the accompanying figure. At what rate is the distance $s$ between the airplane and the fixed point $P$ changing with respect to $\theta$ when $\theta=30^{\circ}$ ? Express the answer in units of feet/degree.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-106.jpg?height=223&width=441&top_left_y=1445&top_left_x=1127)
Figure Ex-32

33. A searchlight is trained on the side of a tall building. As the light rotates, the spot it illuminates moves up and down the side of the building. That is, the distance $D$ between ground level and the illuminated spot on the side of the building is a function of the angle $\theta$ formed by the light beam and the horizontal (see the accompanying figure). If the searchlight is located 50 m from the building, find the rate at which $D$ is changing with respect to $\theta$ when $\theta=45^{\circ}$. Express your answer in units of meters/degree.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-106.jpg?height=305&width=379&top_left_y=2070&top_left_x=1129)
Figure Ex-33

34. An Earth-observing satellite can see only a portion of the Earth's surface. The satellite has horizon sensors that can detect the angle $\theta$ shown in the accompanying figure. Let $r$ be the radius of the Earth (assumed spherical) and $h$ the distance of the satellite from the Earth's surface.
(a) Show that $h=r(\csc \theta-1)$.
(b) Using $r=6378 \mathrm{~km}$, find the rate at which $h$ is changing with respect to $\theta$ when $\theta=30^{\circ}$. Express the answer in units of kilometers/degree.
Source: Adapted from Space Mathematics, NASA, 1985.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-107.jpg?height=272&width=425&top_left_y=648&top_left_x=268)
-Figure Ex-34

35-38 True-False Determine whether the statement is true or false. Explain your answer.
35. If $g(x)=f(x) \sin x$, then $g^{\prime}(x)=f^{\prime}(x) \cos x$.
36. If $g(x)=f(x) \sin x$, then $g^{\prime}(0)=f(0)$.
37. If $f(x) \cos x=\sin x$, then $f^{\prime}(x)=\sec ^{2} x$.
38. Suppose that $g(x)=f(x) \sec x$, where $f(0)=8$ and $f^{\prime}(0)=-2$. Then

$$
\begin{aligned}
g^{\prime}(0) & =\lim _{h \rightarrow 0} \frac{f(h) \sec h-f(0)}{h}=\lim _{h \rightarrow 0} \frac{8(\sec h-1)}{h} \\
& =\left.8 \cdot \frac{d}{d x}[\sec x]\right|_{x=0}=8 \sec 0 \tan 0=0
\end{aligned}
$$

39-40 Make a conjecture about the derivative by calculating the first few derivatives and observing the resulting pattern.
39. $\frac{d^{87}}{d x^{87}}[\sin x]$
40. $\frac{d^{100}}{d x^{100}}[\cos x]$
41. Let $f(x)=\cos x$. Find all positive integers $n$ for which $f^{(n)}(x)=\sin x$.
42. Let $f(x)=\sin x$. Find all positive integers $n$ for which $f^{(n)}(x)=\sin x$.

## FOCUS ON CONCEPTS

43. In each part, determine where $f$ is differentiable.
(a) $f(x)=\sin x$
(b) $f(x)=\cos x$
(c) $f(x)=\tan x$
(d) $f(x)=\cot x$
(e) $f(x)=\sec x$
(f) $f(x)=\csc x$
(g) $f(x)=\frac{1}{1+\cos x}$
(h) $f(x)=\frac{1}{\sin x \cos x}$
(i) $f(x)=\frac{\cos x}{2-\sin x}$
44. (a) Derive Formula (4) using the definition of a derivative.
(b) Use Formulas (3) and (4) to obtain (7).
(c) Use Formula (4) to obtain (6).
(d) Use Formula (3) to obtain (8).
45. Use Formula (1), the alternative form for the definition of derivative given in Formula (13) of Section 2.2, that is,

$$
f^{\prime}(x)=\lim _{w \rightarrow x} \frac{f(w)-f(x)}{w-x}
$$

and the difference identity

$$
\sin \alpha-\sin \beta=2 \sin \left(\frac{\alpha-\beta}{2}\right) \cos \left(\frac{\alpha+\beta}{2}\right)
$$

to show that $\frac{d}{d x}[\sin x]=\cos x$.
46. Follow the directions of Exercise 45 using the difference identity

$$
\cos \alpha-\cos \beta=-2 \sin \left(\frac{\alpha-\beta}{2}\right) \sin \left(\frac{\alpha+\beta}{2}\right)
$$

to show that $\frac{d}{d x}[\cos x]=-\sin x$.
47. (a) Show that $\lim _{h \rightarrow 0} \frac{\tan h}{h}=1$.
(b) Use the result in part (a) to help derive the formula for the derivative of $\tan x$ directly from the definition of a derivative.
48. Without using any trigonometric identities, find

$$
\lim _{x \rightarrow 0} \frac{\tan (x+y)-\tan y}{x}
$$

[Hint: Relate the given limit to the definition of the derivative of an appropriate function of $y$.]
49. The derivative formulas for $\sin x, \cos x, \tan x, \cot x, \sec x$, and $\csc x$ were obtained under the assumption that $x$ is measured in radians. If $x$ is measured in degrees, then

$$
\lim _{x \rightarrow 0} \frac{\sin x}{x}=\frac{\pi}{180}
$$

(See Exercise 49 of Section 1.6). Use this result to prove that if $x$ is measured in degrees, then
(a) $\frac{d}{d x}[\sin x]=\frac{\pi}{180} \cos x$
(b) $\frac{d}{d x}[\cos x]=-\frac{\pi}{180} \sin x$.
50. Writing Suppose that $f$ is a function that is differentiable everywhere. Explain the relationship, if any, between the periodicity of $f$ and that of $f^{\prime}$. That is, if $f$ is periodic, must $f^{\prime}$ also be periodic? If $f^{\prime}$ is periodic, must $f$ also be periodic?

## QUICK CHECK ANSWERS 2.5

1. 

(a) $\cos x$ (b) $-\sin x$ (c) $\sec ^{2} x$ (d) $\sec x \tan x \quad$ 2. $f^{\prime}(x)=\cos ^{2} x-\sin ^{2} x, f^{\prime}(\pi / 3)=-\frac{1}{2}$
3. (a) $\left.\frac{d}{d x}[\sin x]\right|_{x=\pi / 2}=0$
(b) $\frac{d}{d x}[\csc x]=-\csc x \cot x$

### 2.6 THE CHAIN RULE

In this section we will derive a formula that expresses the derivative of a composition $f \circ g$ in terms of the derivatives of $f$ and $g$. This formula will enable us to differentiate complicated functions using known derivatives of simpler functions.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-108.jpg?height=527&width=479&top_left_y=877&top_left_x=156)
Mike Brinson/Getty Images
The cost of a car trip is a combination of fuel efficiency and the cost of gasoline.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-108.jpg?height=358&width=339&top_left_y=1561&top_left_x=224)
- Figure 2.6.1

The name "chain rule" is appropriate because the desired derivative is obtained by a two-link "chain" of simpler derivatives.

## DERIVATIVES OF COMPOSITIONS

Suppose you are traveling to school in your car, which gets 20 miles per gallon of gasoline. The number of miles you can travel in your car without refueling is a function of the number of gallons of gas you have in the gas tank. In symbols, if $y$ is the number of miles you can travel and $u$ is the number of gallons of gas you have initially, then $y$ is a function of $u$, or $y=f(u)$. As you continue your travels, you note that your local service station is selling gasoline for $\$ 4$ per gallon. The number of gallons of gas you have initially is a function of the amount of money you spend for that gas. If $x$ is the number of dollars you spend on gas, then $u=g(x)$. Now 20 miles per gallon is the rate at which your mileage changes with respect to the amount of gasoline you use, so

$$
f^{\prime}(u)=\frac{d y}{d u}=20 \text { miles per gallon }
$$

Similarly, since gasoline costs $\$ 4$ per gallon, each dollar you spend will give you $1 / 4$ of a gallon of gas, and

$$
g^{\prime}(x)=\frac{d u}{d x}=\frac{1}{4} \text { gallons per dollar }
$$

Notice that the number of miles you can travel is also a function of the number of dollars you spend on gasoline. This fact is expressible as the composition of functions

$$
y=f(u)=f(g(x))
$$

You might be interested in how many miles you can travel per dollar, which is $d y / d x$. Intuition suggests that rates of change multiply in this case (see Figure 2.6.1), so

$$
\frac{d y}{d x}=\frac{d y}{d u} \cdot \frac{d u}{d x}=\frac{20 \text { miles }}{1 \text { gallon }} \cdot \frac{1 \text { gallons }}{4 \text { dollars }}=\frac{20 \text { miles }}{4 \text { dollars }}=5 \text { miles per dollar }
$$

The following theorem, the proof of which is given in Appendix D, formalizes the preceding ideas.
2.6.1 THEOREM (The Chain Rule) If $g$ is differentiable at $x$ and $f$ is differentiable at $g(x)$, then the composition $f \circ g$ is differentiable at $x$. Moreover, if

$$
y=f(g(x)) \text { and } u=g(x)
$$

then $y=f(u)$ and

$$
\begin{equation*}
\frac{d y}{d x}=\frac{d y}{d u} \cdot \frac{d u}{d x} \tag{1}
\end{equation*}
$$

Formula (1) is easy to remember because the left side is exactly what results if we "cancel" the $d u$ 's on the right side. This "canceling" device provides a good way of deducing the correct form of the chain rule when different variables are used. For example, if $w$ is a function of $x$ and $x$ is a function of $t$, then the chain rule takes the form

$$
\frac{d w}{d t}=\frac{d w}{d x} \cdot \frac{d x}{d t}
$$

Confirm that (2) is an alternative version of (1) by letting $y=f(g(x))$ and $u=g(x)$.

Example 1 Find $d y / d x$ if $y=\cos \left(x^{3}\right)$.
Solution. Let $u=x^{3}$ and express $y$ as $y=\cos u$. Applying Formula (1) yields

$$
\begin{aligned}
\frac{d y}{d x} & =\frac{d y}{d u} \cdot \frac{d u}{d x} \\
& =\frac{d}{d u}[\cos u] \cdot \frac{d}{d x}\left[x^{3}\right] \\
& =(-\sin u) \cdot\left(3 x^{2}\right) \\
& =\left(-\sin \left(x^{3}\right)\right) \cdot\left(3 x^{2}\right)=-3 x^{2} \sin \left(x^{3}\right)
\end{aligned}
$$

Example 2 Find $d w / d t$ if $w=\tan x$ and $x=4 t^{3}+t$.
Solution. In this case the chain rule computations take the form

$$
\begin{aligned}
\frac{d w}{d t} & =\frac{d w}{d x} \cdot \frac{d x}{d t} \\
& =\frac{d}{d x}[\tan x] \cdot \frac{d}{d t}\left[4 t^{3}+t\right] \\
& =\left(\sec ^{2} x\right) \cdot\left(12 t^{2}+1\right) \\
& =\left[\sec ^{2}\left(4 t^{3}+t\right)\right] \cdot\left(12 t^{2}+1\right)=\left(12 t^{2}+1\right) \sec ^{2}\left(4 t^{3}+t\right)
\end{aligned}
$$

## AN ALTERNATIVE VERSION OF THE CHAIN RULE

Formula (1) for the chain rule can be unwieldy in some problems because it involves so many variables. As you become more comfortable with the chain rule, you may want to dispense with writing out the dependent variables by expressing (1) in the form

$$
\begin{equation*}
\frac{d}{d x}[f(g(x))]=(f \circ g)^{\prime}(x)=f^{\prime}(g(x)) g^{\prime}(x) \tag{2}
\end{equation*}
$$

A convenient way to remember this formula is to call $f$ the "outside function" and $g$ the "inside function" in the composition $f(g(x))$ and then express (2) in words as:

The derivative of $f(g(x))$ is the derivative of the outside function evaluated at the inside function times the derivative of the inside function.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-109.jpg?height=225&width=1093&top_left_y=2168&top_left_x=796)

Example 3 (Example 1 revisited) Find $h^{\prime}(x)$ if $h(x)=\cos \left(x^{3}\right)$.
Solution. We can think of $h$ as a composition $f(g(x))$ in which $g(x)=x^{3}$ is the inside function and $f(x)=\cos x$ is the outside function. Thus, Formula (2) yields

\$\$

\$\$
which agrees with the result obtained in Example 1.

## Example 4

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-110.jpg?height=221&width=1153&top_left_y=893&top_left_x=736)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-110.jpg?height=260&width=1101&top_left_y=1129&top_left_x=676)

## GENERALIZED DERIVATIVE FORMULAS

There is a useful third variation of the chain rule that strikes a middle ground between Formulas (1) and (2). If we let $u=g(x)$ in (2), then we can rewrite that formula as

$$
\begin{equation*}
\frac{d}{d x}[f(u)]=f^{\prime}(u) \frac{d u}{d x} \tag{3}
\end{equation*}
$$

This result, called the generalized derivative formula for $f$, provides a way of using the derivative of $f(x)$ to produce the derivative of $f(u)$, where $u$ is a function of $x$. Table 2.6.1 gives some examples of this formula.

Table 2.6.1
GENERALIZED DERIVATIVE FORMULAS

$$
\begin{array}{rlrl}
\frac{d}{d x}\left[u^{r}\right]=r u^{r-1} \frac{d u}{d x} \\
\frac{d}{d x}[\sin u]=\cos u \frac{d u}{d x} & \frac{d}{d x}[\cos u]=-\sin u \frac{d u}{d x} \\
\frac{d}{d x}[\tan u]=\sec ^{2} u \frac{d u}{d x} & \frac{d}{d x}[\cot u]=-\csc ^{2} u \frac{d u}{d x} \\
\frac{d}{d x}[\sec u]=\sec u \tan u \frac{d u}{d x} & \frac{d}{d x}[\csc u]=-\csc u \cot u \frac{d u}{d x}
\end{array}
$$

Example 5 Find
(a) $\frac{d}{d x}[\sin (2 x)]$
(b) $\frac{d}{d x}\left[\tan \left(x^{2}+1\right)\right]$
(c) $\frac{d}{d x}\left[\sqrt{x^{3}+\csc x}\right]$
(d) $\frac{d}{d x}\left[x^{2}-x+2\right]^{3 / 4}$
(e) $\frac{d}{d x}\left[\left(1+x^{5} \cot x\right)^{-8}\right]$

Solution (a). Taking $u=2 x$ in the generalized derivative formula for $\sin u$ yields

$$
\frac{d}{d x}[\sin (2 x)]=\frac{d}{d x}[\sin u]=\cos u \frac{d u}{d x}=\cos 2 x \cdot \frac{d}{d x}[2 x]=\cos 2 x \cdot 2=2 \cos 2 x
$$

Solution (b). Taking $u=x^{2}+1$ in the generalized derivative formula for $\tan u$ yields

$$
\begin{aligned}
\frac{d}{d x}\left[\tan \left(x^{2}+1\right)\right] & =\frac{d}{d x}[\tan u]=\sec ^{2} u \frac{d u}{d x} \\
& =\sec ^{2}\left(x^{2}+1\right) \cdot \frac{d}{d x}\left[x^{2}+1\right]=\sec ^{2}\left(x^{2}+1\right) \cdot 2 x \\
& =2 x \sec ^{2}\left(x^{2}+1\right)
\end{aligned}
$$

Solution (c). Taking $u=x^{3}+\csc x$ in the generalized derivative formula for $\sqrt{u}$ yields

$$
\begin{aligned}
\frac{d}{d x}\left[\sqrt{x^{3}+\csc x}\right] & =\frac{d}{d x}[\sqrt{u}]=\frac{1}{2 \sqrt{u}} \frac{d u}{d x}=\frac{1}{2 \sqrt{x^{3}+\csc x}} \cdot \frac{d}{d x}\left[x^{3}+\csc x\right] \\
& =\frac{1}{2 \sqrt{x^{3}+\csc x}} \cdot\left(3 x^{2}-\csc x \cot x\right)=\frac{3 x^{2}-\csc x \cot x}{2 \sqrt{x^{3}+\csc x}}
\end{aligned}
$$

Solution (d). Taking $u=x^{2}-x+2$ in the generalized derivative formula for $u^{3 / 4}$ yields

$$
\begin{aligned}
\frac{d}{d x}\left[x^{2}-x+2\right]^{3 / 4} & =\frac{d}{d x}\left[u^{3 / 4}\right]=\frac{3}{4} u^{-1 / 4} \frac{d u}{d x} \\
& =\frac{3}{4}\left(x^{2}-x+2\right)^{-1 / 4} \cdot \frac{d}{d x}\left[x^{2}-x+2\right] \\
& =\frac{3}{4}\left(x^{2}-x+2\right)^{-1 / 4}(2 x-1)
\end{aligned}
$$

Solution (e). Taking $u=1+x^{5} \cot x$ in the generalized derivative formula for $u^{-8}$ yields

$$
\begin{aligned}
\frac{d}{d x}\left[\left(1+x^{5} \cot x\right)^{-8}\right] & =\frac{d}{d x}\left[u^{-8}\right]=-8 u^{-9} \frac{d u}{d x} \\
& =-8\left(1+x^{5} \cot x\right)^{-9} \cdot \frac{d}{d x}\left[1+x^{5} \cot x\right] \\
& =-8\left(1+x^{5} \cot x\right)^{-9} \cdot\left[x^{5}\left(-\csc ^{2} x\right)+5 x^{4} \cot x\right] \\
& =\left(8 x^{5} \csc ^{2} x-40 x^{4} \cot x\right)\left(1+x^{5} \cot x\right)^{-9}
\end{aligned}
$$

Sometimes you will have to make adjustments in notation or apply the chain rule more than once to calculate a derivative.

Example 6 Find
(a) $\frac{d}{d x}[\sin (\sqrt{1+\cos x})]$
(b) $\frac{d \mu}{d t}$ if $\mu=\sec \sqrt{\omega t} \quad(\omega$ constant $)$

Solution (a). Taking $u=\sqrt{1+\cos x}$ in the generalized derivative formula for $\sin u$ yields

$$
\begin{aligned}
\frac{d}{d x}[\sin (\sqrt{1+\cos x})] & =\frac{d}{d x}[\sin u]=\cos u \frac{d u}{d x} \\
& =\cos (\sqrt{1+\cos x}) \cdot \frac{d}{d x}[\sqrt{1+\cos x}] \\
& =\cos (\sqrt{1+\cos x}) \cdot \frac{-\sin x}{2 \sqrt{1+\cos x}} \quad \begin{array}{l}
\text { We used the generalized derivative } \\
\text { formula for } \sqrt{u} \text { with } u=1+\cos x .
\end{array} \\
& =-\frac{\sin x \cos (\sqrt{1+\cos x})}{2 \sqrt{1+\cos x}}
\end{aligned}
$$

## Solution (b).

$$
\begin{aligned}
\frac{d \mu}{d t}=\frac{d}{d t}[\sec \sqrt{\omega t}] & =\sec \sqrt{\omega t} \tan \sqrt{\omega t} \frac{d}{d t}[\sqrt{\omega t}] \\
& =\sec \sqrt{\omega t} \tan \sqrt{\omega t} \frac{\omega}{2 \sqrt{\omega t}}
\end{aligned}
$$

We used the generalized derivative formula for $\sec u$ with $u=\sqrt{\omega t}$.

We used the generalized derivative formula for $\sqrt{u}$ with $u=\omega t$.

## TECHNOLOGY MASTERY

If you have a CAS, use it to perform the differentiation in (4).

## DIFFERENTIATING USING COMPUTER ALGEBRA SYSTEMS

Even with the chain rule and other differentiation rules, some derivative computations can be tedious to perform. For complicated derivatives, engineers and scientists often use computer algebra systems such as Mathematica, Maple, or Sage. For example, although we have all the mathematical tools to compute

$$
\begin{equation*}
\frac{d}{d x}\left[\frac{\left(x^{2}+1\right)^{10} \sin ^{3}(\sqrt{x})}{\sqrt{1+\csc x}}\right] \tag{4}
\end{equation*}
$$

by hand, the computation is sufficiently involved that it may be more efficient (and less error-prone) to use a computer algebra system.

## QUICK CHECK EXERCISES 2.6 (See page 181 for answers.)

1. The chain rule states that the derivative of the composition of two functions is the derivative of the $\_\_\_\_$ function evaluated at the $\_\_\_\_$ function times the derivative of the $\_\_\_\_$ function.
2. If $y$ is a differentiable function of $u$, and $u$ is a differentiable function of $x$, then

$$
\frac{d y}{d x}=
$$

$\_\_\_\_$ . $\_\_\_\_$
3. Find $d y / d x$.
(a) $y=\left(x^{2}+5\right)^{10}$
(b) $y=\sqrt{1+6 x}$
4. Find $d y / d x$.
(a) $y=\sin (3 x+2)$
(b) $y=\left(x^{2} \tan x\right)^{4}$
5. Suppose that $f(2)=3, f^{\prime}(2)=4, g(3)=6$, and $g^{\prime}(3)=-5$. Evaluate
(a) $h^{\prime}(2)$, where $h(x)=g(f(x))$
(b) $k^{\prime}(3)$, where $k(x)=f\left(\frac{1}{3} g(x)\right)$.

1. Given that

$$
f^{\prime}(0)=2, g(0)=0 \quad \text { and } \quad g^{\prime}(0)=3
$$

find $(f \circ g)^{\prime}(0)$.
2. Given that

$$
f^{\prime}(9)=5, g(2)=9 \quad \text { and } \quad g^{\prime}(2)=-3
$$

find $(f \circ g)^{\prime}(2)$.
3. Let $f(x)=x^{5}$ and $g(x)=2 x-3$.
(a) Find $(f \circ g)(x)$ and $(f \circ g)^{\prime}(x)$.
(b) Find $(g \circ f)(x)$ and $(g \circ f)^{\prime}(x)$.
4. Let $f(x)=5 \sqrt{x}$ and $g(x)=4+\cos x$.
(a) Find $(f \circ g)(x)$ and $(f \circ g)^{\prime}(x)$.
(b) Find $(g \circ f)(x)$ and $(g \circ f)^{\prime}(x)$.

## FOCUS ON CONCEPTS

5. Given the following table of values, find the indicated derivatives in parts (a) and (b).

| $x$ | $f(x)$ | $f^{\prime}(x)$ | $g(x)$ | $g^{\prime}(x)$ |
| :---: | :---: | :---: | :---: | :---: |
| 3 | 5 | -2 | 5 | 7 |
| 5 | 3 | -1 | 12 | 4 |

(a) $F^{\prime}(3)$, where $F(x)=f(g(x))$
(b) $G^{\prime}(3)$, where $G(x)=g(f(x))$
6. Given the following table of values, find the indicated derivatives in parts (a) and (b).

| $x$ | $f(x)$ | $f^{\prime}(x)$ | $g(x)$ | $g^{\prime}(x)$ |
| ---: | :---: | :---: | :---: | :---: |
| -1 | 2 | 3 | 2 | -3 |
| 2 | 0 | 4 | 1 | -5 |

(a) $F^{\prime}(-1)$, where $F(x)=f(g(x))$
(b) $G^{\prime}(-1)$, where $G(x)=g(f(x))$

7-26 Find $f^{\prime}(x)$.
7. $f(x)=\left(x^{3}+2 x\right)^{37}$
8. $f(x)=\left(3 x^{2}+2 x-1\right)^{6}$
9. $f(x)=\left(x^{3}-\frac{7}{x}\right)^{-2}$
10. $f(x)=\frac{1}{\left(x^{5}-x+1\right)^{9}}$
11. $f(x)=\frac{4}{\left(3 x^{2}-2 x+1\right)^{3}}$
12. $f(x)=\sqrt{x^{3}-2 x+5}$
13. $f(x)=\sqrt{4+\sqrt{3 x}}$
14. $f(x)=\sqrt[4]{x} \quad(=\sqrt{\sqrt{x}})$
15. $f(x)=\sin \left(\frac{1}{x^{2}}\right)$
16. $f(x)=\tan \sqrt{x}$
17. $f(x)=4 \cos ^{5} x$
18. $f(x)=4 x+5 \sin ^{4} x$
19. $f(x)=\cos ^{2}(3 \sqrt{x})$
20. $f(x)=\tan ^{4}\left(x^{3}\right)$
21. $f(x)=2 \sec ^{2}\left(x^{7}\right)$
22. $f(x)=\cos ^{3}\left(\frac{x}{x+1}\right)$
23. $f(x)=\sqrt{\cos (5 x)}$
24. $f(x)=\sqrt{3 x-\sin ^{2}(4 x)}$
25. $f(x)=\left[x+\csc \left(x^{3}+3\right)\right]^{-3}$
26. $f(x)=\left[x^{4}-\sec \left(4 x^{2}-2\right)\right]^{-4}$

27-40 Find $d y / d x$.
27. $y=x^{3} \sin ^{2}(5 x)$
28. $y=\sqrt{x} \tan ^{3}(\sqrt{x})$
29. $y=x^{5} \sec (1 / x)$
30. $y=\frac{\sin x}{\sec (3 x+1)}$
31. $y=\cos (\cos x)$
32. $y=\sin (\tan 3 x)$
33. $y=\cos ^{3}(\sin 2 x)$
34. $y=\frac{1+\csc \left(x^{2}\right)}{1-\cot \left(x^{2}\right)}$
35. $y=(5 x+8)^{7}(1-\sqrt{x})^{6}$
36. $y=\left(x^{2}+x\right)^{5} \sin ^{8} x$
37. $y=\left(\frac{x-5}{2 x+1}\right)^{3}$
38. $y=\left(\frac{1+x^{2}}{1-x^{2}}\right)^{17}$
39. $y=\frac{(2 x+3)^{3}}{\left(4 x^{2}-1\right)^{8}}$
40. $y=\left[1+\sin ^{3}\left(x^{5}\right)\right]^{12}$

C 41-42 Use a CAS to find $d y / d x$.
41. $y=\left[x \sin 2 x+\tan ^{4}\left(x^{7}\right)\right]^{5}$
42. $y=\tan ^{4}\left(2+\frac{(7-x) \sqrt{3 x^{2}+5}}{x^{3}+\sin x}\right)$

43-50 Find an equation for the tangent line to the graph at the specified value of $x$.
43. $y=x \cos 3 x, x=\pi$
44. $y=\sin \left(1+x^{3}\right), x=-3$
45. $y=\sec ^{3}\left(\frac{\pi}{2}-x\right), x=-\frac{\pi}{2}$
46. $y=\left(x-\frac{1}{x}\right)^{3}, x=2$
47. $y=\tan \left(4 x^{2}\right), x=\sqrt{\pi}$
48. $y=3 \cot ^{4} x, x=\frac{\pi}{4}$
49. $y=x^{2} \sqrt{5-x^{2}}, x=1$
50. $y=\frac{x}{\sqrt{1-x^{2}}}, x=0$

51-54 Find $d^{2} y / d x^{2}$.
51. $y=x \cos (5 x)-\sin ^{2} x$
52. $y=\sin \left(3 x^{2}\right)$
53. $y=\frac{1+x}{1-x}$
54. $y=x \tan \left(\frac{1}{x}\right)$

55-58 Find the indicated derivative.
55. $y=\cot ^{3}(\pi-\theta)$; find $\frac{d y}{d \theta}$.
56. $\lambda=\left(\frac{a u+b}{c u+d}\right)^{6}$; find $\frac{d \lambda}{d u} \quad(a, b, c, d$ constants).
57. $\frac{d}{d \omega}\left[a \cos ^{2} \pi \omega+b \sin ^{2} \pi \omega\right] \quad(a, b$ constants $)$
58. $x=\csc ^{2}\left(\frac{\pi}{3}-y\right)$; find $\frac{d x}{d y}$.
59. (a) Use a graphing utility to obtain the graph of the function $f(x)=x \sqrt{4-x^{2}}$.
(b) Use the graph in part (a) to make a rough sketch of the graph of $f^{\prime}$.
(c) Find $f^{\prime}(x)$, and then check your work in part (b) by using the graphing utility to obtain the graph of $f^{\prime}$.
(d) Find the equation of the tangent line to the graph of $f$ at $x=1$, and graph $f$ and the tangent line together.
60. (a) Use a graphing utility to obtain the graph of the function $f(x)=\sin x^{2} \cos x$ over the interval $[-\pi / 2, \pi / 2]$.
(b) Use the graph in part (a) to make a rough sketch of the graph of $f^{\prime}$ over the interval.
(c) Find $f^{\prime}(x)$, and then check your work in part (b) by using the graphing utility to obtain the graph of $f^{\prime}$ over the interval.
(d) Find the equation of the tangent line to the graph of $f$ at $x=1$, and graph $f$ and the tangent line together over the interval.

61-64 True-False Determine whether the statement is true or false. Explain your answer. $\square$
61. If $y=f(x)$, then $\frac{d}{d x}[\sqrt{y}]=\sqrt{f^{\prime}(x)}$.
62. If $y=f(u)$ and $u=g(x)$, then $d y / d x=f^{\prime}(x) \cdot g^{\prime}(x)$.
63. If $y=\cos [g(x)]$, then $d y / d x=-\sin \left[g^{\prime}(x)\right]$.
64. If $y=\sin ^{3}\left(3 x^{3}\right)$, then $d y / d x=27 x^{2} \sin ^{2}\left(3 x^{3}\right) \cos \left(3 x^{3}\right)$.
65. If an object suspended from a spring is displaced vertically from its equilibrium position by a small amount and released, and if the air resistance and the mass of the spring are ignored, then the resulting oscillation of the object is called simple harmonic motion. Under appropriate conditions the displacement $y$ from equilibrium in terms of time $t$ is given by

$$
y=A \cos \omega t
$$

where $A$ is the initial displacement at time $t=0$, and $\omega$ is a constant that depends on the mass of the object and the stiffness of the spring (see the accompanying figure). The constant $|A|$ is called the amplitude of the motion and $\omega$ the angular frequency.
(a) Show that

$$
\frac{d^{2} y}{d t^{2}}=-\omega^{2} y
$$

(b) The period $T$ is the time required to make one complete oscillation. Show that $T=2 \pi / \omega$.
(c) The frequency $f$ of the vibration is the number of oscillations per unit time. Find $f$ in terms of the period $T$.
(d) Find the amplitude, period, and frequency of an object that is executing simple harmonic motion given by $y=0.6 \cos 15 t$, where $t$ is in seconds and $y$ is in centimeters.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-114.jpg?height=386&width=613&top_left_y=1485&top_left_x=214)
Figure Ex-65

66. Find the value of the constant $A$ so that $y=A \sin 3 t$ satisfies the equation

$$
\frac{d^{2} y}{d t^{2}}+2 y=4 \sin 3 t
$$

## FOCUS ON CONCEPTS

67. Use the graph of the function $f$ in the accompanying figure to evaluate

$$
\left.\frac{d}{d x}[\sqrt{x+f(x)}]\right|_{x=-1}
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-114.jpg?height=365&width=359&top_left_y=198&top_left_x=1149)
Figure Ex-67

68. Using the function $f$ in Exercise 67, evaluate

$$
\left.\frac{d}{d x}[f(2 \sin x)]\right|_{x=\pi / 6}
$$

69. The accompanying figure shows the graph of atmospheric pressure $p\left(\mathrm{lb} / \mathrm{in}^{2}\right)$ versus the altitude $h(\mathrm{mi})$ above sea level.
(a) From the graph and the tangent line at $h=2$ shown on the graph, estimate the values of $p$ and $d p / d h$ at an altitude of 2 mi .
(b) If the altitude of a space vehicle is increasing at the rate of $0.3 \mathrm{mi} / \mathrm{s}$ at the instant when it is 2 mi above sea level, how fast is the pressure changing with time at this instant?

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-114.jpg?height=355&width=363&top_left_y=1217&top_left_x=1125)
< Figure Ex-69

70. The force $F$ (in pounds) acting at an angle $\theta$ with the horizontal that is needed to drag a crate weighing $W$ pounds along a horizontal surface at a constant velocity is given by

$$
F=\frac{\mu W}{\cos \theta+\mu \sin \theta}
$$

where $\mu$ is a constant called the coefficient of sliding friction between the crate and the surface (see the accompanying figure). Suppose that the crate weighs 150 lb and that $\mu=0.3$.
(a) Find $d F / d \theta$ when $\theta=30^{\circ}$. Express the answer in units of pounds/degree.
(b) Find $d F / d t$ when $\theta=30^{\circ}$ if $\theta$ is decreasing at the rate of $0.5^{\circ} / \mathrm{s}$ at this instant.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-114.jpg?height=177&width=405&top_left_y=2190&top_left_x=1129)
Figure Ex-70

71. Recall that

$$
\frac{d}{d x}(|x|)=\left\{\begin{aligned}
1, & x>0 \\
-1, & x<0
\end{aligned}\right.
$$

Use this result and the chain rule to find

$$
\frac{d}{d x}(|\sin x|)
$$

for nonzero $x$ in the interval $(-\pi, \pi)$.
72. Use the derivative formula for $\sin x$ and the identity

$$
\cos x=\sin \left(\frac{\pi}{2}-x\right)
$$

to obtain the derivative formula for $\cos x$.
73. Let

$$
f(x)= \begin{cases}x \sin \frac{1}{x}, & x \neq 0 \\ 0, & x=0\end{cases}
$$

(a) Show that $f$ is continuous at $x=0$.
(b) Use Definition 2.2.1 to show that $f^{\prime}(0)$ does not exist.
(c) Find $f^{\prime}(x)$ for $x \neq 0$.
(d) Determine whether $\lim _{x \rightarrow 0} f^{\prime}(x)$ exists.
74. Let

$$
f(x)= \begin{cases}x^{2} \sin \frac{1}{x}, & x \neq 0 \\ 0, & x=0\end{cases}
$$

(a) Show that $f$ is continuous at $x=0$.
(b) Use Definition 2.2.1 to find $f^{\prime}(0)$.
(c) Find $f^{\prime}(x)$ for $x \neq 0$.
(d) Show that $f^{\prime}$ is not continuous at $x=0$.
75. Given the following table of values, find the indicated derivatives in parts (a) and (b).

| $x$ | $f(x)$ | $f^{\prime}(x)$ |
| :---: | :---: | :---: |
| 2 | 1 | 7 |
| 8 | 5 | -3 |

(a) $g^{\prime}(2)$, where $g(x)=[f(x)]^{3}$
(b) $h^{\prime}(2)$, where $h(x)=f\left(x^{3}\right)$
76. Given that $f^{\prime}(x)=\sqrt{3 x+4}$ and $g(x)=x^{2}-1$, find $F^{\prime}(x)$ if $F(x)=f(g(x))$.
77. Given that $f^{\prime}(x)=\frac{x}{x^{2}+1}$ and $g(x)=\sqrt{3 x-1}$, find $F^{\prime}(x)$ if $F(x)=f(g(x))$.
78. Find $f^{\prime}\left(x^{2}\right)$ if $\frac{d}{d x}\left[f\left(x^{2}\right)\right]=x^{2}$.
79. Find $\frac{d}{d x}[f(x)]$ if $\frac{d}{d x}[f(3 x)]=6 x$.
80. Recall that a function $f$ is even if $f(-x)=f(x)$ and odd if $f(-x)=-f(x)$, for all $x$ in the domain of $f$. Assuming that $f$ is differentiable, prove:
(a) $f^{\prime}$ is odd if $f$ is even
(b) $f^{\prime}$ is even if $f$ is odd.
81. Draw some pictures to illustrate the results in Exercise 80, and write a paragraph that gives an informal explanation of why the results are true.
82. Let $y=f_{1}(u), u=f_{2}(v), v=f_{3}(w)$, and $w=f_{4}(x)$. Express $d y / d x$ in terms of $d y / d u, d w / d x, d u / d v$, and $d v / d w$.
83. Find a formula for

$$
\frac{d}{d x}[f(g(h(x)))]
$$

84. Writing The "co" in "cosine" comes from "complementary," since the cosine of an angle is the sine of the complementary angle, and vice versa:

$$
\cos x=\sin \left(\frac{\pi}{2}-x\right) \quad \text { and } \quad \sin x=\cos \left(\frac{\pi}{2}-x\right)
$$

Suppose that we define a function $g$ to be a cofunction of a function $f$ if

$$
g(x)=f\left(\frac{\pi}{2}-x\right) \quad \text { for all } x
$$

Thus, cosine and sine are cofunctions of each other, as are cotangent and tangent, and also cosecant and secant. If $g$ is the cofunction of $f$, state a formula that relates $g^{\prime}$ and the cofunction of $f^{\prime}$. Discuss how this relationship is exhibited by the derivatives of the cosine, cotangent, and cosecant functions.

## QUICK CHECK ANSWERS 2.6

1. outside; inside; inside
2. $\frac{d y}{d u} \cdot \frac{d u}{d x}$
3. (a) $10\left(x^{2}+5\right)^{9} \cdot 2 x=20 x\left(x^{2}+5\right)^{9}$
(b) $\frac{1}{2 \sqrt{1+6 x}} \cdot 6=\frac{3}{\sqrt{1+6 x}}$
4. 

(a) $3 \cos (3 x+2)$
(b) $4\left(x^{2} \tan x\right)^{3}\left(2 x \tan x+x^{2} \sec ^{2} x\right)$
5. (a) $g^{\prime}(f(2)) f^{\prime}(2)=-20$
(b) $f^{\prime}\left(\frac{1}{3} g(3)\right) \cdot \frac{1}{3} g^{\prime}(3)=-\frac{20}{3}$

## CHAPTER 2 REVIEW EXERCISES

Graphing Utility
CAS

1. Explain the difference between average and instantaneous rates of change, and discuss how they are calculated.
2. In parts (a)-(d), use the function $y=\frac{1}{2} x^{2}$.
(a) Find the average rate of change of $y$ with respect to $x$ over the interval [ 3,4 ].
(b) Find the instantaneous rate of change of $y$ with respect to $x$ at $x=3$.
(cont.)
(c) Find the instantaneous rate of change of $y$ with respect to $x$ at a general $x$-value.
(d) Sketch the graph of $y=\frac{1}{2} x^{2}$ together with the secant line whose slope is given by the result in part (a), and indicate graphically the slope of the tangent line that corresponds to the result in part (b).
3. Complete each part for the function $f(x)=x^{2}+1$.
(a) Find the slope of the tangent line to the graph of $f$ at a general $x$-value.
(b) Find the slope of the tangent line to the graph of $f$ at $x=2$.
4. A car is traveling on a straight road that is 120 mi long. For the first 100 mi the car travels at an average velocity of 50 $\mathrm{mi} / \mathrm{h}$. Show that no matter how fast the car travels for the final 20 mi it cannot bring the average velocity up to 60 $\mathrm{mi} / \mathrm{h}$ for the entire trip.
5. At time $t=0$ a car moves into the passing lane to pass a slow-moving truck. The average velocity of the car from $t=1$ to $t=1+h$ is

$$
v_{\mathrm{ave}}=\frac{3(h+1)^{2.5}+580 h-3}{10 h}
$$

Estimate the instantaneous velocity of the car at $t=1$, where time is in seconds and distance is in feet.
6. A skydiver jumps from an airplane. Suppose that the distance she falls during the first $t$ seconds before her parachute opens is $s(t)=976\left((0.835)^{t}-1\right)+176 t$, where $s$ is in feet. Graph $s$ versus $t$ for $0 \leq t \leq 20$, and use your graph to estimate the instantaneous velocity at $t=15$.
7. A particle moves on a line away from its initial position so that after $t$ hours it is $s=3 t^{2}+t$ miles from its initial position.
(a) Find the average velocity of the particle over the interval $[1,3]$.
(b) Find the instantaneous velocity at $t=1$.
8. State the definition of a derivative, and give two interpretations of it.
9. Use the definition of a derivative to find $d y / d x$, and check your answer by calculating the derivative using appropriate derivative formulas.
(a) $y=\sqrt{9-4 x}$
(b) $y=\frac{x}{x+1}$
10. Suppose that $f(x)= \begin{cases}x^{2}-1, & x \leq 1 \\ k(x-1), & x>1 .\end{cases}$

For what values of $k$ is $f$
(a) continuous?
(b) differentiable?
11. The accompanying figure shows the graph of $y=f^{\prime}(x)$ for an unspecified function $f$.
(a) For what values of $x$ does the curve $y=f(x)$ have a horizontal tangent line?
(b) Over what intervals does the curve $y=f(x)$ have tangent lines with positive slope?
(c) Over what intervals does the curve $y=f(x)$ have tangent lines with negative slope?
(d) Given that $g(x)=f(x) \sin x$, find $g^{\prime \prime}(0)$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-116.jpg?height=411&width=435&top_left_y=338&top_left_x=1125)
Figure Ex-11

12. Sketch the graph of a function $f$ for which $f(0)=1$, $f^{\prime}(0)=0, f^{\prime}(x)>0$ if $x<0$, and $f^{\prime}(x)<0$ if $x>0$.
13. According to the U.S. Bureau of the Census, the estimated and projected midyear world population, $N$, in billions for the years 1950, 1975, 2000, 2025, and 2050 was 2.555, 4.088, 6.080, 7.841, and 9.104, respectively. Although the increase in population is not a continuous function of the time $t$, we can apply the ideas in this section if we are willing to approximate the graph of $N$ versus $t$ by a continuous curve, as shown in the accompanying figure.
(a) Use the tangent line at $t=2000$ shown in the figure to approximate the value of $d N / d t$ there. Interpret your result as a rate of change.
(b) The instantaneous growth rate is defined as

$$
\frac{d N / d t}{N}
$$

Use your answer to part (a) to approximate the instantaneous growth rate at the start of the year 2000. Express the result as a percentage and include the proper units.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-116.jpg?height=500&width=501&top_left_y=1621&top_left_x=1123)
Figure Ex-13

14. Use a graphing utility to graph the function

$$
f(x)=\left|x^{4}-x-1\right|-x
$$

and estimate the values of $x$ where the derivative of this function does not exist.
c 15-18 (a) Use a CAS to find $f^{\prime}(x)$ via Definition 2.2.1; (b) check the result by finding the derivative by hand; (c) use the CAS to find $f^{\prime \prime}(x)$.
15. $f(x)=x^{2} \sin x$
16. $f(x)=\sqrt{x}+\cos ^{2} x$
17. $f(x)=\frac{2 x^{2}-x+5}{3 x+2}$
18. $f(x)=\frac{\tan x}{1+x^{2}}$
19. The amount of water in a tank $t$ minutes after it has started to drain is given by $W=100(t-15)^{2}$ gal.
(a) At what rate is the water running out at the end of 5 $\min$ ?
(b) What is the average rate at which the water flows out during the first 5 min ?
20. Use the formula $V=l^{3}$ for the volume of a cube of side $l$ to find
(a) the average rate at which the volume of a cube changes with $l$ as $l$ increases from $l=2$ to $l=4$
(b) the instantaneous rate at which the volume of a cube changes with $l$ when $l=5$.

21-22 Zoom in on the graph of $f$ on an interval containing $x=x_{0}$ until the graph looks like a straight line. Estimate the slope of this line and then check your answer by finding the exact value of $f^{\prime}\left(x_{0}\right)$.
21. (a) $f(x)=x^{2}-1, x_{0}=1.8$
(b) $f(x)=\frac{x^{2}}{x-2}, x_{0}=3.5$
22. (a) $f(x)=x^{3}-x^{2}+1, x_{0}=2.3$
(b) $f(x)=\frac{x}{x^{2}+1}, x_{0}=-0.5$
23. Suppose that a function $f$ is differentiable at $x=1$ and

$$
\lim _{h \rightarrow 0} \frac{f(1+h)}{h}=5
$$

Find $f(1)$ and $f^{\prime}(1)$.
24. Suppose that a function $f$ is differentiable at $x=2$ and

$$
\lim _{x \rightarrow 2} \frac{x^{3} f(x)-24}{x-2}=28
$$

Find $f(2)$ and $f^{\prime}(2)$.
25. Find the equations of all lines through the origin that are tangent to the curve $y=x^{3}-9 x^{2}-16 x$.
26. Find all values of $x$ for which the tangent line to the curve $y=2 x^{3}-x^{2}$ is perpendicular to the line $x+4 y=10$.
27. Let $f(x)=x^{2}$. Show that for any distinct values of $a$ and $b$, the slope of the tangent line to $y=f(x)$ at $x=\frac{1}{2}(a+b)$ is equal to the slope of the secant line through the points ( $a, a^{2}$ ) and ( $b, b^{2}$ ). Draw a picture to illustrate this result.
28. In each part, evaluate the expression given that $f(1)=1$, $g(1)=-2, f^{\prime}(1)=3$, and $g^{\prime}(1)=-1$.
(a) $\left.\frac{d}{d x}[f(x) g(x)]\right|_{x=1}$
(b) $\left.\frac{d}{d x}\left[\frac{f(x)}{g(x)}\right]\right|_{x=1}$
(c) $\left.\frac{d}{d x}[\sqrt{f(x)}]\right|_{x=1}$
(d) $\frac{d}{d x}\left[f(1) g^{\prime}(1)\right]$

29-32 Find $f^{\prime}(x)$.
29. (a) $f(x)=x^{8}-3 \sqrt{x}+5 x^{-3}$
(b) $f(x)=(2 x+1)^{101}\left(5 x^{2}-7\right)$
30. (a) $f(x)=\sin x+2 \cos ^{3} x$
(b) $f(x)=(1+\sec x)\left(x^{2}-\tan x\right)$
31. (a) $f(x)=\sqrt{3 x+1}(x-1)^{2}$
(b) $f(x)=\left(\frac{3 x+1}{x^{2}}\right)^{3}$
32.
(a) $f(x)=\cot \left(\frac{\csc 2 x}{x^{3}+5}\right)$
(b) $f(x)=\frac{1}{2 x+\sin ^{3} x}$

33-34 Find the values of $x$ at which the curve $y=f(x)$ has a horizontal tangent line.
33. $f(x)=(2 x+7)^{6}(x-2)^{5}$
34. $f(x)=\frac{(x-3)^{4}}{x^{2}+2 x}$
35. Find all lines that are simultaneously tangent to the graph of $y=x^{2}+1$ and to the graph of $y=-x^{2}-1$.
36. (a) Let $n$ denote an even positive integer. Generalize the result of Exercise 35 by finding all lines that are simultaneously tangent to the graph of $y=x^{n}+n-1$ and to the graph of $y=-x^{n}-n+1$.
(b) Let $n$ denote an odd positive integer. Are there any lines that are simultaneously tangent to the graph of $y=x^{n}+n-1$ and to the graph of $y=-x^{n}-n+1$ ? Explain.
37. Find all values of $x$ for which the line that is tangent to $y=3 x-\tan x$ is parallel to the line $y-x=2$.
38. Approximate the values of $x$ at which the tangent line to the graph of $y=x^{3}-\sin x$ is horizontal.
39. Suppose that $f(x)=M \sin x+N \cos x$ for some constants $M$ and $N$. If $f(\pi / 4)=3$ and $f^{\prime}(\pi / 4)=1$, find an equation for the tangent line to $y=f(x)$ at $x=3 \pi / 4$.
40. Suppose that $f(x)=M \tan x+N \sec x$ for some constants $M$ and $N$. If $f(\pi / 4)=2$ and $f^{\prime}(\pi / 4)=0$, find an equation for the tangent line to $y=f(x)$ at $x=0$.
41. Suppose that $f^{\prime}(x)=2 x \cdot f(x)$ and $f(2)=5$.
(a) Find $g^{\prime}(\pi / 3)$ if $g(x)=f(\sec x)$.
(b) Find $h^{\prime}(2)$ if $h(x)=[f(x) /(x-1)]^{4}$.

## CHAPTER 2 MAKING CONNECTIONS

1. Suppose that $f$ is a function with the properties (i) $f$ is differentiable everywhere, (ii) $f(x+y)=f(x) f(y)$ for all values of $x$ and $y$, (iii) $f(0) \neq 0$, and (iv) $f^{\prime}(0)=1$.
(a) Show that $f(0)=1$. [Hint: Consider $f(0+0)$.]
(b) Show that $f(x)>0$ for all values of $x$. [Hint: First show that $f(x) \neq 0$ for any $x$ by considering $f(x-x)$.]
(c) Use the definition of derivative (Definition 2.2.1) to show that $f^{\prime}(x)=f(x)$ for all values of $x$.
2. Suppose that $f$ and $g$ are functions each of which has the properties (i)-(iv) in Exercise 1.
(a) Show that $y=f(2 x)$ satisfies the equation $y^{\prime}=2 y$ in two ways: using property (ii), and by directly applying the chain rule (Theorem 2.6.1).
(b) If $k$ is any constant, show that $y=f(k x)$ satisfies the equation $y^{\prime}=k y$.
(c) Find a value of $k$ such that $y=f(x) g(x)$ satisfies the equation $y^{\prime}=k y$.
(d) If $h=f / g$, find $h^{\prime}(x)$. Make a conjecture about the relationship between $f$ and $g$.
3. (a) Apply the product rule (Theorem 2.4.1) twice to show that if $f, g$, and $h$ are differentiable functions, then $f \cdot g \cdot h$ is differentiable and

$$
(f \cdot g \cdot h)^{\prime}=f^{\prime} \cdot g \cdot h+f \cdot g^{\prime} \cdot h+f \cdot g \cdot h^{\prime}
$$

(b) Suppose that $f, g, h$, and $k$ are differentiable functions. Derive a formula for $(f \cdot g \cdot h \cdot k)^{\prime}$.
(c) Based on the result in part (a), make a conjecture about a formula differentiating a product of $n$ functions. Prove your formula using induction.
4. (a) Apply the quotient rule (Theorem 2.4.2) twice to show that if $f, g$, and $h$ are differentiable functions, then $(f / g) / h$ is differentiable where it is defined and

$$
[(f / g) / h]^{\prime}=\frac{f^{\prime} \cdot g \cdot h-f \cdot g^{\prime} \cdot h-f \cdot g \cdot h^{\prime}}{g^{2} h^{2}}
$$

(b) Derive the derivative formula of part (a) by first simplifying $(f / g) / h$ and then applying the quotient and product rules.
(c) Apply the quotient rule (Theorem 2.4.2) twice to derive a formula for $[f /(g / h)]^{\prime}$.
(d) Derive the derivative formula of part (c) by first simplifying $f /(g / h)$ and then applying the quotient and product rules.
5. Assume that $h(x)=f(x) / g(x)$ is differentiable. Derive the quotient rule formula for $h^{\prime}(x)$ (Theorem 2.4.2) in two ways:
(a) Write $h(x)=f(x) \cdot[g(x)]^{-1}$ and use the product and chain rules (Theorems 2.4.1 and 2.6.1) to differentiate $h$.
(b) Write $f(x)=h(x) \cdot g(x)$ and use the product rule to derive a formula for $h^{\prime}(x)$.

## EXPANDING THE CALCULUS HORIZON

To learn how derivatives can be used in the field of robotics, see the module entitled Robotics at:
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-119.jpg?height=645&width=682&top_left_y=154&top_left_x=210)

## DIFFERENTIATION

Craig Lovell/Corbis Images

The growth and decline of animal populations and natural resources can be modeled using basic functions studied in calculus.

We begin this chapter by extending the process of differentiation to functions that are either difficult or impossible to differentiate directly. We will discuss a combination of direct and indirect methods of differentiation that will allow us to develop a number of new derivative formulas that include the derivatives of logarithmic, exponential, and inverse trigonometric functions. Later in the chapter, we will consider some applications of the derivative. These will include ways in which different rates of change can be related as well as the use of linear functions to approximate nonlinear functions. Finally, we will discuss L'Hôpital's rule, a powerful tool for evaluating limits.

### 3.1 IMPLICIT DIFFERENTIATION

Up to now we have been concerned with differentiating functions that are given by equations of the form $y=f(x)$. In this section we will consider methods for differentiating functions for which it is inconvenient or impossible to express them in this form.

## FUNCTIONS DEFINED EXPLICITLY AND IMPLICITLY

An equation of the form $y=f(x)$ is said to define y explicitly as a function of $x$ because the variable $y$ appears alone on one side of the equation and does not appear at all on the other side. However, sometimes functions are defined by equations in which $y$ is not alone on one side; for example, the equation

$$
\begin{equation*}
y x+y+1=x \tag{1}
\end{equation*}
$$

is not of the form $y=f(x)$, but it still defines $y$ as a function of $x$ since it can be rewritten as

$$
y=\frac{x-1}{x+1}
$$

Thus, we say that (1) defines $y$ implicitly as a function of $x$, the function being

$$
f(x)=\frac{x-1}{x+1}
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-120.jpg?height=1076&width=315&top_left_y=188&top_left_x=234)
- Figure 3.1.1

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-120.jpg?height=365&width=415&top_left_y=1339&top_left_x=184)
- Figure 3.1.2 The graph of $x=y^{2}$ does not pass the vertical line test, but the graphs of $y=\sqrt{x}$ and $y=-\sqrt{x}$ do.

An equation in $x$ and $y$ can implicitly define more than one function of $x$. This can occur when the graph of the equation fails the vertical line test, so it is not the graph of a function of $x$. For example, if we solve the equation of the circle

$$
\begin{equation*}
x^{2}+y^{2}=1 \tag{2}
\end{equation*}
$$

for $y$ in terms of $x$, we obtain $y= \pm \sqrt{1-x^{2}}$, so we have found two functions that are defined implicitly by (2), namely,

$$
\begin{equation*}
f_{1}(x)=\sqrt{1-x^{2}} \quad \text { and } \quad f_{2}(x)=-\sqrt{1-x^{2}} \tag{3}
\end{equation*}
$$

The graphs of these functions are the upper and lower semicircles of the circle $x^{2}+y^{2}=1$ (Figure 3.1.1). This leads us to the following definition.

### 3.1.1 DEFINITION We will say that a given equation in $x$ and $y$ defines the function $f$ implicitly if the graph of $y=f(x)$ coincides with a portion of the graph of the equation.

- Example 1 The graph of $x=y^{2}$ is not the graph of a function of $x$, since it does not pass the vertical line test (Figure 3.1.2). However, if we solve this equation for $y$ in terms of $x$, we obtain the equations $y=\sqrt{x}$ and $y=-\sqrt{x}$, whose graphs pass the vertical line test and are portions of the graph of $x=y^{2}$ (Figure 3.1.2). Thus, the equation $x=y^{2}$ implicitly defines the functions

$$
f_{1}(x)=\sqrt{x} \quad \text { and } \quad f_{2}(x)=-\sqrt{x}
$$

Although it was a trivial matter in the last example to solve the equation $x=y^{2}$ for $y$ in terms of $x$, it is difficult or impossible to do this for some equations. For example, the equation

$$
\begin{equation*}
x^{3}+y^{3}=3 x y \tag{4}
\end{equation*}
$$

can be solved for $y$ in terms of $x$, but the resulting formulas are too complicated to be practical. Other equations, such as $\sin (x y)=y$, cannot be solved for $y$ by any elementary method. Thus, even though an equation may define one or more functions of $x$, it may not be possible or practical to find explicit formulas for those functions.

Fortunately, CAS programs, such as Mathematica and Maple, have "implicit plotting" capabilities that can graph equations such as (4). The graph of this equation, which is called the Folium of Descartes, is shown in Figure 3.1.3a. Parts (b) and (c) of the figure show the graphs (in blue) of two functions that are defined implicitly by (4).

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-120.jpg?height=471&width=1373&top_left_y=1898&top_left_x=546)
- Figure 3.1.3

## IMPLICIT DIFFERENTIATION

In general, it is not necessary to solve an equation for $y$ in terms of $x$ in order to differentiate the functions defined implicitly by the equation. To illustrate this, let us consider the simple equation

$$
\begin{equation*}
x y=1 \tag{5}
\end{equation*}
$$

One way to find $d y / d x$ is to rewrite this equation as

$$
\begin{equation*}
y=\frac{1}{x} \tag{6}
\end{equation*}
$$

from which it follows that

$$
\begin{equation*}
\frac{d y}{d x}=-\frac{1}{x^{2}} \tag{7}
\end{equation*}
$$

Another way to obtain this derivative is to differentiate both sides of (5) before solving for $y$ in terms of $x$, treating $y$ as a (temporarily unspecified) differentiable function of $x$. With this approach we obtain

$$
\begin{aligned}
& \frac{d}{d x}[x y]=\frac{d}{d x}[1] \\
& x \frac{d}{d x}[y]+y \frac{d}{d x}[x]=0 \\
& x \frac{d y}{d x}+y=0 \\
& \frac{d y}{d x}=-\frac{y}{x}
\end{aligned}
$$

If we now substitute (6) into the last expression, we obtain

$$
\frac{d y}{d x}=-\frac{1}{x^{2}}
$$

which agrees with Equation (7). This method of obtaining derivatives is called implicit differentiation.

- Example 2 Use implicit differentiation to find $d y / d x$ if $5 y^{2}+\sin y=x^{2}$.

$$
\begin{array}{ll}
\frac{d}{d x}\left[5 y^{2}+\sin y\right]=\frac{d}{d x}\left[x^{2}\right] & \\
5 \frac{d}{d x}\left[y^{2}\right]+\frac{d}{d x}[\sin y]=2 x & \\
5\left(2 y \frac{d y}{d x}\right)+(\cos y) \frac{d y}{d x}=2 x & \begin{array}{l}
\text { The chain rule was used here } \\
\text { because } y \text { is a function of } x .
\end{array} \\
10 y \frac{d y}{d x}+(\cos y) \frac{d y}{d x}=2 x &
\end{array}
$$

René Descartes (1596-1650) Descartes, a French aristocrat, was the son of a government official. He graduated from the University of Poitiers with a law degree at age 20. After a brief probe into the pleasures of Paris he became a military engineer, first for the Dutch Prince of Nassau and then for the German Duke of Bavaria. It was during his service as a soldier that Descartes began to pursue mathematics seriously and develop his analytic geometry. After the wars, he returned to Paris where he stalked the city as an eccentric, wearing
a sword in his belt and a plumed hat. He lived in leisure, seldom arose before 11 A.M., and dabbled in the study of human physiology, philosophy, glaciers, meteors, and rainbows. He eventually moved to Holland, where he published his Discourse on the Method, and finally to Sweden where he died while serving as tutor to Queen Christina. Descartes is regarded as a genius of the first magnitude. In addition to major contributions in mathematics and philosophy he is considered, along with William Harvey, to be a founder of modern physiology.

Solving for $d y / d x$ we obtain

$$
\begin{equation*}
\frac{d y}{d x}=\frac{2 x}{10 y+\cos y} \tag{8}
\end{equation*}
$$

Note that this formula involves both $x$ and $y$. In order to obtain a formula for $d y / d x$ that involves $x$ alone, we would have to solve the original equation for $y$ in terms of $x$ and then substitute in (8). However, it is impossible to do this, so we are forced to leave the formula for $d y / d x$ in terms of $x$ and $y$.

Example 3 Use implicit differentiation to find $d^{2} y / d x^{2}$ if $4 x^{2}-2 y^{2}=9$.
Solution. Differentiating both sides of $4 x^{2}-2 y^{2}=9$ with respect to $x$ yields

$$
8 x-4 y \frac{d y}{d x}=0
$$

from which we obtain

$$
\begin{equation*}
\frac{d y}{d x}=\frac{2 x}{y} \tag{9}
\end{equation*}
$$

Differentiating both sides of (9) yields

$$
\begin{equation*}
\frac{d^{2} y}{d x^{2}}=\frac{(y)(2)-(2 x)(d y / d x)}{y^{2}} \tag{10}
\end{equation*}
$$

Substituting (9) into (10) and simplifying using the original equation, we obtain

$$
\frac{d^{2} y}{d x^{2}}=\frac{2 y-2 x(2 x / y)}{y^{2}}=\frac{2 y^{2}-4 x^{2}}{y^{3}}=-\frac{9}{y^{3}}
$$

In Examples 2 and 3, the resulting formulas for $d y / d x$ involved both $x$ and $y$. Although it is usually more desirable to have the formula for $d y / d x$ expressed in terms of $x$ alone, having the formula in terms of $x$ and $y$ is not an impediment to finding slopes and equations of tangent lines provided the $x$-and $y$-coordinates of the point of tangency are known. This is illustrated in the following example.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-122.jpg?height=386&width=467&top_left_y=1651&top_left_x=160)
- Figure 3.1.4

Example 4 Find the slopes of the tangent lines to the curve $y^{2}-x+1=0$ at the points $(2,-1)$ and $(2,1)$.

Solution. We could proceed by solving the equation for $y$ in terms of $x$, and then evaluating the derivative of $y=\sqrt{x-1}$ at $(2,1)$ and the derivative of $y=-\sqrt{x-1}$ at $(2,-1)$ (Figure 3.1.4). However, implicit differentiation is more efficient since it can be used for the slopes of both tangent lines. Differentiating implicitly yields

$$
\begin{aligned}
& \frac{d}{d x}\left[y^{2}-x+1\right]=\frac{d}{d x}[0] \\
& \frac{d}{d x}\left[y^{2}\right]-\frac{d}{d x}[x]+\frac{d}{d x}[1]=\frac{d}{d x}[0] \\
& 2 y \frac{d y}{d x}-1=0 \\
& \frac{d y}{d x}=\frac{1}{2 y}
\end{aligned}
$$

At $(2,-1)$ we have $y=-1$, and at $(2,1)$ we have $y=1$, so the slopes of the tangent lines to the curve at those points are

$$
\left.\frac{d y}{d x}\right|_{\substack{x=2 \\ y=-1}}=-\frac{1}{2} \quad \text { and }\left.\quad \frac{d y}{d x}\right|_{\substack{x=2 \\ y=1}}=\frac{1}{2}
$$

Formula (11) cannot be evaluated at $(0,0)$ and hence provides no information about the nature of the Folium of Descartes at the origin. Based on the graphs in Figure 3.1.3, what can you say about the differentiability of the implicitly defined functions graphed in blue in parts (b) and (c) of the figure?

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-123.jpg?height=478&width=472&top_left_y=1211&top_left_x=210)
△ Figure 3.1.5

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-123.jpg?height=479&width=469&top_left_y=1894&top_left_x=212)
- Figure 3.1.6

## Example 5

(a) Use implicit differentiation to find $d y / d x$ for the Folium of Descartes $x^{3}+y^{3}=3 x y$.
(b) Find an equation for the tangent line to the Folium of Descartes at the point $\left(\frac{3}{2}, \frac{3}{2}\right)$.
(c) At what point(s) in the first quadrant is the tangent line to the Folium of Descartes horizontal?

Solution (a). Differentiating implicitly yields

$$
\begin{align*}
& \frac{d}{d x}\left[x^{3}+y^{3}\right]=\frac{d}{d x}[3 x y] \\
& 3 x^{2}+3 y^{2} \frac{d y}{d x}=3 x \frac{d y}{d x}+3 y \\
& x^{2}+y^{2} \frac{d y}{d x}=x \frac{d y}{d x}+y \\
& \left(y^{2}-x\right) \frac{d y}{d x}=y-x^{2} \\
& \frac{d y}{d x}=\frac{y-x^{2}}{y^{2}-x} \tag{11}
\end{align*}
$$

Solution (b). At the point $\left(\frac{3}{2}, \frac{3}{2}\right)$, we have $x=\frac{3}{2}$ and $y=\frac{3}{2}$, so from (11) the slope $m_{\tan }$ of the tangent line at this point is

$$
m_{\tan }=\left.\frac{d y}{d x}\right|_{\substack{x=3 / 2 \\ y=3 / 2}}=\frac{(3 / 2)-(3 / 2)^{2}}{(3 / 2)^{2}-(3 / 2)}=-1
$$

Thus, the equation of the tangent line at the point $\left(\frac{3}{2}, \frac{3}{2}\right)$ is

$$
y-\frac{3}{2}=-1\left(x-\frac{3}{2}\right) \quad \text { or } \quad x+y=3
$$

which is consistent with Figure 3.1.5.
Solution ( $\boldsymbol{c}$ ). The tangent line is horizontal at the points where $d y / d x=0$, and from (11) this occurs only where $y-x^{2}=0$ or

$$
\begin{equation*}
y=x^{2} \tag{12}
\end{equation*}
$$

Substituting this expression for $y$ in the equation $x^{3}+y^{3}=3 x y$ for the curve yields

$$
\begin{aligned}
& x^{3}+\left(x^{2}\right)^{3}=3 x^{3} \\
& x^{6}-2 x^{3}=0 \\
& x^{3}\left(x^{3}-2\right)=0
\end{aligned}
$$

whose solutions are $x=0$ and $x=2^{1 / 3}$. From (12), the solutions $x=0$ and $x=2^{1 / 3}$ yield the points $(0,0)$ and $\left(2^{1 / 3}, 2^{2 / 3}\right)$, respectively. Of these two, only $\left(2^{1 / 3}, 2^{2 / 3}\right)$ is in the first quadrant. Substituting $x=2^{1 / 3}, y=2^{2 / 3}$ into (11) yields

$$
\left.\frac{d y}{d x}\right|_{\substack{x=2^{1 / 3} \\ y=2^{2 / 3}}}=\frac{0}{2^{4 / 3}-2^{2 / 3}}=0
$$

We conclude that $\left(2^{1 / 3}, 2^{2 / 3}\right) \approx(1.26,1.59)$ is the only point on the Folium of Descartes in the first quadrant at which the tangent line is horizontal (Figure 3.1.6).

## - DIFFERENTIABILITY OF FUNCTIONS DEFINED IMPLICITLY

When differentiating implicitly, it is assumed that $y$ represents a differentiable function of $x$. If this is not so, then the resulting calculations may be nonsense. For example, if we differentiate the equation

$$
\begin{equation*}
x^{2}+y^{2}+1=0 \tag{13}
\end{equation*}
$$

we obtain

$$
2 x+2 y \frac{d y}{d x}=0 \quad \text { or } \quad \frac{d y}{d x}=-\frac{x}{y}
$$

However, this derivative is meaningless because there are no real values of $x$ and $y$ that satisfy (13) (why?); and hence (13) does not define any real functions implicitly.

The nonsensical conclusion of these computations conveys the importance of knowing whether an equation in $x$ and $y$ that is to be differentiated implicitly actually defines some differentiable function of $x$ implicitly. Unfortunately, this can be a difficult problem, so we will leave the discussion of such matters for more advanced courses in analysis.

## QUICK CHECK EXERCISES 3.1 (See page 192 for answers.)

1. The equation $x y+2 y=1$ defines implicitly the function $y=$ $\_\_\_\_$ .
2. Use implicit differentiation to find $d y / d x$ for $x^{2}-y^{3}=x y$.
3. The slope of the tangent line to the graph of $x+y+x y=3$ at $(1,1)$ is $\_\_\_\_$ .
4. Use implicit differentiation to find $d^{2} y / d x^{2}$ for $\sin y=x$.

## EXERCISE SET 3.1 C CAS

## 1-2

(a) Find $d y / d x$ by differentiating implicitly.
(b) Solve the equation for $y$ as a function of $x$, and find $d y / d x$ from that equation.
(c) Confirm that the two results are consistent by expressing the derivative in part (a) as a function of $x$ alone.

1. $x+x y-2 x^{3}=2$
2. $\sqrt{y}-\sin x=2$

3-12 Find $d y / d x$ by implicit differentiation.
3. $x^{2}+y^{2}=100$
4. $x^{3}+y^{3}=3 x y^{2}$
5. $x^{2} y+3 x y^{3}-x=3$
6. $x^{3} y^{2}-5 x^{2} y+x=1$
7. $\frac{1}{\sqrt{x}}+\frac{1}{\sqrt{y}}=1$
8. $x^{2}=\frac{x+y}{x-y}$
9. $\sin \left(x^{2} y^{2}\right)=x$
10. $\cos \left(x y^{2}\right)=y$
11. $\tan ^{3}\left(x y^{2}+y\right)=x$
12. $\frac{x y^{3}}{1+\sec y}=1+y^{4}$

13-18 Find $d^{2} y / d x^{2}$ by implicit differentiation.
13. $2 x^{2}-3 y^{2}=4$
14. $x^{3}+y^{3}=1$
15. $x^{3} y^{3}-4=0$
16. $x y+y^{2}=2$
17. $y+\sin y=x$
18. $x \cos y=y$

19-20 Find the slope of the tangent line to the curve at the given points in two ways: first by solving for $y$ in terms of $x$ and differentiating and then by implicit differentiation.
19. $x^{2}+y^{2}=1 ;(1 / 2, \sqrt{3} / 2),(1 / 2,-\sqrt{3} / 2)$
20. $y^{2}-x+1=0 ;(10,3),(10,-3)$

21-24 True-False Determine whether the statement is true or false. Explain your answer.
21. If an equation in $x$ and $y$ defines a function $y=f(x)$ implicitly, then the graph of the equation and the graph of $f$ are identical.
22. The function

$$
f(x)=\left\{\begin{array}{rr}
\sqrt{1-x^{2}}, & 0<x \leq 1 \\
-\sqrt{1-x^{2}}, & -1 \leq x \leq 0
\end{array}\right.
$$

is defined implicitly by the equation $x^{2}+y^{2}=1$.
23. The function $|x|$ is not defined implicitly by the equation $(x+y)(x-y)=0$.
24. If $y$ is defined implicitly as a function of $x$ by the equation $x^{2}+y^{2}=1$, then $d y / d x=-x / y$.

25-28 Use implicit differentiation to find the slope of the tangent line to the curve at the specified point, and check that your answer is consistent with the accompanying graph on the next page.
25. $x^{4}+y^{4}=16 ;(1, \sqrt[4]{15})$ [Lamé's special quartic]
26. $y^{3}+y x^{2}+x^{2}-3 y^{2}=0 ;(0,3) \quad[$ trisectrix $]$
27. $2\left(x^{2}+y^{2}\right)^{2}=25\left(x^{2}-y^{2}\right) ;(3,1)$ [lemniscate]
28. $x^{2 / 3}+y^{2 / 3}=4 ;(-1,3 \sqrt{3})$ [four-cusped hypocycloid]

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-125.jpg?height=319&width=321&top_left_y=200&top_left_x=268)
A Figure Ex-25

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-125.jpg?height=271&width=400&top_left_y=244&top_left_x=652)
- Figure Ex-26

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-125.jpg?height=332&width=401&top_left_y=584&top_left_x=268)
- Figure Ex-27

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-125.jpg?height=326&width=332&top_left_y=586&top_left_x=720)
- Figure Ex-28

## FOCUS ON CONCEPTS

29. In the accompanying figure, it appears that the ellipse $x^{2}+x y+y^{2}=3$ has horizontal tangent lines at the points of intersection of the ellipse and the line $y=-2 x$. Use implicit differentiation to explain why this is the case.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-125.jpg?height=450&width=445&top_left_y=1277&top_left_x=294)
Figure Ex-29

30. (a) A student claims that the ellipse $x^{2}-x y+y^{2}=1$ has a horizontal tangent line at the point $(1,1)$. Without doing any computations, explain why the student's claim must be incorrect.
(b) Find all points on the ellipse $x^{2}-x y+y^{2}=1$ at which the tangent line is horizontal.

C 31. (a) Use the implicit plotting capability of a CAS to graph the equation $y^{4}+y^{2}=x(x-1)$.
(b) Use implicit differentiation to help explain why the graph in part (a) has no horizontal tangent lines.
(c) Solve the equation $y^{4}+y^{2}=x(x-1)$ for $x$ in terms of $y$ and explain why the graph in part (a) consists of two parabolas.
32. Use implicit differentiation to find all points on the graph of $y^{4}+y^{2}=x(x-1)$ at which the tangent line is vertical.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-125.jpg?height=356&width=359&top_left_y=1533&top_left_x=1185)
- Figure Ex-37

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-125.jpg?height=358&width=360&top_left_y=1529&top_left_x=1601)
- Figure Ex-38

33-34 These exercises deal with the rotated ellipse $C$ whose equation is $x^{2}-x y+y^{2}=4$.
33. Show that the line $y=x$ intersects $C$ at two points $P$ and $Q$ and that the tangent lines to $C$ at $P$ and $Q$ are parallel.
34. Prove that if $P(a, b)$ is a point on $C$, then so is $Q(-a,-b)$ and that the tangent lines to $C$ through $P$ and through $Q$ are parallel.
35. Find the values of $a$ and $b$ for the curve $x^{2} y+a y^{2}=b$ if the point ( 1,1 ) is on its graph and the tangent line at ( 1,1 ) has the equation $4 x+3 y=7$.
36. At what point(s) is the tangent line to the curve $y^{3}=2 x^{2}$ perpendicular to the line $x+2 y-2=0$ ?

37-38 Two curves are said to be orthogonal if their tangent lines are perpendicular at each point of intersection, and two families of curves are said to be orthogonal trajectories of one another if each member of one family is orthogonal to each member of the other family. This terminology is used in these exercises.
37. The accompanying figure shows some typical members of the families of circles $x^{2}+(y-c)^{2}=c^{2}$ (black curves) and $(x-k)^{2}+y^{2}=k^{2}$ (gray curves). Show that these families are orthogonal trajectories of one another. [Hint: For the tangent lines to be perpendicular at a point of intersection, the slopes of those tangent lines must be negative reciprocals of one another.]
38. The accompanying figure shows some typical members of the families of hyperbolas $x y=c$ (black curves) and $x^{2}-y^{2}=k$ (gray curves), where $c \neq 0$ and $k \neq 0$. Use the hint in Exercise 37 to show that these families are orthogonal trajectories of one another.
c 39. (a) Use the implicit plotting capability of a CAS to graph the curve $C$ whose equation is $x^{3}-2 x y+y^{3}=0$.
(b) Use the graph in part (a) to estimate the $x$-coordinates of a point in the first quadrant that is on $C$ and at which the tangent line to $C$ is parallel to the $x$-axis.
(c) Find the exact value of the $x$-coordinate in part (b).
c 40. (a) Use the implicit plotting capability of a CAS to graph the curve $C$ whose equation is $x^{3}-2 x y+y^{3}=0$.
(b) Use the graph to guess the coordinates of a point in the first quadrant that is on $C$ and at which the tangent line to $C$ is parallel to the line $y=-x$.
(cont.)
(c) Use implicit differentiation to verify your conjecture in part (b).
41. Prove that for every nonzero rational number $r$, the tangent line to the graph of $x^{r}+y^{r}=2$ at the point $(1,1)$ has slope -1 .
42. Find equations for two lines through the origin that are tangent to the ellipse $2 x^{2}-4 x+y^{2}+1=0$.
43. Writing Write a paragraph that compares the concept of an explicit definition of a function with that of an implicit definition of a function.
44. Writing A student asks: "Suppose implicit differentiation yields an undefined expression at a point. Does this mean that $d y / d x$ is undefined at that point?" Using the equation $x^{2}-2 x y+y^{2}=0$ as a basis for your discussion, write a paragraph that answers the student's question.

## QUICK CHECK ANSWERS 3.1

1. $\frac{1}{x+2}$
2. $\frac{d y}{d x}=\frac{2 x-y}{x+3 y^{2}}$
3. -1
4. $\frac{d^{2} y}{d x^{2}}=\sec ^{2} y \tan y$

### 3.2 DERIVATIVES OF LOGARITHMIC FUNCTIONS

In this section we will obtain derivative formulas for logarithmic functions, and we will explain why the natural logarithm function is preferred over logarithms with other bases in calculus.

## DERIVATIVES OF LOGARITHMIC FUNCTIONS

We will establish that $f(x)=\ln x$ is differentiable for $x>0$ by applying the derivative definition to $f(x)$. To evaluate the resulting limit, we will need the fact that $\ln x$ is continuous for $x>0$ (Theorem 1.6.3), and we will need the limit

$$
\begin{equation*}
\lim _{v \rightarrow 0}(1+v)^{1 / v}=e \tag{1}
\end{equation*}
$$

This limit can be obtained from limits (7) and (8) of Section 1.3 by making the substitution $v=1 / x$ and using the fact that $v \rightarrow 0^{+}$as $x \rightarrow+\infty$ and $v \rightarrow 0^{-}$as $x \rightarrow-\infty$. This produces two equal one-sided limits that together imply (1) (see Exercise 64 of Section 1.3).

$$
\begin{array}{rlr}
\frac{d}{d x}[\ln x] & =\lim _{h \rightarrow 0} \frac{\ln (x+h)-\ln x}{h} & \\
& =\lim _{h \rightarrow 0} \frac{1}{h} \ln \left(\frac{x+h}{x}\right) & \begin{array}{l}
\text { The quotient property of } \\
\text { logarithms in Theorem 0.5.2 }
\end{array} \\
& =\lim _{h \rightarrow 0} \frac{1}{h} \ln \left(1+\frac{h}{x}\right) \\
& =\lim _{v \rightarrow 0} \frac{1}{v x} \ln (1+v) & \\
& =\frac{1}{x} \lim _{v \rightarrow 0} \frac{1}{v} \ln (1+v) & \begin{array}{l}
\text { Let } v=h / x \text { and note that } \\
v \rightarrow 0 \text { if and only if } h \rightarrow 0 .
\end{array} \\
& =\frac{1}{x} \lim _{v \rightarrow 0} \ln (1+v)^{1 / v} & \begin{array}{l}
x \text { is fixed in this limit computation, so } 1 / x \\
\text { can be moved through the limit sign. }
\end{array} \\
& =\frac{1}{x} \ln \left[\lim _{v \rightarrow 0}(1+v)^{1 / v}\right] & \begin{array}{l}
\text { The power property of } \\
\text { logarithms in Theorem 0.5.2 }
\end{array} \\
& =\frac{1}{x} \ln e & \begin{array}{l}
\ln x \text { is continuous on }(0,+\infty) \text { so we can } \\
\text { move the limit through the function symbol. }
\end{array} \\
& =\frac{1}{x} & \\
\text { Since ln } e=1
\end{array}
$$

Note that, among all possible bases, the base $b=e$ produces the simplest formula for the derivative of $\log _{b} x$. This is one of the reasons why the natural logarithm function is preferred over other logarithms in calculus.

Thus,

$$
\begin{equation*}
\frac{d}{d x}[\ln x]=\frac{1}{x}, \quad x>0 \tag{2}
\end{equation*}
$$

A derivative formula for the general logarithmic function $\log _{b} x$ can be obtained from (2) by using Formula (6) of Section 0.5 to write

$$
\frac{d}{d x}\left[\log _{b} x\right]=\frac{d}{d x}\left[\frac{\ln x}{\ln b}\right]=\frac{1}{\ln b} \frac{d}{d x}[\ln x]
$$

It follows from this that

$$
\begin{equation*}
\frac{d}{d x}\left[\log _{b} x\right]=\frac{1}{x \ln b}, \quad x>0 \tag{3}
\end{equation*}
$$

## Example 1

(a) Figure 3.2.1 shows the graph of $y=\ln x$ and its tangent lines at the points $x=\frac{1}{2}, 1,3$, and 5 . Find the slopes of those tangent lines.
(b) Does the graph of $y=\ln x$ have any horizontal tangent lines? Use the derivative of $\ln x$ to justify your answer.

Solution (a). From (2), the slopes of the tangent lines at the points $x=\frac{1}{2}, 1,3$, and 5 are $1 / x=2,1, \frac{1}{3}$, and $\frac{1}{5}$, respectively, which is consistent with Figure 3.2.1.

Solution (b). It does not appear from the graph of $y=\ln x$ that there are any horizontal tangent lines. This is confirmed by the fact that $d y / d x=1 / x$ is not equal to zero for any real value of $x$.

If $u$ is a differentiable function of $x$, and if $u(x)>0$, then applying the chain rule to (2) and (3) produces the following generalized derivative formulas:

$$
\begin{equation*}
\frac{d}{d x}[\ln u]=\frac{1}{u} \cdot \frac{d u}{d x} \quad \text { and } \quad \frac{d}{d x}\left[\log _{b} u\right]=\frac{1}{u \ln b} \cdot \frac{d u}{d x} \tag{4-5}
\end{equation*}
$$

- Example 2 Find $\frac{d}{d x}\left[\ln \left(x^{2}+1\right)\right]$.

Solution. Using (4) with $u=x^{2}+1$ we obtain

$$
\frac{d}{d x}\left[\ln \left(x^{2}+1\right)\right]=\frac{1}{x^{2}+1} \cdot \frac{d}{d x}\left[x^{2}+1\right]=\frac{1}{x^{2}+1} \cdot 2 x=\frac{2 x}{x^{2}+1}
$$

When possible, the properties of logarithms in Theorem 0.5.2 should be used to convert products, quotients, and exponents into sums, differences, and constant multiples before differentiating a function involving logarithms.

## - Example 3

$$
\begin{aligned}
\frac{d}{d x}\left[\ln \left(\frac{x^{2} \sin x}{\sqrt{1+x}}\right)\right] & =\frac{d}{d x}\left[2 \ln x+\ln (\sin x)-\frac{1}{2} \ln (1+x)\right] \\
& =\frac{2}{x}+\frac{\cos x}{\sin x}-\frac{1}{2(1+x)} \\
& =\frac{2}{x}+\cot x-\frac{1}{2+2 x}
\end{aligned}
$$

Figure 3.2.2 shows the graph of $f(x)=\ln |x|$. This function is important because it "extends" the domain of the natural logarithm function in the sense that the values of $\ln |x|$ and $\ln x$ are the same for $x>0$, but $\ln |x|$ is defined for all nonzero values of $x$, and $\ln x$ is only defined for positive values of $x$.

Figure 3.2.2
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-128.jpg?height=335&width=819&top_left_y=424&top_left_x=873)

The derivative of $\ln |x|$ for $x \neq 0$ can be obtained by considering the cases $x>0$ and $x<0$ separately:

Case $\boldsymbol{x}>\mathbf{0}$. In this case $|x|=x$, so

$$
\frac{d}{d x}[\ln |x|]=\frac{d}{d x}[\ln x]=\frac{1}{x}
$$

Case $\boldsymbol{x}<\mathbf{0}$. In this case $|x|=-x$, so it follows from (4) that

$$
\frac{d}{d x}[\ln |x|]=\frac{d}{d x}[\ln (-x)]=\frac{1}{(-x)} \cdot \frac{d}{d x}[-x]=\frac{1}{x}
$$

Since the same formula results in both cases, we have shown that

$$
\begin{equation*}
\frac{d}{d x}[\ln |x|]=\frac{1}{x} \quad \text { if } x \neq 0 \tag{6}
\end{equation*}
$$

Example 4 From (6) and the chain rule,

$$
\frac{d}{d x}[\ln |\sin x|]=\frac{1}{\sin x} \cdot \frac{d}{d x}[\sin x]=\frac{\cos x}{\sin x}=\cot x
$$

## LOGARITHMIC DIFFERENTIATION

We now consider a technique called logarithmic differentiation that is useful for differentiating functions that are composed of products, quotients, and powers.

Example 5 The derivative of

$$
\begin{equation*}
y=\frac{x^{2} \sqrt[3]{7 x-14}}{\left(1+x^{2}\right)^{4}} \tag{7}
\end{equation*}
$$

is messy to calculate directly. However, if we first take the natural logarithm of both sides and then use its properties, we can write

$$
\ln y=2 \ln x+\frac{1}{3} \ln (7 x-14)-4 \ln \left(1+x^{2}\right)
$$

Differentiating both sides with respect to $x$ yields

$$
\frac{1}{y} \frac{d y}{d x}=\frac{2}{x}+\frac{7 / 3}{7 x-14}-\frac{8 x}{1+x^{2}}
$$

In the next section we will discuss differentiating functions that have exponents which are not constant.

Thus, on solving for $d y / d x$ and using (7) we obtain

$$
\frac{d y}{d x}=\frac{x^{2} \sqrt[3]{7 x-14}}{\left(1+x^{2}\right)^{4}}\left[\frac{2}{x}+\frac{1}{3 x-6}-\frac{8 x}{1+x^{2}}\right]
$$

## REMARK

Since $\ln y$ is only defined for $y>0$, the computations in Example 5 are only valid for $x>2$ (verify). However, because the derivative of $\ln y$ is the same as the derivative of $\ln |y|$, and because $\ln |y|$ is defined for $y<0$ as well as $y>0$, it follows that the formula obtained for $d y / d x$ is valid for $x<2$ as well as $x>2$. In general, whenever a derivative $d y / d x$ is obtained by logarithmic differentiation, the resulting derivative formula will be valid for all values of $x$ for which $y \neq 0$. It may be valid at those points as well, but it is not guaranteed.

## DERIVATIVES OF REAL POWERS OF $\boldsymbol{x}$

We know from Theorem 2.3.2 and Exercise 82 in Section 2.3 that the differentiation formula

$$
\begin{equation*}
\frac{d}{d x}\left[x^{r}\right]=r x^{r-1} \tag{8}
\end{equation*}
$$

holds for constant integer values of $r$. We will now use logarithmic differentiation to show that this formula holds if $r$ is any real number (rational or irrational). In our computations we will assume that $x^{r}$ is a differentiable function and that the familiar laws of exponents hold for real exponents.

Let $y=x^{r}$, where $r$ is a real number. The derivative $d y / d x$ can be obtained by logarithmic differentiation as follows:

$$
\begin{aligned}
& \ln |y|=\ln \left|x^{r}\right|=r \ln |x| \\
& \frac{d}{d x}[\ln |y|]=\frac{d}{d x}[r \ln |x|] \\
& \frac{1}{y} \frac{d y}{d x}=\frac{r}{x} \\
& \frac{d y}{d x}=\frac{r}{x} y=\frac{r}{x} x^{r}=r x^{r-1}
\end{aligned}
$$

## QUICK CHECK EXERCISES 3.2 (See page 196 for answers.)

1. The equation of the tangent line to the graph of $y=\ln x$ at $x=e^{2}$ is $\_\_\_\_$ .
2. Find $d y / d x$.
(a) $y=\ln 3 x$
(b) $y=\ln \sqrt{x}$
(c) $y=\log (1 /|x|)$
3. $\lim _{h \rightarrow 0} \frac{\ln (1+h)}{h}=$ $\_\_\_\_$
4. Use logarithmic differentiation to find the derivative of

$$
f(x)=\frac{\sqrt{x+1}}{\sqrt[3]{x-1}}
$$

$\_\_\_\_$

## EXERCISE SET 3.2

1-26 Find $d y / d x$.

1. $y=\ln 5 x$
2. $y=\ln \frac{x}{3}$
3. $y=\ln |1+x|$
4. $y=\ln (2+\sqrt{x})$
5. $y=\ln \left|x^{2}-1\right|$
6. $y=\ln \left|x^{3}-7 x^{2}-3\right|$
7. $y=\ln \left(\frac{x}{1+x^{2}}\right)$
8. $y=\ln \left|\frac{1+x}{1-x}\right|$
9. $y=\ln x^{2}$
10. $y=(\ln x)^{3}$
11. $y=\sqrt{\ln x}$
12. $y=\ln \sqrt{x}$
13. $y=x \ln x$
14. $y=x^{3} \ln x$
15. $y=x^{2} \log _{2}(3-2 x)$
16. $y=x\left[\log _{2}\left(x^{2}-2 x\right)\right]^{3}$
17. $y=\frac{x^{2}}{1+\log x}$
18. $y=\frac{\log x}{1+\log x}$
19. $y=\ln (\ln x)$
20. $y=\ln (\ln (\ln x))$
21. $y=\ln (\tan x)$
22. $y=\ln (\cos x)$
23. $y=\cos (\ln x)$
24. $y=\sin ^{2}(\ln x)$
25. $y=\log \left(\sin ^{2} x\right)$
26. $y=\log \left(1-\sin ^{2} x\right)$

27-30 Use the method of Example 3 to help perform the indicated differentiation.
27. $\frac{d}{d x}\left[\ln \left((x-1)^{3}\left(x^{2}+1\right)^{4}\right)\right]$
28. $\frac{d}{d x}\left[\ln \left(\left(\cos ^{2} x\right) \sqrt{1+x^{4}}\right)\right]$
29. $\frac{d}{d x}\left[\ln \frac{\cos x}{\sqrt{4-3 x^{2}}}\right]$
30. $\frac{d}{d x}\left[\ln \sqrt{\frac{x-1}{x+1}}\right]$

31-34 True-False Determine whether the statement is true or false. Explain your answer.
31. The slope of the tangent line to the graph of $y=\ln x$ at $x=a$ approaches infinity as $a \rightarrow 0^{+}$.
32. If $\lim _{x \rightarrow+\infty} f^{\prime}(x)=0$, then the graph of $y=f(x)$ has a horizontal asymptote.
33. The derivative of $\ln |x|$ is an odd function.
34. We have

$$
\frac{d}{d x}\left((\ln x)^{2}\right)=\frac{d}{d x}(2(\ln x))=\frac{2}{x}
$$

35-38 Find $d y / d x$ using logarithmic differentiation.
35. $y=x \sqrt[3]{1+x^{2}}$
36. $y=\sqrt[5]{\frac{x-1}{x+1}}$
37. $y=\frac{\left(x^{2}-8\right)^{1 / 3} \sqrt{x^{3}+1}}{x^{6}-7 x+5}$
38. $y=\frac{\sin x \cos x \tan ^{3} x}{\sqrt{x}}$
39. Find
(a) $\frac{d}{d x}\left[\log _{x} e\right]$
(b) $\frac{d}{d x}\left[\log _{x} 2\right]$.
40. Find
(a) $\frac{d}{d x}\left[\log _{(1 / x)} e\right]$
(b) $\frac{d}{d x}\left[\log _{(\ln x)} e\right]$.

41-44 Find the equation of the tangent line to the graph of $y=f(x)$ at $x=x_{0}$.
41. $f(x)=\ln x ; x_{0}=e^{-1}$
42. $f(x)=\log x ; x_{0}=10$
43. $f(x)=\ln (-x) ; x_{0}=-e$
44. $f(x)=\ln |x| ; x_{0}=-2$

## FOCUS ON CONCEPTS

45. (a) Find the equation of a line through the origin that is tangent to the graph of $y=\ln x$.
(b) Explain why the $y$-intercept of a tangent line to the curve $y=\ln x$ must be 1 unit less than the $y$-coordinate of the point of tangency.
46. Use logarithmic differentiation to verify the product and quotient rules. Explain what properties of $\ln x$ are important for this verification.
47. Find a formula for the area $A(w)$ of the triangle bounded by the tangent line to the graph of $y=\ln x$ at $P(w, \ln w)$, the horizontal line through $P$, and the $y$-axis.
48. Find a formula for the area $A(w)$ of the triangle bounded by the tangent line to the graph of $y=\ln x^{2}$ at $P\left(w, \ln w^{2}\right)$, the horizontal line through $P$, and the $y$-axis.
49. Verify that $y=\ln (x+e)$ satisfies $d y / d x=e^{-y}$, with $y=1$ when $x=0$.
50. Verify that $y=-\ln \left(e^{2}-x\right)$ satisfies $d y / d x=e^{y}$, with $y=-2$ when $x=0$.
51. Find a function $f$ such that $y=f(x)$ satisfies $d y / d x=e^{-y}$, with $y=0$ when $x=0$.
52. Find a function $f$ such that $y=f(x)$ satisfies $d y / d x=e^{y}$, with $y=-\ln 2$ when $x=0$.

53-55 Find the limit by interpreting the expression as an appropriate derivative.
53. (a) $\lim _{x \rightarrow 0} \frac{\ln (1+3 x)}{x} \quad$ (b) $\lim _{x \rightarrow 0} \frac{\ln (1-5 x)}{x}$
54. (a) $\lim _{\Delta x \rightarrow 0} \frac{\ln \left(e^{2}+\Delta x\right)-2}{\Delta x}$ (b) $\lim _{w \rightarrow 1} \frac{\ln w}{w-1}$
55. (a) $\lim _{x \rightarrow 0} \frac{\ln (\cos x)}{x} \quad$ (b) $\lim _{h \rightarrow 0} \frac{(1+h)^{\sqrt{2}}-1}{h}$
56. Modify the derivation of Equation (2) to give another proof of Equation (3).
57. Writing Review the derivation of the formula

$$
\frac{d}{d x}[\ln x]=\frac{1}{x}
$$

and then write a paragraph that discusses all the ingredients (theorems, limit properties, etc.) that are needed for this derivation.
58. Writing Write a paragraph that explains how logarithmic differentiation can replace a difficult differentiation computation with a simpler computation.

## QUICK CHECK ANSWERS 3.2

1. $y=\frac{x}{e^{2}}+1$
2. (a) $\frac{d y}{d x}=\frac{1}{x}$
(b) $\frac{d y}{d x}=\frac{1}{2 x}$
(c) $\frac{d y}{d x}=-\frac{1}{x \ln 10}$
3. $\frac{\sqrt{x+1}}{\sqrt[3]{x-1}}\left[\frac{1}{2(x+1)}-\frac{1}{3(x-1)}\right]$
4. 1

### 3.3 DERIVATIVES OF EXPONENTIAL AND INVERSE TRIGONOMETRIC FUNCTIONS

See Section 0.4 for a review of one-toone functions and inverse functions.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-131.jpg?height=459&width=469&top_left_y=981&top_left_x=212)
- Figure 3.3.1

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-131.jpg?height=359&width=461&top_left_y=1894&top_left_x=212)
Figure 3.3.2 The graph of an increasing function (blue) or a decreasing function (purple) is cut at most once by any horizontal line.

In this section we will show how the derivative of a one-to-one function can be used to obtain the derivative of its inverse function. This will provide the tools we need to obtain derivative formulas for exponential functions from the derivative formulas for logarithmic functions and to obtain derivative formulas for inverse trigonometric functions from the derivative formulas for trigonometric functions.

Our first goal in this section is to obtain a formula relating the derivative of the inverse function $f^{-1}$ to the derivative of the function $f$.

Example 1 Suppose that $f$ is a one-to-one differentiable function such that $f(2)=1$ and $f^{\prime}(2)=\frac{3}{4}$. Then the tangent line to $y=f(x)$ at the point $(2,1)$ has equation

$$
y-1=\frac{3}{4}(x-2)
$$

The tangent line to $y=f^{-1}(x)$ at the point $(1,2)$ is the reflection about the line $y=x$ of the tangent line to $y=f(x)$ at the point $(2,1)$ (Figure 3.3.1), and its equation can be obtained by interchanging $x$ and $y$ :

$$
x-1=\frac{3}{4}(y-2) \quad \text { or } \quad y-2=\frac{4}{3}(x-1)
$$

Notice that the slope of the tangent line to $y=f^{-1}(x)$ at $x=1$ is the reciprocal of the slope of the tangent line to $y=f(x)$ at $x=2$. That is,

$$
\begin{equation*}
\left(f^{-1}\right)^{\prime}(1)=\frac{1}{f^{\prime}(2)}=\frac{4}{3} \tag{1}
\end{equation*}
$$

Since $2=f^{-1}(1)$ for the function $f$ in Example 1, it follows that $f^{\prime}(2)=f^{\prime}\left(f^{-1}(1)\right)$. Thus, Formula (1) can also be expressed as

$$
\left(f^{-1}\right)^{\prime}(1)=\frac{1}{f^{\prime}\left(f^{-1}(1)\right)}
$$

In general, if $f$ is a differentiable and one-to-one function, then

$$
\begin{equation*}
\left(f^{-1}\right)^{\prime}(x)=\frac{1}{f^{\prime}\left(f^{-1}(x)\right)} \tag{2}
\end{equation*}
$$

provided $f^{\prime}\left(f^{-1}(x)\right) \neq 0$.
Formula (2) can be confirmed using implicit differentiation. The equation $y=f^{-1}(x)$ is equivalent to $x=f(y)$. Differentiating with respect to $x$ we obtain

$$
1=\frac{d}{d x}[x]=\frac{d}{d x}[f(y)]=f^{\prime}(y) \cdot \frac{d y}{d x}
$$

so that

$$
\frac{d y}{d x}=\frac{1}{f^{\prime}(y)}=\frac{1}{f^{\prime}\left(f^{-1}(x)\right)}
$$

Also from $x=f(y)$ we have $d x / d y=f^{\prime}(y)$, which gives the following alternative version of Formula (2):

$$
\begin{equation*}
\frac{d y}{d x}=\frac{1}{d x / d y} \tag{3}
\end{equation*}
$$

## INCREASING OR DECREASING FUNCTIONS ARE ONE-TO-ONE

If the graph of a function $f$ is always increasing or always decreasing over the domain of $f$, then a horizontal line will cut the graph of $f$ in at most one point (Figure 3.3.2), so $f$

In general, once it is established that $f^{-1}$ is differentiable, one has the option of calculating the derivative of $f^{-1}$ using Formula (2) or (3), or by differentiating implicitly, as in Example 2.
must have an inverse function (see Section 0.4). We will prove in the next chapter that $f$ is increasing on any interval on which $f^{\prime}(x)>0$ (since the graph has positive slope) and that $f$ is decreasing on any interval on which $f^{\prime}(x)<0$ (since the graph has negative slope). These intuitive observations, together with Formula (2), suggest the following theorem, which we state without formal proof.
3.3.1 THEOREM Suppose that the domain of a function $f$ is an open interval on which $f^{\prime}(x)>0$ or on which $f^{\prime}(x)<0$. Then $f$ is one-to-one, $f^{-1}(x)$ is differentiable at all values of $x$ in the range of $f$, and the derivative of $f^{-1}(x)$ is given by Formula (2).

Example 2 Consider the function $f(x)=x^{5}+x+1$.
(a) Show that $f$ is one-to-one on the interval $(-\infty,+\infty)$.
(b) Find a formula for the derivative of $f^{-1}$.
(c) Compute $\left(f^{-1}\right)^{\prime}(1)$.

Solution (a). Since

$$
f^{\prime}(x)=5 x^{4}+1>0
$$

for all real values of $x$, it follows from Theorem 3.3.1 that $f$ is one-to-one on the interval $(-\infty,+\infty)$.

Solution (b). Let $y=f^{-1}(x)$. Differentiating $x=f(y)=y^{5}+y+1$ implicitly with respect to $x$ yields

$$
\begin{align*}
& \frac{d}{d x}[x]=\frac{d}{d x}\left[y^{5}+y+1\right] \\
& 1=\left(5 y^{4}+1\right) \frac{d y}{d x} \\
& \frac{d y}{d x}=\frac{1}{5 y^{4}+1} \tag{4}
\end{align*}
$$

We cannot solve $x=y^{5}+y+1$ for $y$ in terms of $x$, so we leave the expression for $d y / d x$ in Equation (4) in terms of $y$.

Solution (c). From Equation (4),

$$
\left(f^{-1}\right)^{\prime}(1)=\left.\frac{d y}{d x}\right|_{x=1}=\left.\frac{1}{5 y^{4}+1}\right|_{x=1}
$$

Thus, we need to know the value of $y=f^{-1}(x)$ at $x=1$, which we can obtain by solving the equation $f(y)=1$ for $y$. This equation is $y^{5}+y+1=1$, which, by inspection, is satisfied by $y=0$. Thus,

$$
\left(f^{-1}\right)^{\prime}(1)=\left.\frac{1}{5 y^{4}+1}\right|_{y=0}=1
$$

## DERIVATIVES OF EXPONENTIAL FUNCTIONS

Our next objective is to show that the general exponential function $b^{x}(b>0, b \neq 1)$ is differentiable everywhere and to find its derivative. To do this, we will use the fact that

How does the derivation of Formula (5) change if $0<b<1$ ?

In Section 0.5 we stated that $b=e$ is the only base for which the slope of the tangent line to the curve $y=b^{x}$ at any point $P$ on the curve is the $y$-coordinate at $P$ (see page 54). Verify this statement.

It is important to distinguish between differentiating an exponential function $b^{x}$ (variable exponent and constant base) and a power function $x^{b}$ (variable base and constant exponent). For example, compare the derivative

$$
\frac{d}{d x}\left[x^{2}\right]=2 x
$$

to the derivative of $2^{x}$ in Example 3.
$b^{x}$ is the inverse of the function $f(x)=\log _{b} x$. We will assume that $b>1$. With this assumption we have $\ln b>0$, so

$$
f^{\prime}(x)=\frac{d}{d x}\left[\log _{b} x\right]=\frac{1}{x \ln b}>0 \quad \text { for all } x \text { in the interval }(0,+\infty)
$$

It now follows from Theorem 3.3.1 that $f^{-1}(x)=b^{x}$ is differentiable for all $x$ in the range of $f(x)=\log _{b} x$. But we know from Table 0.5.3 that the range of $\log _{b} x$ is $(-\infty,+\infty)$, so we have established that $b^{x}$ is differentiable everywhere.

To obtain a derivative formula for $b^{x}$ we rewrite $y=b^{x}$ as

$$
x=\log _{b} y
$$

and differentiate implicitly using Formula (5) of Section 3.2 to obtain

$$
1=\frac{1}{y \ln b} \cdot \frac{d y}{d x}
$$

Solving for $d y / d x$ and replacing $y$ by $b^{x}$ we have

$$
\frac{d y}{d x}=y \ln b=b^{x} \ln b
$$

Thus, we have shown that

$$
\begin{equation*}
\frac{d}{d x}\left[b^{x}\right]=b^{x} \ln b \tag{5}
\end{equation*}
$$

In the special case where $b=e$ we have $\ln e=1$, so that (5) becomes

$$
\begin{equation*}
\frac{d}{d x}\left[e^{x}\right]=e^{x} \tag{6}
\end{equation*}
$$

Moreover, if $u$ is a differentiable function of $x$, then it follows from (5) and (6) that

$$
\begin{equation*}
\frac{d}{d x}\left[b^{u}\right]=b^{u} \ln b \cdot \frac{d u}{d x} \quad \text { and } \quad \frac{d}{d x}\left[e^{u}\right]=e^{u} \cdot \frac{d u}{d x} \tag{7-8}
\end{equation*}
$$

Example 3 The following computations use Formulas (7) and (8).

$$
\begin{aligned}
& \frac{d}{d x}\left[2^{x}\right]=2^{x} \ln 2 \\
& \frac{d}{d x}\left[e^{-2 x}\right]=e^{-2 x} \cdot \frac{d}{d x}[-2 x]=-2 e^{-2 x} \\
& \frac{d}{d x}\left[e^{x^{3}}\right]=e^{x^{3}} \cdot \frac{d}{d x}\left[x^{3}\right]=3 x^{2} e^{x^{3}} \\
& \frac{d}{d x}\left[e^{\cos x}\right]=e^{\cos x} \cdot \frac{d}{d x}[\cos x]=-(\sin x) e^{\cos x}
\end{aligned}
$$

Functions of the form $f(x)=u^{v}$ in which $u$ and $v$ are nonconstant functions of $x$ are neither exponential functions nor power functions. Functions of this form can be differentiated using logarithmic differentiation.

- Example 4 Use logarithmic differentiation to find $\frac{d}{d x}\left[\left(x^{2}+1\right)^{\sin x}\right]$.

Solution. Setting $y=\left(x^{2}+1\right)^{\sin x}$ we have

$$
\ln y=\ln \left[\left(x^{2}+1\right)^{\sin x}\right]=(\sin x) \ln \left(x^{2}+1\right)
$$

Differentiating both sides with respect to $x$ yields

$$
\begin{aligned}
\frac{1}{y} \frac{d y}{d x} & =\frac{d}{d x}\left[(\sin x) \ln \left(x^{2}+1\right)\right] \\
& =(\sin x) \frac{1}{x^{2}+1}(2 x)+(\cos x) \ln \left(x^{2}+1\right)
\end{aligned}
$$

Thus,

$$
\begin{aligned}
\frac{d y}{d x} & =y\left[\frac{2 x \sin x}{x^{2}+1}+(\cos x) \ln \left(x^{2}+1\right)\right] \\
& =\left(x^{2}+1\right)^{\sin x}\left[\frac{2 x \sin x}{x^{2}+1}+(\cos x) \ln \left(x^{2}+1\right)\right]
\end{aligned}
$$

## DERIVATIVES OF THE INVERSE TRIGONOMETRIC FUNCTIONS

To obtain formulas for the derivatives of the inverse trigonometric functions, we will need to use some of the identities given in Formulas (11) to (17) of Section 0.4. Rather than memorize those identities, we recommend that you review the "triangle technique" that we used to obtain them.

To begin, consider the function $\sin ^{-1} x$. If we let $f(x)=\sin x(-\pi / 2 \leq x \leq \pi / 2)$, then it follows from Formula (2) that $f^{-1}(x)=\sin ^{-1} x$ will be differentiable at any point $x$ where $\cos \left(\sin ^{-1} x\right) \neq 0$. This is equivalent to the condition

$$
\sin ^{-1} x \neq-\frac{\pi}{2} \quad \text { and } \quad \sin ^{-1} x \neq \frac{\pi}{2}
$$

so it follows that $\sin ^{-1} x$ is differentiable on the interval $(-1,1)$.
A derivative formula for $\sin ^{-1} x$ on $(-1,1)$ can be obtained by using Formula (2) or (3) or by differentiating implicitly. We will use the latter method. Rewriting the equation

Observe that $\sin ^{-1} x$ is only differentiable on the interval $(-1,1)$, even though its domain is $[-1,1]$. This is because the graph of $y=\sin x$ has horizontal tangent lines at the points $(\pi / 2,1)$ and $(-\pi / 2,-1)$, so the graph of $y=\sin ^{-1} x$ has vertical tangent lines at $x= \pm 1$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-134.jpg?height=327&width=359&top_left_y=1752&top_left_x=212)
Δ Figure 3.3.3

$y=\sin ^{-1} x$ as $x=\sin y$ and differentiating implicitly with respect to $x$, we obtain

$$
\begin{aligned}
& \frac{d}{d x}[x]=\frac{d}{d x}[\sin y] \\
& 1=\cos y \cdot \frac{d y}{d x} \\
& \frac{d y}{d x}=\frac{1}{\cos y}=\frac{1}{\cos \left(\sin ^{-1} x\right)}
\end{aligned}
$$

At this point we have succeeded in obtaining the derivative; however, this derivative formula can be simplified using the identity indicated in Figure 3.3.3. This yields

$$
\frac{d y}{d x}=\frac{1}{\sqrt{1-x^{2}}}
$$

Thus, we have shown that

$$
\frac{d}{d x}\left[\sin ^{-1} x\right]=\frac{1}{\sqrt{1-x^{2}}} \quad(-1<x<1)
$$

More generally, if $u$ is a differentiable function of $x$, then the chain rule produces the following generalized version of this formula:

$$
\frac{d}{d x}\left[\sin ^{-1} u\right]=\frac{1}{\sqrt{1-u^{2}}} \frac{d u}{d x} \quad(-1<u<1)
$$

The method used to derive this formula can be used to obtain generalized derivative formulas for the remaining inverse trigonometric functions. The following is a complete list of these

The appearance of $|u|$ in (13) and (14) will be explained in Exercise 58.
formulas, each of which is valid on the natural domain of the function that multiplies $d u / d x$.

$$
\begin{align*}
\frac{d}{d x}\left[\sin ^{-1} u\right] & =\frac{1}{\sqrt{1-u^{2}}} \frac{d u}{d x} & \frac{d}{d x}\left[\cos ^{-1} u\right] & =-\frac{1}{\sqrt{1-u^{2}}} \frac{d u}{d x}  \tag{9-10}\\
\frac{d}{d x}\left[\tan ^{-1} u\right] & =\frac{1}{1+u^{2}} \frac{d u}{d x} & \frac{d}{d x}\left[\cot ^{-1} u\right] & =-\frac{1}{1+u^{2}} \frac{d u}{d x} \\
\frac{d}{d x}\left[\sec ^{-1} u\right] & =\frac{1}{|u| \sqrt{u^{2}-1}} \frac{d u}{d x} & \frac{d}{d x}\left[\csc ^{-1} u\right] & =-\frac{1}{|u| \sqrt{u^{2}-1}} \frac{d u}{d x} \tag{11-12}
\end{align*}
$$

## Example 5 Find $d y / d x$ if

(a) $y=\sin ^{-1}\left(x^{3}\right)$
(b) $y=\sec ^{-1}\left(e^{x}\right)$

Solution (a). From (9)

$$
\frac{d y}{d x}=\frac{1}{\sqrt{1-\left(x^{3}\right)^{2}}}\left(3 x^{2}\right)=\frac{3 x^{2}}{\sqrt{1-x^{6}}}
$$

Solution (b). From (13)

$$
\frac{d y}{d x}=\frac{1}{e^{x} \sqrt{\left(e^{x}\right)^{2}-1}}\left(e^{x}\right)=\frac{1}{\sqrt{e^{2 x}-1}}
$$

## QUICK CHECK EXERCISES 3.3 (See page 203 for answers.)

1. Suppose that a one-to-one function $f$ has tangent line $y=5 x+3$ at the point ( 1,8 ). Evaluate $\left(f^{-1}\right)^{\prime}(8)$.
2. In each case, from the given derivative, determine whether the function $f$ is invertible.
(a) $f^{\prime}(x)=x^{2}+1$
(b) $f^{\prime}(x)=x^{2}-1$
(c) $f^{\prime}(x)=\sin x$
(d) $f^{\prime}(x)=\frac{\pi}{2}+\tan ^{-1} x$
3. Evaluate the derivative.
(a) $\frac{d}{d x}\left[e^{x}\right]$
(b) $\frac{d}{d x}\left[7^{x}\right]$
(c) $\frac{d}{d x}\left[\cos \left(e^{x}+1\right)\right]$
(d) $\frac{d}{d x}\left[e^{3 x-2}\right]$
4. Let $f(x)=e^{x^{3}+x}$. Use $f^{\prime}(x)$ to verify that $f$ is one-to-one.

## FOCUS ON CONCEPTS

1. Let $f(x)=x^{5}+x^{3}+x$.
(a) Show that $f$ is one-to-one and confirm that $f(1)=3$.
(b) Find $\left(f^{-1}\right)^{\prime}(3)$.
2. Let $f(x)=x^{3}+2 e^{x}$.
(a) Show that $f$ is one-to-one and confirm that $f(0)=2$.
(b) Find $\left(f^{-1}\right)^{\prime}(2)$.

3-4 Find $\left(f^{-1}\right)^{\prime}(x)$ using Formula (2), and check your answer by differentiating $f^{-1}$ directly.
3. $f(x)=2 /(x+3)$
4. $f(x)=\ln (2 x+1)$

5-6 Determine whether the function $f$ is one-to-one by examining the sign of $f^{\prime}(x)$.
5. (a) $f(x)=x^{2}+8 x+1$
(b) $f(x)=2 x^{5}+x^{3}+3 x+2$
(c) $f(x)=2 x+\sin x$
(d) $f(x)=\left(\frac{1}{2}\right)^{x}$
6. (a) $f(x)=x^{3}+3 x^{2}-8$
(b) $f(x)=x^{5}+8 x^{3}+2 x-1$
(c) $f(x)=\frac{x}{x+1}$
(d) $f(x)=\log _{b} x, \quad 0<b<1$

7-10 Find the derivative of $f^{-1}$ by using Formula (3), and check your result by differentiating implicitly.
7. $f(x)=5 x^{3}+x-7$
8. $f(x)=1 / x^{2}, \quad x>0$
9. $f(x)=2 x^{5}+x^{3}+1$
10. $f(x)=5 x-\sin 2 x, \quad-\frac{\pi}{4}<x<\frac{\pi}{4}$

## FOCUS ON CONCEPTS

11. Figure 0.4 .8 is a "proof by picture" that the reflection of a point $P(a, b)$ about the line $y=x$ is the point $Q(b, a)$. Establish this result rigorously by completing each part.
(a) Prove that if $P$ is not on the line $y=x$, then $P$ and $Q$ are distinct, and the line $\overleftrightarrow{P Q}$ is perpendicular to the line $y=x$.
(b) Prove that if $P$ is not on the line $y=x$, the midpoint of segment $P Q$ is on the line $y=x$.
(c) Carefully explain what it means geometrically to reflect $P$ about the line $y=x$.
(d) Use the results of parts (a)-(c) to prove that $Q$ is the reflection of $P$ about the line $y=x$.
12. Prove that the reflection about the line $y=x$ of a line with slope $m, m \neq 0$, is a line with slope $1 / m$. [Hint: Apply the result of the previous exercise to a pair of points on the line of slope $m$ and to a corresponding pair of points on the reflection of this line about the line $y=x$.]
13. Suppose that $f$ and $g$ are increasing functions. Determine which of the functions $f(x)+g(x), f(x) g(x)$, and $f(g(x))$ must also be increasing.
14. Suppose that $f$ and $g$ are one-to-one functions. Determine which of the functions $f(x)+g(x), f(x) g(x)$, and $f(g(x))$ must also be one-to-one.

15-26 Find $d y / d x$.
15. $y=e^{7 x}$
16. $y=e^{-5 x^{2}}$
17. $y=x^{3} e^{x}$
18. $y=e^{1 / x}$
19. $y=\frac{e^{x}-e^{-x}}{e^{x}+e^{-x}}$
20. $y=\sin \left(e^{x}\right)$
21. $y=e^{x \tan x}$
22. $y=\frac{e^{x}}{\ln x}$
23. $y=e^{\left(x-e^{3 x}\right)}$
24. $y=\exp \left(\sqrt{1+5 x^{3}}\right)$
25. $y=\ln \left(1-x e^{-x}\right)$
26. $y=\ln \left(\cos e^{x}\right)$

27-30 Find $f^{\prime}(x)$ by Formula (7) and then by logarithmic differentiation.
27. $f(x)=2^{x}$
28. $f(x)=3^{-x}$
29. $f(x)=\pi^{\sin x}$
30. $f(x)=\pi^{x \tan x}$

31-35 Find $d y / d x$ using the method of logarithmic differentiation.
31. $y=\left(x^{3}-2 x\right)^{\ln x}$
32. $y=x^{\sin x}$
33. $y=(\ln x)^{\tan x}$
34. $y=\left(x^{2}+3\right)^{\ln x}$
35. $y=(\ln x)^{\ln x}$
36. (a) Explain why Formula (5) cannot be used to find $(d / d x)\left[x^{x}\right]$.
(b) Find this derivative by logarithmic differentiation.

37-52 Find $d y / d x$.
37. $y=\sin ^{-1}(3 x)$
38. $y=\cos ^{-1}\left(\frac{x+1}{2}\right)$
39. $y=\sin ^{-1}(1 / x)$
40. $y=\cos ^{-1}(\cos x)$
41. $y=\tan ^{-1}\left(x^{3}\right)$
42. $y=\sec ^{-1}\left(x^{5}\right)$
43. $y=(\tan x)^{-1}$
44. $y=\frac{1}{\tan ^{-1} x}$
45. $y=e^{x} \sec ^{-1} x$
46. $y=\ln \left(\cos ^{-1} x\right)$
47. $y=\sin ^{-1} x+\cos ^{-1} x$
48. $y=x^{2}\left(\sin ^{-1} x\right)^{3}$
49. $y=\sec ^{-1} x+\csc ^{-1} x$
50. $y=\csc ^{-1}\left(e^{x}\right)$
51. $y=\cot ^{-1}(\sqrt{x})$
52. $y=\sqrt{\cot ^{-1} x}$

53-56 True-False Determine whether the statement is true or false. Explain your answer.
53. If a function $y=f(x)$ satisfies $d y / d x=y$, then $y=e^{x}$.
54. If $y=f(x)$ is a function such that $d y / d x$ is a rational function, then $f(x)$ is also a rational function.
55. $\frac{d}{d x}\left(\log _{b}|x|\right)=\frac{1}{x \ln b}$
56. We can conclude from the derivatives of $\sin ^{-1} x$ and $\cos ^{-1} x$ that $\sin ^{-1} x+\cos ^{-1} x$ is constant.
57. (a) Use Formula (2) to prove that

$$
\left.\frac{d}{d x}\left[\cot ^{-1} x\right]\right|_{x=0}=-1
$$

(b) Use part (a) above, part (a) of Exercise 48 in Section 0.4 , and the chain rule to show that

$$
\frac{d}{d x}\left[\cot ^{-1} x\right]=-\frac{1}{1+x^{2}}
$$

for $-\infty<x<+\infty$.
(c) Conclude from part (b) that

$$
\frac{d}{d x}\left[\cot ^{-1} u\right]=-\frac{1}{1+u^{2}} \frac{d u}{d x}
$$

for $-\infty<u<+\infty$.
58. (a) Use part (c) of Exercise 48 in Section 0.4 and the chain rule to show that

$$
\frac{d}{d x}\left[\csc ^{-1} x\right]=-\frac{1}{|x| \sqrt{x^{2}-1}}
$$

for $1<|x|$.
(b) Conclude from part (a) that

$$
\frac{d}{d x}\left[\csc ^{-1} u\right]=-\frac{1}{|u| \sqrt{u^{2}-1}} \frac{d u}{d x}
$$

for $1<|u|$.
(cont.)
(c) Use Equation (11) in Section 0.4 and parts (b) and (c) of Exercise 48 in that section to show that if $|x| \geq 1$ then, $\sec ^{-1} x+\csc ^{-1} x=\pi / 2$. Conclude from part (a) that

$$
\frac{d}{d x}\left[\sec ^{-1} x\right]=\frac{1}{|x| \sqrt{x^{2}-1}}
$$

(d) Conclude from part (c) that

$$
\frac{d}{d x}\left[\sec ^{-1} u\right]=\frac{1}{|u| \sqrt{u^{2}-1}} \frac{d u}{d x}
$$

59-60 Find $d y / d x$ by implicit differentiation.
59. $x^{3}+x \tan ^{-1} y=e^{y}$
60. $\sin ^{-1}(x y)=\cos ^{-1}(x-y)$
61. (a) Show that $f(x)=x^{3}-3 x^{2}+2 x$ is not one-to-one on $(-\infty,+\infty)$.
(b) Find the largest value of $k$ such that $f$ is one-to-one on the interval $(-k, k)$.
62. (a) Show that the function $f(x)=x^{4}-2 x^{3}$ is not one-toone on $(-\infty,+\infty)$.
(b) Find the smallest value of $k$ such that $f$ is one-to-one on the interval $[k,+\infty)$.
63. Let $f(x)=x^{4}+x^{3}+1,0 \leq x \leq 2$.
(a) Show that $f$ is one-to-one.
(b) Let $g(x)=f^{-1}(x)$ and define $F(x)=f(2 g(x))$. Find an equation for the tangent line to $y=F(x)$ at $x=3$.
64. Let $f(x)=\frac{\exp \left(4-x^{2}\right)}{x}, x>0$.
(a) Show that $f$ is one-to-one.
(b) Let $g(x)=f^{-1}(x)$ and define $F(x)=f\left([g(x)]^{2}\right)$. Find $F^{\prime}\left(\frac{1}{2}\right)$.
65. Show that for any constants $A$ and $k$, the function $y=A e^{k t}$ satisfies the equation $d y / d t=k y$.
66. Show that for any constants $A$ and $B$, the function

$$
y=A e^{2 x}+B e^{-4 x}
$$

satisfies the equation

$$
y^{\prime \prime}+2 y^{\prime}-8 y=0
$$

67. Show that
(a) $y=x e^{-x}$ satisfies the equation $x y^{\prime}=(1-x) y$
(b) $y=x e^{-x^{2} / 2}$ satisfies the equation $x y^{\prime}=\left(1-x^{2}\right) y$.
68. Show that the rate of change of $y=100 e^{-0.2 x}$ with respect to $x$ is proportional to $y$.
69. Show that

$$
y=\frac{60}{5+7 e^{-t}} \quad \text { satisfies } \quad \frac{d y}{d t}=r\left(1-\frac{y}{K}\right) y
$$

for some constants $r$ and $K$, and determine the values of these constants.
70. Suppose that the population of oxygen-dependent bacteria in a pond is modeled by the equation

$$
P(t)=\frac{60}{5+7 e^{-t}}
$$

where $P(t)$ is the population (in billions) $t$ days after an initial observation at time $t=0$.
(a) Use a graphing utility to graph the function $P(t)$.
(b) In words, explain what happens to the population over time. Check your conclusion by finding $\lim _{t \rightarrow+\infty} P(t)$.
(c) In words, what happens to the rate of population growth over time? Check your conclusion by graphing $P^{\prime}(t)$.

71-76 Find the limit by interpreting the expression as an appropriate derivative.
71. $\lim _{x \rightarrow 0} \frac{e^{3 x}-1}{x}$
72. $\lim _{x \rightarrow 0} \frac{\exp \left(x^{2}\right)-1}{x}$
73. $\lim _{h \rightarrow 0} \frac{10^{h}-1}{h}$
74. $\lim _{h \rightarrow 0} \frac{\tan ^{-1}(1+h)-\pi / 4}{h}$
75. $\lim _{\Delta x \rightarrow 0} \frac{9\left[\sin ^{-1}\left(\frac{\sqrt{3}}{2}+\Delta x\right)\right]^{2}-\pi^{2}}{\Delta x}$
76. $\lim _{w \rightarrow 2} \frac{3 \sec ^{-1} w-\pi}{w-2}$
77. Writing Let $G$ denote the graph of an invertible function $f$ and consider $G$ as a fixed set of points in the plane. Suppose we relabel the coordinate axes so that the $x$-axis becomes the $y$-axis and vice versa. Carefully explain why now the same set of points $G$ becomes the graph of $f^{-1}$ (with the coordinate axes in a nonstandard position). Use this result to explain Formula (2).
78. Writing Suppose that $f$ has an inverse function. Carefully explain the connection between Formula (2) and implicit differentiation of the equation $x=f(y)$.

## QUICK CHECK ANSWERS 3.3

1. $\frac{1}{5}$
2. 

(a) yes
(b) no
(c) no
(d) yes
3. (a) $e^{x}$
(b) $7^{x} \ln 7$
(c) $-e^{x} \sin \left(e^{x}+1\right)$
(d) $3 e^{3 x-2}$
4. $f^{\prime}(x)=e^{x^{3}+x} \cdot\left(3 x^{2}+1\right)>0$ for all $x$

### 3.4 RELATED RATES

In this section we will study related rates problems. In such problems one tries to find the rate at which some quantity is changing by relating the quantity to other quantities whose rates of change are known.

## DIFFERENTIATING EQUATIONS TO RELATE RATES

Figure 3.4.1 shows a liquid draining through a conical filter. As the liquid drains, its volume $V$, height $h$, and radius $r$ are functions of the elapsed time $t$, and at each instant these variables are related by the equation

$$
V=\frac{\pi}{3} r^{2} h
$$

If we were interested in finding the rate of change of the volume $V$ with respect to the time $t$, we could begin by differentiating both sides of this equation with respect to $t$ to obtain

$$
\frac{d V}{d t}=\frac{\pi}{3}\left[r^{2} \frac{d h}{d t}+h\left(2 r \frac{d r}{d t}\right)\right]=\frac{\pi}{3}\left(r^{2} \frac{d h}{d t}+2 r h \frac{d r}{d t}\right)
$$

Thus, to find $d V / d t$ at a specific time $t$ from this equation we would need to have values for $r, h, d h / d t$, and $d r / d t$ at that time. This is called a related rates problem because the goal is to find an unknown rate of change by relating it to other variables whose values and whose rates of change at time $t$ are known or can be found in some way. Let us begin with a simple example.

- Figure 3.4.1
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-138.jpg?height=358&width=1049&top_left_y=1367&top_left_x=758)

Example 1 Suppose that $x$ and $y$ are differentiable functions of $t$ and are related by the equation $y=x^{3}$. Find $d y / d t$ at time $t=1$ if $x=2$ and $d x / d t=4$ at time $t=1$.

Solution. Using the chain rule to differentiate both sides of the equation $y=x^{3}$ with respect to $t$ yields

$$
\frac{d y}{d t}=\frac{d}{d t}\left[x^{3}\right]=3 x^{2} \frac{d x}{d t}
$$

Thus, the value of $d y / d t$ at time $t=1$ is

$$
\left.\frac{d y}{d t}\right|_{t=1}=\left.3(2)^{2} \frac{d x}{d t}\right|_{t=1}=12 \cdot 4=48
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-139.jpg?height=690&width=471&top_left_y=220&top_left_x=212)
Arni Katz/Phototake
Oil spill from a ruptured tanker.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-139.jpg?height=385&width=395&top_left_y=1235&top_left_x=244)
A Figure 3.4.2

## WARNING

We have italicized the word "After" in Step 5 because it is a common error to substitute numerical values before performing the differentiation. For instance, in Example 2 had we substituted the known value of $r=60$ in (1) before differentiating, we would have obtained $d A / d t=0$, which is obviously incorrect.

Example 2 Assume that oil spilled from a ruptured tanker spreads in a circular pattern whose radius increases at a constant rate of $2 \mathrm{ft} / \mathrm{s}$. How fast is the area of the spill increasing when the radius of the spill is 60 ft ?

Solution. Let
$t$ = number of seconds elapsed from the time of the spill
$r=$ radius of the spill in feet after $t$ seconds
$A=$ area of the spill in square feet after $t$ seconds
(Figure 3.4.2). We know the rate at which the radius is increasing, and we want to find the rate at which the area is increasing at the instant when $r=60$; that is, we want to find

$$
\left.\frac{d A}{d t}\right|_{r=60} \text { given that } \frac{d r}{d t}=2 \mathrm{ft} / \mathrm{s}
$$

This suggests that we look for an equation relating $A$ and $r$ that we can differentiate with respect to $t$ to produce a relationship between $d A / d t$ and $d r / d t$. But $A$ is the area of a circle of radius $r$, so

$$
\begin{equation*}
A=\pi r^{2} \tag{1}
\end{equation*}
$$

Differentiating both sides of (1) with respect to $t$ yields

$$
\begin{equation*}
\frac{d A}{d t}=2 \pi r \frac{d r}{d t} \tag{2}
\end{equation*}
$$

Thus, when $r=60$ the area of the spill is increasing at the rate of

$$
\left.\frac{d A}{d t}\right|_{r=60}=2 \pi(60)(2)=240 \pi \mathrm{ft}^{2} / \mathrm{s} \approx 754 \mathrm{ft}^{2} / \mathrm{s}
$$

With some minor variations, the method used in Example 2 can be used to solve a variety of related rates problems. We can break the method down into five steps.

## A Strategy for Solving Related Rates Problems

Step 1. Assign letters to all quantities that vary with time and any others that seem relevant to the problem. Give a definition for each letter.

Step 2. Identify the rates of change that are known and the rate of change that is to be found. Interpret each rate as a derivative.

Step 3. Find an equation that relates the variables whose rates of change were identified in Step 2. To do this, it will often be helpful to draw an appropriately labeled figure that illustrates the relationship.

Step 4. Differentiate both sides of the equation obtained in Step 3 with respect to time to produce a relationship between the known rates of change and the unknown rate of change.

Step 5. After completing Step 4, substitute all known values for the rates of change and the variables, and then solve for the unknown rate of change.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-140.jpg?height=483&width=467&top_left_y=200&top_left_x=160)
△ Figure 3.4.3

The quantity

$$
\left.\frac{d x}{d t}\right|_{x=20}
$$

is negative because $x$ is decreasing with respect to $t$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-140.jpg?height=483&width=463&top_left_y=1211&top_left_x=160)
\$ Figure 3.4.4

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-140.jpg?height=401&width=407&top_left_y=1944&top_left_x=188)
△ Figure 3.4.5

- Example 3 A baseball diamond is a square whose sides are 90 ft long (Figure 3.4.3). Suppose that a player running from second base to third base has a speed of $30 \mathrm{ft} / \mathrm{s}$ at the instant when he is 20 ft from third base. At what rate is the player's distance from home plate changing at that instant?

Solution. We are given a constant speed with which the player is approaching third base, and we want to find the rate of change of the distance between the player and home plate at a particular instant. Thus, let
$t=$ number of seconds since the player left second base
$x=$ distance in feet from the player to third base
$y=$ distance in feet from the player to home plate
(Figure 3.4.4). Thus, we want to find

$$
\left.\frac{d y}{d t}\right|_{x=20} \text { given that }\left.\quad \frac{d x}{d t}\right|_{x=20}=-30 \mathrm{ft} / \mathrm{s}
$$

As suggested by Figure 3.4.4, an equation relating the variables $x$ and $y$ can be obtained using the Theorem of Pythagoras:

$$
\begin{equation*}
x^{2}+90^{2}=y^{2} \tag{3}
\end{equation*}
$$

Differentiating both sides of this equation with respect to $t$ yields

$$
2 x \frac{d x}{d t}=2 y \frac{d y}{d t}
$$

from which we obtain

$$
\begin{equation*}
\frac{d y}{d t}=\frac{x}{y} \frac{d x}{d t} \tag{4}
\end{equation*}
$$

When $x=20$, it follows from (3) that

$$
y=\sqrt{20^{2}+90^{2}}=\sqrt{8500}=10 \sqrt{85}
$$

so that (4) yields

$$
\left.\frac{d y}{d t}\right|_{x=20}=\frac{20}{10 \sqrt{85}}(-30)=-\frac{60}{\sqrt{85}} \approx-6.51 \mathrm{ft} / \mathrm{s}
$$

The negative sign in the answer tells us that $y$ is decreasing, which makes sense physically from Figure 3.4.4. $\square$

Example 4 In Figure 3.4.5 we have shown a camera mounted at a point 3000 ft from the base of a rocket launching pad. If the rocket is rising vertically at $880 \mathrm{ft} / \mathrm{s}$ when it is 4000 ft above the launching pad, how fast must the camera elevation angle change at that instant to keep the camera aimed at the rocket?

Solution. Let
$t$ = number of seconds elapsed from the time of launch
$\phi=$ camera elevation angle in radians after $t$ seconds
$h=$ height of the rocket in feet after $t$ seconds
(Figure 3.4.6). At each instant the rate at which the camera elevation angle must change

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-141.jpg?height=367&width=375&top_left_y=198&top_left_x=260)
△ Figure 3.4.6

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-141.jpg?height=320&width=291&top_left_y=784&top_left_x=300)
- Figure 3.4.7

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-141.jpg?height=351&width=453&top_left_y=1205&top_left_x=218)
\$ Figure 3.4.8

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-141.jpg?height=306&width=403&top_left_y=1707&top_left_x=248)
The same volume has drained, but the change in height is greater near the bottom than near the top.

- Figure 3.4.9
is $d \phi / d t$, and the rate at which the rocket is rising is $d h / d t$. We want to find

$$
\left.\frac{d \phi}{d t}\right|_{h=4000} \text { given that }\left.\quad \frac{d h}{d t}\right|_{h=4000}=880 \mathrm{ft} / \mathrm{s}
$$

From Figure 3.4.6 we see that

$$
\begin{equation*}
\tan \phi=\frac{h}{3000} \tag{5}
\end{equation*}
$$

Differentiating both sides of (5) with respect to $t$ yields

$$
\begin{equation*}
\left(\sec ^{2} \phi\right) \frac{d \phi}{d t}=\frac{1}{3000} \frac{d h}{d t} \tag{6}
\end{equation*}
$$

When $h=4000$, it follows that

$$
\left.(\sec \phi)\right|_{h=4000}=\frac{5000}{3000}=\frac{5}{3}
$$

(see Figure 3.4.7), so that from (6)

$$
\begin{aligned}
\left.\left(\frac{5}{3}\right)^{2} \frac{d \phi}{d t}\right|_{h=4000} & =\frac{1}{3000} \cdot 880=\frac{22}{75} \\
\left.\frac{d \phi}{d t}\right|_{h=4000} & =\frac{22}{75} \cdot \frac{9}{25}=\frac{66}{625} \approx 0.11 \mathrm{rad} / \mathrm{s} \approx 6.05 \mathrm{deg} / \mathrm{s}
\end{aligned}
$$

Example 5 Suppose that liquid is to be cleared of sediment by allowing it to drain through a conical filter that is 16 cm high and has a radius of 4 cm at the top (Figure 3.4.8). Suppose also that the liquid is forced out of the cone at a constant rate of $2 \mathrm{~cm}^{3} / \mathrm{min}$.
(a) Do you think that the depth of the liquid will decrease at a constant rate? Give a verbal argument that justifies your conclusion.
(b) Find a formula that expresses the rate at which the depth of the liquid is changing in terms of the depth, and use that formula to determine whether your conclusion in part (a) is correct.
(c) At what rate is the depth of the liquid changing at the instant when the liquid in the cone is 8 cm deep?

Solution (a). For the volume of liquid to decrease by a fixed amount, it requires a greater decrease in depth when the cone is close to empty than when it is almost full (Figure 3.4.9). This suggests that for the volume to decrease at a constant rate, the depth must decrease at an increasing rate.

## Solution (b). Let

$$
\begin{aligned}
t & =\text { time elapsed from the initial observation (min) } \\
V & =\text { volume of liquid in the cone at time } t\left(\mathrm{~cm}^{3}\right) \\
y & =\text { depth of the liquid in the cone at time } t(\mathrm{~cm}) \\
r & =\text { radius of the liquid surface at time } t(\mathrm{~cm})
\end{aligned}
$$

(Figure 3.4.8). At each instant the rate at which the volume of liquid is changing is $d V / d t$, and the rate at which the depth is changing is $d y / d t$. We want to express $d y / d t$ in terms of $y$ given that $d V / d t$ has a constant value of $d V / d t=-2$. (We must use a minus sign here because $V$ decreases as $t$ increases.)

From the formula for the volume of a cone, the volume $V$, the radius $r$, and the depth $y$ are related by

$$
\begin{equation*}
V=\frac{1}{3} \pi r^{2} y \tag{7}
\end{equation*}
$$

If we differentiate both sides of (7) with respect to $t$, the right side will involve the quantity $d r / d t$. Since we have no direct information about $d r / d t$, it is desirable to eliminate $r$ from (7) before differentiating. This can be done using similar triangles. From Figure 3.4.8 we see that

$$
\frac{r}{y}=\frac{4}{16} \quad \text { or } \quad r=\frac{1}{4} y
$$

Substituting this expression in (7) gives

$$
\begin{equation*}
V=\frac{\pi}{48} y^{3} \tag{8}
\end{equation*}
$$

Differentiating both sides of (8) with respect to $t$ we obtain

$$
\frac{d V}{d t}=\frac{\pi}{48}\left(3 y^{2} \frac{d y}{d t}\right)
$$

or

$$
\begin{equation*}
\frac{d y}{d t}=\frac{16}{\pi y^{2}} \frac{d V}{d t}=\frac{16}{\pi y^{2}}(-2)=-\frac{32}{\pi y^{2}} \tag{9}
\end{equation*}
$$

which expresses $d y / d t$ in terms of $y$. The minus sign tells us that $y$ is decreasing with time, and

$$
\left|\frac{d y}{d t}\right|=\frac{32}{\pi y^{2}}
$$

tells us how fast $y$ is decreasing. From this formula we see that $|d y / d t|$ increases as $y$ decreases, which confirms our conjecture in part (a) that the depth of the liquid decreases more quickly as the liquid drains through the filter.

Solution (c). The rate at which the depth is changing when the depth is 8 cm can be obtained from (9) with $y=8$ :

$$
\left.\frac{d y}{d t}\right|_{y=8}=-\frac{32}{\pi\left(8^{2}\right)}=-\frac{1}{2 \pi} \approx-0.16 \mathrm{~cm} / \mathrm{min}
$$

## QUICK CHECK EXERCISES 3.4 (See page 211 for answers.)

1. If $A=x^{2}$ and $\frac{d x}{d t}=3$, find $\left.\frac{d A}{d t}\right|_{x=10}$.
2. If $A=x^{2}$ and $\frac{d A}{d t}=3$, find $\left.\frac{d x}{d t}\right|_{x=10}$.
3. A 10 -foot ladder stands on a horizontal floor and leans against a vertical wall. Use $x$ to denote the distance along the floor from the wall to the foot of the ladder, and use $y$ to denote the distance along the wall from the floor to the
top of the ladder. If the foot of the ladder is dragged away from the wall, find an equation that relates rates of change of $x$ and $y$ with respect to time.
4. Suppose that a block of ice in the shape of a right circular cylinder melts so that it retains its cylindrical shape. Find an equation that relates the rates of change of the volume $(V)$, height $(h)$, and radius $(r)$ of the block of ice.

## EXERCISE SET 3.4

1-4 Both $x$ and $y$ denote functions of $t$ that are related by the given equation. Use this equation and the given derivative information to find the specified derivative.

1. Equation: $y=3 x+5$.
(a) Given that $d x / d t=2$, find $d y / d t$ when $x=1$.
(b) Given that $d y / d t=-1$, find $d x / d t$ when $x=0$.
2. Equation: $x+4 y=3$.
(a) Given that $d x / d t=1$, find $d y / d t$ when $x=2$.
(b) Given that $d y / d t=4$, find $d x / d t$ when $x=3$.
3. Equation: $4 x^{2}+9 y^{2}=1$.
(a) Given that $d x / d t=3$, find $d y / d t$ when
$(x, y)=\left(\frac{1}{2 \sqrt{2}}, \frac{1}{3 \sqrt{2}}\right)$.
(b) Given that $d y / d t=8$, find $d x / d t$ when

$$
(x, y)=\left(\frac{1}{3},-\frac{\sqrt{5}}{9}\right) .
$$

4. Equation: $x^{2}+y^{2}=2 x+4 y$.
(a) Given that $d x / d t=-5$, find $d y / d t$ when $(x, y)=(3,1)$.
(b) Given that $d y / d t=6$, find $d x / d t$ when $(x, y)=(1+\sqrt{2}, 2+\sqrt{3})$.

## FOCUS ON CONCEPTS

5. Let $A$ be the area of a square whose sides have length $x$, and assume that $x$ varies with the time $t$.
(a) Draw a picture of the square with the labels $A$ and $x$ placed appropriately.
(b) Write an equation that relates $A$ and $x$.
(c) Use the equation in part (b) to find an equation that relates $d A / d t$ and $d x / d t$.
(d) At a certain instant the sides are 3 ft long and increasing at a rate of $2 \mathrm{ft} / \mathrm{min}$. How fast is the area increasing at that instant?
6. In parts (a)-(d), let $A$ be the area of a circle of radius $r$, and assume that $r$ increases with the time $t$.
(a) Draw a picture of the circle with the labels $A$ and $r$ placed appropriately.
(b) Write an equation that relates $A$ and $r$.
(c) Use the equation in part (b) to find an equation that relates $d A / d t$ and $d r / d t$.
(d) At a certain instant the radius is 5 cm and increasing at the rate of $2 \mathrm{~cm} / \mathrm{s}$. How fast is the area increasing at that instant?
7. Let $V$ be the volume of a cylinder having height $h$ and radius $r$, and assume that $h$ and $r$ vary with time.
(a) How are $d V / d t, d h / d t$, and $d r / d t$ related?
(b) At a certain instant, the height is 6 in and increasing at $1 \mathrm{in} / \mathrm{s}$, while the radius is 10 in and decreasing at $1 \mathrm{in} / \mathrm{s}$. How fast is the volume changing at that instant? Is the volume increasing or decreasing at that instant?
8. Let $l$ be the length of a diagonal of a rectangle whose sides have lengths $x$ and $y$, and assume that $x$ and $y$ vary with time.
(a) How are $d l / d t, d x / d t$, and $d y / d t$ related?
(b) If $x$ increases at a constant rate of $\frac{1}{2} \mathrm{ft} / \mathrm{s}$ and $y$ decreases at a constant rate of $\frac{1}{4} \mathrm{ft} / \mathrm{s}$, how fast is the size of the diagonal changing when $x=3 \mathrm{ft}$ and $y=4 \mathrm{ft}$ ? Is the diagonal increasing or decreasing at that instant?
9. Let $\theta$ (in radians) be an acute angle in a right triangle, and let $x$ and $y$, respectively, be the lengths of the sides adjacent to and opposite $\theta$. Suppose also that $x$ and $y$ vary with time.
(a) How are $d \theta / d t, d x / d t$, and $d y / d t$ related?
(b) At a certain instant, $x=2$ units and is increasing at

1 unit/s, while $y=2$ units and is decreasing at $\frac{1}{4}$ unit/s. How fast is $\theta$ changing at that instant? Is $\theta$ increasing or decreasing at that instant?
10. Suppose that $z=x^{3} y^{2}$, where both $x$ and $y$ are changing with time. At a certain instant when $x=1$ and $y=2, x$ is decreasing at the rate of 2 units/s, and $y$ is increasing at the rate of 3 units/s. How fast is $z$ changing at this instant? Is $z$ increasing or decreasing?
11. The minute hand of a certain clock is 4 in long. Starting from the moment when the hand is pointing straight up, how fast is the area of the sector that is swept out by the hand increasing at any instant during the next revolution of the hand?
12. A stone dropped into a still pond sends out a circular ripple whose radius increases at a constant rate of $3 \mathrm{ft} / \mathrm{s}$. How rapidly is the area enclosed by the ripple increasing at the end of 10 s ?
13. Oil spilled from a ruptured tanker spreads in a circle whose area increases at a constant rate of $6 \mathrm{mi}^{2} / \mathrm{h}$. How fast is the radius of the spill increasing when the area is $9 \mathrm{mi}^{2}$ ?
14. A spherical balloon is inflated so that its volume is increasing at the rate of $3 \mathrm{ft}^{3} / \mathrm{min}$. How fast is the diameter of the balloon increasing when the radius is 1 ft ?
15. A spherical balloon is to be deflated so that its radius decreases at a constant rate of $15 \mathrm{~cm} / \mathrm{min}$. At what rate must air be removed when the radius is 9 cm ?
16. A 17 ft ladder is leaning against a wall. If the bottom of the ladder is pulled along the ground away from the wall at a constant rate of $5 \mathrm{ft} / \mathrm{s}$, how fast will the top of the ladder be moving down the wall when it is 8 ft above the ground?
17. A 13 ft ladder is leaning against a wall. If the top of the ladder slips down the wall at a rate of $2 \mathrm{ft} / \mathrm{s}$, how fast will the foot be moving away from the wall when the top is 5 ft above the ground?
18. A 10 ft plank is leaning against a wall. If at a certain instant the bottom of the plank is 2 ft from the wall and is being pushed toward the wall at the rate of $6 \mathrm{in} / \mathrm{s}$, how fast is the acute angle that the plank makes with the ground increasing?
19. A softball diamond is a square whose sides are 60 ft long. Suppose that a player running from first to second base has a speed of $25 \mathrm{ft} / \mathrm{s}$ at the instant when she is 10 ft from second base. At what rate is the player's distance from home plate changing at that instant?
20. A rocket, rising vertically, is tracked by a radar station that is on the ground 5 mi from the launchpad. How fast is the rocket rising when it is 4 mi high and its distance from the radar station is increasing at a rate of $2000 \mathrm{mi} / \mathrm{h}$ ?
21. For the camera and rocket shown in Figure 3.4.5, at what rate is the camera-to-rocket distance changing when the rocket is 4000 ft up and rising vertically at $880 \mathrm{ft} / \mathrm{s}$ ?
22. For the camera and rocket shown in Figure 3.4.5, at what rate is the rocket rising when the elevation angle is $\pi / 4$ radians and increasing at a rate of $0.2 \mathrm{rad} / \mathrm{s}$ ?
23. A satellite is in an elliptical orbit around the Earth. Its distance $r$ (in miles) from the center of the Earth is given by

$$
r=\frac{4995}{1+0.12 \cos \theta}
$$

where $\theta$ is the angle measured from the point on the orbit nearest the Earth's surface (see the accompanying figure).
(a) Find the altitude of the satellite at perige (the point nearest the surface of the Earth) and at apogee (the point farthest from the surface of the Earth). Use 3960 mi as the radius of the Earth.
(b) At the instant when $\theta$ is $120^{\circ}$, the angle $\theta$ is increasing at the rate of $2.7^{\circ} / \mathrm{min}$. Find the altitude of the satellite and the rate at which the altitude is changing at this instant. Express the rate in units of mi/min.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-144.jpg?height=299&width=459&top_left_y=909&top_left_x=212)
\& Figure Ex-23

24. An aircraft is flying horizontally at a constant height of 4000 ft above a fixed observation point (see the accompanying figure). At a certain instant the angle of elevation $\theta$ is $30^{\circ}$ and decreasing, and the speed of the aircraft is $300 \mathrm{mi} / \mathrm{h}$.
(a) How fast is $\theta$ decreasing at this instant? Express the result in units of deg/s.
(b) How fast is the distance between the aircraft and the observation point changing at this instant? Express the result in units of ft/s. Use $1 \mathrm{mi}=5280 \mathrm{ft}$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-144.jpg?height=298&width=435&top_left_y=1651&top_left_x=212)
< Figure Ex-24

25. A conical water tank with vertex down has a radius of 10 ft at the top and is 24 ft high. If water flows into the tank at a rate of $20 \mathrm{ft}^{3} / \mathrm{min}$, how fast is the depth of the water increasing when the water is 16 ft deep?
26. Grain pouring from a chute at the rate of $8 \mathrm{ft}^{3} / \mathrm{min}$ forms a conical pile whose height is always twice its radius. How fast is the height of the pile increasing at the instant when the pile is 6 ft high?
27. Sand pouring from a chute forms a conical pile whose height is always equal to the diameter. If the height increases at a
constant rate of $5 \mathrm{ft} / \mathrm{min}$, at what rate is sand pouring from the chute when the pile is 10 ft high?
28. Wheat is poured through a chute at the rate of $10 \mathrm{ft}^{3} / \mathrm{min}$ and falls in a conical pile whose bottom radius is always half the altitude. How fast will the circumference of the base be increasing when the pile is 8 ft high?
29. An aircraft is climbing at a $30^{\circ}$ angle to the horizontal. How fast is the aircraft gaining altitude if its speed is $500 \mathrm{mi} / \mathrm{h}$ ?
30. A boat is pulled into a dock by means of a rope attached to a pulley on the dock (see the accompanying figure). The rope is attached to the bow of the boat at a point 10 ft below the pulley. If the rope is pulled through the pulley at a rate of $20 \mathrm{ft} / \mathrm{min}$, at what rate will the boat be approaching the dock when 125 ft of rope is out?

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-144.jpg?height=170&width=273&top_left_y=802&top_left_x=1125)
-Figure Ex-30

31. For the boat in Exercise 30, how fast must the rope be pulled if we want the boat to approach the dock at a rate of $12 \mathrm{ft} / \mathrm{min}$ at the instant when 125 ft of rope is out?
32. A man 6 ft tall is walking at the rate of $3 \mathrm{ft} / \mathrm{s}$ toward a streetlight 18 ft high (see the accompanying figure).
(a) At what rate is his shadow length changing?
(b) How fast is the tip of his shadow moving?

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-144.jpg?height=359&width=397&top_left_y=1309&top_left_x=1129)
<Figure Ex-32

33. A beacon that makes one revolution every 10 s is located on a ship anchored 4 kilometers from a straight shoreline. How fast is the beam moving along the shoreline when it makes an angle of $45^{\circ}$ with the shore?
34. An aircraft is flying at a constant altitude with a constant speed of $600 \mathrm{mi} / \mathrm{h}$. An antiaircraft missile is fired on a straight line perpendicular to the flight path of the aircraft so that it will hit the aircraft at a point $P$ (see the accompanying figure). At the instant the aircraft is 2 mi from the impact point $P$ the missile is 4 mi from $P$ and flying at 1200 $\mathrm{mi} / \mathrm{h}$. At that instant, how rapidly is the distance between missile and aircraft decreasing?

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-144.jpg?height=173&width=395&top_left_y=2210&top_left_x=1129)
<Figure Ex-34

35. Solve Exercise 34 under the assumption that the angle between the flight paths is $120^{\circ}$ instead of the assumption that the paths are perpendicular. [Hint: Use the law of cosines.]
36. A police helicopter is flying due north at $100 \mathrm{mi} / \mathrm{h}$ and at a constant altitude of $\frac{1}{2} \mathrm{mi}$. Below, a car is traveling west on a highway at $75 \mathrm{mi} / \mathrm{h}$. At the moment the helicopter crosses over the highway the car is 2 mi east of the helicopter.
(a) How fast is the distance between the car and helicopter changing at the moment the helicopter crosses the highway?
(b) Is the distance between the car and helicopter increasing or decreasing at that moment?
37. A particle is moving along the curve whose equation is

$$
\frac{x y^{3}}{1+y^{2}}=\frac{8}{5}
$$

Assume that the $x$-coordinate is increasing at the rate of 6 units/s when the particle is at the point $(1,2)$.
(a) At what rate is the $y$-coordinate of the point changing at that instant?
(b) Is the particle rising or falling at that instant?
38. A point $P$ is moving along the curve whose equation is $y=\sqrt{x^{3}+17}$. When $P$ is at $(2,5), y$ is increasing at the rate of 2 units/s. How fast is $x$ changing?
39. A point $P$ is moving along the line whose equation is $y=2 x$. How fast is the distance between $P$ and the point $(3,0)$ changing at the instant when $P$ is at $(3,6)$ if $x$ is decreasing at the rate of 2 units/s at that instant?
40. A point $P$ is moving along the curve whose equation is $y=\sqrt{x}$. Suppose that $x$ is increasing at the rate of 4 units/s when $x=3$.
(a) How fast is the distance between $P$ and the point $(2,0)$ changing at this instant?
(b) How fast is the angle of inclination of the line segment from $P$ to $(2,0)$ changing at this instant?
41. A particle is moving along the curve $y=x /\left(x^{2}+1\right)$. Find all values of $x$ at which the rate of change of $x$ with respect to time is three times that of $y$. [Assume that $d x / d t$ is never zero.]
42. A particle is moving along the curve $16 x^{2}+9 y^{2}=144$. Find all points $(x, y)$ at which the rates of change of $x$ and $y$ with respect to time are equal. [Assume that $d x / d t$ and $d y / d t$ are never both zero at the same point.]
43. The thin lens equation in physics is

$$
\frac{1}{s}+\frac{1}{S}=\frac{1}{f}
$$

where $s$ is the object distance from the lens, $S$ is the image distance from the lens, and $f$ is the focal length of the lens. Suppose that a certain lens has a focal length of 6 cm and that an object is moving toward the lens at the rate of $2 \mathrm{~cm} / \mathrm{s}$. How fast is the image distance changing at the instant when the object is 10 cm from the lens? Is the image moving away from the lens or toward the lens?
44. Water is stored in a cone-shaped reservoir (vertex down). Assuming the water evaporates at a rate proportional to the surface area exposed to the air, show that the depth of the water will decrease at a constant rate that does not depend on the dimensions of the reservoir.
45. A meteor enters the Earth's atmosphere and burns up at a rate that, at each instant, is proportional to its surface area. Assuming that the meteor is always spherical, show that the radius decreases at a constant rate.
46. On a certain clock the minute hand is 4 in long and the hour hand is 3 in long. How fast is the distance between the tips of the hands changing at 9 o'clock?
47. Coffee is poured at a uniform rate of $20 \mathrm{~cm}^{3} / \mathrm{s}$ into a cup whose inside is shaped like a truncated cone (see the accompanying figure). If the upper and lower radii of the cup are 4 cm and 2 cm and the height of the cup is 6 cm , how fast will the coffee level be rising when the coffee is halfway up? [Hint: Extend the cup downward to form a cone.]

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-145.jpg?height=176&width=269&top_left_y=1629&top_left_x=1179)
-Figure Ex-47

## QUICK CHECK ANSWERS 3.4

1. 60
2. $\frac{3}{20}$
3. $x \frac{d x}{d t}+y \frac{d y}{d t}=0$
4. $\frac{d V}{d t}=2 \pi r h \frac{d r}{d t}+\pi r^{2} \frac{d h}{d t}$

### 3.5 LOCAL LINEAR APPROXIMATION; DIFFERENTIALS

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-146.jpg?height=720&width=431&top_left_y=584&top_left_x=176)
△ Figure 3.5.1

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-146.jpg?height=277&width=485&top_left_y=2052&top_left_x=152)
△ Figure 3.5.2

In this section we will show how derivatives can be used to approximate nonlinear functions by linear functions. Also, up to now we have been interpreting $d y / d x$ as a single entity representing the derivative. In this section we will define the quantities $d x$ and $d y$ themselves, thereby allowing us to interpret $d y / d x$ as an actual ratio.

Recall from Section 2.2 that if a function $f$ is differentiable at $x_{0}$, then a sufficiently magnified portion of the graph of $f$ centered at the point $P\left(x_{0}, f\left(x_{0}\right)\right)$ takes on the appearance of a straight line segment. Figure 3.5.1 illustrates this at several points on the graph of $y=x^{2}+1$. For this reason, a function that is differentiable at $x_{0}$ is sometimes said to be locally linear at $x_{0}$.

The line that best approximates the graph of $f$ in the vicinity of $P\left(x_{0}, f\left(x_{0}\right)\right)$ is the tangent line to the graph of $f$ at $x_{0}$, given by the equation

$$
y=f\left(x_{0}\right)+f^{\prime}\left(x_{0}\right)\left(x-x_{0}\right)
$$

[see Formula (3) of Section 2.2]. Thus, for values of $x$ near $x_{0}$ we can approximate values of $f(x)$ by

$$
\begin{equation*}
f(x) \approx f\left(x_{0}\right)+f^{\prime}\left(x_{0}\right)\left(x-x_{0}\right) \tag{1}
\end{equation*}
$$

This is called the local linear approximation of $f$ at $x_{0}$. This formula can also be expressed in terms of the increment $\Delta x=x-x_{0}$ as

$$
\begin{equation*}
f\left(x_{0}+\Delta x\right) \approx f\left(x_{0}\right)+f^{\prime}\left(x_{0}\right) \Delta x \tag{2}
\end{equation*}
$$

## Example 1

(a) Find the local linear approximation of $f(x)=\sqrt{x}$ at $x_{0}=1$.
(b) Use the local linear approximation obtained in part (a) to approximate $\sqrt{1.1}$, and compare your approximation to the result produced directly by a calculating utility.

Solution (a). Since $f^{\prime}(x)=1 /(2 \sqrt{x})$, it follows from (1) that the local linear approximation of $\sqrt{x}$ at a point $x_{0}$ is

$$
\sqrt{x} \approx \sqrt{x_{0}}+\frac{1}{2 \sqrt{x_{0}}}\left(x-x_{0}\right)
$$

Thus, the local linear approximation at $x_{0}=1$ is

$$
\begin{equation*}
\sqrt{x} \approx 1+\frac{1}{2}(x-1) \tag{3}
\end{equation*}
$$

The graphs of $y=\sqrt{x}$ and the local linear approximation $y=1+\frac{1}{2}(x-1)$ are shown in Figure 3.5.2.

Solution (b). Applying (3) with $x=1.1$ yields

$$
\sqrt{1.1} \approx 1+\frac{1}{2}(1.1-1)=1.05
$$

Since the tangent line $y=1+\frac{1}{2}(x-1)$ in Figure 3.5.2 lies above the graph of $f(x)=\sqrt{x}$, we would expect this approximation to be slightly too large. This expectation is confirmed by the calculator approximation $\sqrt{1.1} \approx 1.04881$.

Examples 1 and 2 illustrate important ideas and are not meant to suggest that you should use local linear approximations for computations that your calculating utility can perform. The main application of local linear approximation is in modeling problems where it is useful to replace complicated functions by simpler ones.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-147.jpg?height=342&width=471&top_left_y=744&top_left_x=212)
△ Figure 3.5.3

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-147.jpg?height=332&width=469&top_left_y=1443&top_left_x=212)
Figure 3.5.4

## Example 2

(a) Find the local linear approximation of $f(x)=\sin x$ at $x_{0}=0$.
(b) Use the local linear approximation obtained in part (a) to approximate $\sin 2^{\circ}$, and compare your approximation to the result produced directly by your calculating device.

Solution (a). Since $f^{\prime}(x)=\cos x$, it follows from (1) that the local linear approximation of $\sin x$ at a point $x_{0}$ is

$$
\sin x \approx \sin x_{0}+\left(\cos x_{0}\right)\left(x-x_{0}\right)
$$

Thus, the local linear approximation at $x_{0}=0$ is

$$
\sin x \approx \sin 0+(\cos 0)(x-0)
$$

which simplifies to

$$
\begin{equation*}
\sin x \approx x \tag{4}
\end{equation*}
$$

Solution (b). The variable $x$ in (4) is in radian measure, so we must first convert $2^{\circ}$ to radians before we can apply this approximation. Since

$$
2^{\circ}=2\left(\frac{\pi}{180}\right)=\frac{\pi}{90} \approx 0.0349066 \text { radian }
$$

it follows from (4) that $\sin 2^{\circ} \approx 0.0349066$. Comparing the two graphs in Figure 3.5.3, we would expect this approximation to be slightly larger than the exact value. The calculator approximation $\sin 2^{\circ} \approx 0.0348995$ shows that this is indeed the case.

## ERROR IN LOCAL LINEAR APPROXIMATIONS

As a general rule, the accuracy of the local linear approximation to $f(x)$ at $x_{0}$ will deteriorate as $x$ gets progressively farther from $x_{0}$. To illustrate this for the approximation $\sin x \approx x$ in Example 2, let us graph the function

$$
E(x)=|\sin x-x|
$$

which is the absolute value of the error in the approximation (Figure 3.5.4).
In Figure 3.5.4, the graph shows how the absolute error in the local linear approximation of $\sin x$ increases as $x$ moves progressively farther from 0 in either the positive or negative direction. The graph also tells us that for values of $x$ between the two vertical lines, the absolute error does not exceed 0.01 . Thus, for example, we could use the local linear approximation $\sin x \approx x$ for all values of $x$ in the interval $-0.35<x<0.35$ (radians) with confidence that the approximation is within $\pm 0.01$ of the exact value.

## DIFFERENTIALS

Newton and Leibniz each used a different notation when they published their discoveries of calculus, thereby creating a notational divide between Britain and the European continent that lasted for more than 50 years. The Leibniz notation $d y / d x$ eventually prevailed because it suggests correct formulas in a natural way, the chain rule

$$
\frac{d y}{d x}=\frac{d y}{d u} \cdot \frac{d u}{d x}
$$

being a good example.
Up to now we have interpreted $d y / d x$ as a single entity representing the derivative of $y$ with respect to $x$; the symbols " $d y$ " and " $d x$," which are called differentials, have had no meanings attached to them. Our next goal is to define these symbols in such a way that $d y / d x$ can be treated as an actual ratio. To do this, assume that $f$ is differentiable at a point $x$, define $d x$ to be an independent variable that can have any real value, and define $d y$ by the formula

$$
\begin{equation*}
d y=f^{\prime}(x) d x \tag{5}
\end{equation*}
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-148.jpg?height=355&width=473&top_left_y=196&top_left_x=154)
△ Figure 3.5.5

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-148.jpg?height=458&width=415&top_left_y=634&top_left_x=184)
△ Figure 3.5.6

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-148.jpg?height=391&width=477&top_left_y=1173&top_left_x=152)
- Figure 3.5.7

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-148.jpg?height=328&width=495&top_left_y=1653&top_left_x=156)
- Figure 3.5.8

If $d x \neq 0$, then we can divide both sides of (5) by $d x$ to obtain

$$
\begin{equation*}
\frac{d y}{d x}=f^{\prime}(x) \tag{6}
\end{equation*}
$$

Thus, we have achieved our goal of defining $d y$ and $d x$ so their ratio is $f^{\prime}(x)$. Formula (5) is said to express (6) in differential form.

To interpret (5) geometrically, note that $f^{\prime}(x)$ is the slope of the tangent line to the graph of $f$ at $x$. The differentials $d y$ and $d x$ can be viewed as a corresponding rise and run of this tangent line (Figure 3.5.5).

Example 3 Express the derivative with respect to $x$ of $y=x^{2}$ in differential form, and discuss the relationship between $d y$ and $d x$ at $x=1$.

Solution. The derivative of $y$ with respect to $x$ is $d y / d x=2 x$, which can be expressed in differential form as

$$
d y=2 x d x
$$

When $x=1$ this becomes

$$
d y=2 d x
$$

This tells us that if we travel along the tangent line to the curve $y=x^{2}$ at $x=1$, then a change of $d x$ units in $x$ produces a change of $2 d x$ units in $y$. Thus, for example, a run of $d x=2$ units produces a rise of $d y=4$ units along the tangent line (Figure 3.5.6).

It is important to understand the distinction between the increment $\Delta y$ and the differential $d y$. To see the difference, let us assign the independent variables $d x$ and $\Delta x$ the same value, so $d x=\Delta x$. Then $\Delta y$ represents the change in $y$ that occurs when we start at $x$ and travel along the curve $y=f(x)$ until we have moved $\Delta x(=d x)$ units in the $x$-direction, while $d y$ represents the change in $y$ that occurs if we start at $x$ and travel along the tangent line until we have moved $d x(=\Delta x)$ units in the $x$-direction (Figure 3.5.7).

- Example 4 Let $y=\sqrt{x}$. Find $d y$ and $\Delta y$ at $x=4$ with $d x=\Delta x=3$. Then make a sketch of $y=\sqrt{x}$, showing $d y$ and $\Delta y$ in the picture.

Solution. With $f(x)=\sqrt{x}$ we obtain

$$
\Delta y=f(x+\Delta x)-f(x)=\sqrt{x+\Delta x}-\sqrt{x}=\sqrt{7}-\sqrt{4} \approx 0.65
$$

If $y=\sqrt{x}$, then

$$
\frac{d y}{d x}=\frac{1}{2 \sqrt{x}}, \quad \text { so } \quad d y=\frac{1}{2 \sqrt{x}} d x=\frac{1}{2 \sqrt{4}}(3)=\frac{3}{4}=0.75
$$

Figure 3.5.8 shows the curve $y=\sqrt{x}$ together with $d y$ and $\Delta y$.

## LOCAL LINEAR APPROXIMATION FROM THE DIFFERENTIAL POINT OF VIEW

Although $\Delta y$ and $d y$ are generally different, the differential $d y$ will nonetheless be a good approximation of $\Delta y$ provided $d x=\Delta x$ is close to 0 . To see this, recall from Section 2.2 that

$$
f^{\prime}(x)=\lim _{\Delta x \rightarrow 0} \frac{\Delta y}{\Delta x}
$$

It follows that if $\Delta x$ is close to 0 , then we will have $f^{\prime}(x) \approx \Delta y / \Delta x$ or, equivalently,

$$
\Delta y \approx f^{\prime}(x) \Delta x
$$

If we agree to let $d x=\Delta x$, then we can rewrite this as

$$
\begin{equation*}
\Delta y \approx f^{\prime}(x) d x=d y \tag{7}
\end{equation*}
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-149.jpg?height=706&width=465&top_left_y=408&top_left_x=216)
© Michael Newman/PhotoEdit
Real-world measurements inevitably have small errors.

Note that measurement error is positive if the measured value is greater than the exact value and is negative if it is less than the exact value. The sign of the propagated error conveys similar information.

[^0]In words, this states that for values of $d x$ near zero the differential $d y$ closely approximates the increment $\Delta y$ (Figure 3.5.7). But this is to be expected since the graph of the tangent line at $x$ is the local linear approximation of the graph of $f$.

## ERROR PROPAGATION

In real-world applications, small errors in measured quantities will invariably occur. These measurement errors are of importance in scientific research-all scientific measurements come with measurement errors included. For example, your height might be measured as $170 \pm 0.5 \mathrm{~cm}$, meaning that your exact height lies somewhere between 169.5 and 170.5 cm . Researchers often must use these inexactly measured quantities to compute other quantities, thereby propagating the errors from the measured quantities to the computed quantities. This phenomenon is called error propagation. Researchers must be able to estimate errors in the computed quantities. Our goal is to show how to estimate these errors using local linear approximation and differentials. For this purpose, suppose
> $x_{0}$ is the exact value of the quantity being measured $y_{0}=f\left(x_{0}\right)$ is the exact value of the quantity being computed $x$ is the measured value of $x_{0} y=f(x)$ is the computed value of $y$

We define

$$
\begin{aligned}
& d x(=\Delta x)=x-x_{0} \text { to be the measurement error of } x \\
& \Delta y=f(x)-f\left(x_{0}\right) \text { to be the propagated error of } y
\end{aligned}
$$

It follows from (7) with $x_{0}$ replacing $x$ that the propagated error $\Delta y$ can be approximated by

$$
\begin{equation*}
\Delta y \approx d y=f^{\prime}\left(x_{0}\right) d x \tag{8}
\end{equation*}
$$

Unfortunately, there is a practical difficulty in applying this formula since the value of $x_{0}$ is unknown. (Keep in mind that only the measured value $x$ is known to the researcher.) This being the case, it is standard practice in research to use the measured value $x$ in place of $x_{0}$ in (8) and use the approximation

$$
\begin{equation*}
\Delta y \approx d y=f^{\prime}(x) d x \tag{9}
\end{equation*}
$$

for the propagated error.

Example 5 Suppose that the side of a square is measured with a ruler to be 10 inches with a measurement error of at most $\pm \frac{1}{32} \mathrm{in}$. Estimate the error in the computed area of the square.

Solution. Let $x$ denote the exact length of a side and $y$ the exact area so that $y=x^{2}$. It follows from (9) with $f(x)=x^{2}$ that if $d x$ is the measurement error, then the propagated error $\Delta y$ can be approximated as

$$
\Delta y \approx d y=2 x d x
$$

Substituting the measured value $x=10$ into this equation yields

$$
\begin{equation*}
d y=20 d x \tag{10}
\end{equation*}
$$

But to say that the measurement error is at most $\pm \frac{1}{32}$ means that

$$
-\frac{1}{32} \leq d x \leq \frac{1}{32}
$$

Multiplying these inequalities through by 20 and applying (10) yields

$$
20\left(-\frac{1}{32}\right) \leq d y \leq 20\left(\frac{1}{32}\right) \quad \text { or equivalently } \quad-\frac{5}{8} \leq d y \leq \frac{5}{8}
$$

Thus, the propagated error in the area is estimated to be within $\pm \frac{5}{8} \mathrm{in}^{2}$.

Formula (11) tells us that, as a rule of thumb, the percentage error in the computed volume of a sphere is approximately 3 times the percentage error in the measured value of its radius. As a rule of thumb, how is the percentage error in the computed area of a square related to the percentage error in the measured value of a side?

If the true value of a quantity is $q$ and a measurement or calculation produces an error $\Delta q$, then $\Delta q / q$ is called the relative error in the measurement or calculation; when expressed as a percentage, $\Delta q / q$ is called the percentage error. As a practical matter, the true value $q$ is usually unknown, so that the measured or calculated value of $q$ is used instead; and the relative error is approximated by $d q / q$.

Example 6 The radius of a sphere is measured with a percentage error within $\pm 0.04 \%$. Estimate the percentage error in the calculated volume of the sphere.

Solution. The volume $V$ of a sphere is $V=\frac{4}{3} \pi r^{3}$, so

$$
\frac{d V}{d r}=4 \pi r^{2}
$$

from which it follows that $d V=4 \pi r^{2} d r$. Thus, the relative error in $V$ is approximately

$$
\begin{equation*}
\frac{d V}{V}=\frac{4 \pi r^{2} d r}{\frac{4}{3} \pi r^{3}}=3 \frac{d r}{r} \tag{11}
\end{equation*}
$$

We are given that the relative error in the measured value of $r$ is $\pm 0.04 \%$, which means that

$$
-0.0004 \leq \frac{d r}{r} \leq 0.0004
$$

Multiplying these inequalities through by 3 and applying (11) yields

$$
3(-0.0004) \leq \frac{d V}{V} \leq 3(0.0004) \quad \text { or equivalently } \quad-0.0012 \leq \frac{d V}{V} \leq 0.0012
$$

Thus, we estimate the percentage error in the calculated value of $V$ to be within $\pm 0.12 \%$.

## MORE NOTATION; DIFFERENTIAL FORMULAS

The symbol $d f$ is another common notation for the differential of a function $y=f(x)$. For example, if $f(x)=\sin x$, then we can write $d f=\cos x d x$. We can also view the symbol " $d$ " as an operator that acts on a function to produce the corresponding differential. For example, $d\left[x^{2}\right]=2 x d x, d[\sin x]=\cos x d x$, and so on. All of the general rules of differentiation then have corresponding differential versions:

| DERIVATIVE FORMULA | DIFFERENTIAL FORMULA |
| :--- | :--- |
| $\frac{d}{d x}[c]=0$ | $d[c]=0$ |
| $\frac{d}{d x}[c f]=c \frac{d f}{d x}$ | $d[c f]=c d f$ |
| $\frac{d}{d x}[f+g]=\frac{d f}{d x}+\frac{d g}{d x}$ | $d[f+g]=d f+d g$ |
| $\frac{d}{d x}[f g]=f \frac{d g}{d x}+g \frac{d f}{d x}$ | $d[f g]=f d g+g d f$ |
| $\frac{d}{d x}\left[\frac{f}{g}\right]=\frac{g \frac{d f}{d x}-f \frac{d g}{d x}}{g^{2}}$ | $d\left[\frac{f}{g}\right]=\frac{g d f-f d g}{g^{2}}$ |

For example,

$$
\begin{aligned}
d\left[x^{2} \sin x\right] & =\left(x^{2} \cos x+2 x \sin x\right) d x \\
& =x^{2}(\cos x d x)+(2 x d x) \sin x \\
& =x^{2} d[\sin x]+(\sin x) d\left[x^{2}\right]
\end{aligned}
$$

illustrates the differential version of the product rule.

1. The local linear approximation of $f$ at $x_{0}$ uses the line to the graph of $y=f(x)$ at $x=x_{0}$ to approximate values of $\_\_\_\_$ for values of $x$ near $\_\_\_\_$ .
2. Find an equation for the local linear approximation to $y=5-x^{2}$ at $x_{0}=2$.
3. Let $y=5-x^{2}$. Find $d y$ and $\Delta y$ at $x=2$ with $d x=\Delta x=0.1$.
4. The intensity of light from a light source is a function $I=f(x)$ of the distance $x$ from the light source. Suppose that a small gemstone is measured to be 10 m from a light source, $f(10)=0.2 \mathrm{~W} / \mathrm{m}^{2}$, and $f^{\prime}(10)=-0.04 \mathrm{~W} / \mathrm{m}^{3}$. If the distance $x=10 \mathrm{~m}$ was obtained with a measurement error within $\pm 0.05 \mathrm{~m}$, estimate the percentage error in the calculated intensity of the light on the gemstone.

## EXERCISE SET 3.5 Graphing Utility

1. (a) Use Formula (1) to obtain the local linear approximation of $x^{3}$ at $x_{0}=1$.
(b) Use Formula (2) to rewrite the approximation obtained in part (a) in terms of $\Delta x$.
(c) Use the result obtained in part (a) to approximate $(1.02)^{3}$, and confirm that the formula obtained in part (b) produces the same result.
2. (a) Use Formula (1) to obtain the local linear approximation of $1 / x$ at $x_{0}=2$.
(b) Use Formula (2) to rewrite the approximation obtained in part (a) in terms of $\Delta x$.
(c) Use the result obtained in part (a) to approximate 1/2.05, and confirm that the formula obtained in part (b) produces the same result.

## FOCUS ON CONCEPTS

3. (a) Find the local linear approximation of the function $f(x)=\sqrt{1+x}$ at $x_{0}=0$, and use it to approximate $\sqrt{0.9}$ and $\sqrt{1.1}$.
(b) Graph $f$ and its tangent line at $x_{0}$ together, and use the graphs to illustrate the relationship between the exact values and the approximations of $\sqrt{0.9}$ and $\sqrt{1.1}$.
4. A student claims that whenever a local linear approximation is used to approximate the square root of a number, the approximation is too large.
(a) Write a few sentences that make the student's claim precise, and justify this claim geometrically.
(b) Verify the student's claim algebraically using approximation (1).

5-10 Confirm that the stated formula is the local linear approximation at $x_{0}=0$.
5. $(1+x)^{15} \approx 1+15 x$
6. $\frac{1}{\sqrt{1-x}} \approx 1+\frac{1}{2} x$
7. $\tan x \approx x$
8. $\frac{1}{1+x} \approx 1-x$
9. $e^{x} \approx 1+x$
10. $\ln (1+x) \approx x$

11-16 Confirm that the stated formula is the local linear approximation of $f$ at $x_{0}=1$, where $\Delta x=x-1$.
11. $f(x)=x^{4} ;(1+\Delta x)^{4} \approx 1+4 \Delta x$
12. $f(x)=\sqrt{x} ; \sqrt{1+\Delta x} \approx 1+\frac{1}{2} \Delta x$
13. $f(x)=\frac{1}{2+x} ; \frac{1}{3+\Delta x} \approx \frac{1}{3}-\frac{1}{9} \Delta x$
14. $f(x)=(4+x)^{3} ;(5+\Delta x)^{3} \approx 125+75 \Delta x$
15. $\tan ^{-1} x ; \tan ^{-1}(1+\Delta x) \approx \frac{\pi}{4}+\frac{1}{2} \Delta x$
16. $\sin ^{-1}\left(\frac{x}{2}\right) ; \sin ^{-1}\left(\frac{1}{2}+\frac{1}{2} \Delta x\right) \approx \frac{\pi}{6}+\frac{1}{\sqrt{3}} \Delta x$

17-20 Confirm that the formula is the local linear approximation at $x_{0}=0$, and use a graphing utility to estimate an interval of $x$-values on which the error is at most $\pm 0.1$.
17. $\sqrt{x+3} \approx \sqrt{3}+\frac{1}{2 \sqrt{3}} x$
18. $\frac{1}{\sqrt{9-x}} \approx \frac{1}{3}+\frac{1}{54} x$
19. $\tan 2 x \approx 2 x$
20. $\frac{1}{(1+2 x)^{5}} \approx 1-10 x$
21. (a) Use the local linear approximation of $\sin x$ at $x_{0}=0$ obtained in Example 2 to approximate $\sin 1^{\circ}$, and compare the approximation to the result produced directly by your calculating device.
(b) How would you choose $x_{0}$ to approximate $\sin 44^{\circ}$ ?
(c) Approximate $\sin 44^{\circ}$; compare the approximation to the result produced directly by your calculating device.
22. (a) Use the local linear approximation of $\tan x$ at $x_{0}=0$ to approximate $\tan 2^{\circ}$, and compare the approximation to the result produced directly by your calculating device.
(b) How would you choose $x_{0}$ to approximate $\tan 61^{\circ}$ ?
(c) Approximate $\tan 61^{\circ}$; compare the approximation to the result produced directly by your calculating device.

23-31 Use an appropriate local linear approximation to estimate the value of the given quantity.
23. $(3.02)^{4}$
24. $(1.97)^{3}$
25. $\sqrt{65}$
26. $\sqrt{24}$
27. $\sqrt{80.9}$
28. $\sqrt{36.03}$
29. $\sin 0.1$
30. $\tan 0.2$
31. $\cos 31^{\circ}$
32. $\ln (1.01)$
33. $\tan ^{-1}(0.99)$

## FOCUS ON CONCEPTS

34. The approximation $(1+x)^{k} \approx 1+k x$ is commonly used by engineers for quick calculations.
(a) Derive this result, and use it to make a rough estimate of $(1.001)^{37}$.
(b) Compare your estimate to that produced directly by your calculating device.
(c) If $k$ is a positive integer, how is the approximation $(1+x)^{k} \approx 1+k x$ related to the expansion of $(1+x)^{k}$ using the binomial theorem?
35. Use the approximation $(1+x)^{k} \approx 1+k x$, along with some mental arithmetic to show that $\sqrt[3]{8.24} \approx 2.02$ and $4.08^{3 / 2} \approx 8.24$.
36. Referring to the accompanying figure, suppose that the angle of elevation of the top of the building, as measured from a point 500 ft from its base, is found to be $\theta=6^{\circ}$. Use an appropriate local linear approximation, along with some mental arithmetic to show that the building is about 52 ft high.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-152.jpg?height=105&width=455&top_left_y=1227&top_left_x=240)
Figure Ex-36

37. (a) Let $y=x^{2}$. Find $d y$ and $\Delta y$ at $x=2$ with $d x=\Delta x=1$.
(b) Sketch the graph of $y=x^{2}$, showing $d y$ and $\Delta y$ in the picture.
38. (a) Let $y=x^{3}$. Find $d y$ and $\Delta y$ at $x=1$ with $d x=\Delta x=1$.
(b) Sketch the graph of $y=x^{3}$, showing $d y$ and $\Delta y$ in the picture.

39-42 Find formulas for $d y$ and $\Delta y$.
39. $y=x^{3}$
40. $y=8 x-4$
41. $y=x^{2}-2 x+1$
42. $y=\sin x$

43-46 Find the differential $d y$.
43. (a) $y=4 x^{3}-7 x^{2}$
(b) $y=x \cos x$
44. (a) $y=1 / x$
(b) $y=5 \tan x$
45. (a) $y=x \sqrt{1-x}$
(b) $y=(1+x)^{-17}$
46.
(a) $y=\frac{1}{x^{3}-1}$
(b) $y=\frac{1-x^{3}}{2-x}$

47-50 True-False Determine whether the statement is true or false. Explain your answer.
47. A differential $d y$ is defined to be a very small change in $y$.
48. The error in approximation (2) is the same as the error in approximation (7).
49. A local linear approximation to a function can never be identically equal to the function.
50. A local linear approximation to a nonconstant function can never be constant.

51-54 Use the differential $d y$ to approximate $\Delta y$ when $x$ changes as indicated.
51. $y=\sqrt{3 x-2}$; from $x=2$ to $x=2.03$
52. $y=\sqrt{x^{2}+8}$; from $x=1$ to $x=0.97$
53. $y=\frac{x}{x^{2}+1}$; from $x=2$ to $x=1.96$
54. $y=x \sqrt{8 x+1}$; from $x=3$ to $x=3.05$
55. The side of a square is measured to be 10 ft , with a possible error of $\pm 0.1 \mathrm{ft}$.
(a) Use differentials to estimate the error in the calculated area.
(b) Estimate the percentage errors in the side and the area.
56. The side of a cube is measured to be 25 cm , with a possible error of $\pm 1 \mathrm{~cm}$.
(a) Use differentials to estimate the error in the calculated volume.
(b) Estimate the percentage errors in the side and volume.
57. The hypotenuse of a right triangle is known to be 10 in exactly, and one of the acute angles is measured to be $30^{\circ}$, with a possible error of $\pm 1^{\circ}$.
(a) Use differentials to estimate the errors in the sides opposite and adjacent to the measured angle.
(b) Estimate the percentage errors in the sides.
58. One side of a right triangle is known to be 25 cm exactly. The angle opposite to this side is measured to be $60^{\circ}$, with a possible error of $\pm 0.5^{\circ}$.
(a) Use differentials to estimate the errors in the adjacent side and the hypotenuse.
(b) Estimate the percentage errors in the adjacent side and hypotenuse.
59. The electrical resistance $R$ of a certain wire is given by $R=k / r^{2}$, where $k$ is a constant and $r$ is the radius of the wire. Assuming that the radius $r$ has a possible error of $\pm 5 \%$, use differentials to estimate the percentage error in $R$. (Assume $k$ is exact.)
60. A 12-foot ladder leaning against a wall makes an angle $\theta$ with the floor. If the top of the ladder is $h$ feet up the wall, express $h$ in terms of $\theta$ and then use $d h$ to estimate the change in $h$ if $\theta$ changes from $60^{\circ}$ to $59^{\circ}$.
61. The area of a right triangle with a hypotenuse of $H$ is calculated using the formula $A=\frac{1}{4} H^{2} \sin 2 \theta$, where $\theta$ is one of the acute angles. Use differentials to approximate the error in calculating $A$ if $H=4 \mathrm{~cm}$ (exactly) and $\theta$ is measured to be $30^{\circ}$, with a possible error of $\pm 15^{\prime}$.
62. The side of a square is measured with a possible percentage error of $\pm 1 \%$. Use differentials to estimate the percentage error in the area.
63. The side of a cube is measured with a possible percentage error of $\pm 2 \%$. Use differentials to estimate the percentage error in the volume.
64. The volume of a sphere is to be computed from a measured value of its radius. Estimate the maximum permissible percentage error in the measurement if the percentage error in the volume must be kept within $\pm 3 \%$. ( $V=\frac{4}{3} \pi r^{3}$ is the volume of a sphere of radius $r$.)
65. The area of a circle is to be computed from a measured value of its diameter. Estimate the maximum permissible percentage error in the measurement if the percentage error in the area must be kept within $\pm 1 \%$.
66. A steel cube with 1 -inch sides is coated with 0.01 inch of copper. Use differentials to estimate the volume of copper in the coating. [Hint: Let $\Delta V$ be the change in the volume of the cube.]
67. A metal rod 15 cm long and 5 cm in diameter is to be covered (except for the ends) with insulation that is 0.1 cm thick. Use differentials to estimate the volume of insulation. [Hint: Let $\Delta V$ be the change in volume of the rod.]
68. The time required for one complete oscillation of a pendulum is called its period. If $L$ is the length of the pendulum and the oscillation is small, then the period is given by $P=2 \pi \sqrt{L / g}$, where $g$ is the constant acceleration due to gravity. Use differentials to show that the percentage error in $P$ is approximately half the percentage error in $L$.
69. If the temperature $T$ of a metal rod of length $L$ is changed by an amount $\Delta T$, then the length will change by the amount $\Delta L=\alpha L \Delta T$, where $\alpha$ is called the coefficient of linear expansion. For moderate changes in temperature $\alpha$ is taken as constant.
(a) Suppose that a rod 40 cm long at $20^{\circ} \mathrm{C}$ is found to be 40.006 cm long when the temperature is raised to $30^{\circ} \mathrm{C}$. Find $\alpha$.
(b) If an aluminum pole is 180 cm long at $15^{\circ} \mathrm{C}$, how long is the pole if the temperature is raised to $40^{\circ} \mathrm{C}$ ? [Take $\alpha=2.3 \times 10^{-5} /{ }^{\circ} \mathrm{C}$.]
70. If the temperature $T$ of a solid or liquid of volume $V$ is changed by an amount $\Delta T$, then the volume will change by the amount $\Delta V=\beta V \Delta T$, where $\beta$ is called the coefficient of volume expansion. For moderate changes in temperature $\beta$ is taken as constant. Suppose that a tank truck loads 4000 gallons of ethyl alcohol at a temperature of $35^{\circ} \mathrm{C}$ and delivers its load sometime later at a temperature of $15^{\circ} \mathrm{C}$. Using $\beta=7.5 \times 10^{-4} /{ }^{\circ} \mathrm{C}$ for ethyl alcohol, find the number of gallons delivered.
71. Writing Explain why the local linear approximation of a function value is equivalent to the use of a differential to approximate a change in the function.
72. Writing The local linear approximation

$$
\sin x \approx x
$$

is known as the small angle approximation and has both practical and theoretical applications. Do some research on some of these applications, and write a short report on the results of your investigations.

## QUICK CHECK ANSWERS 3.5

1. tangent; $f(x) ; x_{0}$
2. $y=1+(-4)(x-2)$ or $y=-4 x+9$
3. $d y=-0.4, \Delta y=-0.41$
4. within $\pm 1 \%$

### 3.6 L'HÔPITAL'S RULE; INDETERMINATE FORMS

In this section we will discuss a general method for using derivatives to find limits. This method will enable us to establish limits with certainty that earlier in the text we were only able to conjecture using numerical or graphical evidence. The method that we will discuss in this section is an extremely powerful tool that is used internally by many computer programs to calculate limits of various types.

## INDETERMINATE FORMS OF TYPE 0/0

Recall that a limit of the form

$$
\begin{equation*}
\lim _{x \rightarrow a} \frac{f(x)}{g(x)} \tag{1}
\end{equation*}
$$

in which $f(x) \rightarrow 0$ and $g(x) \rightarrow 0$ as $x \rightarrow a$ is called an indeterminate form of type $\mathbf{0} / \mathbf{0}$. Some examples encountered earlier in the text are

$$
\lim _{x \rightarrow 1} \frac{x^{2}-1}{x-1}=2, \quad \lim _{x \rightarrow 0} \frac{\sin x}{x}=1, \quad \lim _{x \rightarrow 0} \frac{1-\cos x}{x}=0
$$

## WARNING

Note that in L'Hôpital's rule the numerator and denominator are differentiated individually. This is not the same as differentiating $f(x) / g(x)$.

The first limit was obtained algebraically by factoring the numerator and canceling the common factor of $x-1$, and the second two limits were obtained using geometric methods. However, there are many indeterminate forms for which neither algebraic nor geometric methods will produce the limit, so we need to develop a more general method.

To motivate such a method, suppose that (1) is an indeterminate form of type $0 / 0$ in which $f^{\prime}$ and $g^{\prime}$ are continuous at $x=a$ and $g^{\prime}(a) \neq 0$. Since $f$ and $g$ can be closely approximated by their local linear approximations near $a$, it is reasonable to expect that

$$
\begin{equation*}
\lim _{x \rightarrow a} \frac{f(x)}{g(x)}=\lim _{x \rightarrow a} \frac{f(a)+f^{\prime}(a)(x-a)}{g(a)+g^{\prime}(a)(x-a)} \tag{2}
\end{equation*}
$$

Since we are assuming that $f^{\prime}$ and $g^{\prime}$ are continuous at $x=a$, we have

$$
\lim _{x \rightarrow a} f^{\prime}(x)=f^{\prime}(a) \quad \text { and } \quad \lim _{x \rightarrow a} g^{\prime}(x)=g^{\prime}(a)
$$

and since the differentiability of $f$ and $g$ at $x=a$ implies the continuity of $f$ and $g$ at $x=a$, we have

$$
f(a)=\lim _{x \rightarrow a} f(x)=0 \quad \text { and } \quad g(a)=\lim _{x \rightarrow a} g(x)=0
$$

Thus, we can rewrite (2) as

$$
\begin{equation*}
\lim _{x \rightarrow a} \frac{f(x)}{g(x)}=\lim _{x \rightarrow a} \frac{f^{\prime}(a)(x-a)}{g^{\prime}(a)(x-a)}=\lim _{x \rightarrow a} \frac{f^{\prime}(a)}{g^{\prime}(a)}=\lim _{x \rightarrow a} \frac{f^{\prime}(x)}{g^{\prime}(x)} \tag{3}
\end{equation*}
$$

This result, called L'Hôpital's rule, converts the given indeterminate form into a limit involving derivatives that is often easier to evaluate.

Although we motivated (3) by assuming that $f$ and $g$ have continuous derivatives at $x=a$ and that $g^{\prime}(a) \neq 0$, the result is true under less stringent conditions and is also valid for one-sided limits and limits at $+\infty$ and $-\infty$. The proof of the following precise statement of L'Hôpital's rule is omitted.
3.6.1 THEOREM (L'Hôpital's Rule for Form 0/0) Suppose that $f$ and $g$ are differentiable functions on an open interval containing $x=a$, except possibly at $x=a$, and that

$$
\lim _{x \rightarrow a} f(x)=0 \quad \text { and } \quad \lim _{x \rightarrow a} g(x)=0
$$

If $\lim _{x \rightarrow a}\left[f^{\prime}(x) / g^{\prime}(x)\right]$ exists, or if this limit is $+\infty$ or $-\infty$, then

$$
\lim _{x \rightarrow a} \frac{f(x)}{g(x)}=\lim _{x \rightarrow a} \frac{f^{\prime}(x)}{g^{\prime}(x)}
$$

Moreover, this statement is also true in the case of a limit as $x \rightarrow a^{-}, x \rightarrow a^{+}, x \rightarrow-\infty$, or as $x \rightarrow+\infty$.

In the examples that follow we will apply L'Hôpital's rule using the following three-step process:

## Applying L'Hôpital's Rule

Step 1. Check that the limit of $f(x) / g(x)$ is an indeterminate form of type $0 / 0$.
Step 2. Differentiate $f$ and $g$ separately.
Step 3. Find the limit of $f^{\prime}(x) / g^{\prime}(x)$. If this limit is finite, $+\infty$, or $-\infty$, then it is equal to the limit of $f(x) / g(x)$.

The limit in Example 1 can be interpreted as the limit form of a certain derivative. Use that derivative to evaluate the limit.

## WARNING

Applying L'Hôpital's rule to limits that are not indeterminate forms can produce incorrect results. For example, the computation

$$
\begin{aligned}
\lim _{x \rightarrow 0} \frac{x+6}{x+2} & =\lim _{x \rightarrow 0} \frac{\frac{d}{d x}[x+6]}{\frac{d}{d x}[x+2]} \\
& =\lim _{x \rightarrow 0} \frac{1}{1}=1
\end{aligned}
$$

is not valid, since the limit is not an indeterminate form. The correct result is

$$
\lim _{x \rightarrow 0} \frac{x+6}{x+2}=\frac{0+6}{0+2}=3
$$

Example 1 Find the limit

$$
\lim _{x \rightarrow 2} \frac{x^{2}-4}{x-2}
$$

using L'Hôpital's rule, and check the result by factoring.
Solution. The numerator and denominator have a limit of 0 , so the limit is an indeterminate form of type 0/0. Applying L'Hôpital's rule yields

$$
\lim _{x \rightarrow 2} \frac{x^{2}-4}{x-2}=\lim _{x \rightarrow 2} \frac{\frac{d}{d x}\left[x^{2}-4\right]}{\frac{d}{d x}[x-2]}=\lim _{x \rightarrow 2} \frac{2 x}{1}=4
$$

This agrees with the computation

$$
\lim _{x \rightarrow 2} \frac{x^{2}-4}{x-2}=\lim _{x \rightarrow 2} \frac{(x-2)(x+2)}{x-2}=\lim _{x \rightarrow 2}(x+2)=4
$$

Example 2 In each part confirm that the limit is an indeterminate form of type $0 / 0$, and evaluate it using L'Hôpital's rule.
(a) $\lim _{x \rightarrow 0} \frac{\sin 2 x}{x}$
(b) $\lim _{x \rightarrow \pi / 2} \frac{1-\sin x}{\cos x}$
(c) $\lim _{x \rightarrow 0} \frac{e^{x}-1}{x^{3}}$
(d) $\lim _{x \rightarrow 0^{-}} \frac{\tan x}{x^{2}}$
(e) $\lim _{x \rightarrow 0} \frac{1-\cos x}{x^{2}}$
(f) $\lim _{x \rightarrow+\infty} \frac{x^{-4 / 3}}{\sin (1 / x)}$

Solution (a). The numerator and denominator have a limit of 0 , so the limit is an indeterminate form of type 0/0. Applying L'Hôpital's rule yields

$$
\lim _{x \rightarrow 0} \frac{\sin 2 x}{x}=\lim _{x \rightarrow 0} \frac{\frac{d}{d x}[\sin 2 x]}{\frac{d}{d x}[x]}=\lim _{x \rightarrow 0} \frac{2 \cos 2 x}{1}=2
$$

Observe that this result agrees with that obtained by substitution in Example 4(b) of Section 1.6.

Solution (b). The numerator and denominator have a limit of 0 , so the limit is an indeterminate form of type $0 / 0$. Applying L'Hôpital's rule yields

$$
\lim _{x \rightarrow \pi / 2} \frac{1-\sin x}{\cos x}=\lim _{x \rightarrow \pi / 2} \frac{\frac{d}{d x}[1-\sin x]}{\frac{d}{d x}[\cos x]}=\lim _{x \rightarrow \pi / 2} \frac{-\cos x}{-\sin x}=\frac{0}{-1}=0
$$

Guillaume François Antoine de L'Hôpital (1661-1704) French mathematician. L'Hôpital, born to parents of the French high nobility, held the title of Marquis de SainteMesme Comte d'Autrement. He showed mathematical talent quite early and at age 15 solved a difficult problem about cycloids posed by Pascal. As a young man he served briefly as a cavalry officer, but resigned because of nearsightedness. In his own time he gained fame as the author of the first textbook ever published on differential calculus, L'Analyse des

Infiniment Petits pour l'Intelligence des Lignes Courbes (1696). L'Hôpital's rule appeared for the first time in that book. Actually, L'Hôpital's rule and most of the material in the calculus text were due to John Bernoulli, who was L'Hôpital's teacher. L'Hôpital dropped his plans for a book on integral calculus when Leibniz informed him that he intended to write such a text. L'Hôpital was apparently generous and personable, and his many contacts with major mathematicians provided the vehicle for disseminating major discoveries in calculus throughout Europe.

Solution ( $\boldsymbol{c}$ ). The numerator and denominator have a limit of 0 , so the limit is an indeterminate form of type $0 / 0$. Applying L'Hôpital's rule yields

$$
\lim _{x \rightarrow 0} \frac{e^{x}-1}{x^{3}}=\lim _{x \rightarrow 0} \frac{\frac{d}{d x}\left[e^{x}-1\right]}{\frac{d}{d x}\left[x^{3}\right]}=\lim _{x \rightarrow 0} \frac{e^{x}}{3 x^{2}}=+\infty
$$

Solution (d). The numerator and denominator have a limit of 0 , so the limit is an indeterminate form of type 0/0. Applying L'Hôpital's rule yields

$$
\lim _{x \rightarrow 0^{-}} \frac{\tan x}{x^{2}}=\lim _{x \rightarrow 0^{-}} \frac{\sec ^{2} x}{2 x}=-\infty
$$

Solution (e). The numerator and denominator have a limit of 0 , so the limit is an indeterminate form of type 0/0. Applying L'Hôpital's rule yields

$$
\lim _{x \rightarrow 0} \frac{1-\cos x}{x^{2}}=\lim _{x \rightarrow 0} \frac{\sin x}{2 x}
$$

Since the new limit is another indeterminate form of type $0 / 0$, we apply L'Hôpital's rule again:

$$
\lim _{x \rightarrow 0} \frac{1-\cos x}{x^{2}}=\lim _{x \rightarrow 0} \frac{\sin x}{2 x}=\lim _{x \rightarrow 0} \frac{\cos x}{2}=\frac{1}{2}
$$

Solution ( $f$ ). The numerator and denominator have a limit of 0 , so the limit is an indeterminate form of type 0/0. Applying L'Hôpital's rule yields

$$
\lim _{x \rightarrow+\infty} \frac{x^{-4 / 3}}{\sin (1 / x)}=\lim _{x \rightarrow+\infty} \frac{-\frac{4}{3} x^{-7 / 3}}{\left(-1 / x^{2}\right) \cos (1 / x)}=\lim _{x \rightarrow+\infty} \frac{\frac{4}{3} x^{-1 / 3}}{\cos (1 / x)}=\frac{0}{1}=0
$$

## INDETERMINATE FORMS OF TYPE $\infty / \infty$

When we want to indicate that the limit (or a one-sided limit) of a function is $+\infty$ or $-\infty$ without being specific about the sign, we will say that the limit is $\infty$. For example,

$$
\begin{array}{ccccc}
\lim _{x \rightarrow a^{+}} f(x)=\infty & \text { means } & \lim _{x \rightarrow a^{+}} f(x)=+\infty & \text { or } & \lim _{x \rightarrow a^{+}} f(x)=-\infty \\
\lim _{x \rightarrow+\infty} f(x)=\infty & \text { means } & \lim _{x \rightarrow+\infty} f(x)=+\infty & \text { or } & \lim _{x \rightarrow+\infty} f(x)=-\infty \\
\lim _{x \rightarrow a} f(x)=\infty & \text { means } & \lim _{x \rightarrow a^{+}} f(x)= \pm \infty & \text { and } & \lim _{x \rightarrow a^{-}} f(x)= \pm \infty
\end{array}
$$

The limit of a ratio, $f(x) / g(x)$, in which the numerator has limit $\infty$ and the denominator has limit $\infty$ is called an indeterminate form of type $\infty / \infty$. The following version of L'Hôpital's rule, which we state without proof, can often be used to evaluate limits of this type.
3.6.2 THEOREM (L'Hôpital's Rule for Form $\infty / \infty$ ) Suppose that $f$ and $g$ are differentiable functions on an open interval containing $x=a$, except possibly at $x=a$, and that

$$
\lim _{x \rightarrow a} f(x)=\infty \quad \text { and } \quad \lim _{x \rightarrow a} g(x)=\infty
$$

If $\lim _{x \rightarrow a}\left[f^{\prime}(x) / g^{\prime}(x)\right]$ exists, or if this limit is $+\infty$ or $-\infty$, then

$$
\lim _{x \rightarrow a} \frac{f(x)}{g(x)}=\lim _{x \rightarrow a} \frac{f^{\prime}(x)}{g^{\prime}(x)}
$$

Moreover, this statement is also true in the case of a limit as $x \rightarrow a^{-}, x \rightarrow a^{+}, x \rightarrow-\infty$, or as $x \rightarrow+\infty$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-157.jpg?height=866&width=389&top_left_y=1507&top_left_x=248)
- Figure 3.6.1

- Example 3 In each part confirm that the limit is an indeterminate form of type $\infty / \infty$ and apply L'Hôpital's rule.
(a) $\lim _{x \rightarrow+\infty} \frac{x}{e^{x}}$
(b) $\lim _{x \rightarrow 0^{+}} \frac{\ln x}{\csc x}$

Solution (a). The numerator and denominator both have a limit of $+\infty$, so we have an indeterminate form of type $\infty / \infty$. Applying L'Hôpital's rule yields

$$
\lim _{x \rightarrow+\infty} \frac{x}{e^{x}}=\lim _{x \rightarrow+\infty} \frac{1}{e^{x}}=0
$$

Solution (b). The numerator has a limit of $-\infty$ and the denominator has a limit of $+\infty$, so we have an indeterminate form of type $\infty / \infty$. Applying L'Hôpital's rule yields

$$
\begin{equation*}
\lim _{x \rightarrow 0^{+}} \frac{\ln x}{\csc x}=\lim _{x \rightarrow 0^{+}} \frac{1 / x}{-\csc x \cot x} \tag{4}
\end{equation*}
$$

This last limit is again an indeterminate form of type $\infty / \infty$. Moreover, any additional applications of L'Hôpital's rule will yield powers of $1 / x$ in the numerator and expressions involving $\csc x$ and $\cot x$ in the denominator; thus, repeated application of L'Hôpital's rule simply produces new indeterminate forms. We must try something else. The last limit in (4) can be rewritten as

$$
\lim _{x \rightarrow 0^{+}}\left(-\frac{\sin x}{x} \tan x\right)=-\lim _{x \rightarrow 0^{+}} \frac{\sin x}{x} \cdot \lim _{x \rightarrow 0^{+}} \tan x=-(1)(0)=0
$$

Thus,

$$
\lim _{x \rightarrow 0^{+}} \frac{\ln x}{\csc x}=0
$$

## ANALYZING THE GROWTH OF EXPONENTIAL FUNCTIONS USING L'HÔPITAL'S RULE

If $n$ is any positive integer, then $x^{n} \rightarrow+\infty$ as $x \rightarrow+\infty$. Such integer powers of $x$ are sometimes used as "measuring sticks" to describe how rapidly other functions grow. For example, we know that $e^{x} \rightarrow+\infty$ as $x \rightarrow+\infty$ and that the growth of $e^{x}$ is very rapid (Table 0.5.5); however, the growth of $x^{n}$ is also rapid when $n$ is a high power, so it is reasonable to ask whether high powers of $x$ grow more or less rapidly than $e^{x}$. One way to investigate this is to examine the behavior of the ratio $x^{n} / e^{x}$ as $x \rightarrow+\infty$. For example, Figure 3.6.1a shows the graph of $y=x^{5} / e^{x}$. This graph suggests that $x^{5} / e^{x} \rightarrow 0$ as $x \rightarrow+\infty$, and this implies that the growth of the function $e^{x}$ is sufficiently rapid that its values eventually overtake those of $x^{5}$ and force the ratio toward zero. Stated informally, " $e^{x}$ eventually grows more rapidly than $x^{5}$." The same conclusion could have been reached by putting $e^{x}$ on top and examining the behavior of $e^{x} / x^{5}$ as $x \rightarrow+\infty$ (Figure 3.6.1b). In this case the values of $e^{x}$ eventually overtake those of $x^{5}$ and force the ratio toward $+\infty$. More generally, we can use L'Hôpital's rule to show that $e^{x}$ eventually grows more rapidly than any positive integer power of $x$, that is,

$$
\begin{equation*}
\lim _{x \rightarrow+\infty} \frac{x^{n}}{e^{x}}=0 \quad \text { and } \quad \lim _{x \rightarrow+\infty} \frac{e^{x}}{x^{n}}=+\infty \tag{5-6}
\end{equation*}
$$

Both limits are indeterminate forms of type $\infty / \infty$ that can be evaluated using L'Hôpital's rule. For example, to establish (5), we will need to apply L'Hôpital's rule $n$ times. For this purpose, observe that successive differentiations of $x^{n}$ reduce the exponent by 1 each time, thus producing a constant for the $n$th derivative. For example, the successive derivatives
of $x^{3}$ are $3 x^{2}, 6 x$, and 6. In general, the $n$th derivative of $x^{n}$ is $n(n-1)(n-2) \cdots 1=n!$ (verify). ${ }^{*}$ Thus, applying L'Hôpital's rule $n$ times to (5) yields

$$
\lim _{x \rightarrow+\infty} \frac{x^{n}}{e^{x}}=\lim _{x \rightarrow+\infty} \frac{n!}{e^{x}}=0
$$

Limit (6) can be established similarly.

## INDETERMINATE FORMS OF TYPE $0 \cdot \infty$

Thus far we have discussed indeterminate forms of type $0 / 0$ and $\infty / \infty$. However, these are not the only possibilities; in general, the limit of an expression that has one of the forms

$$
\frac{f(x)}{g(x)}, \quad f(x) \cdot g(x), \quad f(x)^{g(x)}, \quad f(x)-g(x), \quad f(x)+g(x)
$$

is called an indeterminate form if the limits of $f(x)$ and $g(x)$ individually exert conflicting influences on the limit of the entire expression. For example, the limit

$$
\lim _{x \rightarrow 0^{+}} x \ln x
$$

is an indeterminate form of type $\mathbf{0} \cdot \infty$ because the limit of the first factor is 0 , the limit of the second factor is $-\infty$, and these two limits exert conflicting influences on the product. On the other hand, the limit

$$
\lim _{x \rightarrow+\infty}\left[\sqrt{x}\left(1-x^{2}\right)\right]
$$

is not an indeterminate form because the first factor has a limit of $+\infty$, the second factor has a limit of $-\infty$, and these influences work together to produce a limit of $-\infty$ for the product.

Indeterminate forms of type $0 \cdot \infty$ can sometimes be evaluated by rewriting the product as a ratio, and then applying L'Hôpital's rule for indeterminate forms of type $0 / 0$ or $\infty / \infty$.

## WARNING

It is tempting to argue that an indeterminate form of type $0 \cdot \infty$ has value 0 since "zero times anything is zero." However, this is fallacious since $0 \cdot \infty$ is not a product of numbers, but rather a statement about limits. For example, here are two indeterminate forms of type $0 \cdot \infty$ whose limits are not zero:

$$
\begin{aligned}
\lim _{x \rightarrow 0}\left(x \cdot \frac{1}{x}\right) & =\lim _{x \rightarrow 0} 1=1 \\
\lim _{x \rightarrow 0^{+}}\left(\sqrt{x} \cdot \frac{1}{x}\right) & =\lim _{x \rightarrow 0^{+}}\left(\frac{1}{\sqrt{x}}\right) \\
& =+\infty
\end{aligned}
$$

## Example 4 Evaluate

(a) $\lim _{x \rightarrow 0^{+}} x \ln x$
(b) $\lim _{x \rightarrow \pi / 4}(1-\tan x) \sec 2 x$

Solution (a). The factor $x$ has a limit of 0 and the factor $\ln x$ has a limit of $-\infty$, so the stated problem is an indeterminate form of type $0 \cdot \infty$. There are two possible approaches: we can rewrite the limit as

$$
\lim _{x \rightarrow 0^{+}} \frac{\ln x}{1 / x} \quad \text { or } \quad \lim _{x \rightarrow 0^{+}} \frac{x}{1 / \ln x}
$$

the first being an indeterminate form of type $\infty / \infty$ and the second an indeterminate form of type $0 / 0$. However, the first form is the preferred initial choice because the derivative of $1 / x$ is less complicated than the derivative of $1 / \ln x$. That choice yields

$$
\lim _{x \rightarrow 0^{+}} x \ln x=\lim _{x \rightarrow 0^{+}} \frac{\ln x}{1 / x}=\lim _{x \rightarrow 0^{+}} \frac{1 / x}{-1 / x^{2}}=\lim _{x \rightarrow 0^{+}}(-x)=0
$$

Solution (b). The stated problem is an indeterminate form of type $0 \cdot \infty$. We will convert it to an indeterminate form of type 0/0:

$$
\begin{aligned}
\lim _{x \rightarrow \pi / 4}(1-\tan x) \sec 2 x & =\lim _{x \rightarrow \pi / 4} \frac{1-\tan x}{1 / \sec 2 x}=\lim _{x \rightarrow \pi / 4} \frac{1-\tan x}{\cos 2 x} \\
& =\lim _{x \rightarrow \pi / 4} \frac{-\sec ^{2} x}{-2 \sin 2 x}=\frac{-2}{-2}=1
\end{aligned}
$$

[^1]
## INDETERMINATE FORMS OF TYPE $\infty-\infty$

A limit problem that leads to one of the expressions

$$
\begin{array}{ll}
(+\infty)-(+\infty), & (-\infty)-(-\infty), \\
(+\infty)+(-\infty), & (-\infty)+(+\infty)
\end{array}
$$

is called an indeterminate form of type $\infty-\infty$. Such limits are indeterminate because the two terms exert conflicting influences on the expression: one pushes it in the positive direction and the other pushes it in the negative direction. However, limit problems that lead to one of the expressions

$$
\begin{array}{ll}
(+\infty)+(+\infty), & (+\infty)-(-\infty), \\
(-\infty)+(-\infty), & (-\infty)-(+\infty)
\end{array}
$$

are not indeterminate, since the two terms work together (those on the top produce a limit of $+\infty$ and those on the bottom produce a limit of $-\infty$ ).

Indeterminate forms of type $\infty-\infty$ can sometimes be evaluated by combining the terms and manipulating the result to produce an indeterminate form of type $0 / 0$ or $\infty / \infty$.

- Example 5 Evaluate $\lim _{x \rightarrow 0^{+}}\left(\frac{1}{x}-\frac{1}{\sin x}\right)$.

Solution. Both terms have a limit of $+\infty$, so the stated problem is an indeterminate form of type $\infty-\infty$. Combining the two terms yields

$$
\lim _{x \rightarrow 0^{+}}\left(\frac{1}{x}-\frac{1}{\sin x}\right)=\lim _{x \rightarrow 0^{+}} \frac{\sin x-x}{x \sin x}
$$

which is an indeterminate form of type $0 / 0$. Applying L'Hôpital's rule twice yields

$$
\begin{aligned}
\lim _{x \rightarrow 0^{+}} \frac{\sin x-x}{x \sin x} & =\lim _{x \rightarrow 0^{+}} \frac{\cos x-1}{\sin x+x \cos x} \\
& =\lim _{x \rightarrow 0^{+}} \frac{-\sin x}{\cos x+\cos x-x \sin x}=\frac{0}{2}=0
\end{aligned}
$$

## INDETERMINATE FORMS OF TYPE $0^{0}, \infty^{0}, 1^{\infty}$

Limits of the form

$$
\lim f(x)^{g(x)}
$$

can give rise to indeterminate forms of the types $\mathbf{0}^{\boldsymbol{0}}, \boldsymbol{\infty}^{\boldsymbol{0}}$, and $\mathbf{1}^{\boldsymbol{\infty}}$. (The interpretations of these symbols should be clear.) For example, the limit

$$
\lim _{x \rightarrow 0^{+}}(1+x)^{1 / x}
$$

whose value we know to be $e$ [see Formula (1) of Section 3.2] is an indeterminate form of type $1^{\infty}$. It is indeterminate because the expressions $1+x$ and $1 / x$ exert two conflicting influences: the first approaches 1 , which drives the expression toward 1 , and the second approaches $+\infty$, which drives the expression toward $+\infty$.

Indeterminate forms of types $0^{0}, \infty{ }^{0}$, and $1^{\infty}$ can sometimes be evaluated by first introducing a dependent variable

$$
y=f(x)^{g(x)}
$$

and then computing the limit of $\ln y$. Since

$$
\ln y=\ln \left[f(x)^{g(x)}\right]=g(x) \cdot \ln [f(x)]
$$

the limit of $\ln y$ will be an indeterminate form of type $0 \cdot \infty$ (verify), which can be evaluated by methods we have already studied. Once the limit of $\ln y$ is known, it is a straightforward matter to determine the limit of $y=f(x)^{g(x)}$, as we will illustrate in the next example.

Example 6 Find $\lim _{x \rightarrow 0}(1+\sin x)^{1 / x}$.
Solution. As discussed above, we begin by introducing a dependent variable

$$
y=(1+\sin x)^{1 / x}
$$

and taking the natural logarithm of both sides:

$$
\ln y=\ln (1+\sin x)^{1 / x}=\frac{1}{x} \ln (1+\sin x)=\frac{\ln (1+\sin x)}{x}
$$

Thus,

$$
\lim _{x \rightarrow 0} \ln y=\lim _{x \rightarrow 0} \frac{\ln (1+\sin x)}{x}
$$

which is an indeterminate form of type $0 / 0$, so by L'Hôpital's rule

$$
\lim _{x \rightarrow 0} \ln y=\lim _{x \rightarrow 0} \frac{\ln (1+\sin x)}{x}=\lim _{x \rightarrow 0} \frac{(\cos x) /(1+\sin x)}{1}=1
$$

Since we have shown that $\ln y \rightarrow 1$ as $x \rightarrow 0$, the continuity of the exponential function implies that $e^{\ln y} \rightarrow e^{1}$ as $x \rightarrow 0$, and this implies that $y \rightarrow e$ as $x \rightarrow 0$. Thus,

$$
\lim _{x \rightarrow 0}(1+\sin x)^{1 / x}=e
$$

## QUICK CHECK EXERCISES 3.6 (See page 228 for answers.)

1. In each part, does L'Hôpital's rule apply to the given limit?
(a) $\lim _{x \rightarrow 1} \frac{2 x-2}{x^{3}+x-2}$
(b) $\lim _{x \rightarrow 0} \frac{\cos x}{x}$
(c) $\lim _{x \rightarrow 0} \frac{e^{2 x}-1}{\tan x}$
2. Evaluate each of the limits in Quick Check Exercise 1.
3. Using L'Hôpital's rule, $\lim _{x \rightarrow+\infty} \frac{e^{x}}{500 x^{2}}=$ $\_\_\_\_$ . . . .
$\_\_\_\_$

## EXERCISE SET 3.6 Graphing Utility c CAS

1-2 Evaluate the given limit without using L'Hôpital's rule, and then check that your answer is correct using L'Hôpital's rule.

1. (a) $\lim _{x \rightarrow 2} \frac{x^{2}-4}{x^{2}+2 x-8}$
(b) $\lim _{x \rightarrow+\infty} \frac{2 x-5}{3 x+7}$
2. (a) $\lim _{x \rightarrow 0} \frac{\sin x}{\tan x}$
(b) $\lim _{x \rightarrow 1} \frac{x^{2}-1}{x^{3}-1}$

3-6 True-False Determine whether the statement is true or false. Explain your answer.
3. L'Hôpital's rule does not apply to $\lim _{x \rightarrow-\infty} \frac{\ln x}{x}$.
4. For any polynomial $p(x), \lim _{x \rightarrow+\infty} \frac{p(x)}{e^{x}}=0$.
5. If $n$ is chosen sufficiently large, then $\lim _{x \rightarrow+\infty} \frac{(\ln x)^{n}}{x}=+\infty$.
6. $\lim _{x \rightarrow 0^{+}}(\sin x)^{1 / x}=0$

7-45 Find the limits.
7. $\lim _{x \rightarrow 0} \frac{e^{x}-1}{\sin x}$
8. $\lim _{x \rightarrow 0} \frac{\sin 2 x}{\sin 5 x}$
9. $\lim _{\theta \rightarrow 0} \frac{\tan \theta}{\theta}$
10. $\lim _{t \rightarrow 0} \frac{t e^{t}}{1-e^{t}}$
11. $\lim _{x \rightarrow \pi^{+}} \frac{\sin x}{x-\pi}$
12. $\lim _{x \rightarrow 0^{+}} \frac{\sin x}{x^{2}}$
13. $\lim _{x \rightarrow+\infty} \frac{\ln x}{x}$
14. $\lim _{x \rightarrow+\infty} \frac{e^{3 x}}{x^{2}}$
15. $\lim _{x \rightarrow 0^{+}} \frac{\cot x}{\ln x}$
16. $\lim _{x \rightarrow 0^{+}} \frac{1-\ln x}{e^{1 / x}}$
17. $\lim _{x \rightarrow+\infty} \frac{x^{100}}{e^{x}}$
18. $\lim _{x \rightarrow 0^{+}} \frac{\ln (\sin x)}{\ln (\tan x)}$
19. $\lim _{x \rightarrow 0} \frac{\sin ^{-1} 2 x}{x}$
20. $\lim _{x \rightarrow 0} \frac{x-\tan ^{-1} x}{x^{3}}$
21. $\lim _{x \rightarrow+\infty} x e^{-x}$
22. $\lim _{x \rightarrow \pi^{-}}(x-\pi) \tan \frac{1}{2} x$
23. $\lim _{x \rightarrow+\infty} x \sin \frac{\pi}{x}$
24. $\lim _{x \rightarrow 0^{+}} \tan x \ln x$
25. $\lim _{x \rightarrow \pi / 2^{-}} \sec 3 x \cos 5 x$
26. $\lim _{x \rightarrow \pi}(x-\pi) \cot x$
27. $\lim _{x \rightarrow+\infty}(1-3 / x)^{x}$
29. $\lim _{x \rightarrow 0}\left(e^{x}+x\right)^{1 / x}$
30. $\lim _{x \rightarrow+\infty}(1+a / x)^{b x}$
31. $\lim _{x \rightarrow 1}(2-x)^{\tan [(\pi / 2) x]}$
32. $\lim _{x \rightarrow+\infty}[\cos (2 / x)]^{x^{2}}$
33. $\lim _{x \rightarrow 0}(\csc x-1 / x)$
34. $\lim _{x \rightarrow 0}\left(\frac{1}{x^{2}}-\frac{\cos 3 x}{x^{2}}\right)$
35. $\lim _{x \rightarrow+\infty}\left(\sqrt{x^{2}+x}-x\right)$
36. $\lim _{x \rightarrow 0}\left(\frac{1}{x}-\frac{1}{e^{x}-1}\right)$
37. $\lim _{x \rightarrow+\infty}\left[x-\ln \left(x^{2}+1\right)\right]$
38. $\lim _{x \rightarrow+\infty}[\ln x-\ln (1+x)]$
39. $\lim _{x \rightarrow 0^{+}} x^{\sin x}$
40. $\lim _{x \rightarrow 0^{+}}\left(e^{2 x}-1\right)^{x}$
41. $\lim _{x \rightarrow 0^{+}}\left[-\frac{1}{\ln x}\right]^{x}$
42. $\lim _{x \rightarrow+\infty} x^{1 / x}$
43. $\lim _{x \rightarrow+\infty}(\ln x)^{1 / x}$
44. $\lim _{x \rightarrow 0^{+}}(-\ln x)^{x}$
45. $\lim _{x \rightarrow \pi / 2^{-}}(\tan x)^{(\pi / 2)-x}$
46. Show that for any positive integer $n$
(a) $\lim _{x \rightarrow+\infty} \frac{\ln x}{x^{n}}=0$
(b) $\lim _{x \rightarrow+\infty} \frac{x^{n}}{\ln x}=+\infty$.

## FOCUS ON CONCEPTS

47. (a) Find the error in the following calculation:

$$
\begin{aligned}
\lim _{x \rightarrow 1} \frac{x^{3}-x^{2}+x-1}{x^{3}-x^{2}} & =\lim _{x \rightarrow 1} \frac{3 x^{2}-2 x+1}{3 x^{2}-2 x} \\
& =\lim _{x \rightarrow 1} \frac{6 x-2}{6 x-2}=1
\end{aligned}
$$

(b) Find the correct limit.
48. (a) Find the error in the following calculation:

$$
\lim _{x \rightarrow 2} \frac{e^{3 x^{2}-12 x+12}}{x^{4}-16}=\lim _{x \rightarrow 2} \frac{(6 x-12) e^{3 x^{2}-12 x+12}}{4 x^{3}}=0
$$

(b) Find the correct limit.

49-52 Make a conjecture about the limit by graphing the function involved with a graphing utility; then check your conjecture using L'Hôpital's rule.
49. $\lim _{x \rightarrow+\infty} \frac{\ln (\ln x)}{\sqrt{x}}$
50. $\lim _{x \rightarrow 0^{+}} x^{x}$
51. $\lim _{x \rightarrow 0^{+}}(\sin x)^{3 / \ln x}$
52. $\lim _{x \rightarrow(\pi / 2)^{-}} \frac{4 \tan x}{1+\sec x}$

53-56 Make a conjecture about the equations of horizontal asymptotes, if any, by graphing the equation with a graphing utility; then check your answer using L'Hôpital's rule.
53. $y=\ln x-e^{x}$
54. $y=x-\ln \left(1+2 e^{x}\right)$
55. $y=(\ln x)^{1 / x}$
56. $y=\left(\frac{x+1}{x+2}\right)^{x}$
57. Limits of the type

$$
\begin{array}{llll}
0 / \infty, & \infty / 0, & 0^{\infty}, & \infty \cdot \infty, \\
+\infty-(-\infty), & -\infty+(-\infty), & -\infty-(+\infty),
\end{array}
$$

are not indeterminate forms. Find the following limits by inspection.
(a) $\lim _{x \rightarrow 0^{+}} \frac{x}{\ln x}$
(b) $\lim _{x \rightarrow+\infty} \frac{x^{3}}{e^{-x}}$
(c) $\lim _{x \rightarrow(\pi / 2)^{-}}(\cos x)^{\tan x}$
(d) $\lim _{x \rightarrow 0^{+}}(\ln x) \cot x$
(e) $\lim _{x \rightarrow 0^{+}}\left(\frac{1}{x}-\ln x\right)$
(f) $\lim _{x \rightarrow-\infty}\left(x+x^{3}\right)$
58. There is a myth that circulates among beginning calculus students which states that all indeterminate forms of types $0^{0}, \infty^{0}$, and $1^{\infty}$ have value 1 because "anything to the zero power is 1 " and " 1 to any power is 1 ." The fallacy is that $0^{0}, \infty^{0}$, and $1^{\infty}$ are not powers of numbers, but rather descriptions of limits. The following examples, which were suggested by Prof. Jack Staib of Drexel University, show that such indeterminate forms can have any positive real value:
(a) $\lim _{x \rightarrow 0^{+}}\left[x^{(\ln a) /(1+\ln x)}\right]=a \quad\left(\right.$ form $\left.0^{0}\right)$
(b) $\lim _{x \rightarrow+\infty}\left[x^{(\ln a) /(1+\ln x)}\right]=a \quad\left(\right.$ form $\left.\infty^{0}\right)$
(c) $\lim _{x \rightarrow 0}\left[(x+1)^{(\ln a) / x}\right]=a \quad\left(\right.$ form $\left.1^{\infty}\right)$.

Verify these results.
59-62 Verify that L'Hôpital's rule is of no help in finding the limit; then find the limit, if it exists, by some other method.
59. $\lim _{x \rightarrow+\infty} \frac{x+\sin 2 x}{x}$
60. $\lim _{x \rightarrow+\infty} \frac{2 x-\sin x}{3 x+\sin x}$
61. $\lim _{x \rightarrow+\infty} \frac{x(2+\sin 2 x)}{x+1}$
62. $\lim _{x \rightarrow+\infty} \frac{x(2+\sin x)}{x^{2}+1}$
63. The accompanying schematic diagram represents an electrical circuit consisting of an electromotive force that produces a voltage $V$, a resistor with resistance $R$, and an inductor with inductance $L$. It is shown in electrical circuit theory that if the voltage is first applied at time $t=0$, then the current $I$ flowing through the circuit at time $t$ is given by

$$
I=\frac{V}{R}\left(1-e^{-R t / L}\right)
$$

What is the effect on the current at a fixed time $t$ if the resistance approaches 0 (i.e., $R \rightarrow 0^{+}$)?

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-161.jpg?height=255&width=435&top_left_y=1816&top_left_x=1185)
Figure Ex-63

64. (a) Show that $\lim _{x \rightarrow \pi / 2}(\pi / 2-x) \tan x=1$.
(b) Show that

$$
\lim _{x \rightarrow \pi / 2}\left(\frac{1}{\pi / 2-x}-\tan x\right)=0
$$

(c) It follows from part (b) that the approximation

$$
\tan x \approx \frac{1}{\pi / 2-x}
$$

should be good for values of $x$ near $\pi / 2$. Use a calculator to find $\tan x$ and $1 /(\pi / 2-x)$ for $x=1.57$; compare the results.

C 65. (a) Use a CAS to show that if $k$ is a positive constant, then

$$
\lim _{x \rightarrow+\infty} x\left(k^{1 / x}-1\right)=\ln k
$$

(b) Confirm this result using L'Hôpital's rule. [Hint: Express the limit in terms of $t=1 / x$.]
(c) If $n$ is a positive integer, then it follows from part (a) with $x=n$ that the approximation

$$
n(\sqrt[n]{k}-1) \approx \ln k
$$

should be good when $n$ is large. Use this result and the square root key on a calculator to approximate the values of $\ln 0.3$ and $\ln 2$ with $n=1024$, then compare the values obtained with values of the logarithms generated directly from the calculator. [Hint: The $n$th roots for which $n$ is a power of 2 can be obtained as successive square roots.]
66. Find all values of $k$ and $l$ such that

$$
\lim _{x \rightarrow 0} \frac{k+\cos l x}{x^{2}}=-4
$$

## FOCUS ON CONCEPTS

67. Let $f(x)=x^{2} \sin (1 / x)$.
(a) Are the limits $\lim _{x \rightarrow 0^{+}} f(x)$ and $\lim _{x \rightarrow 0^{-}} f(x)$ indeterminate forms?
(b) Use a graphing utility to generate the graph of $f$, and use the graph to make conjectures about the limits in part (a).
(c) Use the Squeezing Theorem (1.6.4) to confirm that your conjectures in part (b) are correct.
68. (a) Explain why L'Hôpital's rule does not apply to the problem

$$
\lim _{x \rightarrow 0} \frac{x^{2} \sin (1 / x)}{\sin x}
$$

(b) Find the limit.
69. Find $\lim _{x \rightarrow 0^{+}} \frac{x \sin (1 / x)}{\sin x}$ if it exists.
70. Suppose that functions $f$ and $g$ are differentiable at $x=a$ and that $f(a)=g(a)=0$. If $g^{\prime}(a) \neq 0$, show that

$$
\lim _{x \rightarrow a} \frac{f(x)}{g(x)}=\frac{f^{\prime}(a)}{g^{\prime}(a)}
$$

without using L'Hôpital's rule. [Hint: Divide the numerator and denominator of $f(x) / g(x)$ by $x-a$ and use the definitions for $f^{\prime}(a)$ and $g^{\prime}(a)$.]
71. Writing Were we to use L'Hôpital's rule to evaluate either

$$
\lim _{x \rightarrow 0} \frac{\sin x}{x} \quad \text { or } \quad \lim _{x \rightarrow+\infty}\left(1+\frac{1}{x}\right)^{x}
$$

we could be accused of circular reasoning. Explain why.
72. Writing Exercise 58 shows that the indeterminate forms $0^{0}$ and $\infty^{0}$ can assume any positive real value. However, it is often the case that these indeterminate forms have value 1. Read the article "Indeterminate Forms of Exponential Type" by John Baxley and Elmer Hayashi in the June-July 1978 issue of The American Mathematical Monthly, and write a short report on why this is the case.

## QUICK CHECK ANSWERS 3.6

1. 

(a) yes
(b) no
(c) yes
2. (a) $\frac{1}{2}$
(b) does not exist
(c) 2
3. $+\infty$

1-2 (a) Find $d y / d x$ by differentiating implicitly. (b) Solve the equation for $y$ as a function of $x$, and find $d y / d x$ from that equation. (c) Confirm that the two results are consistent by expressing the derivative in part (a) as a function of $x$ alone.

1. $x^{3}+x y-2 x=1$
2. $x y=x-y$

3-6 Find $d y / d x$ by implicit differentiation.
3. $\frac{1}{y}+\frac{1}{x}=1$
4. $x^{3}-y^{3}=6 x y$
5. $\sec (x y)=y$
6. $x^{2}=\frac{\cot y}{1+\csc y}$

7-8 Find $d^{2} y / d x^{2}$ by implicit differentiation.
7. $3 x^{2}-4 y^{2}=7$
8. $2 x y-y^{2}=3$
9. Use implicit differentiation to find the slope of the tangent line to the curve $y=x \tan (\pi y / 2), x>0, y>0$ (the quadratrix of Hippias) at the point $\left(\frac{1}{2}, \frac{1}{2}\right)$.
10. At what point(s) is the tangent line to the curve $y^{2}=2 x^{3}$ perpendicular to the line $4 x-3 y+1=0$ ?
11. Prove that if $P$ and $Q$ are two distinct points on the rotated ellipse $x^{2}+x y+y^{2}=4$ such that $P, Q$, and the origin are collinear, then the tangent lines to the ellipse at $P$ and $Q$ are parallel.
12. Find the coordinates of the point in the first quadrant at which the tangent line to the curve $x^{3}-x y+y^{3}=0$ is parallel to the $x$-axis.
13. Find the coordinates of the point in the first quadrant at which the tangent line to the curve $x^{3}-x y+y^{3}=0$ is parallel to the $y$-axis.
14. Use implicit differentiation to show that the equation of the tangent line to the curve $y^{2}=k x$ at $\left(x_{0}, y_{0}\right)$ is

$$
y_{0} y=\frac{1}{2} k\left(x+x_{0}\right)
$$

15-16 Find $d y / d x$ by first using algebraic properties of the natural logarithm function.
15. $y=\ln \left(\frac{(x+1)(x+2)^{2}}{(x+3)^{3}(x+4)^{4}}\right)$
16. $y=\ln \left(\frac{\sqrt{x} \sqrt[3]{x+1}}{\sin x \sec x}\right)$
17. $y=\ln 2 x$
19. $y=\sqrt[3]{\ln x+1}$
21. $y=\log (\ln x)$
23. $y=\ln \left(x^{3 / 2} \sqrt{1+x^{4}}\right)$
25. $y=e^{\ln \left(x^{2}+1\right)}$
27. $y=2 x e^{\sqrt{x}}$
29. $y=\frac{1}{\pi} \tan ^{-1} 2 x$
31. $y=x^{\left(e^{x}\right)}$
33. $y=\sec ^{-1}(2 x+1)$

## 17-34 Find $d y / d x$.

18. $y=(\ln x)^{2}$
19. $y=\ln (\sqrt[3]{x+1})$
20. $y=\frac{1+\log x}{1-\log x}$
21. $y=\ln \left(\frac{\sqrt{x} \cos x}{1+x^{2}}\right)$
22. $y=\ln \left(\frac{1+e^{x}+e^{2 x}}{1-e^{3 x}}\right)$
23. $y=\frac{a}{1+b e^{-x}}$
24. $y=2^{\sin ^{-1} x}$
25. $y=(1+x)^{1 / x}$
26. $y=\sqrt{\cos ^{-1} x^{2}}$

35-36 Find $d y / d x$ using logarithmic differentiation.
35. $y=\frac{x^{3}}{\sqrt{x^{2}+1}}$
36. $y=\sqrt[3]{\frac{x^{2}-1}{x^{2}+1}}$
37. (a) Make a conjecture about the shape of the graph of $y=\frac{1}{2} x-\ln x$, and draw a rough sketch.
(b) Check your conjecture by graphing the equation over the interval $0<x<5$ with a graphing utility.
(c) Show that the slopes of the tangent lines to the curve at $x=1$ and $x=e$ have opposite signs.
(d) What does part (c) imply about the existence of a horizontal tangent line to the curve? Explain.
(e) Find the exact $x$-coordinates of all horizontal tangent lines to the curve.
38. Recall from Section 0.5 that the loudness $\beta$ of a sound in decibels (dB) is given by $\beta=10 \log \left(I / I_{0}\right)$, where $I$ is the intensity of the sound in watts per square meter $\left(\mathrm{W} / \mathrm{m}^{2}\right)$ and $I_{0}$ is a constant that is approximately the intensity of a sound at the threshold of human hearing. Find the rate of change of $\beta$ with respect to $I$ at the point where
(a) $I / I_{0}=10$
(b) $I / I_{0}=100$
(c) $I / I_{0}=1000$.
39. A particle is moving along the curve $y=x \ln x$. Find all values of $x$ at which the rate of change of $y$ with respect to time is three times that of $x$. [Assume that $d x / d t$ is never zero.]
40. Find the equation of the tangent line to the graph of $y=\ln \left(5-x^{2}\right)$ at $x=2$.
41. Find the value of $b$ so that the line $y=x$ is tangent to the graph of $y=\log _{b} x$. Confirm your result by graphing both $y=x$ and $y=\log _{b} x$ in the same coordinate system.
42. In each part, find the value of $k$ for which the graphs of $y=f(x)$ and $y=\ln x$ share a common tangent line at their point of intersection. Confirm your result by graphing $y=f(x)$ and $y=\ln x$ in the same coordinate system.
(a) $f(x)=\sqrt{x}+k$
(b) $f(x)=k \sqrt{x}$
43. If $f$ and $g$ are inverse functions and $f$ is differentiable on its domain, must $g$ be differentiable on its domain? Give a reasonable informal argument to support your answer.
44. In each part, find $\left(f^{-1}\right)^{\prime}(x)$ using Formula (2) of Section 3.3, and check your answer by differentiating $f^{-1}$ directly.
(a) $f(x)=3 /(x+1)$
(b) $f(x)=\sqrt{e^{x}}$
45. Find a point on the graph of $y=e^{3 x}$ at which the tangent line passes through the origin.
46. Show that the rate of change of $y=5000 e^{1.07 x}$ is proportional to $y$.
47. Show that the rate of change of $y=3^{2 x} 5^{7 x}$ is proportional to $y$.
48. The equilibrium constant $k$ of a balanced chemical reaction changes with the absolute temperature $T$ according to the law

$$
k=k_{0} \exp \left(-\frac{q\left(T-T_{0}\right)}{2 T_{0} T}\right)
$$

where $k_{0}, q$, and $T_{0}$ are constants. Find the rate of change of $k$ with respect to $T$.
49. Show that the function $y=e^{a x} \sin b x$ satisfies

$$
y^{\prime \prime}-2 a y^{\prime}+\left(a^{2}+b^{2}\right) y=0
$$

for any real constants $a$ and $b$.
50. Show that the function $y=\tan ^{-1} x$ satisfies

$$
y^{\prime \prime}=-2 \sin y \cos ^{3} y
$$

51. Suppose that the population of deer on an island is modeled by the equation

$$
P(t)=\frac{95}{5-4 e^{-t / 4}}
$$

where $P(t)$ is the number of deer $t$ weeks after an initial observation at time $t=0$.
(a) Use a graphing utility to graph the function $P(t)$.
(b) In words, explain what happens to the population over time. Check your conclusion by finding $\lim _{t \rightarrow+\infty} P(t)$.
(c) In words, what happens to the rate of population growth over time? Check your conclusion by graphing $P^{\prime}(t)$.
52. In each part, find each limit by interpreting the expression as an appropriate derivative.
(a) $\lim _{h \rightarrow 0} \frac{(1+h)^{\pi}-1}{h}$
(b) $\lim _{x \rightarrow e} \frac{1-\ln x}{(x-e) \ln x}$
53. Suppose that $\lim f(x)= \pm \infty$ and $\lim g(x)= \pm \infty$. In each of the four possible cases, state whether $\lim [f(x)-g(x)]$ is an indeterminate form, and give a reasonable informal argument to support your answer.
54. (a) Under what conditions will a limit of the form

$$
\lim _{x \rightarrow a}[f(x) / g(x)]
$$

be an indeterminate form?
(b) If $\lim _{x \rightarrow a} g(x)=0$, must $\lim _{x \rightarrow a}[f(x) / g(x)]$ be an indeterminate form? Give some examples to support your answer.

55-58 Evaluate the given limit.
55. $\lim _{x \rightarrow+\infty}\left(e^{x}-x^{2}\right)$
56. $\lim _{x \rightarrow 1} \sqrt{\frac{\ln x}{x^{4}-1}}$
57. $\lim _{x \rightarrow 0} \frac{x^{2} e^{x}}{\sin ^{2} 3 x}$
58. $\lim _{x \rightarrow 0} \frac{a^{x}-1}{x}, \quad a>0$
59. An oil slick on a lake is surrounded by a floating circular containment boom. As the boom is pulled in, the circular containment area shrinks. If the boom is pulled in at the rate of $5 \mathrm{~m} / \mathrm{min}$, at what rate is the containment area shrinking when the containment area has a diameter of 100 m ?
60. The hypotenuse of a right triangle is growing at a constant rate of $a$ centimeters per second and one leg is decreasing at a constant rate of $b$ centimeters per second. How fast is the acute angle between the hypotenuse and the other leg changing at the instant when both legs are 1 cm ?
61. In each part, use the given information to find $\Delta x, \Delta y$, and $d y$.
(a) $y=1 /(x-1) ; x$ decreases from 2 to 1.5.
(b) $y=\tan x ; x$ increases from $-\pi / 4$ to 0 .
(c) $y=\sqrt{25-x^{2}} ; x$ increases from 0 to 3 .
62. Use an appropriate local linear approximation to estimate the value of $\cot 46^{\circ}$, and compare your answer to the value obtained with a calculating device.
63. The base of the Great Pyramid at Giza is a square that is 230 m on each side.
(a) As illustrated in the accompanying figure, suppose that an archaeologist standing at the center of a side measures the angle of elevation of the apex to be $\phi=51^{\circ}$ with an error of $\pm 0.5^{\circ}$. What can the archaeologist reasonably say about the height of the pyramid?
(b) Use differentials to estimate the allowable error in the elevation angle that will ensure that the error in calculating the height is at most $\pm 5 \mathrm{~m}$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-164.jpg?height=345&width=602&top_left_y=957&top_left_x=1181)
A Figure Ex-63

## CHAPTER 3 MAKING CONNECTIONS

In these exercises we explore an application of exponential functions to radioactive decay, and we consider another approach to computing the derivative of the natural exponential function.

1. Consider a simple model of radioactive decay. We assume that given any quantity of a radioactive element, the fraction of the quantity that decays over a period of time will be a constant that depends on only the particular element and the length of the time period. We choose a time parameter $-\infty<t<+\infty$ and let $A=A(t)$ denote the amount of the element remaining at time $t$. We also choose units of measure such that the initial amount of the element is $A(0)=1$, and we let $b=A(1)$ denote the amount at time $t=1$. Prove that the function $A(t)$ has the following properties.
(a) $A(-t)=\frac{1}{A(t)}$ [Hint: For $t>0$, you can interpret $A(t)$ as the fraction of any given amount that remains after a time period of length $t$.]
(b) $A(s+t)=A(s) \cdot A(t)$ [Hint: First consider positive $s$ and $t$. For the other cases use the property in part (a).]
(c) If $n$ is any nonzero integer, then

$$
A\left(\frac{1}{n}\right)=(A(1))^{1 / n}=b^{1 / n}
$$

(d) If $m$ and $n$ are integers with $n \neq 0$, then

$$
A\left(\frac{m}{n}\right)=(A(1))^{m / n}=b^{m / n}
$$

(e) Assuming that $A(t)$ is a continuous function of $t$, then $A(t)=b^{t}$. [Hint: Prove that if two continuous functions agree on the set of rational numbers, then they are equal.]
(f) If we replace the assumption that $A(0)=1$ by the condition $A(0)=A_{0}$, prove that $A=A_{0} b^{t}$.
2. Refer to Figure 1.3.4.
(a) Make the substitution $h=1 / x$ and conclude that

$$
(1+h)^{1 / h}<e<(1-h)^{-1 / h} \quad \text { for } h>0
$$

and

$$
(1-h)^{-1 / h}<e<(1+h)^{1 / h} \quad \text { for } h<0
$$

(b) Use the inequalities in part (a) and the Squeezing Theorem to prove that

$$
\lim _{h \rightarrow 0} \frac{e^{h}-1}{h}=1
$$

(c) Explain why the limit in part (b) confirms Figure 0.5.4.
(d) Use the limit in part (b) to prove that

$$
\frac{d}{d x}\left(e^{x}\right)=e^{x}
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-166.jpg?height=759&width=671&top_left_y=40&top_left_x=160)

## THE DERIVATIVE IN GRAPHING AND APPLICATIONS

Stone/Getty Images

Derivatives can help to find the most cost-effective location for an offshore oil-drilling rig.

In this chapter we will study various applications of the derivative. For example, we will use methods of calculus to analyze functions and their graphs. In the process, we will show how calculus and graphing utilities, working together, can provide most of the important information about the behavior of functions. Another important application of the derivative will be in the solution of optimization problems. For example, if time is the main consideration in a problem, we might be interested in finding the quickest way to perform a task, and if cost is the main consideration, we might be interested in finding the least expensive way to perform a task. Mathematically, optimization problems can be reduced to finding the largest or smallest value of a function on some interval, and determining where the largest or smallest value occurs. Using the derivative, we will develop the mathematical tools necessary for solving such problems. We will also use the derivative to study the motion of a particle moving along a line, and we will show how the derivative can help us to approximate solutions of equations.

### 4.1 ANALYSIS OF FUNCTIONS I: INCREASE, DECREASE, AND CONCAVITY

Although graphing utilities are useful for determining the general shape of a graph, many problems require more precision than graphing utilities are capable of producing. The purpose of this section is to develop mathematical tools that can be used to determine the exact shape of a graph and the precise locations of its key features.

## INCREASING AND DECREASING FUNCTIONS

The terms increasing, decreasing, and constant are used to describe the behavior of a function as we travel left to right along its graph. For example, the function graphed in Figure 4.1.1 can be described as increasing to the left of $x=0$, decreasing from $x=0$ to $x=2$, increasing from $x=2$ to $x=4$, and constant to the right of $x=4$.

Figure 4.1.1
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-166.jpg?height=211&width=763&top_left_y=2198&top_left_x=901)

The definitions of "increasing," "decreasing," and "constant" describe the behavior of a function on an interval and not at a point. In particular, it is not inconsistent to say that the function in Figure 4.1.1 is decreasing on the interval $[0,2]$ and increasing on the interval $[2,4]$.

- Figure 4.1.2
- Figure 4.1.3

Observe that the derivative conditions in Theorem 4.1.2 are only required to hold inside the interval $[a, b]$, even though the conclusions apply to the entire interval.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-167.jpg?height=372&width=404&top_left_y=1533&top_left_x=716)
Each tangent line has positive slope.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-167.jpg?height=372&width=403&top_left_y=1533&top_left_x=1137)
Each tangent line has negative slope.

The following definition, which is illustrated in Figure 4.1.2, expresses these intuitive ideas precisely.
4.1.1 DEFINITION Let $f$ be defined on an interval, and let $x_{1}$ and $x_{2}$ denote points in that interval.
(a) $f$ is increasing on the interval if $f\left(x_{1}\right)<f\left(x_{2}\right)$ whenever $x_{1}<x_{2}$.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-167.jpg?height=372&width=406&top_left_y=1533&top_left_x=1553)

Each tangent line has zero slope.
(b) $f$ is decreasing on the interval if $f\left(x_{1}\right)>f\left(x_{2}\right)$ whenever $x_{1}<x_{2}$.
(c) $\quad f$ is constant on the interval if $f\left(x_{1}\right)=f\left(x_{2}\right)$ for all points $x_{1}$ and $x_{2}$.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-167.jpg?height=460&width=1273&top_left_y=708&top_left_x=706)

Figure 4.1.3 suggests that a differentiable function $f$ is increasing on any interval where each tangent line to its graph has positive slope, is decreasing on any interval where each tangent line to its graph has negative slope, and is constant on any interval where each tangent line to its graph has zero slope. This intuitive observation suggests the following important theorem that will be proved in Section 4.8.
4.1.2 THEOREM Let $f$ be a function that is continuous on a closed interval $[a, b]$ and differentiable on the open interval ( $a, b$ ).
(a) If $f^{\prime}(x)>0$ for every value of $x$ in ( $a, b$ ), then $f$ is increasing on $[a, b]$.
(b) If $f^{\prime}(x)<0$ for every value of $x$ in ( $a, b$ ), then $f$ is decreasing on $[a, b]$.
(c) If $f^{\prime}(x)=0$ for every value of $x$ in $(a, b)$, then $f$ is constant on $[a, b]$.

Although stated for closed intervals, Theorem 4.1.2 is applicable on any interval on which $f$ is continuous. For example, if $f$ is continuous on $[a,+\infty)$ and $f^{\prime}(x)>0$ on $(a,+\infty)$, then $f$ is increasing on $[a,+\infty)$; and if $f$ is continuous on $(-\infty,+\infty)$ and $f^{\prime}(x)<0$ on $(-\infty,+\infty)$, then $f$ is decreasing on $(-\infty,+\infty)$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-168.jpg?height=578&width=399&top_left_y=474&top_left_x=192)
Figure 4.1.4

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-168.jpg?height=578&width=399&top_left_y=1149&top_left_x=192)
Figure 4.1.5

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-168.jpg?height=467&width=467&top_left_y=1828&top_left_x=160)
Figure 4.1.6

$$
f(x)=3 x^{4}+4 x^{3}-12 x^{2}+2
$$

Example 1 Find the intervals on which $f(x)=x^{2}-4 x+3$ is increasing and the intervals on which it is decreasing.

Solution. The graph of $f$ in Figure 4.1.4 suggests that $f$ is decreasing for $x \leq 2$ and increasing for $x \geq 2$. To confirm this, we analyze the sign of $f^{\prime}$. The derivative of $f$ is

$$
f^{\prime}(x)=2 x-4=2(x-2)
$$

It follows that

$$
\begin{array}{lll}
f^{\prime}(x)<0 & \text { if } & x<2 \\
f^{\prime}(x)>0 & \text { if } & 2<x
\end{array}
$$

Since $f$ is continuous everywhere, it follows from the comment after Theorem 4.1.2 that

```
f is decreasing on ( - - , 2]
f is increasing on [2,+\infty)
```

These conclusions are consistent with the graph of $f$ in Figure 4.1.4.

Example 2 Find the intervals on which $f(x)=x^{3}$ is increasing and the intervals on which it is decreasing.

Solution. The graph of $f$ in Figure 4.1.5 suggests that $f$ is increasing over the entire $x$-axis. To confirm this, we differentiate $f$ to obtain $f^{\prime}(x)=3 x^{2}$. Thus,

$$
\begin{array}{lll}
f^{\prime}(x)>0 & \text { if } & x<0 \\
f^{\prime}(x)>0 & \text { if } & 0<x
\end{array}
$$

Since $f$ is continuous everywhere,

```
f is increasing on ( - \infty, 0]
f is increasing on [0, +\infty)
```

Since $f$ is increasing on the adjacent intervals $(-\infty, 0]$ and $[0,+\infty)$, it follows that $f$ is increasing on their union ( $-\infty,+\infty$ ) (see Exercise 59).

## Example 3

(a) Use the graph of $f(x)=3 x^{4}+4 x^{3}-12 x^{2}+2$ in Figure 4.1.6 to make a conjecture about the intervals on which $f$ is increasing or decreasing.
(b) Use Theorem 4.1.2 to determine whether your conjecture is correct.

Solution (a). The graph suggests that the function $f$ is decreasing if $x \leq-2$, increasing if $-2 \leq x \leq 0$, decreasing if $0 \leq x \leq 1$, and increasing if $x \geq 1$.

Solution (b). Differentiating $f$ we obtain

$$
f^{\prime}(x)=12 x^{3}+12 x^{2}-24 x=12 x\left(x^{2}+x-2\right)=12 x(x+2)(x-1)
$$

The sign analysis of $f^{\prime}$ in Table 4.1.1 can be obtained using the method of test points discussed in Web Appendix E. The conclusions in Table 4.1.1 confirm the conjecture in part (a).

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-169.jpg?height=460&width=351&top_left_y=664&top_left_x=268)
- Figure 4.1.7

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-169.jpg?height=624&width=403&top_left_y=1213&top_left_x=244)
Figure 4.1.8

Table 4.1.1
| INTERVAL | $(12 x)(x+2)(x-1)$ | $f^{\prime}(x)$ | CONCLUSION |
| :---: | :---: | :---: | :--- |
| $x<-2$ | $(-)(-)(-)$ | - | $f$ is decreasing on $(-\infty,-2]$ |
| $-2<x<0$ | $(-)(+)(-)$ | + | $f$ is increasing on $[-2,0]$ |
| $0<x<1$ | $(+)(+)(-)$ | - | $f$ is decreasing on $[0,1]$ |
| $1<x$ | $(+)(+)(+)$ | + | $f$ is increasing on $[1,+\infty)$ |


## CONCAVITY

Although the sign of the derivative of $f$ reveals where the graph of $f$ is increasing or decreasing, it does not reveal the direction of curvature. For example, the graph is increasing on both sides of the point in Figure 4.1.7, but on the left side it has an upward curvature ("holds water") and on the right side it has a downward curvature ("spills water"). On intervals where the graph of $f$ has upward curvature we say that $f$ is concave up, and on intervals where the graph has downward curvature we say that $f$ is concave down.

Figure 4.1.8 suggests two ways to characterize the concavity of a differentiable function $f$ on an open interval:

- $f$ is concave up on an open interval if its tangent lines have increasing slopes on that interval and is concave down if they have decreasing slopes.
- $f$ is concave up on an open interval if its graph lies above its tangent lines on that interval and is concave down if it lies below its tangent lines.

Our formal definition for "concave up" and "concave down" corresponds to the first of these characterizations.
4.1.3 DEFINITION If $f$ is differentiable on an open interval, then $f$ is said to be concave up on the open interval if $f^{\prime}$ is increasing on that interval, and $f$ is said to be concave down on the open interval if $f^{\prime}$ is decreasing on that interval.

Since the slopes of the tangent lines to the graph of a differentiable function $f$ are the values of its derivative $f^{\prime}$, it follows from Theorem 4.1.2 (applied to $f^{\prime}$ rather than $f$ ) that $f^{\prime}$ will be increasing on intervals where $f^{\prime \prime}$ is positive and that $f^{\prime}$ will be decreasing on intervals where $f^{\prime \prime}$ is negative. Thus, we have the following theorem.
4.1.4 THEOREM Let $f$ be twice differentiable on an open interval.
(a) If $f^{\prime \prime}(x)>0$ for every value of $x$ in the open interval, then $f$ is concave up on that interval.
(b) If $f^{\prime \prime}(x)<0$ for every value of $x$ in the open interval, then $f$ is concave down on that interval.

Example 4 Figure 4.1.4 suggests that the function $f(x)=x^{2}-4 x+3$ is concave up on the interval $(-\infty,+\infty)$. This is consistent with Theorem 4.1.4, since $f^{\prime}(x)=2 x-4$ and $f^{\prime \prime}(x)=2$, so

$$
f^{\prime \prime}(x)>0 \quad \text { on the interval }(-\infty,+\infty)
$$

Also, Figure 4.1.5 suggests that $f(x)=x^{3}$ is concave down on the interval ( $-\infty, 0$ ) and concave up on the interval $(0,+\infty)$. This agrees with Theorem 4.1.4, since $f^{\prime}(x)=3 x^{2}$ and $f^{\prime \prime}(x)=6 x$, so

$$
f^{\prime \prime}(x)<0 \quad \text { if } x<0 \quad \text { and } \quad f^{\prime \prime}(x)>0 \quad \text { if } x>0
$$

## INFLECTION POINTS

We see from Example 4 and Figure 4.1.5 that the graph of $f(x)=x^{3}$ changes from concave down to concave up at $x=0$. Points where a curve changes from concave up to concave down or vice versa are of special interest, so there is some terminology associated with them.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-170.jpg?height=528&width=361&top_left_y=682&top_left_x=212)
- Figure 4.1.9

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-170.jpg?height=612&width=463&top_left_y=1325&top_left_x=160)
- Figure 4.1.10

4.1.5 DEFINITION If $f$ is continuous on an open interval containing a value $x_{0}$, and if $f$ changes the direction of its concavity at the point $\left(x_{0}, f\left(x_{0}\right)\right)$, then we say that $f$ has an inflection point at $\boldsymbol{x}_{\mathbf{0}}$, and we call the point $\left(x_{0}, f\left(x_{0}\right)\right)$ on the graph of $f$ an inflection point of $f$ (Figure 4.1.9).

- Example 5 Figure 4.1.10 shows the graph of the function $f(x)=x^{3}-3 x^{2}+1$. Use the first and second derivatives of $f$ to determine the intervals on which $f$ is increasing, decreasing, concave up, and concave down. Locate all inflection points and confirm that your conclusions are consistent with the graph.

Solution. Calculating the first two derivatives of $f$ we obtain

$$
\begin{aligned}
& f^{\prime}(x)=3 x^{2}-6 x=3 x(x-2) \\
& f^{\prime \prime}(x)=6 x-6=6(x-1)
\end{aligned}
$$

The sign analysis of these derivatives is shown in the following tables:

| INTERVAL | $(3 x)(x-2)$ | $f^{\prime}(x)$ | CONCLUSION |
| :--- | :--- | :--- | :--- |
| $x<0$ | (-)(-) | + | $f$ is increasing on $(-\infty, 0]$ |
| $0<x<2$ | (+)(-) | - | $f$ is decreasing on [0,2] |
| $x>2$ | (+)(+) | + | $f$ is increasing on $[2,+\infty)$ |
| INTERVAL | $6(x-1)$ | $f^{\prime \prime}(x)$ | CONCLUSION |
| $x<1$ | (-) | - | $f$ is concave down on $(-\infty, 1)$ |
| $x>1$ | (+) | + | $f$ is concave up on ( $1,+\infty$ ) |

The second table shows that there is an inflection point at $x=1$, since $f$ changes from concave down to concave up at that point. The inflection point is $(1, f(1))=(1,-1)$. All of these conclusions are consistent with the graph of $f$.

One can correctly guess from Figure 4.1.10 that the function $f(x)=x^{3}-3 x^{2}+1$ has an inflection point at $x=1$ without actually computing derivatives. However, sometimes changes in concavity are so subtle that calculus is essential to confirm their existence and identify their location. Here is an example.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-171.jpg?height=299&width=383&top_left_y=200&top_left_x=256)
Figure 4.1.11

$$
f(x)=x e^{-x}
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-171.jpg?height=490&width=469&top_left_y=1573&top_left_x=214)
Figure 4.1.12

Example 6 Figure 4.1.11 suggests that the function $f(x)=x e^{-x}$ has an inflection point but its exact location is not evident from the graph in this figure. Use the first and second derivatives of $f$ to determine the intervals on which $f$ is increasing, decreasing, concave up, and concave down. Locate all inflection points.

Solution. Calculating the first two derivatives of $f$ we obtain (verify)

$$
\begin{aligned}
f^{\prime}(x) & =(1-x) e^{-x} \\
f^{\prime \prime}(x) & =(x-2) e^{-x}
\end{aligned}
$$

Keeping in mind that $e^{-x}$ is positive for all $x$, the sign analysis of these derivatives is easily determined:

| INTERVAL | $(1-x)\left(e^{-x}\right)$ | $f^{\prime}(x)$ | CONCLUSION |
| :---: | :---: | :---: | :---: |
| $x<1$ | $(+)(+)$ | + | $f$ is increasing on $(-\infty, 1]$ |
| $x>1$ | $(-)(+)$ | - | $f$ is decreasing on $[1,+\infty)$ |


| INTERVAL | $(x-2)\left(e^{-x}\right)$ | $f^{\prime \prime}(x)$ | CONCLUSION |
| :---: | :---: | :---: | :---: |
| $x<2$ | $(-)(+)$ | - | $f$ is concave down on $(-\infty, 2)$ |
| $x>2$ | $(+)(+)$ | + | $f$ is concave up on $(2,+\infty)$ |

The second table shows that there is an inflection point at $x=2$, since $f$ changes from concave down to concave up at that point. All of these conclusions are consistent with the graph of $f$.

Example 7 Figure 4.1.12 shows the graph of the function $f(x)=x+2 \sin x$ over the interval $[0,2 \pi]$. Use the first and second derivatives of $f$ to determine where $f$ is increasing, decreasing, concave up, and concave down. Locate all inflection points and confirm that your conclusions are consistent with the graph.

Solution. Calculating the first two derivatives of $f$ we obtain

$$
\begin{aligned}
f^{\prime}(x) & =1+2 \cos x \\
f^{\prime \prime}(x) & =-2 \sin x
\end{aligned}
$$

Since $f^{\prime}$ is a continuous function, it changes sign on the interval ( $0,2 \pi$ ) only at points where $f^{\prime}(x)=0$ (why?). These values are solutions of the equation

$$
1+2 \cos x=0 \quad \text { or equivalently } \quad \cos x=-\frac{1}{2}
$$

There are two solutions of this equation in the interval ( $0,2 \pi$ ), namely, $x=2 \pi / 3$ and $x=4 \pi / 3$ (verify). Similarly, $f^{\prime \prime}$ is a continuous function, so its sign changes in the interval ( $0,2 \pi$ ) will occur only at values of $x$ for which $f^{\prime \prime}(x)=0$. These values are solutions of the equation

$$
-2 \sin x=0
$$

The signs in the two tables of Example 7 can be obtained either using the method of test points or using the unit circle definition of the sine and cosine functions.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-172.jpg?height=545&width=461&top_left_y=1125&top_left_x=160)
Figure 4.1.13

Give an argument to show that the function $f(x)=x^{4}$ graphed in Figure 4.1.13 is concave up on the interval $(-\infty,+\infty)$.

There is one solution of this equation in the interval ( $0,2 \pi$ ), namely, $x=\pi$. With the help of these "sign transition points" we obtain the sign analysis shown in the following tables:

| INTERVAL | $f^{\prime}(x)=1+2 \cos x$ | CONCLUSION |
| :--- | :--- | :--- |
| $0<x<2 \pi / 3$ | + | $f$ is increasing on [ $0,2 \pi / 3$ ] |
| $2 \pi / 3<x<4 \pi / 3$ | - | $f$ is decreasing on $[2 \pi / 3,4 \pi / 3]$ |
| $4 \pi / 3<x<2 \pi$ | + | $f$ is increasing on $[4 \pi / 3,2 \pi]$ |
| INTERVAL | $f^{\prime \prime}(x)=-2 \sin x$ | CONCLUSION |
| $0<x<\pi$ | - | $f$ is concave down on ( $0, \pi$ ) |
| $\pi<x<2 \pi$ | + | $f$ is concave up on ( $\pi, 2 \pi$ ) |

The second table shows that there is an inflection point at $x=\pi$, since $f$ changes from concave down to concave up at that point. All of these conclusions are consistent with the graph of $f$.

In the preceding examples the inflection points of $f$ occurred wherever $f^{\prime \prime}(x)=0$. However, this is not always the case. Here is a specific example.

- Example 8 Find the inflection points, if any, of $f(x)=x^{4}$.

Solution. Calculating the first two derivatives of $f$ we obtain

$$
\begin{gathered}
f^{\prime}(x)=4 x^{3} \\
f^{\prime \prime}(x)=12 x^{2}
\end{gathered}
$$

Since $f^{\prime \prime}(x)$ is positive for $x<0$ and for $x>0$, the function $f$ is concave up on the interval $(-\infty, 0)$ and on the interval ( $0,+\infty$ ). Thus, there is no change in concavity and hence no inflection point at $x=0$, even though $f^{\prime \prime}(0)=0$ (Figure 4.1.13).

We will see later that if a function $f$ has an inflection point at $x=x_{0}$ and $f^{\prime \prime}\left(x_{0}\right)$ exists, then $f^{\prime \prime}\left(x_{0}\right)=0$. Also, we will see in Section 4.3 that an inflection point may also occur where $f^{\prime \prime}(x)$ is not defined.

## INFLECTION POINTS IN APPLICATIONS

Inflection points of a function $f$ are those points on the graph of $y=f(x)$ where the slopes of the tangent lines change from increasing to decreasing or vice versa (Figure 4.1.14). Since the slope of the tangent line at a point on the graph of $y=f(x)$ can be interpreted as the rate of change of $y$ with respect to $x$ at that point, we can interpret inflection points in the following way:

Inflection points mark the places on the curve $y=f(x)$ where the rate of change of $y$ with respect to $x$ changes from increasing to decreasing, or vice versa.

This is a subtle idea, since we are dealing with a change in a rate of change. It can help with your understanding of this idea to realize that inflection points may have interpretations in more familiar contexts. For example, consider the statement "Oil prices rose sharply during the first half of the year but have since begun to level off." If the price of oil is plotted as a function of time of year, this statement suggests the existence of an inflection point

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-173.jpg?height=732&width=469&top_left_y=242&top_left_x=214)
- Figure 4.1.14

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-173.jpg?height=325&width=467&top_left_y=1195&top_left_x=212)
Logistic growth curve

- Figure 4.1.16

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-173.jpg?height=352&width=467&top_left_y=1693&top_left_x=212)
- Figure 4.1.17

on the graph near the end of June. (Why?) To give a more visual example, consider the flask shown in Figure 4.1.15. Suppose that water is added to the flask so that the volume increases at a constant rate with respect to the time $t$, and let us examine the rate at which the water level $y$ rises with respect to $t$. Initially, the level $y$ will rise at a slow rate because of the wide base. However, as the diameter of the flask narrows, the rate at which the level $y$ rises will increase until the level is at the narrow point in the neck. From that point on the rate at which the level rises will decrease as the diameter gets wider and wider. Thus, the narrow point in the neck is the point at which the rate of change of $y$ with respect to $t$ changes from increasing to decreasing.

- Figure 4.1.15
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-173.jpg?height=434&width=1014&top_left_y=630&top_left_x=945)

## LOGISTIC CURVES

When a population grows in an environment in which space or food is limited, the graph of population versus time is typically an S-shaped curve of the form shown in Figure 4.1.16. The scenario described by this curve is a population that grows slowly at first and then more and more rapidly as the number of individuals producing offspring increases. However, at a certain point in time (where the inflection point occurs) the environmental factors begin to show their effect, and the growth rate begins a steady decline. Over an extended period of time the population approaches a limiting value that represents the upper limit on the number of individuals that the available space or food can sustain. Population growth curves of this type are called logistic growth curves.

- Example 9 We will see in a later chapter that logistic growth curves arise from equations of the form

$$
\begin{equation*}
y=\frac{L}{1+A e^{-k t}} \tag{1}
\end{equation*}
$$

where $y$ is the population at time $t(t \geq 0)$ and $A, k$, and $L$ are positive constants. Show that Figure 4.1.17 correctly describes the graph of this equation when $A>1$.

Solution. It follows from (1) that at time $t=0$ the value of $y$ is

$$
y=\frac{L}{1+A}
$$

and it follows from (1) and the fact that $0<e^{-k t} \leq 1$ for $t \geq 0$ that

$$
\begin{equation*}
\frac{L}{1+A} \leq y<L \tag{2}
\end{equation*}
$$

(verify). This is consistent with the graph in Figure 4.1.17. The horizontal asymptote at $y=L$ is confirmed by the limit

$$
\begin{equation*}
\lim _{t \rightarrow+\infty} y=\lim _{t \rightarrow+\infty} \frac{L}{1+A e^{-k t}}=\frac{L}{1+0}=L \tag{3}
\end{equation*}
$$

Physically, Formulas (2) and (3) tell us that $L$ is an upper limit on the population and that the population approaches this limit over time. Again, this is consistent with the graph in Figure 4.1.17.

To investigate intervals of increase and decrease, concavity, and inflection points, we need the first and second derivatives of $y$ with respect to $t$. By multiplying both sides of Equation (1) by $e^{k t}\left(1+A e^{-k t}\right)$, we can rewrite (1) as

$$
y e^{k t}+A y=L e^{k t}
$$

Using implicit differentiation, we can derive that

$$
\begin{align*}
& \frac{d y}{d t}=\frac{k}{L} y(L-y)  \tag{4}\\
& \frac{d^{2} y}{d t^{2}}=\frac{k^{2}}{L^{2}} y(L-y)(L-2 y) \tag{5}
\end{align*}
$$

(Exercise 70). Since $k>0, y>0$, and $L-y>0$, it follows from (4) that $d y / d t>0$ for all $t$. Thus, $y$ is always increasing, which is consistent with Figure 4.1.17.

Since $y>0$ and $L-y>0$, it follows from (5) that

$$
\begin{aligned}
& \frac{d^{2} y}{d t^{2}}>0 \quad \text { if } \quad L-2 y>0 \\
& \frac{d^{2} y}{d t^{2}}<0 \quad \text { if } \quad L-2 y<0
\end{aligned}
$$

Thus, the graph of $y$ versus $t$ is concave up if $y<L / 2$, concave down if $y>L / 2$, and has an inflection point where $y=L / 2$, all of which is consistent with Figure 4.1.17.

Finally, we leave it for you to solve the equation

$$
\frac{L}{2}=\frac{L}{1+A e^{-k t}}
$$

for $t$ to show that the inflection point occurs at

$$
\begin{equation*}
t=\frac{1}{k} \ln A=\frac{\ln A}{k} \tag{6}
\end{equation*}
$$

## QUICK CHECK EXERCISES 4.1 (See page 244 for answers.)

1. (a) A function $f$ is increasing on $(a, b)$ if $\_\_\_\_$ whenever $a<x_{1}<x_{2}<b$.
(b) A function $f$ is decreasing on ( $a, b$ ) if $\_\_\_\_$ whenever $a<x_{1}<x_{2}<b$.
(c) A function $f$ is concave up on ( $a, b$ ) if $f^{\prime}$ is $\_\_\_\_$ on $(a, b)$.
(d) If $f^{\prime \prime}(a)$ exists and $f$ has an inflection point at $x=a$, then $f^{\prime \prime}(a)$ $\_\_\_\_$ .
2. Let $f(x)=0.1\left(x^{3}-3 x^{2}-9 x\right)$. Then

$$
\begin{aligned}
f^{\prime}(x) & =0.1\left(3 x^{2}-6 x-9\right)=0.3(x+1)(x-3) \\
f^{\prime \prime}(x) & =0.6(x-1)
\end{aligned}
$$

(a) Solutions to $f^{\prime}(x)=0$ are $x=$ $\_\_\_\_$ .
(b) The function $f$ is increasing on the interval(s) $\_\_\_\_$ .
(c) The function $f$ is concave down on the interval(s)
$\_\_\_\_$ .
(d) $\_\_\_\_$ is an inflection point on the graph of $f$.
3. Suppose that $f(x)$ has derivative $f^{\prime}(x)=(x-4)^{2} e^{-x / 2}$. Then $f^{\prime \prime}(x)=-\frac{1}{2}(x-4)(x-8) e^{-x / 2}$.
(a) The function $f$ is increasing on the interval(s) $\_\_\_\_$ .
(b) The function $f$ is concave up on the interval(s)
$\_\_\_\_$ .
(c) The function $f$ is concave down on the interval(s)
$\_\_\_\_$ .
4. Consider the statement "The rise in the cost of living slowed during the first half of the year." If we graph the cost of living versus time for the first half of the year, how does the graph reflect this statement?

## FOCUS ON CONCEPTS

1. In each part, sketch the graph of a function $f$ with the stated properties, and discuss the signs of $f^{\prime}$ and $f^{\prime \prime}$.
(a) The function $f$ is concave up and increasing on the interval $(-\infty,+\infty)$.
(b) The function $f$ is concave down and increasing on the interval $(-\infty,+\infty)$.
(c) The function $f$ is concave up and decreasing on the interval $(-\infty,+\infty)$.
(d) The function $f$ is concave down and decreasing on the interval $(-\infty,+\infty)$.
2. In each part, sketch the graph of a function $f$ with the stated properties.
(a) $f$ is increasing on $(-\infty,+\infty)$, has an inflection point at the origin, and is concave up on ( $0,+\infty$ ).
(b) $f$ is increasing on $(-\infty,+\infty)$, has an inflection point at the origin, and is concave down on $(0,+\infty)$.
(c) $f$ is decreasing on $(-\infty,+\infty)$, has an inflection point at the origin, and is concave up on ( $0,+\infty$ ).
(d) $f$ is decreasing on $(-\infty,+\infty)$, has an inflection point at the origin, and is concave down on $(0,+\infty)$.
3. Use the graph of the equation $y=f(x)$ in the accompanying figure to find the signs of $d y / d x$ and $d^{2} y / d x^{2}$ at the points $A, B$, and $C$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-175.jpg?height=317&width=323&top_left_y=1357&top_left_x=276)
-Figure Ex-3

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-175.jpg?height=325&width=340&top_left_y=2022&top_left_x=266)
- Figure Ex-4

4. Use the graph of the equation $y=f^{\prime}(x)$ in the accompanying figure to find the signs of $d y / d x$ and $d^{2} y / d x^{2}$ at the points $A, B$, and $C$.
5. Use the graph of $y=f^{\prime \prime}(x)$ in the accompanying figure

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-175.jpg?height=327&width=390&top_left_y=2022&top_left_x=650)
- Figure Ex-5

6. Use the graph of $y=f^{\prime}(x)$ in the accompanying figure to replace the question mark with $<,=$, or $>$, as appropriate. Explain your reasoning.
(a) $f(0) ? f(1)$
(b) $f(1) ? f(2)$
(c) $f^{\prime}(0) ? 0$
(d) $f^{\prime}(1) ? 0$
(e) $f^{\prime \prime}(0) ? 0$
(f) $f^{\prime \prime}(2) ? 0$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-175.jpg?height=332&width=391&top_left_y=532&top_left_x=1187)
Figure Ex-6

7. In each part, use the graph of $y=f(x)$ in the accompanying figure to find the requested information.
(a) Find the intervals on which $f$ is increasing.
(b) Find the intervals on which $f$ is decreasing.
(c) Find the open intervals on which $f$ is concave up.
(d) Find the open intervals on which $f$ is concave down.
(e) Find all values of $x$ at which $f$ has an inflection point.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-175.jpg?height=371&width=778&top_left_y=1189&top_left_x=1187)
- Figure Ex-7

8. Use the graph in Exercise 7 to make a table that shows the signs of $f^{\prime}$ and $f^{\prime \prime}$ over the intervals $(1,2),(2,3),(3,4)$, $(4,5),(5,6)$, and $(6,7)$.

9-10 A sign chart is presented for the first and second derivatives of a function $f$. Assuming that $f$ is continuous everywhere, find: (a) the intervals on which $f$ is increasing, (b) the intervals on which $f$ is decreasing, (c) the open intervals on which $f$ is concave up, (d) the open intervals on which $f$ is concave down, and (e) the $x$-coordinates of all inflection points.
9.

| INTERVAL | SIGN OF $f^{\prime}(x)$ | SIGN OF $f^{\prime \prime}(x)$ |
| :--- | :---: | :---: |
| $x<1$ | - | + |
| $1<x<2$ | + | + |
| $2<x<3$ | + | - |
| $3<x<4$ | - | - |
| $4<x$ | - | + |

10. 

| INTERVAL | SIGN OF $f^{\prime}(x)$ | SIGN OF $f^{\prime \prime}(x)$ |
| :--- | :---: | :---: |
| $x<1$ | + | + |
| $1<x<3$ | + | - |
| $3<x$ | + | + |

11-14 True-False Assume that $f$ is differentiable everywhere. Determine whether the statement is true or false. Explain your answer.
11. If $f$ is decreasing on $[0,2]$, then $f(0)>f(1)>f(2)$.
12. If $f^{\prime}(1)>0$, then $f$ is increasing on $[0,2]$.
13. If $f$ is increasing on $[0,2]$, then $f^{\prime}(1)>0$.
14. If $f^{\prime}$ is increasing on $[0,1]$ and $f^{\prime}$ is decreasing on $[1,2]$, then $f$ has an inflection point at $x=1$.

15-32 Find: (a) the intervals on which $f$ is increasing, (b) the intervals on which $f$ is decreasing, (c) the open intervals on which $f$ is concave up, (d) the open intervals on which $f$ is concave down, and (e) the $x$-coordinates of all inflection points.
15. $f(x)=x^{2}-3 x+8$
16. $f(x)=5-4 x-x^{2}$
17. $f(x)=(2 x+1)^{3}$
18. $f(x)=5+12 x-x^{3}$
19. $f(x)=3 x^{4}-4 x^{3}$
20. $f(x)=x^{4}-5 x^{3}+9 x^{2}$
21. $f(x)=\frac{x-2}{\left(x^{2}-x+1\right)^{2}}$
22. $f(x)=\frac{x}{x^{2}+2}$
23. $f(x)=\sqrt[3]{x^{2}+x+1}$
24. $f(x)=x^{4 / 3}-x^{1 / 3}$
25. $f(x)=\left(x^{2 / 3}-1\right)^{2}$
26. $f(x)=x^{2 / 3}-x$
27. $f(x)=e^{-x^{2} / 2}$
28. $f(x)=x e^{x^{2}}$
29. $f(x)=\ln \sqrt{x^{2}+4}$
30. $f(x)=x^{3} \ln x$
31. $f(x)=\tan ^{-1}\left(x^{2}-1\right)$
32. $f(x)=\sin ^{-1} x^{2 / 3}$

33-38 Analyze the trigonometric function $f$ over the specified interval, stating where $f$ is increasing, decreasing, concave up, and concave down, and stating the $x$-coordinates of all inflection points. Confirm that your results are consistent with the graph of $f$ generated with a graphing utility.
33. $f(x)=\sin x-\cos x ;[-\pi, \pi]$
34. $f(x)=\sec x \tan x ;(-\pi / 2, \pi / 2)$
35. $f(x)=1-\tan (x / 2) ;(-\pi, \pi)$
36. $f(x)=2 x+\cot x ;(0, \pi)$
37. $f(x)=(\sin x+\cos x)^{2} ;[-\pi, \pi]$
38. $f(x)=\sin ^{2} 2 x ;[0, \pi]$

## FOCUS ON CONCEPTS

39. In parts (a)-(c), sketch a continuous curve $y=f(x)$ with the stated properties.
(a) $f(2)=4, f^{\prime}(2)=0, f^{\prime \prime}(x)>0$ for all $x$
(b) $f(2)=4, f^{\prime}(2)=0, f^{\prime \prime}(x)<0$ for $x<2, f^{\prime \prime}(x)>0$ for $x>2$
(c) $f(2)=4, f^{\prime \prime}(x)<0$ for $x \neq 2$ and $\lim _{x \rightarrow 2^{+}} f^{\prime}(x)=+\infty, \lim _{x \rightarrow 2^{-}} f^{\prime}(x)=-\infty$
40. In each part sketch a continuous curve $y=f(x)$ with the stated properties.
(a) $f(2)=4, f^{\prime}(2)=0, f^{\prime \prime}(x)<0$ for all $x$
(b) $f(2)=4, f^{\prime}(2)=0, f^{\prime \prime}(x)>0$ for $x<2, f^{\prime \prime}(x)<0$ for $x>2$
(c) $f(2)=4, f^{\prime \prime}(x)>0$ for $x \neq 2$ and $\lim _{x \rightarrow 2^{+}} f^{\prime}(x)=-\infty, \lim _{x \rightarrow 2^{-}} f^{\prime}(x)=+\infty$

41-46 If $f$ is increasing on an interval $[0, b)$, then it follows from Definition 4.1.1 that $f(0)<f(x)$ for each $x$ in the interval $(0, b)$. Use this result in these exercises.
41. Show that $\sqrt[3]{1+x}<1+\frac{1}{3} x$ if $x>0$, and confirm the inequality with a graphing utility. [Hint: Show that the function $f(x)=1+\frac{1}{3} x-\sqrt[3]{1+x}$ is increasing on $[0,+\infty)$.]
42. Show that $x<\tan x$ if $0<x<\pi / 2$, and confirm the inequality with a graphing utility. [Hint: Show that the function $f(x)=\tan x-x$ is increasing on $[0, \pi / 2)$.]
43. Use a graphing utility to make a conjecture about the relative sizes of $x$ and $\sin x$ for $x \geq 0$, and prove your conjecture.
44. Use a graphing utility to make a conjecture about the relative sizes of $1-x^{2} / 2$ and $\cos x$ for $x \geq 0$, and prove your conjecture. [Hint: Use the result of Exercise 43.]
45. (a) Show that $\ln (x+1) \leq x$ if $x \geq 0$.
(b) Show that $\ln (x+1) \geq x-\frac{1}{2} x^{2}$ if $x \geq 0$.
(c) Confirm the inequalities in parts (a) and (b) with a graphing utility.
46. (a) Show that $e^{x} \geq 1+x$ if $x \geq 0$.
(b) Show that $e^{x} \geq 1+x+\frac{1}{2} x^{2}$ if $x \geq 0$.
(c) Confirm the inequalities in parts (a) and (b) with a graphing utility.

47-48 Use a graphing utility to generate the graphs of $f^{\prime}$ and $f^{\prime \prime}$ over the stated interval; then use those graphs to estimate the $x$-coordinates of the inflection points of $f$, the intervals on which $f$ is concave up or down, and the intervals on which $f$ is increasing or decreasing. Check your estimates by graphing $f$.
47. $f(x)=x^{4}-24 x^{2}+12 x, \quad-5 \leq x \leq 5$
48. $f(x)=\frac{1}{1+x^{2}}, \quad-5 \leq x \leq 5$

C 49-50 Use a CAS to find $f^{\prime \prime}$ and to approximate the $x$ coordinates of the inflection points to six decimal places. Confirm that your answer is consistent with the graph of $f$.
49. $f(x)=\frac{10 x-3}{3 x^{2}-5 x+8}$
50. $f(x)=\frac{x^{3}-8 x+7}{\sqrt{x^{2}+1}}$
51. Use Definition 4.1.1 to prove that $f(x)=x^{2}$ is increasing on $[0,+\infty)$.
52. Use Definition 4.1.1 to prove that $f(x)=1 / x$ is decreasing on $(0,+\infty)$.

## FOCUS ON CONCEPTS

53-54 Determine whether the statements are true or false. If a statement is false, find functions for which the statement fails to hold.
53. (a) If $f$ and $g$ are increasing on an interval, then so is $f+g$.
(b) If $f$ and $g$ are increasing on an interval, then so is $f \cdot g$.
54. (a) If $f$ and $g$ are concave up on an interval, then so is $f+g$.
(b) If $f$ and $g$ are concave up on an interval, then so is $f \cdot g$.
55. In each part, find functions $f$ and $g$ that are increasing on $(-\infty,+\infty)$ and for which $f-g$ has the stated property.
(a) $f-g$ is decreasing on $(-\infty,+\infty)$.
(b) $f-g$ is constant on $(-\infty,+\infty)$.
(c) $f-g$ is increasing on $(-\infty,+\infty)$.
56. In each part, find functions $f$ and $g$ that are positive and increasing on $(-\infty,+\infty)$ and for which $f / g$ has the stated property.
(a) $f / g$ is decreasing on $(-\infty,+\infty)$.
(b) $f / g$ is constant on $(-\infty,+\infty)$.
(c) $f / g$ is increasing on $(-\infty,+\infty)$.
57. (a) Prove that a general cubic polynomial

$$
f(x)=a x^{3}+b x^{2}+c x+d \quad(a \neq 0)
$$

has exactly one inflection point.
(b) Prove that if a cubic polynomial has three $x$-intercepts, then the inflection point occurs at the average value of the intercepts.
(c) Use the result in part (b) to find the inflection point of the cubic polynomial $f(x)=x^{3}-3 x^{2}+2 x$, and check your result by using $f^{\prime \prime}$ to determine where $f$ is concave up and concave down.
58. From Exercise 57, the polynomial $f(x)=x^{3}+b x^{2}+1$ has one inflection point. Use a graphing utility to reach a conclusion about the effect of the constant $b$ on the location of the inflection point. Use $f^{\prime \prime}$ to explain what you have observed graphically.
59. Use Definition 4.1.1 to prove:
(a) If $f$ is increasing on the intervals $(a, c]$ and $[c, b)$, then $f$ is increasing on $(a, b)$.
(b) If $f$ is decreasing on the intervals $(a, c]$ and $[c, b)$, then $f$ is decreasing on ( $a, b$ ).
60. Use part (a) of Exercise 59 to show that $f(x)=x+\sin x$ is increasing on the interval $(-\infty,+\infty)$.
61. Use part (b) of Exercise 59 to show that $f(x)=\cos x-x$ is decreasing on the interval $(-\infty,+\infty)$.
62. Let $y=1 /\left(1+x^{2}\right)$. Find the values of $x$ for which $y$ is increasing most rapidly or decreasing most rapidly.

## FOCUS ON CONCEPTS

63-66 Suppose that water is flowing at a constant rate into the container shown. Make a rough sketch of the graph of the water level $y$ versus the time $t$. Make sure that your sketch conveys where the graph is concave up and concave down, and label the $y$-coordinates of the inflection points.
63.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-177.jpg?height=319&width=283&top_left_y=468&top_left_x=1205)
64.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-177.jpg?height=323&width=236&top_left_y=464&top_left_x=1573)
65.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-177.jpg?height=464&width=241&top_left_y=788&top_left_x=1205)
66.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-177.jpg?height=464&width=270&top_left_y=788&top_left_x=1571)
67. Suppose that a population $y$ grows according to the logistic model given by Formula (1).
(a) At what rate is $y$ increasing at time $t=0$ ?
(b) In words, describe how the rate of growth of $y$ varies with time.
(c) At what time is the population growing most rapidly?
68. Suppose that the number of individuals at time $t$ in a certain wildlife population is given by

$$
N(t)=\frac{340}{1+9(0.77)^{t}}, \quad t \geq 0
$$

where $t$ is in years. Use a graphing utility to estimate the time at which the size of the population is increasing most rapidly.
69. Suppose that the spread of a flu virus on a college campus is modeled by the function

$$
y(t)=\frac{1000}{1+999 e^{-0.9 t}}
$$

where $y(t)$ is the number of infected students at time $t$ (in days, starting with $t=0$ ). Use a graphing utility to estimate the day on which the virus is spreading most rapidly.
70. The logistic growth model given in Formula (1) is equivalent to

$$
y e^{k t}+A y=L e^{k t}
$$

where $y$ is the population at time $t(t \geq 0)$ and $A, k$, and $L$
are positive constants. Use implicit differentiation to verify that

$$
\begin{aligned}
& \frac{d y}{d t}=\frac{k}{L} y(L-y) \\
& \frac{d^{2} y}{d t^{2}}=\frac{k^{2}}{L^{2}} y(L-y)(L-2 y)
\end{aligned}
$$

71. Assuming that $A, k$, and $L$ are positive constants, verify that the graph of $y=L /\left(1+A e^{-k t}\right)$ has an inflection point at $\left(\frac{1}{k} \ln A, \frac{1}{2} L\right)$.
72. Writing An approaching storm causes the air temperature to fall. Make a statement that indicates there is an inflection point in the graph of temperature versus time. Explain how the existence of an inflection point follows from your statement.
73. Writing Explain what the sign analyses of $f^{\prime}(x)$ and $f^{\prime \prime}(x)$ tell us about the graph of $y=f(x)$.

## QUICK CHECK ANSWERS 4.1

1. (a) $f\left(x_{1}\right)<f\left(x_{2}\right)$
(b) $f\left(x_{1}\right)>f\left(x_{2}\right)$
(c) increasing (d) $=0$
2. (a) $-1,3$
(b) $(-\infty,-1]$ and $[3,+\infty)$
(c) $(-\infty, 1)$
(d) $(1,-1.1)$
3. (a) $(-\infty,+\infty)$
(b) $(4,8)$
(c) $(-\infty, 4),(8,+\infty)$
4. The graph is increasing and concave down.

### 4.2 ANALYSIS OF FUNCTIONS II: RELATIVE EXTREMA; GRAPHING POLYNOMIALS

In this section we will develop methods for finding the high and low points on the graph of a function and we will discuss procedures for analyzing the graphs of polynomials.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-178.jpg?height=297&width=475&top_left_y=1317&top_left_x=156)
- Figure 4.2.1

## RELATIVE MAXIMA AND MINIMA

If we imagine the graph of a function $f$ to be a two-dimensional mountain range with hills and valleys, then the tops of the hills are called "relative maxima," and the bottoms of the valleys are called "relative minima" (Figure 4.2.1). The relative maxima are the high points in their immediate vicinity, and the relative minima are the low points. A relative maximum need not be the highest point in the entire mountain range, and a relative minimum need not be the lowest point-they are just high and low points relative to the nearby terrain. These ideas are captured in the following definition.
4.2.1 DEFINITION A function $f$ is said to have a relative maximum at $x_{0}$ if there is an open interval containing $x_{0}$ on which $f\left(x_{0}\right)$ is the largest value, that is, $f\left(x_{0}\right) \geq f(x)$ for all $x$ in the interval. Similarly, $f$ is said to have a relative minimum at $x_{0}$ if there is an open interval containing $x_{0}$ on which $f\left(x_{0}\right)$ is the smallest value, that is, $f\left(x_{0}\right) \leq f(x)$ for all $x$ in the interval. If $f$ has either a relative maximum or a relative minimum at $x_{0}$, then $f$ is said to have a relative extremum at $x_{0}$.

- Example 1 We can see from Figure 4.2.2 that:
- $f(x)=x^{2}$ has a relative minimum at $x=0$ but no relative maxima.
- $f(x)=x^{3}$ has no relative extrema.
- $f(x)=x^{3}-3 x+3$ has a relative maximum at $x=-1$ and a relative minimum at $x=1$.
- $f(x)=\frac{1}{2} x^{4}-\frac{4}{3} x^{3}-x^{2}+4 x+1$ has relative minima at $x=-1$ and $x=2$ and a relative maximum at $x=1$.
- $f(x)=\cos x$ has relative maxima at all even multiples of $\pi$ and relative minima at all odd multiples of $\pi$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-179.jpg?height=530&width=1745&top_left_y=378&top_left_x=224)
- Figure 4.2.2

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-179.jpg?height=321&width=469&top_left_y=1043&top_left_x=214)
Figure 4.2.3 The points $x_{1}, x_{2}, x_{3}$, $x_{4}$, and $x_{5}$ are critical points. Of these, $x_{1}, x_{2}$, and $x_{5}$ are stationary points.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-179.jpg?height=550&width=467&top_left_y=1497&top_left_x=212)
Figure 4.2.4

What is the maximum number of critical points that a polynomial of degree $n$ can have? Why?

The relative extrema for the five functions in Example 1 occur at points where the graphs of the functions have horizontal tangent lines. Figure 4.2.3 illustrates that a relative extremum can also occur at a point where a function is not differentiable. In general, we define a critical point for a function $f$ to be a point in the domain of $f$ at which either the graph of $f$ has a horizontal tangent line or $f$ is not differentiable. To distinguish between the two types of critical points we call $x$ a stationary point of $f$ if $f^{\prime}(x)=0$. The following theorem, which is proved in Appendix D, states that the critical points for a function form a complete set of candidates for relative extrema on the interior of the domain of the function.
4.2.2 THEOREM Suppose that $f$ is a function defined on an open interval containing the point $x_{0}$. If $f$ has a relative extremum at $x=x_{0}$, then $x=x_{0}$ is a critical point of $f$; that is, either $f^{\prime}\left(x_{0}\right)=0$ or $f$ is not differentiable at $x_{0}$.

Example 2 Find all critical points of $f(x)=x^{3}-3 x+1$.

Solution. The function $f$, being a polynomial, is differentiable everywhere, so its critical points are all stationary points. To find these points we must solve the equation $f^{\prime}(x)=0$. Since

$$
f^{\prime}(x)=3 x^{2}-3=3(x+1)(x-1)
$$

we conclude that the critical points occur at $x=-1$ and $x=1$. This is consistent with the graph of $f$ in Figure 4.2.4.

Example 3 Find all critical points of $f(x)=3 x^{5 / 3}-15 x^{2 / 3}$.

Solution. The function $f$ is continuous everywhere and its derivative is

$$
f^{\prime}(x)=5 x^{2 / 3}-10 x^{-1 / 3}=5 x^{-1 / 3}(x-2)=\frac{5(x-2)}{x^{1 / 3}}
$$

We see from this that $f^{\prime}(x)=0$ if $x=2$ and $f^{\prime}(x)$ is undefined if $x=0$. Thus $x=0$ and $x=2$ are critical points and $x=2$ is a stationary point. This is consistent with the graph of $f$ shown in Figure 4.2.5.

## TECHNOLOGY

MASTERY

Your graphing utility may have trouble producing portions of the graph in Figure 4.2.5 because of the fractional exponents. If this is the case for you, graph the function

$$
y=3(|x| / x)|x|^{5 / 3}-15|x|^{2 / 3}
$$

which is equivalent to $f(x)$ for $x \neq 0$. Appendix A explores the method suggested here in more detail.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-180.jpg?height=520&width=387&top_left_y=684&top_left_x=200)
△ Figure 4.2.5

## FIRST DERIVATIVE TEST

Theorem 4.2.2 asserts that the relative extrema must occur at critical points, but it does not say that a relative extremum occurs at every critical point. For example, for the eight critical points in Figure 4.2.6, relative extrema occur at each $x_{0}$ in the top row but not at any $x_{0}$ in the bottom row. Moreover, at the critical points in the first row the derivatives have opposite signs on the two sides of $x_{0}$, whereas at the critical points in the second row the signs of the derivatives are the same on both sides. This suggests:

A function $f$ has a relative extremum at those critical points where $f^{\prime}$ changes sign.

△ Figure 4.2.5
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-180.jpg?height=930&width=1375&top_left_y=1205&top_left_x=544)

We can actually take this a step further. At the two relative maxima in Figure 4.2.6 the derivative is positive on the left side and negative on the right side, and at the two relative minima the derivative is negative on the left side and positive on the right side. All of this is summarized more precisely in the following theorem.

Informally stated, parts (a) and (b) of Theorem 4.2.3 tell us that for a continuous function, relative maxima occur at critical points where the derivative changes from + to - and relative minima where it changes from - to +.

Use the first derivative test to confirm the behavior at $x_{0}$ of each graph in Figure 4.2.6.

Table 4.2.1
| INTERVAL | $5(x-2) / x^{1 / 3}$ | $f^{\prime}(x)$ |
| :--- | :---: | :---: |
| $x<0$ | $(-) /(-)$ | + |
| $0<x<2$ | $(-) /(+)$ | - |
| $x>2$ | $(+) /(+)$ | + |


![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-181.jpg?height=353&width=461&top_left_y=1772&top_left_x=216)
△ Figure 4.2.7

4.2.3 THEOREM (First Derivative Test) Suppose that $f$ is continuous at a critical point $x_{0}$.
(a) If $f^{\prime}(x)>0$ on an open interval extending left from $x_{0}$ and $f^{\prime}(x)<0$ on an open interval extending right from $x_{0}$, then $f$ has a relative maximum at $x_{0}$.
(b) If $f^{\prime}(x)<0$ on an open interval extending left from $x_{0}$ and $f^{\prime}(x)>0$ on an open interval extending right from $x_{0}$, then $f$ has a relative minimum at $x_{0}$.
(c) If $f^{\prime}(x)$ has the same sign on an open interval extending left from $x_{0}$ as it does on an open interval extending right from $x_{0}$, then $f$ does not have a relative extremum at $x_{0}$.
proof We will prove part (a) and leave parts (b) and (c) as exercises. We are assuming that $f^{\prime}(x)>0$ on the interval ( $a, x_{0}$ ) and that $f^{\prime}(x)<0$ on the interval ( $x_{0}, b$ ), and we want to show that

$$
f\left(x_{0}\right) \geq f(x)
$$

for all $x$ in the interval $(a, b)$. However, the two hypotheses, together with Theorem 4.1.2 and its associated marginal note imply that $f$ is increasing on the interval ( $a, x_{0}$ ] and decreasing on the interval $\left[x_{0}, b\right)$. Thus, $f\left(x_{0}\right) \geq f(x)$ for all $x$ in ( $a, b$ ) with equality only at $x_{0}$.

Example 4 We showed in Example 3 that the function $f(x)=3 x^{5 / 3}-15 x^{2 / 3}$ has critical points at $x=0$ and $x=2$. Figure 4.2.5 suggests that $f$ has a relative maximum at $x=0$ and a relative minimum at $x=2$. Confirm this using the first derivative test.

Solution. We showed in Example 3 that

$$
f^{\prime}(x)=\frac{5(x-2)}{x^{1 / 3}}
$$

A sign analysis of this derivative is shown in Table 4.2.1. The sign of $f^{\prime}$ changes from + to - at $x=0$, so there is a relative maximum at that point. The sign changes from - to + at $x=2$, so there is a relative minimum at that point.

## SECOND DERIVATIVE TEST

There is another test for relative extrema that is based on the following geometric observation: A function $f$ has a relative maximum at a stationary point if the graph of $f$ is concave down on an open interval containing that point, and it has a relative minimum if it is concave up (Figure 4.2.7).
4.2.4 THEOREM (Second Derivative Test) Suppose that $f$ is twice differentiable at the point $x_{0}$.
(a) If $f^{\prime}\left(x_{0}\right)=0$ and $f^{\prime \prime}\left(x_{0}\right)>0$, then $f$ has a relative minimum at $x_{0}$.
(b) If $f^{\prime}\left(x_{0}\right)=0$ and $f^{\prime \prime}\left(x_{0}\right)<0$, then $f$ has a relative maximum at $x_{0}$.
(c) If $f^{\prime}\left(x_{0}\right)=0$ and $f^{\prime \prime}\left(x_{0}\right)=0$, then the test is inconclusive; that is, $f$ may have a relative maximum, a relative minimum, or neither at $x_{0}$.

The second derivative test is often easier to apply than the first derivative test. However, the first derivative test can be used at any critical point of a continuous function, while the second derivative test applies only at stationary points where the second derivative exists.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-182.jpg?height=555&width=473&top_left_y=1778&top_left_x=154)
- Figure 4.2.8

We will prove parts (a) and (c) and leave part (b) as an exercise.
proof (a) We are given that $f^{\prime}\left(x_{0}\right)=0$ and $f^{\prime \prime}\left(x_{0}\right)>0$, and we want to show that $f$ has a relative minimum at $x_{0}$. Expressing $f^{\prime \prime}\left(x_{0}\right)$ as a limit and using the two given conditions we obtain

$$
f^{\prime \prime}\left(x_{0}\right)=\lim _{x \rightarrow x_{0}} \frac{f^{\prime}(x)-f^{\prime}\left(x_{0}\right)}{x-x_{0}}=\lim _{x \rightarrow x_{0}} \frac{f^{\prime}(x)}{x-x_{0}}>0
$$

This implies that for $x$ sufficiently close to but different from $x_{0}$ we have

$$
\begin{equation*}
\frac{f^{\prime}(x)}{x-x_{0}}>0 \tag{1}
\end{equation*}
$$

Thus, there is an open interval extending left from $x_{0}$ and an open interval extending right from $x_{0}$ on which (1) holds. On the open interval extending left the denominator in (1) is negative, so $f^{\prime}(x)<0$, and on the open interval extending right the denominator is positive, so $f^{\prime}(x)>0$. It now follows from part (b) of the first derivative test (Theorem 4.2.3) that $f$ has a relative minimum at $x_{0}$.

PROOF (c) To prove this part of the theorem we need only provide functions for which $f^{\prime}\left(x_{0}\right)=0$ and $f^{\prime \prime}\left(x_{0}\right)=0$ at some point $x_{0}$, but with one having a relative minimum at $x_{0}$, one having a relative maximum at $x_{0}$, and one having neither at $x_{0}$. We leave it as an exercise for you to show that three such functions are $f(x)=x^{4}$ (relative minimum at $x=0$ ), $f(x)=-x^{4}$ (relative maximum at $x=0$ ), and $f(x)=x^{3}$ (neither a relative maximum nor a relative minimum at $x_{0}$ ).

Example 5 Find the relative extrema of $f(x)=3 x^{5}-5 x^{3}$.
Solution. We have

$$
\begin{aligned}
f^{\prime}(x) & =15 x^{4}-15 x^{2}=15 x^{2}\left(x^{2}-1\right)=15 x^{2}(x+1)(x-1) \\
f^{\prime \prime}(x) & =60 x^{3}-30 x=30 x\left(2 x^{2}-1\right)
\end{aligned}
$$

Solving $f^{\prime}(x)=0$ yields the stationary points $x=0, x=-1$, and $x=1$. As shown in the following table, we can conclude from the second derivative test that $f$ has a relative maximum at $x=-1$ and a relative minimum at $x=1$.

| STATIONARY POINT | $30 x\left(2 x^{2}-1\right)$ | $f^{\prime \prime}(x)$ | SECOND DERIVATIVE TEST |
| :---: | :---: | :---: | :--- |
| $x=-1$ | -30 | - | $f$ has a relative maximum |
| $x=0$ | 0 | 0 | Inconclusive |
| $x=1$ | 30 | + | $f$ has a relative minimum |

The test is inconclusive at $x=0$, so we will try the first derivative test at that point. A sign analysis of $f^{\prime}$ is given in the following table:

| INTERVAL | $15 x^{2}(x+1)(x-1)$ | $f^{\prime}(x)$ |
| ---: | ---: | ---: |
| $-1<x<0$ | $(+)(+)(-)$ | - |
| $0<x<1$ | $(+)(+)(-)$ | - |

Since there is no sign change in $f^{\prime}$ at $x=0$, there is neither a relative maximum nor a relative minimum at that point. All of this is consistent with the graph of $f$ shown in Figure 4.2.8.

## GEOMETRIC IMPLICATIONS OF MULTIPLICITY

Our final goal in this section is to outline a general procedure that can be used to analyze and graph polynomials. To do so, it will be helpful to understand how the graph of a polynomial behaves in the vicinity of its roots. For example, it would be nice to know what property of the polynomial in Example 5 produced the inflection point and horizontal tangent at the root $x=0$.

Recall that a root $x=r$ of a polynomial $p(x)$ has multiplicity $\boldsymbol{m}$ if $(x-r)^{m}$ divides $p(x)$ but $(x-r)^{m+1}$ does not. A root of multiplicity 1 is called a simple root. Figure 4.2.9 and the following theorem show that the behavior of a polynomial in the vicinity of a real root is determined by the multiplicity of that root (we omit the proof).
4.2.5 THE GEOMETRIC IMPLICATIONS OF MULTIPLICITY Suppose that $p(x)$ is a polynomial with a root of multiplicity $m$ at $x=r$.
(a) If $m$ is even, then the graph of $y=p(x)$ is tangent to the $x$-axis at $x=r$, does not cross the $x$-axis there, and does not have an inflection point there.
(b) If $m$ is odd and greater than 1 , then the graph is tangent to the $x$-axis at $x=r$, crosses the $x$-axis there, and also has an inflection point there.
(c) If $m=1$ (so that the root is simple), then the graph is not tangent to the $x$-axis at $x=r$, crosses the $x$-axis there, and may or may not have an inflection point there.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-183.jpg?height=423&width=1621&top_left_y=1253&top_left_x=346)
△ Figure 4.2.9

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-183.jpg?height=551&width=467&top_left_y=1766&top_left_x=214)
\$ Figure 4.2.10

Example 6 Make a conjecture about the behavior of the graph of

$$
y=x^{3}(3 x-4)(x+2)^{2}
$$

in the vicinity of its $x$-intercepts, and test your conjecture by generating the graph.
Solution. The $x$-intercepts occur at $x=0, x=\frac{4}{3}$, and $x=-2$. The root $x=0$ has multiplicity 3 , which is odd, so at that point the graph should be tangent to the $x$-axis, cross the $x$-axis, and have an inflection point there. The root $x=-2$ has multiplicity 2 , which is even, so the graph should be tangent to but not cross the $x$-axis there. The root $x=\frac{4}{3}$ is simple, so at that point the curve should cross the $x$-axis without being tangent to it. All of this is consistent with the graph in Figure 4.2.10.

For each of the graphs in Figure 4.2.11, count the number of $x$-intercepts, relative extrema, and inflection points, and confirm that your count is consistent with the degree of the polynomial.

## ANALYSIS OF POLYNOMIALS

Historically, the term "curve sketching" meant using calculus to help draw the graph of a function by hand-the graph was the goal. Since graphs can now be produced with great precision using calculators and computers, the purpose of curve sketching has changed. Today, we typically start with a graph produced by a calculator or computer, then use curve sketching to identify important features of the graph that the calculator or computer might have missed. Thus, the goal of curve sketching is no longer the graph itself, but rather the information it reveals about the function.

Polynomials are among the simplest functions to graph and analyze. Their significant features are symmetry, intercepts, relative extrema, inflection points, and the behavior as $x \rightarrow+\infty$ and as $x \rightarrow-\infty$. Figure 4.2.11 shows the graphs of four polynomials in $x$. The graphs in Figure 4.2.11 have properties that are common to all polynomials:

- The natural domain of a polynomial is $(-\infty,+\infty)$.
- Polynomials are continuous everywhere.
- Polynomials are differentiable everywhere, so their graphs have no corners or vertical tangent lines.
- The graph of a nonconstant polynomial eventually increases or decreases without bound as $x \rightarrow+\infty$ and as $x \rightarrow-\infty$. This is because the limit of a nonconstant polynomial as $x \rightarrow+\infty$ or as $x \rightarrow-\infty$ is $\pm \infty$, depending on the sign of the term of highest degree and whether the polynomial has even or odd degree [see Formulas (17) and (18) of Section 1.3 and the related discussion].
- The graph of a polynomial of degree $n(>2)$ has at most $n x$-intercepts, at most $n-1$ relative extrema, and at most $n-2$ inflection points. This is because the $x$ intercepts, relative extrema, and inflection points of a polynomial $p(x)$ are among the real solutions of the equations $p(x)=0, p^{\prime}(x)=0$, and $p^{\prime \prime}(x)=0$, and the polynomials in these equations have degree $n, n-1$, and $n-2$, respectively. Thus, for example, the graph of a quadratic polynomial has at most two $x$-intercepts, one relative extremum, and no inflection points; and the graph of a cubic polynomial has at most three $x$-intercepts, two relative extrema, and one inflection point.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-184.jpg?height=364&width=1647&top_left_y=1531&top_left_x=272)
- Figure 4.2.11

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-184.jpg?height=401&width=395&top_left_y=1974&top_left_x=194)
- Figure 4.2.12

Example 7 Figure 4.2.12 shows the graph of

$$
y=3 x^{4}-6 x^{3}+2 x
$$

produced on a graphing calculator. Confirm that the graph is not missing any significant features.

Solution. We can be confident that the graph shows all significant features of the polynomial because the polynomial has degree 4 and we can account for four roots, three relative extrema, and two inflection points. Moreover, the graph suggests the correct behavior as

A review of polynomial factoring is given in Appendix C.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-185.jpg?height=483&width=964&top_left_y=1902&top_left_x=420)
- Figure 4.2.13

$x \rightarrow+\infty$ and as $x \rightarrow-\infty$, since

$$
\begin{aligned}
& \lim _{x \rightarrow+\infty}\left(3 x^{4}-6 x^{3}+2 x\right)=\lim _{x \rightarrow+\infty} 3 x^{4}=+\infty \\
& \lim _{x \rightarrow-\infty}\left(3 x^{4}-6 x^{3}+2 x\right)=\lim _{x \rightarrow-\infty} 3 x^{4}=+\infty
\end{aligned}
$$

Example 8 Sketch the graph of the equation

$$
y=x^{3}-3 x+2
$$

and identify the locations of the intercepts, relative extrema, and inflection points.
Solution. The following analysis will produce the information needed to sketch the graph:

- $x$-intercepts: Factoring the polynomial yields

$$
x^{3}-3 x+2=(x+2)(x-1)^{2}
$$

which tells us that the $x$-intercepts are $x=-2$ and $x=1$.

- $y$-intercept: Setting $x=0$ yields $y=2$.
- End behavior: We have

$$
\begin{aligned}
\lim _{x \rightarrow+\infty}\left(x^{3}-3 x+2\right) & =\lim _{x \rightarrow+\infty} x^{3}=+\infty \\
\lim _{x \rightarrow-\infty}\left(x^{3}-3 x+2\right) & =\lim _{x \rightarrow-\infty} x^{3}=-\infty
\end{aligned}
$$

so the graph increases without bound as $x \rightarrow+\infty$ and decreases without bound as $x \rightarrow-\infty$.

- Derivatives:

$$
\begin{aligned}
& \frac{d y}{d x}=3 x^{2}-3=3(x-1)(x+1) \\
& \frac{d^{2} y}{d x^{2}}=6 x
\end{aligned}
$$

- Increase, decrease, relative extrema, inflection points: Figure 4.2.13 gives a sign analysis of the first and second derivatives and indicates its geometric significance. There are stationary points at $x=-1$ and $x=1$. Since the sign of $d y / d x$ changes from + to - at $x=-1$, there is a relative maximum there, and since it changes from - to + at $x=1$, there is a relative minimum there. The sign of $d^{2} y / d x^{2}$ changes from - to + at $x=0$, so there is an inflection point there.
- Final sketch: Figure 4.2.14 shows the final sketch with the coordinates of the intercepts, relative extrema, and inflection point labeled. $\square$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-185.jpg?height=547&width=474&top_left_y=1838&top_left_x=1493)
\$ Figure 4.2.14

## QUICK CHECK EXERCISES 4.2 (See page 254 for answers.)

1. A function $f$ has a relative maximum at $x_{0}$ if there is an open interval containing $x_{0}$ on which $f(x)$ is $\_\_\_\_$ $f\left(x_{0}\right)$ for every $x$ in the interval.
2. Suppose that $f$ is defined everywhere and $x=2,3,5,7$ are critical points for $f$. If $f^{\prime}(x)$ is positive on the intervals $(-\infty, 2)$ and (5, 7), and if $f^{\prime}(x)$ is negative on the intervals $(2,3),(3,5)$, and $(7,+\infty)$, then $f$ has relative maxima at $x=$ $\_\_\_\_$ and $f$ has relative minima at $x=$ $\_\_\_\_$ .
3. Suppose that $f$ is defined everywhere and $x=-2$ and $x=1$ are critical points for $f$. If $f^{\prime \prime}(x)=2 x+1$, then $f$ has a relative $\_\_\_\_$ at $x=-2$ and $f$ has a relative
$\_\_\_\_$ at $x=1$.
4. Let $f(x)=\left(x^{2}-4\right)^{2}$. Then $f^{\prime}(x)=4 x\left(x^{2}-4\right)$ and $f^{\prime \prime}(x)=4\left(3 x^{2}-4\right)$. Identify the locations of the (a) relative maxima, (b) relative minima, and (c) inflection points on the graph of $f$.

## EXERCISE SET 4.2 Graphing Utility C CAS

## FOCUS ON CONCEPTS

1. In each part, sketch the graph of a continuous function $f$ with the stated properties.
(a) $f$ is concave up on the interval $(-\infty,+\infty)$ and has exactly one relative extremum.
(b) $f$ is concave up on the interval $(-\infty,+\infty)$ and has no relative extrema.
(c) The function $f$ has exactly two relative extrema on the interval $(-\infty,+\infty)$, and $f(x) \rightarrow+\infty$ as $x \rightarrow+\infty$.
(d) The function $f$ has exactly two relative extrema on the interval $(-\infty,+\infty)$, and $f(x) \rightarrow-\infty$ as $x \rightarrow+\infty$.
2. In each part, sketch the graph of a continuous function $f$ with the stated properties.
(a) $f$ has exactly one relative extremum on $(-\infty,+\infty)$, and $f(x) \rightarrow 0$ as $x \rightarrow+\infty$ and as $x \rightarrow-\infty$.
(b) $f$ has exactly two relative extrema on $(-\infty,+\infty)$, and $f(x) \rightarrow 0$ as $x \rightarrow+\infty$ and as $x \rightarrow-\infty$.
(c) $f$ has exactly one inflection point and one relative extremum on $(-\infty,+\infty)$.
(d) $f$ has infinitely many relative extrema, and $f(x) \rightarrow 0$ as $x \rightarrow+\infty$ and as $x \rightarrow-\infty$.
3. (a) Use both the first and second derivative tests to show that $f(x)=3 x^{2}-6 x+1$ has a relative minimum at $x=1$.
(b) Use both the first and second derivative tests to show that $f(x)=x^{3}-3 x+3$ has a relative minimum at $x=1$ and a relative maximum at $x=-1$.
4. (a) Use both the first and second derivative tests to show that $f(x)=\sin ^{2} x$ has a relative minimum at $x=0$.
(b) Use both the first and second derivative tests to show that $g(x)=\tan ^{2} x$ has a relative minimum at $x=0$.
(c) Give an informal verbal argument to explain without calculus why the functions in parts (a) and (b) have relative minima at $x=0$.
5. (a) Show that both of the functions $f(x)=(x-1)^{4}$ and $g(x)=x^{3}-3 x^{2}+3 x-2$ have stationary points at $x=1$.
(b) What does the second derivative test tell you about the nature of these stationary points?
(c) What does the first derivative test tell you about the nature of these stationary points?
6. (a) Show that $f(x)=1-x^{5}$ and $g(x)=3 x^{4}-8 x^{3}$ both have stationary points at $x=0$.
(b) What does the second derivative test tell you about the nature of these stationary points?
(c) What does the first derivative test tell you about the nature of these stationary points?

7-14 Locate the critical points and identify which critical points are stationary points.
7. $f(x)=4 x^{4}-16 x^{2}+17$
8. $f(x)=3 x^{4}+12 x$
9. $f(x)=\frac{x+1}{x^{2}+3}$
10. $f(x)=\frac{x^{2}}{x^{3}+8}$
11. $f(x)=\sqrt[3]{x^{2}-25}$
12. $f(x)=x^{2}(x-1)^{2 / 3}$
13. $f(x)=|\sin x|$
14. $f(x)=\sin |x|$

15-18 True-False Assume that $f$ is continuous everywhere. Determine whether the statement is true or false. Explain your answer.
15. If $f$ has a relative maximum at $x=1$, then $f(1) \geq f(2)$.
16. If $f$ has a relative maximum at $x=1$, then $x=1$ is a critical point for $f$.
17. If $f^{\prime \prime}(x)>0$, then $f$ has a relative minimum at $x=1$.
18. If $p(x)$ is a polynomial such that $p^{\prime}(x)$ has a simple root at $x=1$, then $p$ has a relative extremum at $x=1$.

## FOCUS ON CONCEPTS

19-20 The graph of a function $f(x)$ is given. Sketch graphs of $y=f^{\prime}(x)$ and $y=f^{\prime \prime}(x)$.
19.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-186.jpg?height=299&width=369&top_left_y=2106&top_left_x=1149)
20.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-187.jpg?height=243&width=367&top_left_y=200&top_left_x=292)

21-24 Use the graph of $f^{\prime}$ shown in the figure to estimate all values of $x$ at which $f$ has (a) relative minima, (b) relative maxima, and (c) inflection points. (d) Draw a rough sketch of the graph of a function $f$ with the given derivative.
21.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-187.jpg?height=312&width=329&top_left_y=644&top_left_x=292)
22.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-187.jpg?height=332&width=306&top_left_y=644&top_left_x=666)
23.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-187.jpg?height=335&width=349&top_left_y=981&top_left_x=272)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-187.jpg?height=337&width=436&top_left_y=975&top_left_x=602)

25-32 Use the given derivative to find all critical points of $f$, and at each critical point determine whether a relative maximum, relative minimum, or neither occurs. Assume in each case that $f$ is continuous everywhere.
25. $f^{\prime}(x)=x^{2}\left(x^{3}-5\right)$
26. $f^{\prime}(x)=4 x^{3}-9 x$
27. $f^{\prime}(x)=\frac{2-3 x}{\sqrt[3]{x+2}}$
28. $f^{\prime}(x)=\frac{x^{2}-7}{\sqrt[3]{x^{2}+4}}$
29. $f^{\prime}(x)=x e^{1-x^{2}}$
30. $f^{\prime}(x)=x^{4}\left(e^{x}-3\right)$
31. $f^{\prime}(x)=\ln \left(\frac{2}{1+x^{2}}\right)$
32. $f^{\prime}(x)=e^{2 x}-5 e^{x}+6$

33-36 Find the relative extrema using both first and second derivative tests.
33. $f(x)=1+8 x-3 x^{2}$
34. $f(x)=x^{4}-12 x^{3}$
35. $f(x)=\sin 2 x, \quad 0<x<\pi$
36. $f(x)=(x-3) e^{x}$

37-50 Use any method to find the relative extrema of the function $f$.
37. $f(x)=x^{4}-4 x^{3}+4 x^{2}$
38. $f(x)=x(x-4)^{3}$
39. $f(x)=x^{3}(x+1)^{2}$
40. $f(x)=x^{2}(x+1)^{3}$
41. $f(x)=2 x+3 x^{2 / 3}$
42. $f(x)=2 x+3 x^{1 / 3}$
43. $f(x)=\frac{x+3}{x-2}$
44. $f(x)=\frac{x^{2}}{x^{4}+16}$
45. $f(x)=\ln \left(2+x^{2}\right)$
46. $f(x)=\ln \left|2+x^{3}\right|$
47. $f(x)=e^{2 x}-e^{x}$
48. $f(x)=\left(x e^{x}\right)^{2}$
49. $f(x)=\left|3 x-x^{2}\right|$
50. $f(x)=|1+\sqrt[3]{x}|$
□ 51-60 Give a graph of the polynomial and label the coordinates of the intercepts, stationary points, and inflection points. Check your work with a graphing utility.
51. $p(x)=x^{2}-3 x-4$
52. $p(x)=1+8 x-x^{2}$
53. $p(x)=2 x^{3}-3 x^{2}-36 x+5$
54. $p(x)=2-x+2 x^{2}-x^{3}$
55. $p(x)=(x+1)^{2}\left(2 x-x^{2}\right)$
56. $p(x)=x^{4}-6 x^{2}+5$
57. $p(x)=x^{4}-2 x^{3}+2 x-1$
58. $p(x)=4 x^{3}-9 x^{4}$
59. $p(x)=x\left(x^{2}-1\right)^{2}$
60. $p(x)=x\left(x^{2}-1\right)^{3}$
61. In each part: (i) Make a conjecture about the behavior of the graph in the vicinity of its $x$-intercepts. (ii) Make a rough sketch of the graph based on your conjecture and the limits of the polynomial as $x \rightarrow+\infty$ and as $x \rightarrow-\infty$. (iii) Compare your sketch to the graph generated with a graphing utility.
(a) $y=x(x-1)(x+1)$
(b) $y=x^{2}(x-1)^{2}(x+1)^{2}$
(c) $y=x^{2}(x-1)^{2}(x+1)^{3}$
(d) $y=x(x-1)^{5}(x+1)^{4}$
62. Sketch the graph of $y=(x-a)^{m}(x-b)^{n}$ for the stated values of $m$ and $n$, assuming that $a<b$ (six graphs in total).
(a) $m=1, n=1,2,3$
(b) $m=2, n=2,3$
(c) $m=3, n=3$

63-66 Find the relative extrema in the interval $0<x<2 \pi$, and confirm that your results are consistent with the graph of $f$ generated with a graphing utility.
63. $f(x)=|\sin 2 x|$
64. $f(x)=\sqrt{3} x+2 \sin x$
65. $f(x)=\cos ^{2} x$
66. $f(x)=\frac{\sin x}{2-\cos x}$

67-70 Use a graphing utility to make a conjecture about the relative extrema of $f$, and then check your conjecture using either the first or second derivative test.
67. $f(x)=x \ln x$
68. $f(x)=\frac{2}{e^{x}+e^{-x}}$
69. $f(x)=x^{2} e^{-2 x}$
70. $f(x)=10 \ln x-x$

71-72 Use a graphing utility to generate the graphs of $f^{\prime}$ and $f^{\prime \prime}$ over the stated interval, and then use those graphs to estimate the $x$-coordinates of the relative extrema of $f$. Check that your estimates are consistent with the graph of $f$.
71. $f(x)=x^{4}-24 x^{2}+12 x, \quad-5 \leq x \leq 5$
72. $f(x)=\sin \frac{1}{2} x \cos x, \quad-\pi / 2 \leq x \leq \pi / 2$
(c) 73-76 Use a CAS to graph $f^{\prime}$ and $f^{\prime \prime}$, and then use those graphs to estimate the $x$-coordinates of the relative extrema of $f$. Check that your estimates are consistent with the graph of $f$.
73. $f(x)=\frac{10 x^{3}-3}{3 x^{2}-5 x+8}$
74. $f(x)=\frac{\tan ^{-1}\left(x^{2}-x\right)}{x^{2}+4}$
75. $f(x)=\sqrt{x^{4}+\cos ^{2} x}$
76. $f(x)=x^{2}\left(e^{2 x}-e^{x}\right)$
77. In each part, find $k$ so that $f$ has a relative extremum at the point where $x=3$.
(a) $f(x)=x^{2}+\frac{k}{x}$
(b) $f(x)=\frac{x}{x^{2}+k}$
78. (a) Use a CAS to graph the function

$$
f(x)=\frac{x^{4}+1}{x^{2}+1}
$$

and use the graph to estimate the $x$-coordinates of the relative extrema.
(b) Find the exact $x$-coordinates by using the CAS to solve the equation $f^{\prime}(x)=0$.
79. Functions similar to

$$
f(x)=\frac{1}{\sqrt{2 \pi}} e^{-x^{2} / 2}
$$

arise in a wide variety of statistical problems.
(a) Use the first derivative test to show that $f$ has a relative maximum at $x=0$, and confirm this by using a graphing utility to graph $f$.
(b) Sketch the graph of

$$
f(x)=\frac{1}{\sqrt{2 \pi}} e^{-(x-\mu)^{2} / 2}
$$

where $\mu$ is a constant, and label the coordinates of the relative extrema.
80. Functions of the form

$$
f(x)=\frac{x^{n} e^{-x}}{n!}, \quad x>0
$$

where $n$ is a positive integer, arise in the statistical study of traffic flow.
(a) Use a graphing utility to generate the graph of $f$ for $n=2,3,4$, and 5 , and make a conjecture about the number and locations of the relative extrema of $f$.
(b) Confirm your conjecture using the first derivative test.
81. Let $h$ and $g$ have relative maxima at $x_{0}$. Prove or disprove:
(a) $h+g$ has a relative maximum at $x_{0}$
(b) $h-g$ has a relative maximum at $x_{0}$.
82. Sketch some curves that show that the three parts of the first derivative test (Theorem 4.2.3) can be false without the assumption that $f$ is continuous at $x_{0}$.
83. Writing Discuss the relative advantages or disadvantages of using the first derivative test versus using the second derivative test to classify candidates for relative extrema on the interior of the domain of a function. Include specific examples to illustrate your points.
84. Writing If $p(x)$ is a polynomial, discuss the usefulness of knowing zeros for $p, p^{\prime}$, and $p^{\prime \prime}$ when determining information about the graph of $p$.

## QUICK CHECK ANSWERS 4.2

1. less than or equal to
2. 2,$7 ; 5$
3. maximum; minimum
4. (a) $(0,16)$ (b) $(-2,0)$ and $(2,0)$
(c) $(-2 / \sqrt{3}, 64 / 9)$ and $(2 / \sqrt{3}, 64 / 9)$

### 4.3 ANALYSIS OF FUNCTIONS III: RATIONAL FUNCTIONS, CUSPS, AND VERTICAL TANGENTS

In this section we will discuss procedures for graphing rational functions and other kinds of curves. We will also discuss the interplay between calculus and technology in curve sketching.

## PROPERTIES OF GRAPHS

In many problems, the properties of interest in the graph of a function are:

- symmetries
- $x$-intercepts
- relative extrema
- intervals of increase and decrease
- asymptotes
- periodicity
- $y$-intercepts
- concavity
- inflection points
- behavior as $x \rightarrow+\infty$ or as $x \rightarrow-\infty$

Some of these properties may not be relevant in certain cases; for example, asymptotes are characteristic of rational functions but not of polynomials, and periodicity is characteristic of
trigonometric functions but not of polynomial or rational functions. Thus, when analyzing the graph of a function $f$, it helps to know something about the general properties of the family to which it belongs.

In a given problem you will usually have a definite objective for your analysis of a graph. For example, you may be interested in showing all of the important characteristics of the function, you may only be interested in the behavior of the graph as $x \rightarrow+\infty$ or as $x \rightarrow-\infty$, or you may be interested in some specific feature such as a particular inflection point. Thus, your objectives in the problem will dictate those characteristics on which you want to focus.

## GRAPHING RATIONAL FUNCTIONS

Recall that a rational function is a function of the form $f(x)=P(x) / Q(x)$ in which $P(x)$ and $Q(x)$ are polynomials. Graphs of rational functions are more complicated than those of polynomials because of the possibility of asymptotes and discontinuities (see Figure 0.3.11, for example). If $P(x)$ and $Q(x)$ have no common factors, then the information obtained in the following steps will usually be sufficient to obtain an accurate sketch of the graph of a rational function.

## Graphing a Rational Function $f(x)=P(x) / Q(x)$ if $P(x)$ and $Q(x)$ have no Common Factors

Step 1. (symmetries). Determine whether there is symmetry about the $y$-axis or the origin.

Step 2. ( $\boldsymbol{x}$ - and $\boldsymbol{y}$-intercepts). Find the $x$ - and $y$-intercepts.
Step 3. (vertical asymptotes). Find the values of $x$ for which $Q(x)=0$. The graph has a vertical asymptote at each such value.

Step 4. (sign of $\boldsymbol{f}(\boldsymbol{x}))$. The only places where $f(x)$ can change sign are at the $x$ intercepts or vertical asymptotes. Mark the points on the $x$-axis at which these occur and calculate a sample value of $f(x)$ in each of the open intervals determined by these points. This will tell you whether $f(x)$ is positive or negative over that interval.

Step 5. (end behavior). Determine the end behavior of the graph by computing the limits of $f(x)$ as $x \rightarrow+\infty$ and as $x \rightarrow-\infty$. If either limit has a finite value $L$, then the line $y=L$ is a horizontal asymptote.

Step 6. (derivatives). Find $f^{\prime}(x)$ and $f^{\prime \prime}(x)$.
Step 7. (conclusions and graph). Analyze the sign changes of $f^{\prime}(x)$ and $f^{\prime \prime}(x)$ to determine the intervals where $f(x)$ is increasing, decreasing, concave up, and concave down. Determine the locations of all stationary points, relative extrema, and inflection points. Use the sign analysis of $f(x)$ to determine the behavior of the graph in the vicinity of the vertical asymptotes. Sketch a graph of $f$ that exhibits these conclusions.

Example 1 Sketch a graph of the equation

$$
y=\frac{2 x^{2}-8}{x^{2}-16}
$$

and identify the locations of the intercepts, relative extrema, inflection points, and asymptotes.

Solution. The numerator and denominator have no common factors, so we will use the procedure just outlined.

SIGN ANALYSIS OF $y=\frac{2 x^{2}-8}{x^{2}-16}$

Table 4.3.1
|  | TEST | VALUE | SIGN |
| :--- | :---: | :---: | :---: |
| INTERVAL | POINT | OF $y$ | OF $y$ |
| $(-\infty,-4)$ | -5 | $14 / 3$ | + |
| $(-4,-2)$ | -3 | $-10 / 7$ | - |
| $(-2,2)$ | 0 | $1 / 2$ | + |
| $(2,4)$ | 3 | $-10 / 7$ | - |
| $(4,+\infty)$ | 5 | $14 / 3$ | + |


The procedure we stated for graphing a rational function $P(x) / Q(x)$ applies only if the polynomials $P(x)$ and $Q(x)$ have no common factors. How would you find the graph if those polynomials have common factors?

- Symmetries: Replacing $x$ by $-x$ does not change the equation, so the graph is symmetric about the $y$-axis.
- $x$ - and $y$-intercepts: Setting $y=0$ yields the $x$-intercepts $x=-2$ and $x=2$. Setting $x=0$ yields the $y$-intercept $y=\frac{1}{2}$.
- Vertical asymptotes: We observed above that the numerator and denominator of $y$ have no common factors, so the graph has vertical asymptotes at the points where the denominator of $y$ is zero, namely, at $x=-4$ and $x=4$.
- Sign of y: The set of points where $x$-intercepts or vertical asymptotes occur is $\{-4,-2,2,4\}$. These points divide the $x$-axis into the open intervals

$$
(-\infty,-4), \quad(-4,-2), \quad(-2,2), \quad(2,4), \quad(4,+\infty)
$$

We can find the sign of $y$ on each interval by choosing an arbitrary test point in the interval and evaluating $y=f(x)$ at the test point (Table 4.3.1). This analysis is summarized on the first line of Figure 4.3.1a.

- End behavior: The limits

$$
\begin{aligned}
& \lim _{x \rightarrow+\infty} \frac{2 x^{2}-8}{x^{2}-16}=\lim _{x \rightarrow+\infty} \frac{2-\left(8 / x^{2}\right)}{1-\left(16 / x^{2}\right)}=2 \\
& \lim _{x \rightarrow-\infty} \frac{2 x^{2}-8}{x^{2}-16}=\lim _{x \rightarrow-\infty} \frac{2-\left(8 / x^{2}\right)}{1-\left(16 / x^{2}\right)}=2
\end{aligned}
$$

yield the horizontal asymptote $y=2$.

- Derivatives:

$$
\begin{aligned}
\frac{d y}{d x} & =\frac{\left(x^{2}-16\right)(4 x)-\left(2 x^{2}-8\right)(2 x)}{\left(x^{2}-16\right)^{2}}=-\frac{48 x}{\left(x^{2}-16\right)^{2}} \\
\frac{d^{2} y}{d x^{2}} & =\frac{48\left(16+3 x^{2}\right)}{\left(x^{2}-16\right)^{3}} \quad(\text { verify })
\end{aligned}
$$

Conclusions and graph:

- The sign analysis of $y$ in Figure 4.3.1a reveals the behavior of the graph in the vicinity of the vertical asymptotes: The graph increases without bound as $x \rightarrow-4^{-}$ and decreases without bound as $x \rightarrow-4^{+}$; and the graph decreases without bound as $x \rightarrow 4^{-}$and increases without bound as $x \rightarrow 4^{+}$(Figure 4.3.1b).
- The sign analysis of $d y / d x$ in Figure 4.3.1a shows that the graph is increasing to the left of $x=0$ and is decreasing to the right of $x=0$. Thus, there is a relative maximum at the stationary point $x=0$. There are no relative minima.
- The sign analysis of $d^{2} y / d x^{2}$ in Figure 4.3.1a shows that the graph is concave up to the left of $x=-4$, is concave down between $x=-4$ and $x=4$, and is concave up to the right of $x=4$. There are no inflection points.

The graph is shown in Figure 4.3.1c.

Example 2 Sketch a graph of

$$
y=\frac{x^{2}-1}{x^{3}}
$$

and identify the locations of all asymptotes, intercepts, relative extrema, and inflection points.

Solution. The numerator and denominator have no common factors, so we will use the procedure outlined previously.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-191.jpg?height=471&width=1547&top_left_y=194&top_left_x=422)
- Figure 4.3.1

SIGN ANALYSIS OF $y=\frac{x^{2}-1}{x^{3}}$

Table 4.3.2
| INTERVAL | TEST <br> POINT | VALUE <br> OF $y$ | SIGN <br> OF $y$ |
| :--- | ---: | ---: | ---: |
| $(-\infty,-1)$ | -2 | $-\frac{3}{8}$ | - |
| $(-1,0)$ | $-\frac{1}{2}$ | 6 | + |
| $(0,1)$ | $\frac{1}{2}$ | -6 | - |
| $(1,+\infty)$ | 2 | $\frac{3}{8}$ | + |


- Symmetries: Replacing $x$ by $-x$ and $y$ by $-y$ yields an equation that simplifies to the original equation, so the graph is symmetric about the origin.
- $x$-and $y$-intercepts: Setting $y=0$ yields the $x$-intercepts $x=-1$ and $x=1$. Setting $x=0$ leads to a division by zero, so there is no $y$-intercept.
- Vertical asymptotes: Setting $x^{3}=0$ yields the solution $x=0$. This is not a root of $x^{2}-1$, so $x=0$ is a vertical asymptote.
- Sign of $y$ : The set of points where $x$-intercepts or vertical asymptotes occur is $\{-1,0,1\}$. These points divide the $x$-axis into the open intervals

$$
(-\infty,-1), \quad(-1,0), \quad(0,1), \quad(1,+\infty)
$$

Table 4.3.2 uses the method of test points to produce the sign of $y$ on each of these intervals.

- End behavior: The limits

$$
\begin{aligned}
& \lim _{x \rightarrow+\infty} \frac{x^{2}-1}{x^{3}}=\lim _{x \rightarrow+\infty}\left(\frac{1}{x}-\frac{1}{x^{3}}\right)=0 \\
& \lim _{x \rightarrow-\infty} \frac{x^{2}-1}{x^{3}}=\lim _{x \rightarrow-\infty}\left(\frac{1}{x}-\frac{1}{x^{3}}\right)=0
\end{aligned}
$$

yield the horizontal asymptote $y=0$.

- Derivatives:

$$
\begin{aligned}
& \frac{d y}{d x}=\frac{x^{3}(2 x)-\left(x^{2}-1\right)\left(3 x^{2}\right)}{\left(x^{3}\right)^{2}}=\frac{3-x^{2}}{x^{4}}=\frac{(\sqrt{3}+x)(\sqrt{3}-x)}{x^{4}} \\
& \frac{d^{2} y}{d x^{2}}=\frac{x^{4}(-2 x)-\left(3-x^{2}\right)\left(4 x^{3}\right)}{\left(x^{4}\right)^{2}}=\frac{2\left(x^{2}-6\right)}{x^{5}}=\frac{2(x-\sqrt{6})(x+\sqrt{6})}{x^{5}}
\end{aligned}
$$

## Conclusions and graph:

- The sign analysis of $y$ in Figure 4.3.2a reveals the behavior of the graph in the vicinity of the vertical asymptote $x=0$ : The graph increases without bound as $x \rightarrow 0^{-}$and decreases without bound as $x \rightarrow 0^{+}$(Figure 4.3.2b).
- The sign analysis of $d y / d x$ in Figure 4.3.2a shows that there is a relative minimum at $x=-\sqrt{3}$ and a relative maximum at $x=\sqrt{3}$.
- The sign analysis of $d^{2} y / d x^{2}$ in Figure 4.3.2a shows that the graph changes concavity at the vertical asymptote $x=0$ and that there are inflection points at $x=-\sqrt{6}$ and $x=\sqrt{6}$.

The graph is shown in Figure 4.3.2c. To produce a slightly more accurate sketch, we used a graphing utility to help plot the relative extrema and inflection points. You should confirm that the approximate coordinates of the inflection points are $(-2.45,-0.34)$ and $(2.45$, 0.34 ) and that the approximate coordinates of the relative minimum and relative maximum are $(-1.73,-0.38)$ and $(1.73,0.38)$, respectively.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-192.jpg?height=528&width=1725&top_left_y=484&top_left_x=194)
△ Figure 4.3.2

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-192.jpg?height=477&width=477&top_left_y=1131&top_left_x=154)
- Figure 4.3.3

$$
y=\frac{x^{2}+1}{x}
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-192.jpg?height=577&width=465&top_left_y=1788&top_left_x=156)
- Figure 4.3.4

## RATIONAL FUNCTIONS WITH OBLIQUE OR CURVILINEAR ASYMPTOTES

In the rational functions of Examples 1 and 2, the degree of the numerator did not exceed the degree of the denominator, and the asymptotes were either vertical or horizontal. If the numerator of a rational function has greater degree than the denominator, then other kinds of "asymptotes" are possible. For example, consider the rational functions

$$
\begin{equation*}
f(x)=\frac{x^{2}+1}{x} \quad \text { and } \quad g(x)=\frac{x^{3}-x^{2}-8}{x-1} \tag{1}
\end{equation*}
$$

By division we can rewrite these as

$$
f(x)=x+\frac{1}{x} \quad \text { and } \quad g(x)=x^{2}-\frac{8}{x-1}
$$

Since the second terms both approach 0 as $x \rightarrow+\infty$ or as $x \rightarrow-\infty$, it follows that

$$
\begin{array}{ll}
(f(x)-x) \rightarrow 0 & \text { as } x \rightarrow+\infty \text { or as } x \rightarrow-\infty \\
\left(g(x)-x^{2}\right) \rightarrow 0 & \text { as } x \rightarrow+\infty \text { or as } x \rightarrow-\infty
\end{array}
$$

Geometrically, this means that the graph of $y=f(x)$ eventually gets closer and closer to the line $y=x$ as $x \rightarrow+\infty$ or as $x \rightarrow-\infty$. The line $y=x$ is called an oblique or slant asymptote of $f$. Similarly, the graph of $y=g(x)$ eventually gets closer and closer to the parabola $y=x^{2}$ as $x \rightarrow+\infty$ or as $x \rightarrow-\infty$. The parabola is called a curvilinear asymptote of $g$. The graphs of the functions in (1) are shown in Figures 4.3.3 and 4.3.4.

In general, if $f(x)=P(x) / Q(x)$ is a rational function, then we can find quotient and remainder polynomials $q(x)$ and $r(x)$ such that

$$
f(x)=q(x)+\frac{r(x)}{Q(x)}
$$

and the degree of $r(x)$ is less than the degree of $Q(x)$. Then $r(x) / Q(x) \rightarrow 0$ as $x \rightarrow+\infty$ and as $x \rightarrow-\infty$, so $y=q(x)$ is an asymptote of $f$. This asymptote will be an oblique line if the degree of $P(x)$ is one greater than the degree of $Q(x)$, and it will be curvilinear if the degree of $P(x)$ exceeds that of $Q(x)$ by two or more. Problems involving these kinds of asymptotes are given in the exercises (Exercises 17 and 18).

- Figure 4.3.5

The steps that are used to sketch the graph of a rational function can serve as guidelines for sketching graphs of other types of functions. This is illustrated in Examples 3, 4, and 5.

## GRAPHS WITH VERTICAL TANGENTS AND CUSPS

Figure 4.3.5 shows four curve elements that are commonly found in graphs of functions that involve radicals or fractional exponents. In all four cases, the function is not differentiable at $x_{0}$ because the secant line through $\left(x_{0}, f\left(x_{0}\right)\right)$ and $(x, f(x))$ approaches a vertical position as $x$ approaches $x_{0}$ from either side. Thus, in each case, the curve has a vertical tangent line at ( $x_{0}, f\left(x_{0}\right)$ ). In parts ( $a$ ) and ( $b$ ) of the figure, there is an inflection point at $x_{0}$ because there is a change in concavity at that point. In parts ( $c$ ) and ( $d$ ), where $f^{\prime}(x)$ approaches $+\infty$ from one side of $x_{0}$ and $-\infty$ from the other side, we say that the graph has a cusp at $x_{0}$.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-193.jpg?height=253&width=264&top_left_y=584&top_left_x=772)

$$
\begin{aligned}
& \lim _{x \rightarrow x_{0}^{+}} f^{\prime}(x)=+\infty \\
& \lim _{x \rightarrow x_{0}^{-}} f^{\prime}(x)=+\infty
\end{aligned}
$$

(a)

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-193.jpg?height=420&width=263&top_left_y=584&top_left_x=1063)
(b)

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-193.jpg?height=251&width=259&top_left_y=584&top_left_x=1355)

$$
\begin{aligned}
& \lim _{x \rightarrow x_{0}^{+}} f^{\prime}(x)=-\infty \\
& \lim _{x \rightarrow x_{0}^{-}} f^{\prime}(x)=+\infty
\end{aligned}
$$

(c)

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-193.jpg?height=420&width=264&top_left_y=584&top_left_x=1645)
(d)

Example 3 Sketch the graph of $y=(x-4)^{2 / 3}$.

- Symmetries: There are no symmetries about the coordinate axes or the origin (verify). However, the graph of $y=(x-4)^{2 / 3}$ is symmetric about the line $x=4$ since it is a translation (4 units to the right) of the graph of $y=x^{2 / 3}$, which is symmetric about the $y$-axis.
- $x$ - and $y$-intercepts: Setting $y=0$ yields the $x$-intercept $x=4$. Setting $x=0$ yields the $y$-intercept $y=\sqrt[3]{16} \approx 2.5$.
- Vertical asymptotes: None, since $f(x)=(x-4)^{2 / 3}$ is continuous everywhere.
- End behavior: The graph has no horizontal asymptotes since

$$
\lim _{x \rightarrow+\infty}(x-4)^{2 / 3}=+\infty \quad \text { and } \quad \lim _{x \rightarrow-\infty}(x-4)^{2 / 3}=+\infty
$$

- Derivatives:

$$
\begin{aligned}
& \frac{d y}{d x}=f^{\prime}(x)=\frac{2}{3}(x-4)^{-1 / 3}=\frac{2}{3(x-4)^{1 / 3}} \\
& \frac{d^{2} y}{d x^{2}}=f^{\prime \prime}(x)=-\frac{2}{9}(x-4)^{-4 / 3}=-\frac{2}{9(x-4)^{4 / 3}}
\end{aligned}
$$

- Vertical tangent lines: There is a vertical tangent line and cusp at $x=4$ of the type in Figure 4.3.5d since $f(x)=(x-4)^{2 / 3}$ is continuous at $x=4$ and

$$
\begin{aligned}
& \lim _{x \rightarrow 4^{+}} f^{\prime}(x)=\lim _{x \rightarrow 4^{+}} \frac{2}{3(x-4)^{1 / 3}}=+\infty \\
& \lim _{x \rightarrow 4^{-}} f^{\prime}(x)=\lim _{x \rightarrow 4^{-}} \frac{2}{3(x-4)^{1 / 3}}=-\infty
\end{aligned}
$$

Conclusions and graph:

- The function $f(x)=(x-4)^{2 / 3}=\left((x-4)^{1 / 3}\right)^{2}$ is nonnegative for all $x$. There is a zero for $f$ at $x=4$.
- There is a critical point at $x=4$ since $f$ is not differentiable there. We saw above that a cusp occurs at this point. The sign analysis of $d y / d x$ in Figure 4.3.6 $a$ and the first derivative test show that there is a relative minimum at this cusp since $f^{\prime}(x)<0$ if $x<4$ and $f^{\prime}(x)>0$ if $x>4$.
- The sign analysis of $d^{2} y / d x^{2}$ in Figure 4.3.6a shows that the graph is concave down on both sides of the cusp.

The graph is shown in Figure 4.3.6b.

Figure 4.3.6
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-194.jpg?height=472&width=1227&top_left_y=614&top_left_x=672)

Example 4 Sketch the graph of $y=6 x^{1 / 3}+3 x^{4 / 3}$.
Solution. It will help in our analysis to write

$$
f(x)=6 x^{1 / 3}+3 x^{4 / 3}=3 x^{1 / 3}(2+x)
$$

- Symmetries: There are no symmetries about the coordinate axes or the origin (verify).
- $x$ - and $y$-intercepts: Setting $y=3 x^{1 / 3}(2+x)=0$ yields the $x$-intercepts $x=0$ and $x=-2$. Setting $x=0$ yields the $y$-intercept $y=0$.
- Vertical asymptotes: None, since $f(x)=6 x^{1 / 3}+3 x^{4 / 3}$ is continuous everywhere.
- End behavior: The graph has no horizontal asymptotes since

$$
\begin{aligned}
& \lim _{x \rightarrow+\infty}\left(6 x^{1 / 3}+3 x^{4 / 3}\right)=\lim _{x \rightarrow+\infty} 3 x^{1 / 3}(2+x)=+\infty \\
& \lim _{x \rightarrow-\infty}\left(6 x^{1 / 3}+3 x^{4 / 3}\right)=\lim _{x \rightarrow-\infty} 3 x^{1 / 3}(2+x)=+\infty
\end{aligned}
$$

- Derivatives:

$$
\begin{aligned}
& \frac{d y}{d x}=f^{\prime}(x)=2 x^{-2 / 3}+4 x^{1 / 3}=2 x^{-2 / 3}(1+2 x)=\frac{2(2 x+1)}{x^{2 / 3}} \\
& \frac{d^{2} y}{d x^{2}}=f^{\prime \prime}(x)=-\frac{4}{3} x^{-5 / 3}+\frac{4}{3} x^{-2 / 3}=\frac{4}{3} x^{-5 / 3}(-1+x)=\frac{4(x-1)}{3 x^{5 / 3}}
\end{aligned}
$$

- Vertical tangent lines: There is a vertical tangent line at $x=0$ since $f$ is continuous there and

$$
\begin{aligned}
& \lim _{x \rightarrow 0^{+}} f^{\prime}(x)=\lim _{x \rightarrow 0^{+}} \frac{2(2 x+1)}{x^{2 / 3}}=+\infty \\
& \lim _{x \rightarrow 0^{-}} f^{\prime}(x)=\lim _{x \rightarrow 0^{-}} \frac{2(2 x+1)}{x^{2 / 3}}=+\infty
\end{aligned}
$$

This and the change in concavity at $x=0$ mean that $(0,0)$ is an inflection point of the type in Figure 4.3.5a.

## TECHNOLOGY MASTERY

The graph in Figure 4.3.7b was generated with a graphing utility. However, the inflection point at $x=1$ is so subtle that it is not evident from this graph. See if you can produce a version of this graph with your graphing utility that makes the inflection point evident.

## Conclusions and graph:

- From the sign analysis of $y$ in Figure 4.3.7a, the graph is below the $x$-axis between the $x$-intercepts $x=-2$ and $x=0$ and is above the $x$-axis if $x<-2$ or $x>0$.
- From the formula for $d y / d x$ we see that there is a stationary point at $x=-\frac{1}{2}$ and a critical point at $x=0$ at which $f$ is not differentiable. We saw above that a vertical tangent line and inflection point are at that critical point.
- The sign analysis of $d y / d x$ in Figure 4.3.7a and the first derivative test show that there is a relative minimum at the stationary point at $x=-\frac{1}{2}$ (verify).
- The sign analysis of $d^{2} y / d x^{2}$ in Figure 4.3.7a shows that in addition to the inflection point at the vertical tangent there is an inflection point at $x=1$ at which the graph changes from concave down to concave up.

The graph is shown in Figure 4.3.7b.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-195.jpg?height=421&width=992&top_left_y=875&top_left_x=464)
(a)

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-195.jpg?height=451&width=474&top_left_y=869&top_left_x=1497)
(b)

- Figure 4.3.7


## GRAPHING OTHER KINDS OF FUNCTIONS

We have discussed methods for graphing polynomials, rational functions, and functions with cusps and vertical tangent lines. The same calculus tools that we used to analyze these functions can also be used to analyze and graph trigonometric functions, logarithmic and exponential functions, and an endless variety of other kinds of functions.

Example 5 Sketch the graph of $y=e^{-x^{2} / 2}$ and identify the locations of all relative extrema and inflection points.

## Solution.

- Symmetries: Replacing $x$ by $-x$ does not change the equation, so the graph is symmetric about the $y$-axis.
- $x$ - and $y$-intercepts: Setting $y=0$ leads to the equation $e^{-x^{2} / 2}=0$, which has no solutions since all powers of $e$ have positive values. Thus, there are no $x$-intercepts. Setting $x=0$ yields the $y$-intercept $y=1$.
- Vertical asymptotes: There are no vertical asymptotes since $e^{-x^{2} / 2}$ is continuous on $(-\infty,+\infty)$.
- End behavior: The $x$-axis ( $y=0$ ) is a horizontal asymptote since

$$
\lim _{x \rightarrow-\infty} e^{-x^{2} / 2}=\lim _{x \rightarrow+\infty} e^{-x^{2} / 2}=0
$$

- Derivatives:

$$
\begin{aligned}
\frac{d y}{d x} & =e^{-x^{2} / 2} \frac{d}{d x}\left[-\frac{x^{2}}{2}\right]=-x e^{-x^{2} / 2} \\
\frac{d^{2} y}{d x^{2}} & =-x \frac{d}{d x}\left[e^{-x^{2} / 2}\right]+e^{-x^{2} / 2} \frac{d}{d x}[-x] \\
& =x^{2} e^{-x^{2} / 2}-e^{-x^{2} / 2}=\left(x^{2}-1\right) e^{-x^{2} / 2}
\end{aligned}
$$

## Conclusions and graph:

- The sign analysis of $y$ in Figure 4.3.8a is based on the fact that $e^{-x^{2} / 2}>0$ for all $x$. This shows that the graph is always above the $x$-axis.
- The sign analysis of $d y / d x$ in Figure 4.3.8 $a$ is based on the fact that $d y / d x=-x e^{-x^{2} / 2}$ has the same sign as $-x$. This analysis and the first derivative test show that there is a stationary point at $x=0$ at which there is a relative maximum. The value of $y$ at the relative maximum is $y=e^{0}=1$.
- The sign analysis of $d^{2} y / d x^{2}$ in Figure 4.3.8a is based on the fact that $d^{2} y / d x^{2}= \left(x^{2}-1\right) e^{-x^{2} / 2}$ has the same sign as $x^{2}-1$. This analysis shows that there are inflection points at $x=-1$ and $x=1$. The graph changes from concave up to concave down at $x=-1$ and from concave down to concave up at $x=1$. The coordinates of the inflection points are $\left(-1, e^{-1 / 2}\right) \approx(-1,0.61)$ and $\left(1, e^{-1 / 2}\right) \approx(1,0.61)$.

The graph is shown in Figure 4.3.8b.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-196.jpg?height=479&width=1405&top_left_y=1189&top_left_x=520)
- Figure 4.3.8

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-196.jpg?height=439&width=393&top_left_y=1878&top_left_x=196)
- Figure 4.3.9

## GRAPHING USING CALCULUS AND TECHNOLOGY TOGETHER

Thus far in this chapter we have used calculus to produce graphs of functions; the graph was the end result. Now we will work in the reverse direction by starting with a graph produced by a graphing utility. Our goal will be to use the tools of calculus to determine the exact locations of relative extrema, inflection points, and other features suggested by that graph and to determine whether the graph may be missing some important features that we would like to see.

Example 6 Use a graphing utility to generate the graph of $f(x)=(\ln x) / x$, and discuss what it tells you about relative extrema, inflection points, asymptotes, and end behavior. Use calculus to find the locations of all key features of the graph.

Solution. Figure 4.3.9 shows a graph of $f$ produced by a graphing utility. The graph suggests that there is an $x$-intercept near $x=1$, a relative maximum somewhere between
$x=0$ and $x=5$, an inflection point near $x=5$, a vertical asymptote at $x=0$, and possibly a horizontal asymptote $y=0$. For a more precise analysis of this information we need to consider the derivatives

$$
\begin{aligned}
f^{\prime}(x) & =\frac{x\left(\frac{1}{x}\right)-(\ln x)(1)}{x^{2}}=\frac{1-\ln x}{x^{2}} \\
f^{\prime \prime}(x) & =\frac{x^{2}\left(-\frac{1}{x}\right)-(1-\ln x)(2 x)}{x^{4}}=\frac{2 x \ln x-3 x}{x^{4}}=\frac{2 \ln x-3}{x^{3}}
\end{aligned}
$$

- Relative extrema: Solving $f^{\prime}(x)=0$ yields the stationary point $x=e$ (verify). Since

$$
f^{\prime \prime}(e)=\frac{2-3}{e^{3}}=-\frac{1}{e^{3}}<0
$$

there is a relative maximum at $x=e \approx 2.7$ by the second derivative test.

- Inflection points: Since $f(x)=(\ln x) / x$ is only defined for positive values of $x$, the second derivative $f^{\prime \prime}(x)$ has the same sign as $2 \ln x-3$. We leave it for you to use the inequalities $(2 \ln x-3)<0$ and $(2 \ln x-3)>0$ to show that $f^{\prime \prime}(x)<0$ if $x<e^{3 / 2}$ and $f^{\prime \prime}(x)>0$ if $x>e^{3 / 2}$. Thus, there is an inflection point at $x=e^{3 / 2} \approx 4.5$.
- Asymptotes: Applying L'Hôpital's rule we have

$$
\lim _{x \rightarrow+\infty} \frac{\ln x}{x}=\lim _{x \rightarrow+\infty} \frac{(1 / x)}{1}=\lim _{x \rightarrow+\infty} \frac{1}{x}=0
$$

so that $y=0$ is a horizontal asymptote. Also, there is a vertical asymptote at $x=0$ since

$$
\lim _{x \rightarrow 0^{+}} \frac{\ln x}{x}=-\infty
$$

(why?).

- Intercepts: Setting $f(x)=0$ yields $(\ln x) / x=0$. The only real solution of this equation is $x=1$, so there is an $x$-intercept at this point.


## QUICK CHECK EXERCISES 4.3 (See page 266 for answers.)

1. Let $f(x)=\frac{3(x+1)(x-3)}{(x+2)(x-4)}$. Given that

$$
f^{\prime}(x)=\frac{-30(x-1)}{(x+2)^{2}(x-4)^{2}}, \quad f^{\prime \prime}(x)=\frac{90\left(x^{2}-2 x+4\right)}{(x+2)^{3}(x-4)^{3}}
$$

determine the following properties of the graph of $f$.
(a) The $x$ - and $y$-intercepts are $\_\_\_\_$ .
(b) The vertical asymptotes are $\_\_\_\_$ .
(c) The horizontal asymptote is $\_\_\_\_$ .
(d) The graph is above the $x$-axis on the intervals $\_\_\_\_$ .
(e) The graph is increasing on the intervals $\_\_\_\_$ .
(f) The graph is concave up on the intervals $\_\_\_\_$ .
(g) The relative maximum point on the graph is $\_\_\_\_$ .
2. Let $f(x)=\frac{x^{2}-4}{x^{8 / 3}}$. Given that

$$
f^{\prime}(x)=\frac{-2\left(x^{2}-16\right)}{3 x^{11 / 3}}, \quad f^{\prime \prime}(x)=\frac{2\left(5 x^{2}-176\right)}{9 x^{14 / 3}}
$$

determine the following properties of the graph of $f$.
(a) The $x$-intercepts are $\_\_\_\_$ .
(b) The vertical asymptote is $\_\_\_\_$ .
(c) The horizontal asymptote is $\_\_\_\_$ .
(d) The graph is above the $x$-axis on the intervals $\_\_\_\_$ .
(e) The graph is increasing on the intervals $\_\_\_\_$ .
(f) The graph is concave up on the intervals $\_\_\_\_$ .
(g) Inflection points occur at $x=$ $\_\_\_\_$ .
3. Let $f(x)=(x-2)^{2} e^{x / 2}$. Given that
$f^{\prime}(x)=\frac{1}{2}\left(x^{2}-4\right) e^{x / 2}, \quad f^{\prime \prime}(x)=\frac{1}{4}\left(x^{2}+4 x-4\right) e^{x / 2}$ determine the following properties of the graph of $f$.
(a) The horizontal asymptote is $\_\_\_\_$ .
(b) The graph is above the $x$-axis on the intervals $\_\_\_\_$ .
(c) The graph is increasing on the intervals $\_\_\_\_$ .
(d) The graph is concave up on the intervals $\_\_\_\_$ .
(e) The relative minimum point on the graph is $\_\_\_\_$ .
(f) The relative maximum point on the graph is $\_\_\_\_$ .
(g) Inflection points occur at $x=$ $\_\_\_\_$ .

1-14 Give a graph of the rational function and label the coordinates of the stationary points and inflection points. Show the horizontal and vertical asymptotes and label them with their equations. Label point(s), if any, where the graph crosses a horizontal asymptote. Check your work with a graphing utility.

1. $\frac{2 x-6}{4-x}$
2. $\frac{8}{x^{2}-4}$
3. $\frac{x}{x^{2}-4}$
4. $\frac{x^{2}}{x^{2}-4}$
5. $\frac{x^{2}}{x^{2}+4}$
6. $\frac{\left(x^{2}-1\right)^{2}}{x^{4}+1}$
7. $\frac{x^{3}+1}{x^{3}-1}$
8. $2-\frac{1}{3 x^{2}+x^{3}}$
9. $\frac{4}{x^{2}}-\frac{2}{x}+3$
10. $\frac{3(x+1)^{2}}{(x-1)^{2}}$
11. $\frac{(3 x+1)^{2}}{(x-1)^{2}}$
12. $3+\frac{x+1}{(x-1)^{4}}$
13. $\frac{x^{2}+x}{1-x^{2}}$
14. $\frac{x^{2}}{1-x^{3}}$

15-16 In each part, make a rough sketch of the graph using asymptotes and appropriate limits but no derivatives. Compare your graph to that generated with a graphing utility.
15.
(a) $y=\frac{3 x^{2}-8}{x^{2}-4}$
(b) $y=\frac{x^{2}+2 x}{x^{2}-1}$
16.
(a) $y=\frac{2 x-x^{2}}{x^{2}+x-2}$
(b) $y=\frac{x^{2}}{x^{2}-x-2}$
17. Show that $y=x+3$ is an oblique asymptote of the graph of $f(x)=x^{2} /(x-3)$. Sketch the graph of $y=f(x)$ showing this asymptotic behavior.
18. Show that $y=3-x^{2}$ is a curvilinear asymptote of the graph of $f(x)=\left(2+3 x-x^{3}\right) / x$. Sketch the graph of $y=f(x)$ showing this asymptotic behavior.

19-24 Sketch a graph of the rational function and label the coordinates of the stationary points and inflection points. Show the horizontal, vertical, oblique, and curvilinear asymptotes and label them with their equations. Label point(s), if any, where the graph crosses an asymptote. Check your work with a graphing utility.
19. $x^{2}-\frac{1}{x}$
20. $\frac{x^{2}-2}{x}$
21. $\frac{(x-2)^{3}}{x^{2}}$
22. $x-\frac{1}{x}-\frac{1}{x^{2}}$
23. $\frac{x^{3}-4 x-8}{x+2}$
24. $\frac{x^{5}}{x^{2}+1}$

## FOCUS ON CONCEPTS

25. In each part, match the function with graphs I-VI.
(a) $x^{1 / 3}$
(b) $x^{1 / 4}$
(c) $x^{1 / 5}$
(d) $x^{2 / 5}$
(e) $x^{4 / 3}$
(f) $x^{-1 / 3}$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-198.jpg?height=860&width=688&top_left_y=280&top_left_x=1145)
- Figure Ex-25

26. Sketch the general shape of the graph of $y=x^{1 / n}$, and then explain in words what happens to the shape of the graph as $n$ increases if
(a) $n$ is a positive even integer
(b) $n$ is a positive odd integer.

27-30 True-False Determine whether the statement is true or false. Explain your answer.
27. Suppose that $f(x)=P(x) / Q(x)$, where $P$ and $Q$ are polynomials with no common factors. If $y=5$ is a horizontal asymptote for the graph of $f$, then $P$ and $Q$ have the same degree.
28. If the graph of $f$ has a vertical asymptote at $x=1$, then $f$ cannot be continuous at $x=1$.
29. If the graph of $f^{\prime}$ has a vertical asymptote at $x=1$, then $f$ cannot be continuous at $x=1$.
30. If the graph of $f$ has a cusp at $x=1$, then $f$ cannot have an inflection point at $x=1$.

31-38 Give a graph of the function and identify the locations of all critical points and inflection points. Check your work with a graphing utility.
31. $\sqrt{4 x^{2}-1}$
32. $\sqrt[3]{x^{2}-4}$
33. $2 x+3 x^{2 / 3}$
34. $2 x^{2}-3 x^{4 / 3}$
35. $4 x^{1 / 3}-x^{4 / 3}$
36. $5 x^{2 / 3}+x^{5 / 3}$
37. $\frac{8+x}{2+\sqrt[3]{x}}$
38. $\frac{8(\sqrt{x}-1)}{x}$

39-44 Give a graph of the function and identify the locations of all relative extrema and inflection points. Check your work with a graphing utility.
39. $x+\sin x$
40. $x-\tan x$
41. $\sqrt{3} \cos x+\sin x$
42. $\sin x+\cos x$
43. $\sin ^{2} x-\cos x, \quad-\pi \leq x \leq 3 \pi$
44. $\sqrt{\tan x}, \quad 0 \leq x<\pi / 2$

45-54 Using L'Hôpital's rule (Section 3.6) one can verify that

$$
\lim _{x \rightarrow+\infty} \frac{e^{x}}{x}=+\infty, \quad \lim _{x \rightarrow+\infty} \frac{x}{e^{x}}=0, \quad \lim _{x \rightarrow-\infty} x e^{x}=0
$$

In these exercises: (a) Use these results, as necessary, to find the limits of $f(x)$ as $x \rightarrow+\infty$ and as $x \rightarrow-\infty$. (b) Sketch a graph of $f(x)$ and identify all relative extrema, inflection points, and asymptotes (as appropriate). Check your work with a graphing utility.
45. $f(x)=x e^{x}$
46. $f(x)=x e^{-x}$
47. $f(x)=x^{2} e^{-2 x}$
48. $f(x)=x^{2} e^{2 x}$
49. $f(x)=x^{2} e^{-x^{2}}$
50. $f(x)=e^{-1 / x^{2}}$
51. $f(x)=\frac{e^{x}}{1-x}$
52. $f(x)=x^{2 / 3} e^{x}$
53. $f(x)=x^{2} e^{1-x}$
54. $f(x)=x^{3} e^{x-1}$

55-60 Using L'Hôpital's rule (Section 3.6) one can verify that

$$
\lim _{x \rightarrow+\infty} \frac{\ln x}{x^{r}}=0, \quad \lim _{x \rightarrow+\infty} \frac{x^{r}}{\ln x}=+\infty, \quad \lim _{x \rightarrow 0^{+}} x^{r} \ln x=0
$$

for any positive real number $r$. In these exercises: (a) Use these results, as necessary, to find the limits of $f(x)$ as $x \rightarrow+\infty$ and as $x \rightarrow 0^{+}$. (b) Sketch a graph of $f(x)$ and identify all relative extrema, inflection points, and asymptotes (as appropriate). Check your work with a graphing utility.
55. $f(x)=x \ln x$
56. $f(x)=x^{2} \ln x$
57. $f(x)=x^{2} \ln (2 x)$
58. $f(x)=\ln \left(x^{2}+1\right)$
59. $f(x)=x^{2 / 3} \ln x$
60. $f(x)=x^{-1 / 3} \ln x$

## FOCUS ON CONCEPTS

61. Consider the family of curves $y=x e^{-b x}(b>0)$.
(a) Use a graphing utility to generate some members of this family.
(b) Discuss the effect of varying $b$ on the shape of the graph, and discuss the locations of the relative extrema and inflection points.
62. Consider the family of curves $y=e^{-b x^{2}}(b>0)$.
(a) Use a graphing utility to generate some members of this family.
(b) Discuss the effect of varying $b$ on the shape of the graph, and discuss the locations of the relative extrema and inflection points.
63. (a) Determine whether the following limits exist, and if so, find them:

$$
\lim _{x \rightarrow+\infty} e^{x} \cos x, \quad \lim _{x \rightarrow-\infty} e^{x} \cos x
$$

(b) Sketch the graphs of the equations $y=e^{x}, y=-e^{x}$, and $y=e^{x} \cos x$ in the same coordinate system, and label any points of intersection.
(c) Use a graphing utility to generate some members of the family $y=e^{a x} \cos b x(a>0$ and $b>0)$, and discuss the effect of varying $a$ and $b$ on the shape of the curve.
64. Consider the family of curves $y=x^{n} e^{-x^{2} / n}$, where $n$ is a positive integer.
(a) Use a graphing utility to generate some members of this family.
(b) Discuss the effect of varying $n$ on the shape of the graph, and discuss the locations of the relative extrema and inflection points.
65. The accompanying figure shows the graph of the derivative of a function $h$ that is defined and continuous on the interval $(-\infty,+\infty)$. Assume that the graph of $h^{\prime}$ has a vertical asymptote at $x=3$ and that

$$
\begin{aligned}
& h^{\prime}(x) \rightarrow 0^{+} \text {as } x \rightarrow-\infty \\
& h^{\prime}(x) \rightarrow-\infty \text { as } x \rightarrow+\infty
\end{aligned}
$$

(a) What are the critical points for $h(x)$ ?
(b) Identify the intervals on which $h(x)$ is increasing.
(c) Identify the $x$-coordinates of relative extrema for $h(x)$ and classify each as a relative maximum or relative minimum.
(d) Estimate the $x$-coordinates of inflection points for $h(x)$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-199.jpg?height=416&width=475&top_left_y=1357&top_left_x=1205)
Figure Ex-65

66. Let $f(x)=(1-2 x) h(x)$, where $h(x)$ is as given in Exercise 65 . Suppose that $x=5$ is a critical point for $f(x)$.
(a) Estimate $h(5)$.
(b) Use the second derivative test to determine whether $f(x)$ has a relative maximum or a relative minimum at $x=5$.
67. A rectangular plot of land is to be fenced off so that the area enclosed will be $400 \mathrm{ft}^{2}$. Let $L$ be the length of fencing needed and $x$ the length of one side of the rectangle. Show that $L=2 x+800 / x$ for $x>0$, and sketch the graph of $L$ versus $x$ for $x>0$.
68. A box with a square base and open top is to be made from sheet metal so that its volume is $500 \mathrm{in}^{3}$. Let $S$ be the area
of the surface of the box and $x$ the length of a side of the square base. Show that $S=x^{2}+2000 / x$ for $x>0$, and sketch the graph of $S$ versus $x$ for $x>0$.
69. The accompanying figure shows a computer-generated graph of the polynomial $y=0.1 x^{5}(x-1)$ using a viewing window of $[-2,2.5] \times[-1,5]$. Show that the choice of the vertical scale caused the computer to miss important features of the graph. Find the features that were missed and make your own sketch of the graph that shows the missing features.
70. The accompanying figure shows a computer-generated graph of the polynomial $y=0.1 x^{5}(x+1)^{2}$ using a viewing window of $[-2,1.5] \times[-0.2,0.2]$. Show that the choice of the vertical scale caused the computer to miss important features of the graph. Find the features that were missed and make your own sketch of the graph that shows the missing features.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-200.jpg?height=221&width=343&top_left_y=188&top_left_x=1125)
- Figure Ex-69

Generated by Mathematica

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-200.jpg?height=223&width=336&top_left_y=188&top_left_x=1569)
Generated by Mathematica

- Figure Ex-70

71. Writing Suppose that $x=x_{0}$ is a point at which a function $f$ is continuous but not differentiable and that $f^{\prime}(x)$ approaches different finite limits as $x$ approaches $x_{0}$ from either side. Invent your own term to describe the graph of $f$ at such a point and discuss the appropriateness of your term.
72. Writing Suppose that the graph of a function $f$ is obtained using a graphing utility. Discuss the information that calculus techniques can provide about $f$ to add to what can already be inferred about $f$ from the graph as shown on your utility's display.

## QUICK CHECK ANSWERS 4.3

1. (a) $(-1,0),(3,0),\left(0, \frac{9}{8}\right)$ (b) $x=-2$ and $x=4$ (c) $y=3$ (d) $(-\infty,-2),(-1,3)$, and $(4,+\infty)$ (e) $(-\infty,-2)$ and $(-2,1]$
(f) $(-\infty,-2)$ and $(4,+\infty)$ (g) $\left(1, \frac{4}{3}\right)$
2. (a) $(-2,0),(2,0)$
(b) $x=0$
(b) $(-\infty, 2)$ and $(2,+\infty)$
(c) $y=0$
(c) $(-\infty,-2]$ and $[2,+\infty)$
(d) $(-\infty,-2)$ and $(2,+\infty)$
(d) $(-\infty,-2-2 \sqrt{2})$ and $(-2+2 \sqrt{2},+\infty)$
(e) $(-\infty,-4]$ and $(0,4]$
(e) $(2,0)$
(f) $(-\infty,-4 \sqrt{11 / 5})$ and $(4 \sqrt{11 / 5},+\infty)$ (g) $\pm 4 \sqrt{11 / 5} \approx \pm 5.93 \quad$ 3. (a) $y=0$ (as $x \rightarrow-\infty$ )
(f) $\left(-2,16 e^{-1}\right) \approx(-2,5.89)$ (g) $-2 \pm 2 \sqrt{2}$

### 4.4 ABSOLUTE MAXIMA AND MINIMA

At the beginning of Section 4.2 we observed that if the graph of a function $f$ is viewed as a two-dimensional mountain range (Figure 4.2.1), then the relative maxima and minima correspond to the tops of the hills and the bottoms of the valleys; that is, they are the high and low points in their immediate vicinity. In this section we will be concerned with the more encompassing problem of finding the highest and lowest points over the entire mountain range, that is, we will be looking for the top of the highest hill and the bottom of the deepest valley. In mathematical terms, we will be looking for the largest and smallest values of a function over an interval.

## ABSOLUTE EXTREMA

We will begin with some terminology for describing the largest and smallest values of a function on an interval.
4.4.1 DEFINITION Consider an interval in the domain of a function $f$ and a point $x_{0}$ in that interval. We say that $f$ has an absolute maximum at $x_{0}$ if $f(x) \leq f\left(x_{0}\right)$ for all $x$ in the interval, and we say that $f$ has an absolute minimum at $x_{0}$ if $f\left(x_{0}\right) \leq f(x)$ for all $x$ in the interval. We say that $f$ has an absolute extremum at $x_{0}$ if it has either an absolute maximum or an absolute minimum at that point.

If $f$ has an absolute maximum at the point $x_{0}$ on an interval, then $f\left(x_{0}\right)$ is the largest value of $f$ on the interval, and if $f$ has an absolute minimum at $x_{0}$, then $f\left(x_{0}\right)$ is the smallest value of $f$ on the interval. In general, there is no guarantee that a function will actually have an absolute maximum or minimum on a given interval (Figure 4.4.1).

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-201.jpg?height=522&width=1699&top_left_y=402&top_left_x=276)
\$ Figure 4.4.1

The hypotheses in the Extreme-Value Theorem are essential. That is, if either the interval is not closed or $f$ is not continuous on the interval, then $f$ need not have absolute extrema on the interval (Exercises 4-6).

## REMARK

Theorem 4.4.3 is also valid on infinite open intervals, that is, intervals of the form $(-\infty,+\infty),(a,+\infty)$, and $(-\infty, b)$.

## THE EXTREME VALUE THEOREM

Parts $(a)-(d)$ of Figure 4.4.1 show that a continuous function may or may not have absolute maxima or minima on an infinite interval or on a finite open interval. However, the following theorem shows that a continuous function must have both an absolute maximum and an absolute minimum on every finite closed interval [see part ( $e$ ) of Figure 4.4.1].
4.4.2 THEOREM (Extreme-Value Theorem) If a function $f$ is continuous on a finite closed interval $[a, b]$, then $f$ has both an absolute maximum and an absolute minimum on $[a, b]$.

Although the proof of this theorem is too difficult to include here, you should be able to convince yourself of its validity with a little experimentation-try graphing various continuous functions over the interval $[0,1]$, and convince yourself that there is no way to avoid having a highest and lowest point on a graph. As a physical analogy, if you imagine the graph to be a roller-coaster track starting at $x=0$ and ending at $x=1$, the roller coaster will have to pass through a highest point and a lowest point during the trip.

The Extreme-Value Theorem is an example of what mathematicians call an existence theorem. Such theorems state conditions under which certain objects exist, in this case absolute extrema. However, knowing that an object exists and finding it are two separate things. We will now address methods for determining the locations of absolute extrema under the conditions of the Extreme-Value Theorem.

If $f$ is continuous on the finite closed interval $[a, b]$, then the absolute extrema of $f$ occur either at the endpoints of the interval or inside on the open interval $(a, b)$. If the absolute extrema happen to fall inside, then the following theorem tells us that they must occur at critical points of $f$.

[^2]![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-202.jpg?height=1034&width=459&top_left_y=186&top_left_x=162)
△ Figure 4.4.2 In part (a) the absolute maximum occurs at an endpoint of $[a, b]$, in part ( $b$ ) it occurs at a stationary point in ( $a, b$ ), and in part ( $c$ ) it occurs at a critical point in ( $a, b$ ) where $f$ is not differentiable.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-202.jpg?height=434&width=391&top_left_y=1493&top_left_x=196)
△ Figure 4.4.3

Table 4.4.1
| $x$ | -1 | 0 | $\frac{1}{8}$ | 1 |
| :---: | ---: | ---: | ---: | ---: |
| $f(x)$ | 9 | 0 | $-\frac{9}{8}$ | 3 |


PROOF If $f$ has an absolute maximum on $(a, b)$ at $x_{0}$, then $f\left(x_{0}\right)$ is also a relative maximum for $f$; for if $f\left(x_{0}\right)$ is the largest value of $f$ on all $(a, b)$, then $f\left(x_{0}\right)$ is certainly the largest value for $f$ in the immediate vicinity of $x_{0}$. Thus, $x_{0}$ is a critical point of $f$ by Theorem 4.2.2. The proof for absolute minima is similar.

It follows from this theorem that if $f$ is continuous on the finite closed interval $[a, b]$, then the absolute extrema occur either at the endpoints of the interval or at critical points inside the interval (Figure 4.4.2). Thus, we can use the following procedure to find the absolute extrema of a continuous function on a finite closed interval $[a, b]$.

## A Procedure for Finding the Absolute Extrema of a Continuous Function fon a Finite Closed Interval [ $a, b$ ]

Step 1. Find the critical points of $f$ in ( $a, b$ ).
Step 2. Evaluate $f$ at all the critical points and at the endpoints $a$ and $b$.
Step 3. The largest of the values in Step 2 is the absolute maximum value of $f$ on $[a, b]$ and the smallest value is the absolute minimum.

Example 1 Find the absolute maximum and minimum values of the function $f(x)=2 x^{3}-15 x^{2}+36 x$ on the interval $[1,5]$, and determine where these values occur.

Solution. Since $f$ is continuous and differentiable everywhere, the absolute extrema must occur either at endpoints of the interval or at solutions to the equation $f^{\prime}(x)=0$ in the open interval $(1,5)$. The equation $f^{\prime}(x)=0$ can be written as

$$
6 x^{2}-30 x+36=6\left(x^{2}-5 x+6\right)=6(x-2)(x-3)=0
$$

Thus, there are stationary points at $x=2$ and at $x=3$. Evaluating $f$ at the endpoints, at $x=2$, and at $x=3$ yields

$$
\begin{aligned}
& f(1)=2(1)^{3}-15(1)^{2}+36(1)=23 \\
& f(2)=2(2)^{3}-15(2)^{2}+36(2)=28 \\
& f(3)=2(3)^{3}-15(3)^{2}+36(3)=27 \\
& f(5)=2(5)^{3}-15(5)^{2}+36(5)=55
\end{aligned}
$$

from which we conclude that the absolute minimum of $f$ on $[1,5]$ is 23 , occurring at $x=1$, and the absolute maximum of $f$ on $[1,5]$ is 55 , occurring at $x=5$. This is consistent with the graph of $f$ in Figure 4.4.3.

Example 2 Find the absolute extrema of $f(x)=6 x^{4 / 3}-3 x^{1 / 3}$ on the interval $[-1,1]$, and determine where these values occur.

Solution. Note that $f$ is continuous everywhere and therefore the Extreme-Value Theorem guarantees that $f$ has a maximum and a minimum value in the interval $[-1,1]$. Differentiating, we obtain

$$
f^{\prime}(x)=8 x^{1 / 3}-x^{-2 / 3}=x^{-2 / 3}(8 x-1)=\frac{8 x-1}{x^{2 / 3}}
$$

Thus, $f^{\prime}(x)=0$ at $x=\frac{1}{8}$, and $f^{\prime}(x)$ is undefined at $x=0$. Evaluating $f$ at these critical points and endpoints yields Table 4.4.1, from which we conclude that an absolute minimum value of $-\frac{9}{8}$ occurs at $x=\frac{1}{8}$, and an absolute maximum value of 9 occurs at $x=-1$.

## ABSOLUTE EXTREMA ON INFINITE INTERVALS

We observed earlier that a continuous function may or may not have absolute extrema on an infinite interval (see Figure 4.4.1). However, certain conclusions about the existence of absolute extrema of a continuous function $f$ on $(-\infty,+\infty)$ can be drawn from the behavior of $f(x)$ as $x \rightarrow-\infty$ and as $x \rightarrow+\infty$ (Table 4.4.2).

Table 4.4.2
ABSOLUTE EXTREMA ON INFINITE INTERVALS
| LIMITS | $\begin{aligned} & \lim _{x \rightarrow-\infty} f(x)=+\infty \\ & \lim _{x \rightarrow+\infty} f(x)=+\infty \end{aligned}$ | $\begin{aligned} & \lim _{x \rightarrow-\infty} f(x)=-\infty \\ & \lim _{x \rightarrow+\infty} f(x)=-\infty \end{aligned}$ | $\begin{aligned} & \lim _{x \rightarrow-\infty} f(x)=-\infty \\ & \lim _{x \rightarrow+\infty} f(x)=+\infty \end{aligned}$ | $\begin{aligned} \lim _{x \rightarrow-\infty} f(x) & =+\infty \\ \lim _{x \rightarrow+\infty} f(x) & =-\infty \end{aligned}$ |
| :--- | :--- | :--- | :--- | :--- |
| CONCLUSION IF $\boldsymbol{f}$ IS CONTINUOUS EVERYWHERE | $f$ has an absolute minimum but no absolute maximum on $(-\infty,+\infty)$. | $f$ has an absolute maximum but no absolute minimum on $(-\infty,+\infty)$. | $f$ has neither an absolute maximum nor an absolute minimum on $(-\infty,+\infty)$. | $f$ has neither an absolute maximum nor an absolute minimum on $(-\infty,+\infty)$. |
| GRAPH | ![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-203.jpg?height=225&width=355&top_left_y=824&top_left_x=499) | ![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-203.jpg?height=227&width=350&top_left_y=824&top_left_x=874) | ![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-203.jpg?height=225&width=350&top_left_y=824&top_left_x=1250) | ![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-203.jpg?height=233&width=352&top_left_y=824&top_left_x=1614) |


![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-203.jpg?height=535&width=459&top_left_y=1786&top_left_x=216)
△ Figure 4.4.4

Example 3 What can you say about the existence of absolute extrema on ( $-\infty,+\infty$ ) for polynomials?

Solution. If $p(x)$ is a polynomial of odd degree, then

$$
\begin{equation*}
\lim _{x \rightarrow+\infty} p(x) \text { and } \lim _{x \rightarrow-\infty} p(x) \tag{1}
\end{equation*}
$$

have opposite signs (one is $+\infty$ and the other is $-\infty$ ), so there are no absolute extrema. On the other hand, if $p(x)$ has even degree, then the limits in (1) have the same sign (both $+\infty$ or both $-\infty$ ). If the leading coefficient is positive, then both limits are $+\infty$, and there is an absolute minimum but no absolute maximum; if the leading coefficient is negative, then both limits are $-\infty$, and there is an absolute maximum but no absolute minimum.

Example 4 Determine by inspection whether $p(x)=3 x^{4}+4 x^{3}$ has any absolute extrema. If so, find them and state where they occur.

Solution. Since $p(x)$ has even degree and the leading coefficient is positive, $p(x) \rightarrow+\infty$ as $x \rightarrow \pm \infty$. Thus, there is an absolute minimum but no absolute maximum. From Theorem 4.4.3 [applied to the interval $(-\infty,+\infty)$ ], the absolute minimum must occur at a critical point of $p$. Since $p$ is differentiable everywhere, we can find all critical points by solving the equation $p^{\prime}(x)=0$. This equation is

$$
12 x^{3}+12 x^{2}=12 x^{2}(x+1)=0
$$

from which we conclude that the critical points are $x=0$ and $x=-1$. Evaluating $p$ at these critical points yields

$$
p(0)=0 \quad \text { and } \quad p(-1)=-1
$$

Therefore, $p$ has an absolute minimum of -1 at $x=-1$ (Figure 4.4.4).

## ABSOLUTE EXTREMA ON OPEN INTERVALS

We know that a continuous function may or may not have absolute extrema on an open interval. However, certain conclusions about the existence of absolute extrema of a continuous function $f$ on a finite open interval $(a, b)$ can be drawn from the behavior of $f(x)$ as $x \rightarrow a^{+}$and as $x \rightarrow b^{-}$(Table 4.4.3). Similar conclusions can be drawn for intervals of the form $(-\infty, b)$ or $(a,+\infty)$.

Table 4.4.3
ABSOLUTE EXTREMA ON OPEN INTERVALS
| LIMITS | $\begin{aligned} & \lim _{x \rightarrow a^{+}} f(x)=+\infty \\ & \lim _{x \rightarrow b^{-}} f(x)=+\infty \end{aligned}$ | $\begin{aligned} & \lim _{x \rightarrow a^{+}} f(x)=-\infty \\ & \lim _{x \rightarrow b^{-}} f(x)=-\infty \end{aligned}$ | $\begin{aligned} & \lim _{x \rightarrow a^{+}} f(x)=-\infty \\ & \lim _{x \rightarrow b^{-}} f(x)=+\infty \end{aligned}$ | $\begin{aligned} & \lim _{x \rightarrow a^{+}} f(x)=+\infty \\ & \lim _{x \rightarrow b^{-}} f(x)=-\infty \end{aligned}$ |
| :--- | :--- | :--- | :--- | :--- |
| CONCLUSION IF $\boldsymbol{f}$ is continuous ON $(a, b)$ | $f$ has an absolute minimum but no absolute maximum on ( $a, b$ ). | $f$ has an absolute maximum but no absolute minimum on ( $a, b$ ). | $f$ has neither an absolute maximum nor an absolute minimum on $(a, b)$. | $f$ has neither an absolute maximum nor an absolute minimum on $(a, b)$. |
| GRAPH | ![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-204.jpg?height=160&width=347&top_left_y=857&top_left_x=438) | ![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-204.jpg?height=156&width=342&top_left_y=859&top_left_x=816) | ![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-204.jpg?height=185&width=349&top_left_y=856&top_left_x=1189) | ![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-204.jpg?height=187&width=346&top_left_y=856&top_left_x=1564) |


Example 5 Determine whether the function

$$
f(x)=\frac{1}{x^{2}-x}
$$

has any absolute extrema on the interval $(0,1)$. If so, find them and state where they occur.
Solution. Since $f$ is continuous on the interval $(0,1)$ and

$$
\begin{aligned}
& \lim _{x \rightarrow 0^{+}} f(x)=\lim _{x \rightarrow 0^{+}} \frac{1}{x^{2}-x}=\lim _{x \rightarrow 0^{+}} \frac{1}{x(x-1)}=-\infty \\
& \lim _{x \rightarrow 1^{-}} f(x)=\lim _{x \rightarrow 1^{-}} \frac{1}{x^{2}-x}=\lim _{x \rightarrow 1^{-}} \frac{1}{x(x-1)}=-\infty
\end{aligned}
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-204.jpg?height=512&width=403&top_left_y=1621&top_left_x=192)
△ Figure 4.4.5

the function $f$ has an absolute maximum but no absolute minimum on the interval $(0,1)$. By Theorem 4.4.3 the absolute maximum must occur at a critical point of $f$ in the interval $(0,1)$. We have

$$
f^{\prime}(x)=-\frac{2 x-1}{\left(x^{2}-x\right)^{2}}
$$

so the only solution of the equation $f^{\prime}(x)=0$ is $x=\frac{1}{2}$. Although $f$ is not differentiable at $x=0$ or at $x=1$, these values are doubly disqualified since they are neither in the domain of $f$ nor in the interval $(0,1)$. Thus, the absolute maximum occurs at $x=\frac{1}{2}$, and this absolute maximum is

$$
f\left(\frac{1}{2}\right)=\frac{1}{\left(\frac{1}{2}\right)^{2}-\frac{1}{2}}=-4
$$

(Figure 4.4.5).

## ABSOLUTE EXTREMA OF FUNCTIONS WITH ONE RELATIVE EXTREMUM

If a continuous function has only one relative extremum on a finite or infinite interval, then that relative extremum must of necessity also be an absolute extremum. To understand why

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-205.jpg?height=392&width=468&top_left_y=198&top_left_x=214)
△ Figure 4.4.6

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-205.jpg?height=472&width=469&top_left_y=1521&top_left_x=214)
△ Figure 4.4.7

Does the function in Example 6 have an absolute minimum on the interval $(-\infty,+\infty)$ ?
this is so, suppose that $f$ has a relative maximum at $x_{0}$ in an interval, and there are no other relative extrema of $f$ on the interval. If $f\left(x_{0}\right)$ is not the absolute maximum of $f$ on the interval, then the graph of $f$ has to make an upward turn somewhere on the interval to rise above $f\left(x_{0}\right)$. However, this cannot happen because in the process of making an upward turn it would produce a second relative extremum (Figure 4.4.6). Thus, $f\left(x_{0}\right)$ must be the absolute maximum as well as a relative maximum. This idea is captured in the following theorem, which we state without proof.
4.4.4 THEOREM Suppose that $f$ is continuous and has exactly one relative extremum on an interval, say at $x_{0}$.
(a) If $f$ has a relative minimum at $x_{0}$, then $f\left(x_{0}\right)$ is the absolute minimum of $f$ on the interval.
(b) If $f$ has a relative maximum at $x_{0}$, then $f\left(x_{0}\right)$ is the absolute maximum of $f$ the interval.

This theorem is often helpful in situations where other methods are difficult or tedious to apply.

Example 6 Find the absolute extrema, if any, of the function $f(x)=e^{\left(x^{3}-3 x^{2}\right)}$ on the interval $(0,+\infty)$.

Solution. We have

$$
\lim _{x \rightarrow+\infty} f(x)=+\infty
$$

(verify), so $f$ does not have an absolute maximum on the interval $(0,+\infty)$. However, the continuity of $f$ together with the fact that

$$
\lim _{x \rightarrow 0^{+}} f(x)=e^{0}=1
$$

is finite allow for the possibility that $f$ has an absolute minimum on $(0,+\infty)$. If so, it would have to occur at a critical point of $f$, so we consider

$$
f^{\prime}(x)=e^{\left(x^{3}-3 x^{2}\right)}\left(3 x^{2}-6 x\right)=3 x(x-2) e^{\left(x^{3}-3 x^{2}\right)}
$$

Since $e^{\left(x^{3}-3 x^{2}\right)}>0$ for all values of $x$, we see that $x=0$ and $x=2$ are the only critical points of $f$. Of these, only $x=2$ is in the interval ( $0,+\infty$ ), so this is the point at which an absolute minimum could occur. To see whether an absolute minimum actually does occur at this point, we can apply part (a) of Theorem 4.4.4. Since

$$
\begin{aligned}
f^{\prime \prime}(x) & =e^{\left(x^{3}-3 x^{2}\right)}\left(3 x^{2}-6 x\right)^{2}+e^{\left(x^{3}-3 x^{2}\right)}(6 x-6) \\
& =\left[\left(3 x^{2}-6 x\right)^{2}+(6 x-6)\right] e^{\left(x^{3}-3 x^{2}\right)}
\end{aligned}
$$

we have

$$
f^{\prime \prime}(2)=(0+6) e^{-4}=6 e^{-4}>0
$$

so a relative minimum occurs at $x=2$ by the second derivative test. Thus, $f(x)$ has an absolute minimum at $x=2$, and this absolute minimum is $f(2)=e^{-4} \approx 0.0183$ (Figure 4.4.7).

1. Use the accompanying graph to find the $x$-coordinates of the relative extrema and absolute extrema of $f$ on $[0,6]$.

QUICK CHECK EXERCISES 4.4 (See page 274 for answers.)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-206.jpg?height=347&width=395&top_left_y=396&top_left_x=212)

Figure Ex-1
2. Suppose that a function $f$ is continuous on $[-4,4]$ and has critical points at $x=-3,0,2$. Use the accompanying table
to determine the absolute maximum and absolute minimum values, if any, for $f$ on the indicated intervals.
(a) $[1,4]$
(b) $[-2,2]$
(c) $[-4,4]$
(d) $(-4,4)$

| $x$ | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| $f(x)$ | 2224 | -1333 | 0 | 1603 | 2096 | 2293 | 2400 | 2717 | 6064 |

3. Let $f(x)=x^{3}-3 x^{2}-9 x+25$. Use the derivative $f^{\prime}(x)=3(x+1)(x-3)$ to determine the absolute maximum and absolute minimum values, if any, for $f$ on each of the given intervals.
(a) $[0,4]$
(b) $[-2,4]$
(c) $[-4,2]$
(d) $[-5,10]$
(e) $(-5,4)$

## FOCUS ON CONCEPTS

1-2 Use the graph to find $x$-coordinates of the relative extrema and absolute extrema of $f$ on [0,7].

1.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-206.jpg?height=307&width=343&top_left_y=1197&top_left_x=224)

2.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-206.jpg?height=307&width=350&top_left_y=1197&top_left_x=592)

3. In each part, sketch the graph of a continuous function $f$ with the stated properties on the interval $[0,10]$.
(a) $f$ has an absolute minimum at $x=0$ and an absolute maximum at $x=10$.
(b) $f$ has an absolute minimum at $x=2$ and an absolute maximum at $x=7$.
(c) $f$ has relative minima at $x=1$ and $x=8$, has relative maxima at $x=3$ and $x=7$, has an absolute minimum at $x=5$, and has an absolute maximum at $x=10$.
4. In each part, sketch the graph of a continuous function $f$ with the stated properties on the interval $(-\infty,+\infty)$.
(a) $f$ has no relative extrema or absolute extrema.
(b) $f$ has an absolute minimum at $x=0$ but no absolute maximum.
(c) $f$ has an absolute maximum at $x=-5$ and an absolute minimum at $x=5$.
5. Let

$$
f(x)= \begin{cases}\frac{1}{1-x}, & 0 \leq x<1 \\ 0, & x=1\end{cases}
$$

Explain why $f$ has a minimum value but no maximum value on the closed interval $[0,1]$.
6. Let

$$
f(x)= \begin{cases}x, & 0<x<1 \\ \frac{1}{2}, & x=0,1\end{cases}
$$

Explain why $f$ has neither a minimum value nor a maximum value on the closed interval $[0,1]$.

7-16 Find the absolute maximum and minimum values of $f$ on the given closed interval, and state where those values occur.
7. $f(x)=4 x^{2}-12 x+10 ;[1,2]$
8. $f(x)=8 x-x^{2} ;[0,6]$
9. $f(x)=(x-2)^{3} ;[1,4]$
10. $f(x)=2 x^{3}+3 x^{2}-12 x$; $[-3,2]$
11. $f(x)=\frac{3 x}{\sqrt{4 x^{2}+1}} ;[-1,1]$
12. $f(x)=\left(x^{2}+x\right)^{2 / 3} ;[-2,3]$
13. $f(x)=x-2 \sin x ;[-\pi / 4, \pi / 2]$
14. $f(x)=\sin x-\cos x ;[0, \pi]$
15. $f(x)=1+\left|9-x^{2}\right| ;[-5,1]$
16. $f(x)=|6-4 x|$; $[-3,3]$

17-20 True-False Determine whether the statement is true or false. Explain your answer.
17. If a function $f$ is continuous on $[a, b]$, then $f$ has an absolute maximum on $[a, b]$.
18. If a function $f$ is continuous on ( $a, b$ ), then $f$ has an absolute minimum on $(a, b)$.
19. If a function $f$ has an absolute minimum on $(a, b)$, then there is a critical point of $f$ in ( $a, b$ ).
20. If a function $f$ is continuous on $[a, b]$ and $f$ has no relative extreme values in $(a, b)$, then the absolute maximum value of $f$ exists and occurs either at $x=a$ or at $x=b$.

21-28 Find the absolute maximum and minimum values of $f$, if any, on the given interval, and state where those values occur.
21. $f(x)=x^{2}-x-2 ;(-\infty,+\infty)$
22. $f(x)=3-4 x-2 x^{2} ;(-\infty,+\infty)$
23. $f(x)=4 x^{3}-3 x^{4} ;(-\infty,+\infty)$
24. $f(x)=x^{4}+4 x ;(-\infty,+\infty)$
25. $f(x)=2 x^{3}-6 x+2$; $(-\infty,+\infty)$
26. $f(x)=x^{3}-9 x+1 ;(-\infty,+\infty)$
27. $f(x)=\frac{x^{2}+1}{x+1} ;(-5,-1)$
28. $f(x)=\frac{x-2}{x+1} ;(-1,5]$

29-42 Use a graphing utility to estimate the absolute maximum and minimum values of $f$, if any, on the stated interval, and then use calculus methods to find the exact values.
29. $f(x)=\left(x^{2}-2 x\right)^{2} ;(-\infty,+\infty)$
30. $f(x)=(x-1)^{2}(x+2)^{2} ;(-\infty,+\infty)$
31. $f(x)=x^{2 / 3}(20-x) ;[-1,20]$
32. $f(x)=\frac{x}{x^{2}+2} ;[-1,4]$
33. $f(x)=1+\frac{1}{x} ;(0,+\infty)$
34. $f(x)=\frac{2 x^{2}-3 x+3}{x^{2}-2 x+2} ;[1,+\infty)$
35. $f(x)=\frac{2-\cos x}{\sin x} ;[\pi / 4,3 \pi / 4]$
36. $f(x)=\sin ^{2} x+\cos x ;[-\pi, \pi]$
37. $f(x)=x^{3} e^{-2 x} ;[1,4]$
38. $f(x)=\frac{\ln (2 x)}{x} ;[1, e]$
39. $f(x)=5 \ln \left(x^{2}+1\right)-3 x$; $[0,4]$
40. $f(x)=\left(x^{2}-1\right) e^{x}$; [-2,2]
41. $f(x)=\sin (\cos x) ;[0,2 \pi]$
42. $f(x)=\cos (\sin x) ;[0, \pi]$
43. Find the absolute maximum and minimum values of

$$
f(x)= \begin{cases}4 x-2, & x<1 \\ (x-2)(x-3), & x \geq 1\end{cases}
$$

on $\left[\frac{1}{2}, \frac{7}{2}\right]$.
44. Let $f(x)=x^{2}+p x+q$. Find the values of $p$ and $q$ such that $f(1)=3$ is an extreme value of $f$ on $[0,2]$. Is this value a maximum or minimum?

45-46 If $f$ is a periodic function, then the locations of all absolute extrema on the interval $(-\infty,+\infty)$ can be obtained by finding the locations of the absolute extrema for one period and using the periodicity to locate the rest. Use this idea in these exercises to find the absolute maximum and minimum values of the function, and state the $x$-values at which they occur.
45. $f(x)=2 \cos x+\cos 2 x$
46. $f(x)=3 \cos \frac{x}{3}+2 \cos \frac{x}{2}$

47-48 One way of proving that $f(x) \leq g(x)$ for all $x$ in a given interval is to show that $0 \leq g(x)-f(x)$ for all $x$ in the interval; and one way of proving the latter inequality is to show that the absolute minimum value of $g(x)-f(x)$ on the interval is nonnegative. Use this idea to prove the inequalities in these exercises. □
47. Prove that $\sin x \leq x$ for all $x$ in the interval $[0,2 \pi]$.
48. Prove that $\cos x \geq 1-\left(x^{2} / 2\right)$ for all $x$ in the interval $[0,2 \pi]$.
49. What is the smallest possible slope for a tangent to the graph of the equation $y=x^{3}-3 x^{2}+5 x$ ?
50. (a) Show that $f(x)=\sec x+\csc x$ has a minimum value but no maximum value on the interval $(0, \pi / 2)$.
(b) Find the minimum value in part (a).
c 51. Show that the absolute minimum value of

$$
f(x)=x^{2}+\frac{x^{2}}{(8-x)^{2}}, \quad x>8
$$

occurs at $x=10$ by using a CAS to find $f^{\prime}(x)$ and to solve the equation $f^{\prime}(x)=0$.
52. The concentration $C(t)$ of a drug in the bloodstream $t$ hours after it has been injected is commonly modeled by an equation of the form

$$
C(t)=\frac{K\left(e^{-b t}-e^{-a t}\right)}{a-b}
$$

where $K>0$ and $a>b>0$.
(a) At what time does the maximum concentration occur?
(b) Let $K=1$ for simplicity, and use a graphing utility to check your result in part (a) by graphing $C(t)$ for various values of $a$ and $b$.
53. Suppose that the equations of motion of a paper airplane during the first 12 seconds of flight are

$$
x=t-2 \sin t, \quad y=2-2 \cos t \quad(0 \leq t \leq 12)
$$

What are the highest and lowest points in the trajectory, and when is the airplane at those points?
54. The accompanying figure shows the path of a fly whose equations of motion are
$x=\frac{\cos t}{2+\sin t}, \quad y=3+\sin (2 t)-2 \sin ^{2} t \quad(0 \leq t \leq 2 \pi)$
(a) How high and low does it fly?
(b) How far left and right of the origin does it fly?

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-207.jpg?height=329&width=473&top_left_y=2082&top_left_x=1181)
Figure Ex-54

55. Let $f(x)=a x^{2}+b x+c$, where $a>0$. Prove that $f(x) \geq 0$ for all $x$ if and only if $b^{2}-4 a c \leq 0$. [Hint: Find the minimum of $f(x)$.]
56. Prove Theorem 4.4.3 in the case where the extreme value is a minimum.
57. Writing Suppose that $f$ is continuous and positive-valued everywhere and that the $x$-axis is an asymptote for the graph of $f$, both as $x \rightarrow-\infty$ and as $x \rightarrow+\infty$. Explain why $f$
cannot have an absolute minimum but may have a relative minimum.
58. Writing Explain the difference between a relative maximum and an absolute maximum. Sketch a graph that illustrates a function with a relative maximum that is not an absolute maximum, and sketch another graph illustrating an absolute maximum that is not a relative maximum. Explain how these graphs satisfy the given conditions.

## QUICK CHECK ANSWERS 4.4

1. There is a relative minimum at $x=3$, a relative maximum at $x=1$, an absolute minimum at $x=3$, and an absolute maximum at $x=6$. 2. (a) max, 6064; $\min , 2293$ (b) max, $2400 ; \min , 0$ (c) max, $6064 ; \min ,-1333$ (d) no max; min, -1333
2. (a) max, $f(0)=25$; min, $f(3)=-2$ (b) max, $f(-1)=30$; min, $f(3)=-2$ (c) max, $f(-1)=30$; min, $f(-4)=-51$
(d) $\max , f(10)=635 ; \min , f(-5)=-130(\mathrm{e}) \max , f(-1)=30 ;$ no min

### 4.5 APPLIED MAXIMUM AND MIMIMUM PROBLEMS

In this section we will show how the methods discussed in the last section can be used to solve various applied optimization problems.

## CLASSIFICATION OF OPTIMIZATION PROBLEMS

The applied optimization problems that we will consider in this section fall into the following two categories:

- Problems that reduce to maximizing or minimizing a continuous function over a finite closed interval.
- Problems that reduce to maximizing or minimizing a continuous function over an infinite interval or a finite interval that is not closed.

For problems of the first type the Extreme-Value Theorem (4.4.2) guarantees that the problem has a solution, and we know that the solution can be obtained by examining the values of the function at the critical points and at the endpoints. However, for problems of the second type there may or may not be a solution. If the function is continuous and has exactly one relative extremum of the appropriate type on the interval, then Theorem 4.4.4 guarantees the existence of a solution and provides a method for finding it. In cases where this theorem is not applicable some ingenuity may be required to solve the problem.

## PROBLEMS INVOLVING FINITE CLOSED INTERVALS

In his On a Method for the Evaluation of Maxima and Minima, the seventeenth century French mathematician Pierre de Fermat solved an optimization problem very similar to the one posed in our first example. Fermat's work on such optimization problems prompted the French mathematician Laplace to proclaim Fermat the "true inventor of the differential calculus." Although this honor must still reside with Newton and Leibniz, it is the case that Fermat developed procedures that anticipated parts of differential calculus.

- Example 1 A garden is to be laid out in a rectangular area and protected by a chicken wire fence. What is the largest possible area of the garden if only 100 running feet of chicken wire is available for the fence?

Solution. Let

$$
\begin{aligned}
x & =\text { length of the rectangle }(\mathrm{ft}) \\
y & =\text { width of the rectangle }(\mathrm{ft}) \\
A & =\text { area of the rectangle }\left(\mathrm{ft}^{2}\right)
\end{aligned}
$$

Then

$$
\begin{equation*}
A=x y \tag{1}
\end{equation*}
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-209.jpg?height=322&width=395&top_left_y=618&top_left_x=248)
△ Figure 4.5.1

Since the perimeter of the rectangle is 100 ft , the variables $x$ and $y$ are related by the equation

$$
\begin{equation*}
2 x+2 y=100 \text { or } y=50-x \tag{2}
\end{equation*}
$$

(See Figure 4.5.1.) Substituting (2) in (1) yields

$$
\begin{equation*}
A=x(50-x)=50 x-x^{2} \tag{3}
\end{equation*}
$$

Because $x$ represents a length, it cannot be negative, and because the two sides of length $x$ cannot have a combined length exceeding the total perimeter of 100 ft , the variable $x$ must satisfy

$$
\begin{equation*}
0 \leq x \leq 50 \tag{4}
\end{equation*}
$$

Thus, we have reduced the problem to that of finding the value (or values) of $x$ in $[0,50]$, for which $A$ is maximum. Since $A$ is a polynomial in $x$, it is continuous on [0,50], and so the maximum must occur at an endpoint of this interval or at a critical point.

From (3) we obtain

$$
\frac{d A}{d x}=50-2 x
$$

Setting $d A / d x=0$ we obtain

$$
50-2 x=0
$$

Pierre de Fermat (1601-1665) Fermat, the son of a successful French leather merchant, was a lawyer who practiced mathematics as a hobby. He received a Bachelor of Civil Laws degree from the University of Orleans in 1631 and subsequently held various government positions, including a post as councillor to the Toulouse parliament. Although he was apparently financially successful, confidential documents of that time suggest that his performance in office and as a lawyer was poor, perhaps because he devoted so much time to mathematics. Throughout his life, Fermat fought all efforts to have his mathematical results published. He had the unfortunate habit of scribbling his work in the margins of books and often sent his results to friends without keeping copies for himself. As a result, he never received credit for many major achievements until his name was raised from obscurity in the mid-nineteenth century. It is now known that Fermat, simultaneously and independently of Descartes, developed analytic geometry. Unfortunately, Descartes and Fermat argued bitterly over various problems so that there was never any real cooperation between these two great geniuses.

Fermat solved many fundamental calculus problems. He obtained the first procedure for differentiating polynomials, and solved many important maximization, minimization, area, and tangent problems. His work served to inspire Isaac Newton. Fermat is best known for his work in number theory, the study of properties of and relationships between whole numbers. He was the first
mathematician to make substantial contributions to this field after the ancient Greek mathematician Diophantus. Unfortunately, none of Fermat's contemporaries appreciated his work in this area, a fact that eventually pushed Fermat into isolation and obscurity in later life. In addition to his work in calculus and number theory, Fermat was one of the founders of probability theory and made major contributions to the theory of optics. Outside mathematics, Fermat was a classical scholar of some note, was fluent in French, Italian, Spanish, Latin, and Greek, and he composed a considerable amount of Latin poetry.

One of the great mysteries of mathematics is shrouded in Fermat's work in number theory. In the margin of a book by Diophantus, Fermat scribbled that for integer values of $n$ greater than 2 , the equation $x^{n}+y^{n}=z^{n}$ has no nonzero integer solutions for $x, y$, and $z$. He stated, "I have discovered a truly marvelous proof of this, which however the margin is not large enough to contain." This result, which became known as "Fermat's last theorem," appeared to be true, but its proof evaded the greatest mathematical geniuses for 300 years until Professor Andrew Wiles of Princeton University presented a proof in June 1993 in a dramatic series of three lectures that drew international media attention (see New York Times, June 27, 1993). As it turned out, that proof had a serious gap that Wiles and Richard Taylor fixed and published in 1995. A prize of 100,000 German marks was offered in 1908 for the solution, but it is worthless today because of inflation.

Table 4.5.1
| $x$ | 0 | 25 | 50 |
| ---: | ---: | ---: | ---: |
| $A$ | 0 | 625 | 0 |


![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-210.jpg?height=289&width=461&top_left_y=438&top_left_x=160)
\$ Figure 4.5.2

In Example 1 we included $x=0$ and $x=50$ as possible values of $x$, even though these correspond to rectangles with two sides of length zero. If we view this as a purely mathematical problem, then there is nothing wrong with this. However, if we view this as an applied problem in which the rectangle will be formed from physical material, then it would make sense to exclude these values.
or $x=25$. Thus, the maximum occurs at one of the values

$$
x=0, \quad x=25, \quad x=50
$$

Substituting these values in (3) yields Table 4.5.1, which tells us that the maximum area of $625 \mathrm{ft}^{2}$ occurs at $x=25$, which is consistent with the graph of (3) in Figure 4.5.2. From (2) the corresponding value of $y$ is 25 , so the rectangle of perimeter 100 ft with greatest area is a square with sides of length 25 ft .

Example 1 illustrates the following five-step procedure that can be used for solving many applied maximum and minimum problems.

## A Procedure for Solving Applied Maximum and Minimum Problems

Step 1. Draw an appropriate figure and label the quantities relevant to the problem.
Step 2. Find a formula for the quantity to be maximized or minimized.
Step 3. Using the conditions stated in the problem to eliminate variables, express the quantity to be maximized or minimized as a function of one variable.

Step 4. Find the interval of possible values for this variable from the physical restrictions in the problem.

Step 5. If applicable, use the techniques of the preceding section to obtain the maximum or minimum.

Example 2 An open box is to be made from a 16 -inch by 30 -inch piece of cardboard by cutting out squares of equal size from the four corners and bending up the sides (Figure 4.5.3). What size should the squares be to obtain a box with the largest volume?
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-210.jpg?height=324&width=997&top_left_y=1449&top_left_x=848)

Solution. For emphasis, we explicitly list the steps of the five-step problem-solving procedure given above as an outline for the solution of this problem. (In later examples we will follow these guidelines without listing the steps.)

- Step 1: Figure 4.5.3a illustrates the cardboard piece with squares removed from its corners. Let

$$
\begin{aligned}
x & =\text { length (in inches) of the sides of the squares to be cut out } \\
V & =\text { volume (in cubic inches) of the resulting box }
\end{aligned}
$$

- Step 2: Because we are removing a square of side $x$ from each corner, the resulting box will have dimensions $16-2 x$ by $30-2 x$ by $x$ (Figure 4.5.3b). Since the volume of a box is the product of its dimensions, we have

$$
\begin{equation*}
V=(16-2 x)(30-2 x) x=480 x-92 x^{2}+4 x^{3} \tag{5}
\end{equation*}
$$

Table 4.5.2
| $x$ | 0 | $\frac{10}{3}$ | 8 |
| :--- | :--- | :---: | :--- |
| $V$ | 0 | $\frac{19,600}{27} \approx 726$ | 0 |


![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-211.jpg?height=300&width=465&top_left_y=770&top_left_x=212)
Figure 4.5.4

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-211.jpg?height=407&width=431&top_left_y=1221&top_left_x=232)
△ Figure 4.5.5

- Step 3: Note that our volume expression is already in terms of the single variable $x$.
- Step 4: The variable $x$ in (5) is subject to certain restrictions. Because $x$ represents a length, it cannot be negative, and because the width of the cardboard is 16 inches, we cannot cut out squares whose sides are more than 8 inches long. Thus, the variable $x$ in (5) must satisfy

$$
0 \leq x \leq 8
$$

and hence we have reduced our problem to finding the value (or values) of $x$ in the interval $[0,8]$ for which (5) is a maximum.

- Step 5: From (5) we obtain

$$
\begin{aligned}
\frac{d V}{d x} & =480-184 x+12 x^{2}=4\left(120-46 x+3 x^{2}\right) \\
& =4(x-12)(3 x-10)
\end{aligned}
$$

Setting $d V / d x=0$ yields

$$
x=\frac{10}{3} \quad \text { and } \quad x=12
$$

Since $x=12$ falls outside the interval $[0,8]$, the maximum value of $V$ occurs either at the critical point $x=\frac{10}{3}$ or at the endpoints $x=0, x=8$. Substituting these values into (5) yields Table 4.5.2, which tells us that the greatest possible volume $V=\frac{19,600}{27}$ in $^{3} \approx 726$ in $^{3}$ occurs when we cut out squares whose sides have length $\frac{10}{3}$ inches. This is consistent with the graph of (5) shown in Figure 4.5.4.

Example 3 Figure 4.5.5 shows an offshore oil well located at a point $W$ that is 5 km from the closest point $A$ on a straight shoreline. Oil is to be piped from $W$ to a shore point $B$ that is 8 km from $A$ by piping it on a straight line under water from $W$ to some shore point $P$ between $A$ and $B$ and then on to $B$ via pipe along the shoreline. If the cost of laying pipe is $\$ 1,000,000 / \mathrm{km}$ under water and $\$ 500,000 / \mathrm{km}$ over land, where should the point $P$ be located to minimize the cost of laying the pipe?

Solution. Let

$$
\begin{aligned}
& x=\text { distance (in kilometers) between } A \text { and } P \\
& c=\text { cost (in millions of dollars) for the entire pipeline }
\end{aligned}
$$

From Figure 4.5.5 the length of pipe under water is the distance between $W$ and $P$. By the Theorem of Pythagoras that length is

$$
\begin{equation*}
\sqrt{x^{2}+25} \tag{6}
\end{equation*}
$$

Also from Figure 4.5.5, the length of pipe over land is the distance between $P$ and $B$, which is

$$
\begin{equation*}
8-x \tag{7}
\end{equation*}
$$

From (6) and (7) it follows that the total cost $c$ (in millions of dollars) for the pipeline is

$$
\begin{equation*}
c=1\left(\sqrt{x^{2}+25}\right)+\frac{1}{2}(8-x)=\sqrt{x^{2}+25}+\frac{1}{2}(8-x) \tag{8}
\end{equation*}
$$

Because the distance between $A$ and $B$ is 8 km , the distance $x$ between $A$ and $P$ must satisfy

$$
0 \leq x \leq 8
$$

We have thus reduced our problem to finding the value (or values) of $x$ in the interval $[0,8]$ for which $c$ is a minimum. Since $c$ is a continuous function of $x$ on the closed interval $[0,8]$, we can use the methods developed in the preceding section to find the minimum.

## TECHNOLOGY MASTERY

If you have a CAS, use it to check all of the computations in Example 3. Specifically, differentiate $c$ with respect to $x$, solve the equation $d c / d x=0$, and perform all of the numerical calculations.

From (8) we obtain

$$
\frac{d c}{d x}=\frac{x}{\sqrt{x^{2}+25}}-\frac{1}{2}
$$

Setting $d c / d x=0$ and solving for $x$ yields

$$
\begin{align*}
\frac{x}{\sqrt{x^{2}+25}} & =\frac{1}{2}  \tag{9}\\
x^{2} & =\frac{1}{4}\left(x^{2}+25\right) \\
x & = \pm \frac{5}{\sqrt{3}}
\end{align*}
$$

The number $-5 / \sqrt{3}$ is not a solution of (9) and must be discarded, leaving $x=5 / \sqrt{3}$ as the only critical point. Since this point lies in the interval [0,8], the minimum must occur at one of the values

$$
x=0, \quad x=5 / \sqrt{3}, \quad x=8
$$

Substituting these values into (8) yields Table 4.5.3, which tells us that the least possible cost of the pipeline (to the nearest dollar) is $c=\$ 8,330,127$, and this occurs when the point $P$ is located at a distance of $5 / \sqrt{3} \approx 2.89 \mathrm{~km}$ from $A$.

Table 4.5.3
| $x$ | 0 | $\frac{5}{\sqrt{3}}$ | 8 |
| :--- | :--- | :---: | :---: |
| $c$ | 9 | $\frac{10}{\sqrt{3}}+\left(4-\frac{5}{2 \sqrt{3}}\right) \approx 8.330127$ | $\sqrt{89} \approx 9.433981$ |


![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-212.jpg?height=816&width=423&top_left_y=1381&top_left_x=180)
△ Figure 4.5.6

Example 4 Find the radius and height of the right circular cylinder of largest volume that can be inscribed in a right circular cone with radius 6 inches and height 10 inches (Figure 4.5.6a).

## Solution. Let

$$
\begin{aligned}
r & =\text { radius (in inches) of the cylinder } \\
h & =\text { height (in inches) of the cylinder } \\
V & =\text { volume (in cubic inches) of the cylinder }
\end{aligned}
$$

The formula for the volume of the inscribed cylinder is

$$
\begin{equation*}
V=\pi r^{2} h \tag{10}
\end{equation*}
$$

To eliminate one of the variables in (10) we need a relationship between $r$ and $h$. Using similar triangles (Figure 4.5.6b) we obtain

$$
\begin{equation*}
\frac{10-h}{r}=\frac{10}{6} \quad \text { or } \quad h=10-\frac{5}{3} r \tag{11}
\end{equation*}
$$

Substituting (11) into (10) we obtain

$$
\begin{equation*}
V=\pi r^{2}\left(10-\frac{5}{3} r\right)=10 \pi r^{2}-\frac{5}{3} \pi r^{3} \tag{12}
\end{equation*}
$$

which expresses $V$ in terms of $r$ alone. Because $r$ represents a radius, it cannot be negative, and because the radius of the inscribed cylinder cannot exceed the radius of the cone, the variable $r$ must satisfy

$$
0 \leq r \leq 6
$$

Thus, we have reduced the problem to that of finding the value (or values) of $r$ in $[0,6]$ for which (12) is a maximum. Since $V$ is a continuous function of $r$ on $[0,6]$, the methods developed in the preceding section apply.

From (12) we obtain

$$
\frac{d V}{d r}=20 \pi r-5 \pi r^{2}=5 \pi r(4-r)
$$

Setting $d V / d r=0$ gives

$$
5 \pi r(4-r)=0
$$

so $r=0$ and $r=4$ are critical points. Since these lie in the interval [ 0,6$]$, the maximum must occur at one of the values

$$
r=0, \quad r=4, \quad r=6
$$

Table 4.5.4
| $r$ | 0 | 4 | 6 |
| :---: | :---: | :---: | :---: |
| $V$ | 0 | $\frac{160}{3} \pi$ | 0 |


Substituting these values into (12) yields Table 4.5.4, which tells us that the maximum volume $V=\frac{160}{3} \pi \approx 168 \mathrm{in}^{3}$ occurs when the inscribed cylinder has radius 4 in . When $r=4$ it follows from (11) that $h=\frac{10}{3}$. Thus, the inscribed cylinder of largest volume has radius $r=4$ in and height $h=\frac{10}{3}$ in.

## PROBLEMS INVOLVING INTERVALS THAT ARE NOT BOTH FINITE AND CLOSED

Example 5 A closed cylindrical can is to hold 1 liter $\left(1000 \mathrm{~cm}^{3}\right)$ of liquid. How should we choose the height and radius to minimize the amount of material needed to manufacture the can?

Solution. Let

$$
\begin{aligned}
h & =\text { height (in } \mathrm{cm} \text { ) of the can } \\
r & =\text { radius (in } \mathrm{cm} \text { ) of the can } \\
S & =\text { surface area (in } \mathrm{cm}^{2} \text { ) of the can }
\end{aligned}
$$

Assuming there is no waste or overlap, the amount of material needed for manufacture will be the same as the surface area of the can. Since the can consists of two circular disks of radius $r$ and a rectangular sheet with dimensions $h$ by $2 \pi r$ (Figure 4.5.7), the surface area will be

$$
\begin{equation*}
S=2 \pi r^{2}+2 \pi r h \tag{13}
\end{equation*}
$$

Since $S$ depends on two variables, $r$ and $h$, we will look for some condition in the problem that will allow us to express one of these variables in terms of the other. For this purpose,

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-213.jpg?height=467&width=1093&top_left_y=1902&top_left_x=792)
△ Figure 4.5.7

observe that the volume of the can is $1000 \mathrm{~cm}^{3}$, so it follows from the formula $V=\pi r^{2} h$ for the volume of a cylinder that

$$
\begin{equation*}
1000=\pi r^{2} h \quad \text { or } \quad h=\frac{1000}{\pi r^{2}} \tag{14-15}
\end{equation*}
$$

Substituting (15) in (13) yields

$$
\begin{equation*}
S=2 \pi r^{2}+\frac{2000}{r} \tag{16}
\end{equation*}
$$

Thus, we have reduced the problem to finding a value of $r$ in the interval ( $0,+\infty$ ) for which $S$ is minimum. Since $S$ is a continuous function of $r$ on the interval ( $0,+\infty$ ) and

$$
\lim _{r \rightarrow 0^{+}}\left(2 \pi r^{2}+\frac{2000}{r}\right)=+\infty \quad \text { and } \quad \lim _{r \rightarrow+\infty}\left(2 \pi r^{2}+\frac{2000}{r}\right)=+\infty
$$

the analysis in Table 4.4.3 implies that $S$ does have a minimum on the interval $(0,+\infty)$. Since this minimum must occur at a critical point, we calculate

$$
\begin{equation*}
\frac{d S}{d r}=4 \pi r-\frac{2000}{r^{2}} \tag{17}
\end{equation*}
$$

Setting $d S / d r=0$ gives

$$
\begin{equation*}
r=\frac{10}{\sqrt[3]{2 \pi}} \approx 5.4 \tag{18}
\end{equation*}
$$

Since (18) is the only critical point in the interval ( $0,+\infty$ ), this value of $r$ yields the minimum value of $S$. From (15) the value of $h$ corresponding to this $r$ is

$$
h=\frac{1000}{\pi(10 / \sqrt[3]{2 \pi})^{2}}=\frac{20}{\sqrt[3]{2 \pi}}=2 r
$$

It is not an accident here that the minimum occurs when the height of the can is equal to the diameter of its base (Exercise 29).

Second Solution. The conclusion that a minimum occurs at the value of $r$ in (18) can be deduced from Theorem 4.4.4 and the second derivative test by noting that

$$
\frac{d^{2} S}{d r^{2}}=4 \pi+\frac{4000}{r^{3}}
$$

is positive if $r>0$ and hence is positive if $r=10 / \sqrt[3]{2 \pi}$. This implies that a relative minimum, and therefore a minimum, occurs at the critical point $r=10 / \sqrt[3]{2 \pi}$.

Third Solution. An alternative justification that the critical point $r=10 / \sqrt[3]{2 \pi}$ corresponds to a minimum for $S$ is to view the graph of $S$ versus $r$ (Figure 4.5.8).

In Example 5, the surface area $S$ has no absolute maximum, since $S$ increases without bound as the radius $r$ approaches 0 (Figure 4.5.8). Thus, had we asked for the dimensions of the can requiring the maximum amount of material for its manufacture, there would have been no solution to the problem. Optimization problems with no solution are sometimes called ill posed.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-214.jpg?height=384&width=455&top_left_y=1365&top_left_x=164)
△ Figure 4.5.8

- Example 6 Find a point on the curve $y=x^{2}$ that is closest to the point $(18,0)$.

Solution. The distance $L$ between $(18,0)$ and an arbitrary point $(x, y)$ on the curve $y=x^{2}$ (Figure 4.5.9) is given by

$$
L=\sqrt{(x-18)^{2}+(y-0)^{2}}
$$

Since $(x, y)$ lies on the curve, $x$ and $y$ satisfy $y=x^{2}$; thus,

$$
\begin{equation*}
L=\sqrt{(x-18)^{2}+x^{4}} \tag{19}
\end{equation*}
$$

Because there are no restrictions on $x$, the problem reduces to finding a value of $x$ in $(-\infty,+\infty)$ for which (19) is a minimum. The distance $L$ and the square of the distance $L^{2}$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-215.jpg?height=313&width=471&top_left_y=196&top_left_x=212)
△ Figure 4.5.9

are minimized at the same value (see Exercise 66). Thus, the minimum value of $L$ in (19) and the minimum value of

$$
\begin{equation*}
S=L^{2}=(x-18)^{2}+x^{4} \tag{20}
\end{equation*}
$$

occur at the same $x$-value.
From (20),

$$
\begin{equation*}
\frac{d S}{d x}=2(x-18)+4 x^{3}=4 x^{3}+2 x-36 \tag{21}
\end{equation*}
$$

so the critical points satisfy $4 x^{3}+2 x-36=0$ or, equivalently,

$$
\begin{equation*}
2 x^{3}+x-18=0 \tag{22}
\end{equation*}
$$

To solve for $x$ we will begin by checking the divisors of -18 to see whether the polynomial on the left side has any integer roots (see Appendix C). These divisors are $\pm 1, \pm 2, \pm 3, \pm 6$, $\pm 9$, and $\pm 18$. A check of these values shows that $x=2$ is a root, so $x-2$ is a factor of the polynomial. After dividing the polynomial by this factor we can rewrite (22) as

$$
(x-2)\left(2 x^{2}+4 x+9\right)=0
$$

Thus, the remaining solutions of (22) satisfy the quadratic equation

$$
2 x^{2}+4 x+9=0
$$

But this equation has no real solutions (using the quadratic formula), so $x=2$ is the only critical point of $S$. To determine the nature of this critical point we will use the second derivative test. From (21),

$$
\frac{d^{2} S}{d x^{2}}=12 x^{2}+2, \quad \text { so }\left.\quad \frac{d^{2} S}{d x^{2}}\right|_{x=2}=50>0
$$

which shows that a relative minimum occurs at $x=2$. Since $x=2$ yields the only relative extremum for $L$, it follows from Theorem 4.4.4 that an absolute minimum value of $L$ also occurs at $x=2$. Thus, the point on the curve $y=x^{2}$ closest to $(18,0)$ is

$$
(x, y)=\left(x, x^{2}\right)=(2,4)
$$

## AN APPLICATION TO ECONOMICS

Three functions of importance to an economist or a manufacturer are
$C(x)=$ total cost of producing $x$ units of a product during some time period
$R(x)=$ total revenue from selling $x$ units of the product during the time period
$P(x)=$ total profit obtained by selling $x$ units of the product during the time period
These are called, respectively, the cost function, revenue function, and profit function. If all units produced are sold, then these are related by

$$
\begin{align*}
& P(x)=R(x)-C(x)  \tag{23}\\
& {[\text { profit }]=[\text { revenue }]-[\text { cost }]}
\end{align*}
$$

The total cost $C(x)$ of producing $x$ units can be expressed as a sum

$$
\begin{equation*}
C(x)=a+M(x) \tag{24}
\end{equation*}
$$

where $a$ is a constant, called overhead, and $M(x)$ is a function representing manufacturing cost. The overhead, which includes such fixed costs as rent and insurance, does not depend on $x$; it must be paid even if nothing is produced. On the other hand, the manufacturing cost $M(x)$, which includes such items as cost of materials and labor, depends on the number of items manufactured. It is shown in economics that with suitable simplifying assumptions, $M(x)$ can be expressed in the form

$$
M(x)=b x+c x^{2}
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-216.jpg?height=479&width=477&top_left_y=1125&top_left_x=156)
Jim Karageorge/Getty Images
A pharmaceutical firm's profit is a function of the number of units produced.

where $b$ and $c$ are constants. Substituting this in (24) yields

$$
\begin{equation*}
C(x)=a+b x+c x^{2} \tag{25}
\end{equation*}
$$

If a manufacturing firm can sell all the items it produces for $p$ dollars apiece, then its total revenue $R(x)$ (in dollars) will be

$$
\begin{equation*}
R(x)=p x \tag{26}
\end{equation*}
$$

and its total profit $P(x)$ (in dollars) will be

$$
P(x)=[\text { total revenue }]-[\text { total cost }]=R(x)-C(x)=p x-C(x)
$$

Thus, if the cost function is given by (25),

$$
\begin{equation*}
P(x)=p x-\left(a+b x+c x^{2}\right) \tag{27}
\end{equation*}
$$

Depending on such factors as number of employees, amount of machinery available, economic conditions, and competition, there will be some upper limit $l$ on the number of items a manufacturer is capable of producing and selling. Thus, during a fixed time period the variable $x$ in (27) will satisfy

$$
0 \leq x \leq l
$$

By determining the value or values of $x$ in $[0, l]$ that maximize (27), the firm can determine how many units of its product must be manufactured and sold to yield the greatest profit. This is illustrated in the following numerical example.

- Example 7 A liquid form of antibiotic manufactured by a pharmaceutical firm is sold in bulk at a price of $\$ 200$ per unit. If the total production cost (in dollars) for $x$ units is

$$
C(x)=500,000+80 x+0.003 x^{2}
$$

and if the production capacity of the firm is at most 30,000 units in a specified time, how many units of antibiotic must be manufactured and sold in that time to maximize the profit?

Solution. Since the total revenue for selling $x$ units is $R(x)=200 x$, the profit $P(x)$ on $x$ units will be

$$
\begin{equation*}
P(x)=R(x)-C(x)=200 x-\left(500,000+80 x+0.003 x^{2}\right) \tag{28}
\end{equation*}
$$

Since the production capacity is at most 30,000 units, $x$ must lie in the interval $[0,30,000]$. From (28)

$$
\frac{d P}{d x}=200-(80+0.006 x)=120-0.006 x
$$

Setting $d P / d x=0$ gives

$$
120-0.006 x=0 \quad \text { or } \quad x=20,000
$$

Since this critical point lies in the interval [ $0,30,000$ ], the maximum profit must occur at one of the values

$$
x=0, \quad x=20,000, \quad \text { or } \quad x=30,000
$$

Substituting these values in (28) yields Table 4.5.5, which tells us that the maximum profit $P=\$ 700,000$ occurs when $x=20,000$ units are manufactured and sold in the specified time.

Table 4.5.5
| $x$ | 0 | 20,000 | 30,000 |
| :---: | :---: | :---: | :---: |
| $P(x)$ | $-500,000$ | 700,000 | 400,000 |


## MARGINAL ANALYSIS

Economists call $P^{\prime}(x), R^{\prime}(x)$, and $C^{\prime}(x)$ the marginal profit, marginal revenue, and marginal cost, respectively; and they interpret these quantities as the additional profit, revenue, and cost that result from producing and selling one additional unit of the product when the production and sales levels are at $x$ units. These interpretations follow from the local linear approximations of the profit, revenue, and cost functions. For example, it follows from Formula (2) of Section 3.5 that when the production and sales levels are at $x$ units the local linear approximation of the profit function is

$$
P(x+\Delta x) \approx P(x)+P^{\prime}(x) \Delta x
$$

Thus, if $\Delta x=1$ (one additional unit produced and sold), this formula implies

$$
P(x+1) \approx P(x)+P^{\prime}(x)
$$

and hence the additional profit that results from producing and selling one additional unit can be approximated as

$$
P(x+1)-P(x) \approx P^{\prime}(x)
$$

Similarly, $R(x+1)-R(x) \approx R^{\prime}(x)$ and $C(x+1)-C(x) \approx C^{\prime}(x)$.

## - A BASIC PRINCIPLE OF ECONOMICS

It follows from (23) that $P^{\prime}(x)=0$ has the same solution as $C^{\prime}(x)=R^{\prime}(x)$, and this implies that the maximum profit must occur at a point where the marginal revenue is equal to the marginal cost; that is:

If profit is maximum, then the cost of manufacturing and selling an additional unit of a product is approximately equal to the revenue generated by the additional unit.

In Example 7, the maximum profit occurs when $x=20,000$ units. Note that

$$
C(20,001)-C(20,000)=\$ 200.003 \quad \text { and } \quad R(20,001)-R(20,000)=\$ 200
$$

which is consistent with this basic economic principle.

## QUICK CHECK EXERCISES 4.5 (See page 288 for answers.)

1. A positive number $x$ and its reciprocal are added together. The smallest possible value of this sum is obtained by minimizing $f(x)=$ $\_\_\_\_$ for $x$ in the interval $\_\_\_\_$ .
2. Two nonnegative numbers, $x$ and $y$, have a sum equal to 10. The largest possible product of the two numbers is obtained by maximizing $f(x)=$ $\_\_\_\_$ for $x$ in the interval
$\_\_\_\_$ .
3. A rectangle in the $x y$-plane has one corner at the origin, an adjacent corner at the point ( $x, 0$ ), and a third corner at a
point on the line segment from $(0,4)$ to $(3,0)$. The largest possible area of the rectangle is obtained by maximizing $A(x)=$ $\_\_\_\_$ for $x$ in the interval $\_\_\_\_$ .
4. An open box is to be made from a 20 -inch by 32 -inch piece of cardboard by cutting out $x$-inch by $x$-inch squares from the four corners and bending up the sides. The largest possible volume of the box is obtained by maximizing $V(x)=$
$\_\_\_\_$ for $x$ in the interval $\_\_\_\_$ .

## EXERCISE SET 4.5

1. Find a number in the closed interval $\left[\frac{1}{2}, \frac{3}{2}\right]$ such that the sum of the number and its reciprocal is
(a) as small as possible
(b) as large as possible.
2. How should two nonnegative numbers be chosen so that their sum is 1 and the sum of their squares is
(a) as large as possible
(b) as small as possible?
3. A rectangular field is to be bounded by a fence on three sides and by a straight stream on the fourth side. Find the dimensions of the field with maximum area that can be enclosed using 1000 ft of fence.
4. The boundary of a field is a right triangle with a straight stream along its hypotenuse and with fences along its other two sides. Find the dimensions of the field with maximum area that can be enclosed using 1000 ft of fence.
5. A rectangular plot of land is to be fenced in using two kinds of fencing. Two opposite sides will use heavy-duty fencing selling for $\$ 3$ a foot, while the remaining two sides will use standard fencing selling for $\$ 2$ a foot. What are the dimensions of the rectangular plot of greatest area that can be fenced in at a cost of $\$ 6000$ ?
6. A rectangle is to be inscribed in a right triangle having sides of length $6 \mathrm{in}, 8 \mathrm{in}$, and 10 in . Find the dimensions of the rectangle with greatest area assuming the rectangle is

- Figure Ex-6
positioned as in Figure Ex-6.

7. Solve the problem in Exercise 6 assuming the rectangle is positioned as in Figure Ex-7.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-218.jpg?height=235&width=211&top_left_y=1057&top_left_x=540)
- Figure Ex-7

8. A rectangle has its two lower corners on the $x$-axis and its two upper corners on the curve $y=16-x^{2}$. For all such rectangles, what are the dimensions of the one with largest area?
9. Find the dimensions of the rectangle with maximum area that can be inscribed in a circle of radius 10 .
10. Find the point $P$ in the first quadrant on the curve $y=x^{-2}$ such that a rectangle with sides on the coordinate axes and a vertex at $P$ has the smallest possible perimeter.
11. A rectangular area of $3200 \mathrm{ft}^{2}$ is to be fenced off. Two opposite sides will use fencing costing $\$ 1$ per foot and the remaining sides will use fencing costing $\$ 2$ per foot. Find the dimensions of the rectangle of least cost.
12. Show that among all rectangles with perimeter $p$, the square has the maximum area.
13. Show that among all rectangles with area $A$, the square has the minimum perimeter.
14. A wire of length 12 in can be bent into a circle, bent into a square, or cut into two pieces to make both a circle and a square. How much wire should be used for the circle if the total area enclosed by the figure(s) is to be
(a) a maximum
(b) a minimum?
15. A rectangle $R$ in the plane has corners at ( $\pm 8, \pm 12$ ), and a 100 by 100 square $S$ is positioned in the plane so that its
sides are parallel to the coordinate axes and the lower left corner of $S$ is on the line $y=-3 x$. What is the largest possible area of a region in the plane that is contained in both $R$ and $S$ ?
16. Solve the problem in Exercise 15 if $S$ is a 16 by 16 square.
17. Solve the problem in Exercise 15 if $S$ is positioned with its lower left corner on the line $y=-6 x$.
18. A rectangular page is to contain 42 square inches of printable area. The margins at the top and bottom of the page are each 1 inch, one side margin is 1 inch, and the other side margin is 2 inches. What should the dimensions of the page be so that the least amount of paper is used?
19. A box with a square base is taller than it is wide. In order to send the box through the U.S. mail, the height of the box and the perimeter of the base can sum to no more than 108 in. What is the maximum volume for such a box?
20. A box with a square base is wider than it is tall. In order to send the box through the U.S. mail, the width of the box and the perimeter of one of the (nonsquare) sides of the box can sum to no more than 108 in . What is the maximum volume for such a box?
21. An open box is to be made from a 3 ft by 8 ft rectangular piece of sheet metal by cutting out squares of equal size from the four corners and bending up the sides. Find the maximum volume that the box can have.
22. A closed rectangular container with a square base is to have a volume of $2250 \mathrm{in}^{3}$. The material for the top and bottom of the container will cost $\$ 2$ per in ${ }^{2}$, and the material for the sides will cost $\$ 3$ per in ${ }^{2}$. Find the dimensions of the container of least cost.
23. A closed rectangular container with a square base is to have a volume of $2000 \mathrm{~cm}^{3}$. It costs twice as much per square centimeter for the top and bottom as it does for the sides. Find the dimensions of the container of least cost.
24. A container with square base, vertical sides, and open top is to be made from $1000 \mathrm{ft}^{2}$ of material. Find the dimensions of the container with greatest volume.
25. A rectangular container with two square sides and an open top is to have a volume of $V$ cubic units. Find the dimensions of the container with minimum surface area.
26. A church window consisting of a rectangle topped by a semicircle is to have a perimeter $p$. Find the radius of the semicircle if the area of the window is to be maximum.
27. Find the dimensions of the right circular cylinder of largest volume that can be inscribed in a sphere of radius $R$.
28. Find the dimensions of the right circular cylinder of greatest surface area that can be inscribed in a sphere of radius $R$.
29. A closed, cylindrical can is to have a volume of $V$ cubic units. Show that the can of minimum surface area is achieved when the height is equal to the diameter of the base.
30. A closed cylindrical can is to have a surface area of $S$ square units. Show that the can of maximum volume is achieved when the height is equal to the diameter of the base.
31. A cylindrical can, open at the top, is to hold $500 \mathrm{~cm}^{3}$ of liquid. Find the height and radius that minimize the amount of material needed to manufacture the can.
32. A soup can in the shape of a right circular cylinder of radius $r$ and height $h$ is to have a prescribed volume $V$. The top and bottom are cut from squares as shown in Figure Ex-32. If the shaded corners are wasted, but there is no other waste, find the ratio $r / h$ for the can requiring the least material (including waste).
33. A box-shaped wire frame consists of two identical wire squares whose vertices are connected by four straight wires

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-219.jpg?height=207&width=207&top_left_y=937&top_left_x=268)
- Figure Ex-32

of equal length (Figure Ex-33). If the frame is to be made from a wire of length $L$, what should the dimensions be to obtain a box of greatest volume?

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-219.jpg?height=129&width=284&top_left_y=1013&top_left_x=584)
- Figure Ex-33

34. Suppose that the sum of the surface areas of a sphere and a cube is a constant.
(a) Show that the sum of their volumes is smallest when the diameter of the sphere is equal to the length of an edge of the cube.
(b) When will the sum of their volumes be greatest?
35. Find the height and radius of the cone of slant height $L$ whose volume is as large as possible.
36. A cone is made from a circular sheet of radius $R$ by cutting out a sector and gluing the cut edges of the remaining piece together (Figure Ex-36). What is the maximum volume attainable for the cone?

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-219.jpg?height=305&width=612&top_left_y=1752&top_left_x=264)
- Figure Ex-36

37. A cone-shaped paper drinking cup is to hold $100 \mathrm{~cm}^{3}$ of water. Find the height and radius of the cup that will require the least amount of paper.
38. Find the dimensions of the isosceles triangle of least area that can be circumscribed about a circle of radius $R$.
39. Find the height and radius of the right circular cone with least volume that can be circumscribed about a sphere of radius $R$.
40. A commercial cattle ranch currently allows 20 steers per acre of grazing land; on the average its steers weigh 2000 lb at market. Estimates by the Agriculture Department indicate that the average market weight per steer will be reduced by 50 lb for each additional steer added per acre of grazing land. How many steers per acre should be allowed in order for the ranch to get the largest possible total market weight for its cattle?
41. A company mines low-grade nickel ore. If the company mines $x$ tons of ore, it can sell the ore for $p=225-0.25 x$ dollars per ton. Find the revenue and marginal revenue functions. At what level of production would the company obtain the maximum revenue?
42. A fertilizer producer finds that it can sell its product at a price of $p=300-0.1 x$ dollars per unit when it produces $x$ units of fertilizer. The total production cost (in dollars) for $x$ units is

$$
C(x)=15,000+125 x+0.025 x^{2}
$$

If the production capacity of the firm is at most 1000 units of fertilizer in a specified time, how many units must be manufactured and sold in that time to maximize the profit?
43. (a) A chemical manufacturer sells sulfuric acid in bulk at a price of $\$ 100$ per unit. If the daily total production cost in dollars for $x$ units is

$$
C(x)=100,000+50 x+0.0025 x^{2}
$$

and if the daily production capacity is at most 7000 units, how many units of sulfuric acid must be manufactured and sold daily to maximize the profit?
(b) Would it benefit the manufacturer to expand the daily production capacity?
(c) Use marginal analysis to approximate the effect on profit if daily production could be increased from 7000 to 7001 units.
44. A firm determines that $x$ units of its product can be sold daily at $p$ dollars per unit, where

$$
x=1000-p
$$

The cost of producing $x$ units per day is

$$
C(x)=3000+20 x
$$

(a) Find the revenue function $R(x)$.
(b) Find the profit function $P(x)$.
(c) Assuming that the production capacity is at most 500 units per day, determine how many units the company must produce and sell each day to maximize the profit.
(d) Find the maximum profit.
(e) What price per unit must be charged to obtain the maximum profit?
45. In a certain chemical manufacturing process, the daily weight $y$ of defective chemical output depends on the total weight $x$ of all output according to the empirical formula

$$
y=0.01 x+0.00003 x^{2}
$$

where $x$ and $y$ are in pounds. If the profit is $\$ 100$ per pound of nondefective chemical produced and the loss is $\$ 20$ per pound of defective chemical produced, how many pounds of chemical should be produced daily to maximize the total daily profit?
46. An independent truck driver charges a client $\$ 15$ for each hour of driving, plus the cost of fuel. At highway speeds of $v$ miles per hour, the trucker's rig gets $10-0.07 v$ miles per gallon of diesel fuel. If diesel fuel costs $\$ 2.50$ per gallon, what speed $v$ will minimize the cost to the client?
47. A trapezoid is inscribed in a semicircle of radius 2 so that one side is along the diameter (Figure Ex-47). Find the maximum possible area for the trapezoid. [Hint: Express the area of the trapezoid in terms of $\theta$.]
48. A drainage channel is to be made so that its cross section is a trapezoid with equally sloping sides (Figure Ex-48). If

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-220.jpg?height=225&width=351&top_left_y=1165&top_left_x=212)
- Figure Ex-47

the sides and bottom all have a length of 5 ft , how should the angle $\theta(0 \leq \theta \leq \pi / 2)$ be chosen to yield the greatest cross-sectional area of the channel?

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-220.jpg?height=183&width=354&top_left_y=1205&top_left_x=650)
- Figure Ex-48

49. A lamp is suspended above the center of a round table of radius $r$. How high above the table should the lamp be placed to achieve maximum illumination at the edge of the table? [Assume that the illumination $I$ is directly proportional to the cosine of the angle of incidence $\phi$ of the light rays and inversely proportional to the square of the distance $l$ from the light source (Figure Ex-49).]
50. A plank is used to reach over a fence 8 ft high to support a wall that is 1 ft behind the fence (Figure Ex-50). What is

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-220.jpg?height=303&width=373&top_left_y=1948&top_left_x=216)
- Figure Ex-49

the length of the shortest plank that can be used? [Hint: Express the length of the plank in terms of the angle $\theta$ shown in the figure.]

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-220.jpg?height=247&width=338&top_left_y=2008&top_left_x=668)
- Figure Ex-50

51. Find the coordinates of the point $P$ on the curve

$$
y=\frac{1}{x^{2}} \quad(x>0)
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-220.jpg?height=310&width=345&top_left_y=1553&top_left_x=1123)
- Figure Ex-55

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-220.jpg?height=302&width=352&top_left_y=1555&top_left_x=1525)
- Figure Ex-56

where the segment of the tangent line at $P$ that is cut off by the coordinate axes has its shortest length.
52. Find the $x$-coordinate of the point $P$ on the parabola

$$
y=1-x^{2} \quad(0<x \leq 1)
$$

where the triangle that is enclosed by the tangent line at $P$ and the coordinate axes has the smallest area.
53. Where on the curve $y=\left(1+x^{2}\right)^{-1}$ does the tangent line have the greatest slope?
54. Suppose that the number of bacteria in a culture at time $t$ is given by $N=5000\left(25+t e^{-t / 20}\right)$.
(a) Find the largest and smallest number of bacteria in the culture during the time interval $0 \leq t \leq 100$.
(b) At what time during the time interval in part (a) is the number of bacteria decreasing most rapidly?
55. The shoreline of Circle Lake is a circle with diameter 2 mi . Nancy's training routine begins at point $E$ on the eastern shore of the lake. She jogs along the north shore to a point $P$ and then swims the straight line distance, if any, from $P$ to point $W$ diametrically opposite $E$ (Figure Ex-55). Nancy swims at a rate of $2 \mathrm{mi} / \mathrm{h}$ and jogs at $8 \mathrm{mi} / \mathrm{h}$. How far should Nancy jog in order to complete her training routine in
(a) the least amount of time
(b) the greatest amount of time?
56. A man is floating in a rowboat 1 mile from the (straight) shoreline of a large lake. A town is located on the shoreline 1 mile from the point on the shoreline closest to the man. As suggested in Figure Ex-56, he intends to row in a straight line to some point $P$ on the shoreline and then walk the remaining distance to the town. To what point should he row in order to reach his destination in the least time if
(a) he can walk $5 \mathrm{mi} / \mathrm{h}$ and row $3 \mathrm{mi} / \mathrm{h}$
(b) he can walk $5 \mathrm{mi} / \mathrm{h}$ and row $4 \mathrm{mi} / \mathrm{h}$ ?
57. A pipe of negligible diameter is to be carried horizontally around a corner from a hallway 8 ft wide into a hallway 4 ft wide (Figure Ex-57 on the next page). What is the maximum length that the pipe can have?
Source: An interesting discussion of this problem in the case where the diameter of the pipe is not neglected is given by Norman Miller in the American Mathematical Monthly, Vol. 56, 1949, pp. 177-179.
58. A concrete barrier whose cross section is an isosceles triangle runs parallel to a wall. The height of the barrier is 3 ft , the width of the base of a cross section is 8 ft , and the barrier is positioned on level ground with its base 1 ft from the wall. A straight, stiff metal rod of negligible diameter

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-221.jpg?height=295&width=341&top_left_y=344&top_left_x=272)
- Figure Ex-57

has one end on the ground, the other end against the wall, and touches the top of the barrier (Figure Ex-58). What is the minimum length the rod can have?

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-221.jpg?height=243&width=350&top_left_y=396&top_left_x=680)
- Figure Ex-58

59. Suppose that the intensity of a point light source is directly proportional to the strength of the source and inversely proportional to the square of the distance from the source. Two point light sources with strengths of $S$ and $8 S$ are separated by a distance of 90 cm . Where on the line segment between the two sources is the total intensity a minimum?
60. Given points $A(2,1)$ and $B(5,4)$, find the point $P$ in the interval $[2,5]$ on the $x$-axis that maximizes angle $A P B$.
61. The lower edge of a painting, 10 ft in height, is 2 ft above an observer's eye level. Assuming that the best view is obtained when the angle subtended at the observer's eye by the painting is maximum, how far from the wall should the observer stand?

## FOCUS ON CONCEPTS

62. Fermat's principle (biography on p.275) in optics states that light traveling from one point to another follows that path for which the total travel time is minimum. In a uniform medium, the paths of "minimum time" and "shortest distance" turn out to be the same, so that light, if unobstructed, travels along a straight line. Assume that we have a light source, a flat mirror, and an observer in a uniform medium. If a light ray leaves the source, bounces off the mirror, and travels on to the observer, then its path will consist of two line segments, as shown in Figure Ex-62. According to Fermat's principle, the path will be such that the total travel time $t$ is minimum or, since the medium is uniform, the path will be such that the total distance traveled from $A$ to $P$ to $B$ is as small as possible. Assuming the minimum occurs when $d t / d x=0$, show that the light ray will strike the mirror at the point $P$ where the "angle of incidence" $\theta_{1}$ equals the "angle of reflection" $\theta_{2}$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-221.jpg?height=359&width=413&top_left_y=2054&top_left_x=296)
Figure Ex-62

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-221.jpg?height=468&width=385&top_left_y=1557&top_left_x=1207)
- Figure Ex-63

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-221.jpg?height=295&width=298&top_left_y=1730&top_left_x=1635)
- Figure Ex-64

63. Fermat's principle (Exercise 62) also explains why light rays traveling between air and water undergo bending (refraction). Imagine that we have two uniform media (such as air and water) and a light ray traveling from a source $A$ in one medium to an observer $B$ in the other medium (Figure Ex-63). It is known that light travels at a constant speed in a uniform medium, but more slowly in a dense medium (such as water) than in a thin medium (such as air). Consequently, the path of shortest time from $A$ to $B$ is not necessarily a straight line, but rather some broken line path $A$ to $P$ to $B$ allowing the light to take greatest advantage of its higher speed through the thin medium. Snell's law of refraction (biography on p. 288) states that the path of the light ray will be such that

$$
\frac{\sin \theta_{1}}{v_{1}}=\frac{\sin \theta_{2}}{v_{2}}
$$

where $v_{1}$ is the speed of light in the first medium, $v_{2}$ is the speed of light in the second medium, and $\theta_{1}$ and $\theta_{2}$ are the angles shown in Figure Ex-63. Show that this follows from the assumption that the path of minimum time occurs when $d t / d x=0$.
64. A farmer wants to walk at a constant rate from her barn to a straight river, fill her pail, and carry it to her house in the least time.
(a) Explain how this problem relates to Fermat's principle and the light-reflection problem in Exercise 62.
(b) Use the result of Exercise 62 to describe geometrically the best path for the farmer to take.
(c) Use part (b) to determine where the farmer should fill her pail if her house and barn are located as in Figure Ex-64.
65. If an unknown physical quantity $x$ is measured $n$ times, the measurements $x_{1}, x_{2}, \ldots, x_{n}$ often vary because of uncontrollable factors such as temperature, atmospheric pressure, and so forth. Thus, a scientist is often faced with the problem of using $n$ different observed measurements to obtain an estimate $\bar{x}$ of an unknown quantity $x$. One method for making such an estimate is based on the least squares principle, which states that the estimate $\bar{x}$
should be chosen to minimize

$$
s=\left(x_{1}-\bar{x}\right)^{2}+\left(x_{2}-\bar{x}\right)^{2}+\cdots+\left(x_{n}-\bar{x}\right)^{2}
$$

which is the sum of the squares of the deviations between the estimate $\bar{x}$ and the measured values. Show that the estimate resulting from the least squares principle is

$$
\bar{x}=\frac{1}{n}\left(x_{1}+x_{2}+\cdots+x_{n}\right)
$$

that is, $\bar{x}$ is the arithmetic average of the observed values.
66. Prove: If $f(x) \geq 0$ on an interval and if $f(x)$ has a maximum value on that interval at $x_{0}$, then $\sqrt{f(x)}$ also has a maximum value at $x_{0}$. Similarly for minimum values. [Hint: Use the fact that $\sqrt{x}$ is an increasing function on the interval $[0,+\infty)$.]
67. Writing Discuss the importance of finding intervals of possible values imposed by physical restrictions on variables in an applied maximum or minimum problem.

## QUICK CHECK ANSWERS 4.5

1. $x+\frac{1}{x} ;(0,+\infty)$
2. $x(10-x) ;[0,10]$
3. $x\left(-\frac{4}{3} x+4\right)=-\frac{4}{3} x^{2}+4 x ;[0,3]$
4. $x(20-2 x)(32-2 x)=4 x^{3}-104 x^{2}+640 x$; [0,10]

### 4.6 RECTILINEAR MOTION

In this section we will continue the study of rectilinear motion that we began in Section 2.1. We will define the notion of "acceleration" mathematically, and we will show how the tools of calculus developed earlier in this chapter can be used to analyze rectilinear motion in more depth.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-222.jpg?height=460&width=473&top_left_y=1409&top_left_x=154)
- Figure 4.6.1

## REVIEW OF TERMINOLOGY

Recall from Section 2.1 that a particle that can move in either direction along a coordinate line is said to be in rectilinear motion. The line might be an $x$-axis, a $y$-axis, or a coordinate line inclined at some angle. In general discussions we will designate the coordinate line as the $s$-axis. We will assume that units are chosen for measuring distance and time and that we begin observing the motion of the particle at time $t=0$. As the particle moves along the $s$-axis, its coordinate $s$ will be some function of time, say $s=s(t)$. We call $s(t)$ the position function of the particle,* and we call the graph of $s$ versus $t$ the position versus time curve. If the coordinate of a particle at time $t_{1}$ is $s\left(t_{1}\right)$ and the coordinate at a later time $t_{2}$ is $s\left(t_{2}\right)$, then $s\left(t_{2}\right)-s\left(t_{1}\right)$ is called the displacement of the particle over the time interval $\left[t_{1}, t_{2}\right]$. The displacement describes the change in position of the particle.

Figure 4.6.1 shows a typical position versus time curve for a particle in rectilinear motion. We can tell from that graph that the coordinate of the particle at time $t=0$ is $s_{0}$, and we can tell from the sign of $s$ when the particle is on the negative or the positive side of the origin as it moves along the coordinate line.

[^3]Willebrord van Roijen Snell (1591-1626) Dutch mathematician. Snell, who succeeded his father to the post of Professor of Mathematics at the University of Leiden in 1613, is most famous for the result of light refraction that bears his name. Although this phenomenon was studied as far back as the ancient Greek astronomer

Ptolemy, until Snell's work the relationship was incorrectly thought to be $\theta_{1} / v_{1}=\theta_{2} / v_{2}$. Snell's law was published by Descartes in 1638 without giving proper credit to Snell. Snell also discovered a method for determining distances by triangulation that founded the modern technique of mapmaking.

We should more properly call $v(t)$ the instantaneous velocity function to distinguish instantaneous velocity from average velocity. However, we will follow the standard practice of referring to it as the "velocity function," leaving it understood that it describes instantaneous velocity.

Example 1 Figure 4.6.2 $a$ shows the position versus time curve for a particle moving along an $s$-axis. In words, describe how the position of the particle changes with time.

Solution. The particle is at $s=-3$ at time $t=0$. It moves in the positive direction until time $t=4$, since $s$ is increasing. At time $t=4$ the particle is at position $s=3$. At that time it turns around and travels in the negative direction until time $t=7$, since $s$ is decreasing. At time $t=7$ the particle is at position $s=-1$, and it remains stationary thereafter, since $s$ is constant for $t>7$. This is illustrated schematically in Figure 4.6.2b.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-223.jpg?height=490&width=1153&top_left_y=594&top_left_x=760)
△ Figure 4.6.2

## VELOCITY AND SPEED

Recall from Formula (5) of Section 2.1 and Formula (4) of Section 2.2 that the instantaneous velocity of a particle in rectilinear motion is the derivative of the position function. Thus, if a particle in rectilinear motion has position function $s(t)$, then we define its velocity function $v(t)$ to be

$$
\begin{equation*}
v(t)=s^{\prime}(t)=\frac{d s}{d t} \tag{1}
\end{equation*}
$$

The sign of the velocity tells which way the particle is moving-a positive value for $v(t)$ means that $s$ is increasing with time, so the particle is moving in the positive direction, and a negative value for $v(t)$ means that $s$ is decreasing with time, so the particle is moving in the negative direction. If $v(t)=0$, then the particle has momentarily stopped.

For a particle in rectilinear motion it is important to distinguish between its velocity, which describes how fast and in what direction the particle is moving, and its speed, which describes only how fast the particle is moving. We make this distinction by defining speed to be the absolute value of velocity. Thus a particle with a velocity of $2 \mathrm{~m} / \mathrm{s}$ has a speed of $2 \mathrm{~m} / \mathrm{s}$ and is moving in the positive direction, while a particle with a velocity of $-2 \mathrm{~m} / \mathrm{s}$ also has a speed of $2 \mathrm{~m} / \mathrm{s}$ but is moving in the negative direction.

Since the instantaneous speed of a particle is the absolute value of its instantaneous velocity, we define its speed function to be

$$
\begin{equation*}
|v(t)|=\left|s^{\prime}(t)\right|=\left|\frac{d s}{d t}\right| \tag{2}
\end{equation*}
$$

The speed function, which is always nonnegative, tells us how fast the particle is moving but not its direction of motion.

- Example 2 Let $s(t)=t^{3}-6 t^{2}$ be the position function of a particle moving along an $s$-axis, where $s$ is in meters and $t$ is in seconds. Find the velocity and speed functions, and show the graphs of position, velocity, and speed versus time.

Solution. From (1) and (2), the velocity and speed functions are given by

$$
v(t)=\frac{d s}{d t}=3 t^{2}-12 t \quad \text { and } \quad|v(t)|=\left|3 t^{2}-12 t\right|
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-224.jpg?height=303&width=475&top_left_y=352&top_left_x=154)

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-224.jpg?height=252&width=467&top_left_y=684&top_left_x=156)
Velocity versus time

Velocity versus time
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-224.jpg?height=321&width=461&top_left_y=1029&top_left_x=160)

- Figure 4.6.3

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-224.jpg?height=240&width=459&top_left_y=1633&top_left_x=160)
Acceleration versus time

△ Figure 4.6.4

The graphs of position, velocity, and speed versus time are shown in Figure 4.6.3. Observe that velocity and speed both have units of meters per second (m/s), since $s$ is in meters (m) and time is in seconds (s).

The graphs in Figure 4.6.3 provide a wealth of visual information about the motion of the particle. For example, the position versus time curve tells us that the particle is on the negative side of the origin for $0<t<6$, is on the positive side of the origin for $t>6$, and is at the origin at times $t=0$ and $t=6$. The velocity versus time curve tells us that the particle is moving in the negative direction if $0<t<4$, is moving in the positive direction if $t>4$, and is momentarily stopped at times $t=0$ and $t=4$ (the velocity is zero at those times). The speed versus time curve tells us that the speed of the particle is increasing for $0<t<2$, decreasing for $2<t<4$, and increasing again for $t>4$.

## ACCELERATION

In rectilinear motion, the rate at which the instantaneous velocity of a particle changes with time is called its instantaneous acceleration. Thus, if a particle in rectilinear motion has velocity function $v(t)$, then we define its acceleration function to be

$$
\begin{equation*}
a(t)=v^{\prime}(t)=\frac{d v}{d t} \tag{3}
\end{equation*}
$$

Alternatively, we can use the fact that $v(t)=s^{\prime}(t)$ to express the acceleration function in terms of the position function as

$$
\begin{equation*}
a(t)=s^{\prime \prime}(t)=\frac{d^{2} s}{d t^{2}} \tag{4}
\end{equation*}
$$

Example 3 Let $s(t)=t^{3}-6 t^{2}$ be the position function of a particle moving along an $s$-axis, where $s$ is in meters and $t$ is in seconds. Find the acceleration function $a(t)$, and show the graph of acceleration versus time.

Solution. From Example 2, the velocity function of the particle is $v(t)=3 t^{2}-12 t$, so the acceleration function is

$$
a(t)=\frac{d v}{d t}=6 t-12
$$

and the acceleration versus time curve is the line shown in Figure 4.6.4. Note that in this example the acceleration has units of $\mathrm{m} / \mathrm{s}^{2}$, since $v$ is in meters per second ( $\mathrm{m} / \mathrm{s}$ ) and time is in seconds (s).

## SPEEDING UP AND SLOWING DOWN

We will say that a particle in rectilinear motion is speeding up when its speed is increasing and is slowing down when its speed is decreasing. In everyday language an object that is speeding up is said to be "accelerating" and an object that is slowing down is said to be "decelerating"; thus, one might expect that a particle in rectilinear motion will be speeding up when its acceleration is positive and slowing down when it is negative. Although this is true for a particle moving in the positive direction, it is not true for a particle moving in the

If $a(t)=0$ over a certain time interval, what does this tell you about the motion of the particle during that time?
negative direction-a particle with negative velocity is speeding up when its acceleration is negative and slowing down when its acceleration is positive. This is because a positive acceleration implies an increasing velocity, and increasing a negative velocity decreases its absolute value; similarly, a negative acceleration implies a decreasing velocity, and decreasing a negative velocity increases its absolute value.

The preceding informal discussion can be summarized as follows (Exercise 41):

> INTERPRETING THE SIGN OF ACCELERATION A particle in rectilinear motion is speeding up when its velocity and acceleration have the same sign and slowing down when they have opposite signs.

Example 4 In Examples 2 and 3 we found the velocity versus time curve and the acceleration versus time curve for a particle with position function $s(t)=t^{3}-6 t^{2}$. Use those curves to determine when the particle is speeding up and slowing down, and confirm that your results are consistent with the speed versus time curve obtained in Example 2.

Solution. Over the time interval $0<t<2$ the velocity and acceleration are negative, so the particle is speeding up. This is consistent with the speed versus time curve, since the speed is increasing over this time interval. Over the time interval $2<t<4$ the velocity is negative and the acceleration is positive, so the particle is slowing down. This is also consistent with the speed versus time curve, since the speed is decreasing over this time interval. Finally, on the time interval $t>4$ the velocity and acceleration are positive, so the particle is speeding up, which again is consistent with the speed versus time curve.

## ANALYZING THE POSITION VERSUS TIME CURVE

The position versus time curve contains all of the significant information about the position and velocity of a particle in rectilinear motion:

- If $s(t)>0$, the particle is on the positive side of the $s$-axis.
- If $s(t)<0$, the particle is on the negative side of the $s$-axis.
- The slope of the curve at any time is equal to the instantaneous velocity at that time.
- Where the curve has positive slope, the velocity is positive and the particle is moving in the positive direction.
- Where the curve has negative slope, the velocity is negative and the particle is moving in the negative direction.
- Where the slope of the curve is zero, the velocity is zero, and the particle is momentarily stopped.

Information about the acceleration of a particle in rectilinear motion can also be deduced from the position versus time curve by examining its concavity. For example, we know that the position versus time curve will be concave up on intervals where $s^{\prime \prime}(t)>0$ and will be concave down on intervals where $s^{\prime \prime}(t)<0$. But we know from (4) that $s^{\prime \prime}(t)$ is the acceleration, so that on intervals where the position versus time curve is concave up the particle has a positive acceleration, and on intervals where it is concave down the particle has a negative acceleration.

Table 4.6.1 summarizes our observations about the position versus time curve.

Table 4.6.1
ANALYSIS OF PARTICLE MOTION

## POSITION VERSUS <br> TIME CURVE

CHARACTERISTICS OF THE
CURVE AT $t=t_{0}$

## BEHAVIOR OF THE PARTICLE <br> AT TIME $t=t_{0}$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-226.jpg?height=195&width=263&top_left_y=504&top_left_x=548)

- $s\left(t_{0}\right)>0$
- Curve has positive slope.
- Curve is concave down.
- Particle is on the positive side of the origin.
- Particle is moving in the positive direction.
- Velocity is decreasing.
- Particle is slowing down.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-226.jpg?height=194&width=263&top_left_y=728&top_left_x=548)
- $s\left(t_{0}\right)>0$
- Curve has negative slope.
- Curve is concave down.
- Particle is on the positive side of the origin.
- Particle is moving in the negative direction.
- Velocity is decreasing.
- Particle is speeding up.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-226.jpg?height=179&width=261&top_left_y=949&top_left_x=548)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-226.jpg?height=191&width=259&top_left_y=1173&top_left_x=548)
- $s\left(t_{0}\right)>0$
- Curve has zero slope.
- Curve is concave down.
- Particle is on the negative side of the origin.
- Particle is moving in the negative direction.
- Velocity is increasing.
- Particle is slowing down.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-226.jpg?height=420&width=429&top_left_y=1475&top_left_x=176)
△ Figure 4.6.5

- $s\left(t_{0}\right)<0$
- Curve has negative slope.
- Curve is concave up.
- Particle is on the positive side of the origin.
- Particle is momentarily stopped.
- Velocity is decreasing.

Example 5 Use the position versus time curve in Figure 4.6.5 to determine when the particle in Example 1 is speeding up and slowing down.

Solution. From $t=0$ to $t=2$, the acceleration and velocity are positive, so the particle is speeding up. From $t=2$ to $t=4$, the acceleration is negative and the velocity is positive, so the particle is slowing down. At $t=4$, the velocity is zero, so the particle has momentarily stopped. From $t=4$ to $t=6$, the acceleration is negative and the velocity is negative, so the particle is speeding up. From $t=6$ to $t=7$, the acceleration is positive and the velocity is negative, so the particle is slowing down. Thereafter, the velocity is zero, so the particle has stopped.

Example 6 Suppose that the position function of a particle moving on a coordinate line is given by $s(t)=2 t^{3}-21 t^{2}+60 t+3$. Analyze the motion of the particle for $t \geq 0$.

Solution. The velocity and acceleration functions are

$$
\begin{aligned}
& v(t)=s^{\prime}(t)=6 t^{2}-42 t+60=6(t-2)(t-5) \\
& a(t)=v^{\prime}(t)=12 t-42=12\left(t-\frac{7}{2}\right)
\end{aligned}
$$

- Direction of motion: The sign analysis of the velocity function in Figure 4.6.6 shows that the particle is moving in the positive direction over the time interval $0 \leq t<2$,
stops momentarily at time $t=2$, moves in the negative direction over the time interval $2<t<5$, stops momentarily at time $t=5$, and then moves in the positive direction thereafter.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-227.jpg?height=155&width=1101&top_left_y=368&top_left_x=788)
△ Figure 4.6.6

- Change in speed: A comparison of the signs of the velocity and acceleration functions is shown in Figure 4.6.7. Since the particle is speeding up when the signs are the same and is slowing down when they are opposite, we see that the particle is slowing down over the time interval $0 \leq t<2$ and stops momentarily at time $t=2$. It is then speeding up over the time interval $2<t<\frac{7}{2}$. At time $t=\frac{7}{2}$ the instantaneous acceleration is zero, so the particle is neither speeding up nor slowing down. It is then slowing down over the time interval $\frac{7}{2}<t<5$ and stops momentarily at time $t=5$. Thereafter, it is speeding up.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-227.jpg?height=311&width=1099&top_left_y=1025&top_left_x=790)
\$ Figure 4.6.7

Conclusions: The diagram in Figure 4.6.8 summarizes the above information schematically. The curved line is descriptive only; the actual path is back and forth on the coordinate line. The coordinates of the particle at times $t=0, t=2, t=\frac{7}{2}$, and $t=5$ were computed from $s(t)$. Segments in red indicate that the particle is speeding up and segments in blue indicate that it is slowing down.

- Figure 4.6.8
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-227.jpg?height=206&width=768&top_left_y=1689&top_left_x=957)

## QUICK CHECK EXERCISES 4.6 (See page 296 for answers.)

1. For a particle in rectilinear motion, the velocity and position functions $v(t)$ and $s(t)$ are related by the equation $\_\_\_\_$ and the acceleration and velocity functions $a(t)$ and $v(t)$ are related by the equation $\_\_\_\_$ .
2. Suppose that a particle moving along the $s$-axis has position function $s(t)=7 t-2 t^{2}$. At time $t=3$, the particle's position is $\_\_\_\_$ , its velocity is $\_\_\_\_$ , its speed is -, and its acceleration is $\_\_\_\_$
3. A particle in rectilinear motion is speeding up if the signs of its velocity and acceleration are $\_\_\_\_$ and it is slowing down if these signs are $\_\_\_\_$ .
4. Suppose that a particle moving along the $s$-axis has position function $s(t)=t^{4}-24 t^{2}$ over the time interval $t \geq 0$. The particle slows down over the time interval(s) $\_\_\_\_$ .

## FOCUS ON CONCEPTS

1. The graphs of three position functions are shown in the accompanying figure. In each case determine the signs of the velocity and acceleration, and then determine whether the particle is speeding up or slowing down.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-228.jpg?height=291&width=774&top_left_y=516&top_left_x=212)
- Figure Ex-1

2. The graphs of three velocity functions are shown in the accompanying figure. In each case determine the sign of the acceleration, and then determine whether the particle is speeding up or slowing down.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-228.jpg?height=285&width=768&top_left_y=1043&top_left_x=216)
- Figure Ex-2

3. The graph of the position function of a particle moving on a horizontal line is shown in the accompanying figure.
(a) Is the particle moving left or right at time $t_{0}$ ?
(b) Is the acceleration positive or negative at time $t_{0}$ ?
(c) Is the particle speeding up or slowing down at time $t_{0}$ ?
(d) Is the particle speeding up or slowing down at time $t_{1}$ ?

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-228.jpg?height=223&width=387&top_left_y=1730&top_left_x=220)
Figure Ex-3

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-228.jpg?height=229&width=223&top_left_y=2134&top_left_x=220)
(a)

4. For the graphs in the accompanying figure, match the position functions (a)-(c) with their corresponding velocity functions (I)-(III).

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-228.jpg?height=223&width=217&top_left_y=2138&top_left_x=490)
(b)

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-228.jpg?height=223&width=220&top_left_y=2138&top_left_x=756)
(c)

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-228.jpg?height=225&width=215&top_left_y=306&top_left_x=1137)
(I)

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-228.jpg?height=219&width=217&top_left_y=308&top_left_x=1403)
(II)

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-228.jpg?height=223&width=216&top_left_y=308&top_left_x=1669)
(III)

- Figure Ex-4

5. Sketch a reasonable graph of $s$ versus $t$ for a mouse that is trapped in a narrow corridor (an $s$-axis with the positive direction to the right) and scurries back and forth as follows. It runs right with a constant speed of $1.2 \mathrm{~m} / \mathrm{s}$ for a while, then gradually slows down to $0.6 \mathrm{~m} / \mathrm{s}$, then quickly speeds up to $2.0 \mathrm{~m} / \mathrm{s}$, then gradually slows to a stop but immediately reverses direction and quickly speeds up to $1.2 \mathrm{~m} / \mathrm{s}$.
6. The accompanying figure shows the position versus time curve for an ant that moves along a narrow vertical pipe, where $t$ is measured in seconds and the $s$-axis is along the pipe with the positive direction up.
(a) When, if ever, is the ant above the origin?
(b) When, if ever, does the ant have velocity zero?
(c) When, if ever, is the ant moving down the pipe?

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-228.jpg?height=323&width=319&top_left_y=1277&top_left_x=1137)
\& Figure Ex-6

7. The accompanying figure shows the graph of velocity versus time for a particle moving along a coordinate line. Make a rough sketch of the graphs of speed versus time and acceleration versus time.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-228.jpg?height=371&width=409&top_left_y=1806&top_left_x=1135)
\& Figure Ex-7

8. The accompanying figure (on the next page) shows the position versus time graph for an elevator that ascends 40 m from one stop to the next.
(a) Estimate the velocity when the elevator is halfway up to the top.
(cont.)
(b) Sketch rough graphs of the velocity versus time curve and the acceleration versus time curve.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-229.jpg?height=271&width=357&top_left_y=292&top_left_x=276)
\& Figure Ex-8

9-12 True-False Determine whether the statement is true or false. Explain your answer.
9. A particle is speeding up when its position versus time graph is increasing.
10. Velocity is the derivative of position with respect to time.
11. Acceleration is the absolute value of velocity.
12. If the position versus time curve is increasing and concave down, then the particle is slowing down.
13. The accompanying figure shows the velocity versus time graph for a test run on a Pontiac Grand Prix GTP. Using this graph, estimate
(a) the acceleration at $60 \mathrm{mi} / \mathrm{h}\left(\mathrm{in} \mathrm{ft} / \mathrm{s}^{2}\right)$
(b) the time at which the maximum acceleration occurs.

Source: Data from Car and Driver Magazine, July 2003.
14. The accompanying figure shows the velocity versus time graph for a test run on a Chevrolet Malibu. Using this graph, estimate

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-229.jpg?height=340&width=353&top_left_y=1557&top_left_x=268)
- Figure Ex-13

(a) the acceleration at $60 \mathrm{mi} / \mathrm{h}\left(\mathrm{in} \mathrm{ft} / \mathrm{s}^{2}\right)$
(b) the time at which the maximum acceleration occurs.

Source: Data from Car and Driver Magazine, November 2003.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-229.jpg?height=340&width=354&top_left_y=1557&top_left_x=684)
- Figure Ex-14

15-16 The function $s(t)$ describes the position of a particle moving along a coordinate line, where $s$ is in meters and $t$ is in seconds.
(a) Make a table showing the position, velocity, and acceleration to two decimal places at times $t=1,2,3,4,5$.
(b) At each of the times in part (a), determine whether the particle is stopped; if it is not, state its direction of motion.
(c) At each of the times in part (a), determine whether the particle is speeding up, slowing down, or neither.
15. $s(t)=\sin \frac{\pi t}{4}$
16. $s(t)=t^{4} e^{-t}, \quad t \geq 0$

17-22 The function $s(t)$ describes the position of a particle moving along a coordinate line, where $s$ is in feet and $t$ is in seconds.
(a) Find the velocity and acceleration functions.
(b) Find the position, velocity, speed, and acceleration at time $t=1$.
(c) At what times is the particle stopped?
(d) When is the particle speeding up? Slowing down?
(e) Find the total distance traveled by the particle from time $t=0$ to time $t=5$.
17. $s(t)=t^{3}-3 t^{2}, \quad t \geq 0$
18. $s(t)=t^{4}-4 t^{2}+4, \quad t \geq 0$
19. $s(t)=9-9 \cos (\pi t / 3), \quad 0 \leq t \leq 5$
20. $s(t)=\frac{t}{t^{2}+4}, \quad t \geq 0$
21. $s(t)=\left(t^{2}+8\right) e^{-t / 3}, \quad t \geq 0$
22. $s(t)=\frac{1}{4} t^{2}-\ln (t+1), \quad t \geq 0$
23. Let $s(t)=t /\left(t^{2}+5\right)$ be the position function of a particle moving along a coordinate line, where $s$ is in meters and $t$ is in seconds. Use a graphing utility to generate the graphs of $s(t), v(t)$, and $a(t)$ for $t \geq 0$, and use those graphs where needed.
(a) Use the appropriate graph to make a rough estimate of the time at which the particle first reverses the direction of its motion; and then find the time exactly.
(b) Find the exact position of the particle when it first reverses the direction of its motion.
(c) Use the appropriate graphs to make a rough estimate of the time intervals on which the particle is speeding up and on which it is slowing down; and then find those time intervals exactly.
24. Let $s(t)=t / e^{t}$ be the position function of a particle moving along a coordinate line, where $s$ is in meters and $t$ is in seconds. Use a graphing utility to generate the graphs of $s(t), v(t)$, and $a(t)$ for $t \geq 0$, and use those graphs where needed.
(a) Use the appropriate graph to make a rough estimate of the time at which the particle first reverses the direction of its motion; and then find the time exactly.
(b) Find the exact position of the particle when it first reverses the direction of its motion.
(c) Use the appropriate graphs to make a rough estimate of the time intervals on which the particle is speeding up and on which it is slowing down; and then find those time intervals exactly.

25-32 A position function of a particle moving along a coordinate line is given. Use the method of Example 6 to analyze the motion of the particle for $t \geq 0$, and give a schematic picture of the motion (as in Figure 4.6.8).
25. $s=-4 t+3$
26. $s=5 t^{2}-20 t$
27. $s=t^{3}-9 t^{2}+24 t$
28. $s=t^{3}-6 t^{2}+9 t+1$
29. $s=16 t e^{-\left(t^{2} / 8\right)}$
30. $s=t+\frac{25}{t+2}$
31. $s= \begin{cases}\cos t, & 0 \leq t<2 \pi \\ 1, & t \geq 2 \pi\end{cases}$
32. $s= \begin{cases}2 t(t-2)^{2}, & 0 \leq t<3 \\ 13-7(t-4)^{2}, & t \geq 3\end{cases}$
33. Let $s(t)=5 t^{2}-22 t$ be the position function of a particle moving along a coordinate line, where $s$ is in feet and $t$ is in seconds.
(a) Find the maximum speed of the particle during the time interval $1 \leq t \leq 3$.
(b) When, during the time interval $1 \leq t \leq 3$, is the particle farthest from the origin? What is its position at that instant?
34. Let $s=100 /\left(t^{2}+12\right)$ be the position function of a particle moving along a coordinate line, where $s$ is in feet and $t$ is in seconds. Find the maximum speed of the particle for $t \geq 0$, and find the direction of motion of the particle when it has its maximum speed.

35-36 A position function of a particle moving along a coordinate line is provided. (a) Evaluate $s$ and $v$ when $a=0$. (b) Evaluate $s$ and $a$ when $v=0$.
35. $s=\ln \left(3 t^{2}-12 t+13\right) \quad$ 36. $s=t^{3}-6 t^{2}+1$
37. Let $s=\sqrt{2 t^{2}+1}$ be the position function of a particle moving along a coordinate line.
(a) Use a graphing utility to generate the graph of $v$ versus $t$, and make a conjecture about the velocity of the particle as $t \rightarrow+\infty$.
(b) Check your conjecture by finding $\lim _{t \rightarrow+\infty} v$.
38. (a) Use the chain rule to show that for a particle in rectilinear motion $a=v(d v / d s)$.
(b) Let $s=\sqrt{3 t+7}, t \geq 0$. Find a formula for $v$ in terms of $s$ and use the equation in part (a) to find the acceleration when $s=5$.
39. Suppose that the position functions of two particles, $P_{1}$ and $P_{2}$, in motion along the same line are

$$
s_{1}=\frac{1}{2} t^{2}-t+3 \quad \text { and } \quad s_{2}=-\frac{1}{4} t^{2}+t+1
$$

respectively, for $t \geq 0$.
(a) Prove that $P_{1}$ and $P_{2}$ do not collide.
(b) How close do $P_{1}$ and $P_{2}$ get to each other?
(c) During what intervals of time are they moving in opposite directions?
40. Let $s_{A}=15 t^{2}+10 t+20$ and $s_{B}=5 t^{2}+40 t, t \geq 0$, be the position functions of cars $A$ and $B$ that are moving along parallel straight lanes of a highway.
(a) How far is car $A$ ahead of car $B$ when $t=0$ ?
(b) At what instants of time are the cars next to each other?
(c) At what instant of time do they have the same velocity? Which car is ahead at this instant?
41. Prove that a particle is speeding up if the velocity and acceleration have the same sign, and slowing down if they have opposite signs. [Hint: Let $r(t)=|v(t)|$ and find $r^{\prime}(t)$ using the chain rule.]
42. Writing A speedometer on a bicycle calculates the bicycle's speed by measuring the time per rotation for one of the bicycle's wheels. Explain how this measurement can be used to calculate an average velocity for the bicycle, and discuss how well it approximates the instantaneous velocity for the bicycle.
43. Writing A toy rocket is launched into the air and falls to the ground after its fuel runs out. Describe the rocket's acceleration and when the rocket is speeding up or slowing down during its flight. Accompany your description with a sketch of a graph of the rocket's acceleration versus time.

## QUICK CHECK ANSWERS 4.6

1. $v(t)=s^{\prime}(t) ; a(t)=v^{\prime}(t)$
2. $3 ;-5 ; 5 ;-4$
3. the same; opposite
4. $2<t<2 \sqrt{3}$

### 4.7 NEWTON'S METHOD

In Section 1.5 we showed how to approximate the roots of an equation $f(x)=0$ using the Intermediate-Value Theorem. In this section we will study a technique, called "Newton's Method," that is usually more efficient than that method. Newton's Method is the technique used by many commercial and scientific computer programs for finding roots.

## NEWTON'S METHOD

In beginning algebra one learns that the solution of a first-degree equation $a x+b=0$ is given by the formula $x=-b / a$, and the solutions of a second-degree equation

$$
a x^{2}+b x+c=0
$$

are given by the quadratic formula. Formulas also exist for the solutions of all third- and fourth-degree equations, although they are too complicated to be of practical use. In 1826 it was shown by the Norwegian mathematician Niels Henrik Abel that it is impossible to construct a similar formula for the solutions of a general fifth-degree equation or higher. Thus, for a specific fifth-degree polynomial equation such as

$$
x^{5}-9 x^{4}+2 x^{3}-5 x^{2}+17 x-8=0
$$

it may be difficult or impossible to find exact values for all of the solutions. Similar difficulties occur for nonpolynomial equations such as

$$
x-\cos x=0
$$

For such equations the solutions are generally approximated in some way, often by the method we will now discuss.

Suppose that we are trying to find a root $r$ of the equation $f(x)=0$, and suppose that by

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-231.jpg?height=352&width=467&top_left_y=828&top_left_x=214)
Figure 4.7.1

To implement Newton's Method analytically, we must derive a formula that will tell us how to calculate each improved approximation from the preceding approximation. For this purpose, we note that the point-slope form of the tangent line to $y=f(x)$ at the initial
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-231.jpg?height=223&width=187&top_left_y=1477&top_left_x=172)

Niels Henrik Abel (1802-1829) Norwegian mathematician. Abel was the son of a poor Lutheran minister and a remarkably beautiful mother from whom he inherited strikingly good looks. In his brief life of 26 years Abel lived in virtual poverty and suffered a succession of adversities, yet he managed to prove major results that altered the mathematical landscape forever. At the age of thirteen he was sent away from home to a school whose better days had long passed. By a stroke of luck the school had just hired a teacher named Bernt Michael Holmboe, who quickly discovered that Abel had extraordinary mathematical ability. Together, they studied the calculus texts of Euler and works of Newton and the later French mathematicians. By the time he graduated, Abel was familar with most of the great mathematical literature. In 1820 his father died, leaving the family in dire financial straits. Abel was able to enter the University of Christiania in Oslo only because he was granted a free room and several professors supported him directly from their salaries. The University had no advanced courses in mathematics, so Abel took a preliminary degree in 1822 and then continued to study mathematics on his own. In 1824 he published at his own expense the proof that it is impossible to solve the general fifthdegree polynomial equation algebraically. With the hope that this landmark paper would lead to his recognition and acceptance by the European mathematical community, Abel sent the paper to the
great German mathematician Gauss, who casually declared it to be a "monstrosity" and tossed it aside. However, in 1826 Abel's paper on the fifth-degree equation and other work was published in the first issue of a new journal, founded by his friend, Leopold Crelle. In the summer of 1826 he completed a landmark work on transcendental functions, which he submitted to the French Academy of Sciences. He hoped to establish himself as a major mathematician, for many young mathematicians had gained quick distinction by having their work accepted by the Academy. However, Abel waited in vain because the paper was either ignored or misplaced by one of the referees, and it did not surface again until two years after his death. That paper was later described by one major mathematician as "...the most important mathematical discovery that has been made in our century...." After submitting his paper, Abel returned to Norway, ill with tuberculosis and in heavy debt. While eking out a meager living as a tutor, he continued to produce great work and his fame spread. Soon great efforts were being made to secure a suitable mathematical position for him. Fearing that his great work had been lost by the Academy, he mailed a proof of the main results to Crelle in January of 1829. In April he suffered a violent hemorrhage and died. Two days later Crelle wrote to inform him that an appointment had been secured for him in Berlin and his days of poverty were over! Abel's great paper was finally published by the Academy twelve years after his death.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-232.jpg?height=422&width=387&top_left_y=1409&top_left_x=200)
△ Figure 4.7.2

## TECHNOLOGY MASTERY

Many calculators and computer programs calculate internally with more digits than they display. Where possible, you should use stored calculated values rather than values displayed from earlier calculations. Thus, in Example 1 the value of $x_{2}$ used in (7) should be the stored value, not the value in (6).
approximation $x_{1}$ is

$$
\begin{equation*}
y-f\left(x_{1}\right)=f^{\prime}\left(x_{1}\right)\left(x-x_{1}\right) \tag{1}
\end{equation*}
$$

If $f^{\prime}\left(x_{1}\right) \neq 0$, then this line is not parallel to the $x$-axis and consequently it crosses the $x$-axis at some point $\left(x_{2}, 0\right)$. Substituting the coordinates of this point in (1) yields

$$
-f\left(x_{1}\right)=f^{\prime}\left(x_{1}\right)\left(x_{2}-x_{1}\right)
$$

Solving for $x_{2}$ we obtain

$$
\begin{equation*}
x_{2}=x_{1}-\frac{f\left(x_{1}\right)}{f^{\prime}\left(x_{1}\right)} \tag{2}
\end{equation*}
$$

The next approximation can be obtained more easily. If we view $x_{2}$ as the starting approximation and $x_{3}$ the new approximation, we can simply apply (2) with $x_{2}$ in place of $x_{1}$ and $x_{3}$ in place of $x_{2}$. This yields

$$
\begin{equation*}
x_{3}=x_{2}-\frac{f\left(x_{2}\right)}{f^{\prime}\left(x_{2}\right)} \tag{3}
\end{equation*}
$$

provided $f^{\prime}\left(x_{2}\right) \neq 0$. In general, if $x_{n}$ is the $n$th approximation, then it is evident from the pattern in (2) and (3) that the improved approximation $x_{n+1}$ is given by

## Newton's Method

$$
\begin{equation*}
x_{n+1}=x_{n}-\frac{f\left(x_{n}\right)}{f^{\prime}\left(x_{n}\right)}, \quad n=1,2,3, \ldots \tag{4}
\end{equation*}
$$

Example 1 Use Newton's Method to approximate the real solutions of

$$
x^{3}-x-1=0
$$

Solution. Let $f(x)=x^{3}-x-1$, so $f^{\prime}(x)=3 x^{2}-1$ and (4) becomes

$$
\begin{equation*}
x_{n+1}=x_{n}-\frac{x_{n}^{3}-x_{n}-1}{3 x_{n}^{2}-1} \tag{5}
\end{equation*}
$$

From the graph of $f$ in Figure 4.7.2, we see that the given equation has only one real solution. This solution lies between 1 and 2 because $f(1)=-1<0$ and $f(2)=5>0$. We will use $x_{1}=1.5$ as our first approximation ( $x_{1}=1$ or $x_{1}=2$ would also be reasonable choices).

Letting $n=1$ in (5) and substituting $x_{1}=1.5$ yields

$$
\begin{equation*}
x_{2}=1.5-\frac{(1.5)^{3}-1.5-1}{3(1.5)^{2}-1} \approx 1.34782609 \tag{6}
\end{equation*}
$$

(We used a calculator that displays nine digits.) Next, we let $n=2$ in (5) and substitute $x_{2}$ to obtain

$$
\begin{equation*}
x_{3}=x_{2}-\frac{x_{2}^{3}-x_{2}-1}{3 x_{2}^{2}-1} \approx 1.32520040 \tag{7}
\end{equation*}
$$

If we continue this process until two identical approximations are generated in succession, we obtain

$$
\begin{aligned}
& x_{1}=1.5 \\
& x_{2} \approx 1.34782609 \\
& x_{3} \approx 1.32520040 \\
& x_{4} \approx 1.32471817 \\
& x_{5} \approx 1.32471796 \\
& x_{6} \approx 1.32471796
\end{aligned}
$$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-233.jpg?height=353&width=403&top_left_y=364&top_left_x=244)
△ Figure 4.7.3

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-233.jpg?height=431&width=481&top_left_y=1730&top_left_x=204)
△ Figure 4.7.4

At this stage there is no need to continue further because we have reached the display accuracy limit of our calculator, and all subsequent approximations that the calculator generates will likely be the same. Thus, the solution is approximately $x \approx 1.32471796$.

Example 2 It is evident from Figure 4.7.3 that if $x$ is in radians, then the equation

$$
\cos x=x
$$

has a solution between 0 and 1 . Use Newton's Method to approximate it.
Solution. Rewrite the equation as

$$
x-\cos x=0
$$

and apply (4) with $f(x)=x-\cos x$. Since $f^{\prime}(x)=1+\sin x$, (4) becomes

$$
\begin{equation*}
x_{n+1}=x_{n}-\frac{x_{n}-\cos x_{n}}{1+\sin x_{n}} \tag{8}
\end{equation*}
$$

From Figure 4.7.3, the solution seems closer to $x=1$ than $x=0$, so we will use $x_{1}=1$ (radian) as our initial approximation. Letting $n=1$ in (8) and substituting $x_{1}=1$ yields

$$
x_{2}=1-\frac{1-\cos 1}{1+\sin 1} \approx 0.750363868
$$

Next, letting $n=2$ in (8) and substituting this value of $x_{2}$ yields

$$
x_{3}=x_{2}-\frac{x_{2}-\cos x_{2}}{1+\sin x_{2}} \approx 0.739112891
$$

If we continue this process until two identical approximations are generated in succession, we obtain

$$
\begin{aligned}
& x_{1}=1 \\
& x_{2} \approx 0.750363868 \\
& x_{3} \approx 0.739112891 \\
& x_{4} \approx 0.739085133 \\
& x_{5} \approx 0.739085133
\end{aligned}
$$

Thus, to the accuracy limit of our calculator, the solution of the equation $\cos x=x$ is $x \approx 0.739085133$.

## SOME DIFFICULTIES WITH NEWTON'S METHOD

When Newton's Method works, the approximations usually converge toward the solution with dramatic speed. However, there are situations in which the method fails. For example, if $f^{\prime}\left(x_{n}\right)=0$ for some $n$, then (4) involves a division by zero, making it impossible to generate $x_{n+1}$. However, this is to be expected because the tangent line to $y=f(x)$ is parallel to the $x$-axis where $f^{\prime}\left(x_{n}\right)=0$, and hence this tangent line does not cross the $x$-axis to generate the next approximation (Figure 4.7.4).

Newton's Method can fail for other reasons as well; sometimes it may overlook the root you are trying to find and converge to a different root, and sometimes it may fail to converge altogether. For example, consider the equation

$$
x^{1 / 3}=0
$$

which has $x=0$ as its only solution, and try to approximate this solution by Newton's Method with a starting value of $x_{0}=1$. Letting $f(x)=x^{1 / 3}$, Formula (4) becomes

$$
x_{n+1}=x_{n}-\frac{\left(x_{n}\right)^{1 / 3}}{\frac{1}{3}\left(x_{n}\right)^{-2 / 3}}=x_{n}-3 x_{n}=-2 x_{n}
$$

Beginning with $x_{1}=1$, the successive values generated by this formula are

$$
x_{1}=1, \quad x_{2}=-2, \quad x_{3}=4, \quad x_{4}=-8, \ldots
$$

which obviously do not converge to $x=0$. Figure 4.7.5 illustrates what is happening geometrically in this situation.

Figure 4.7.5
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-234.jpg?height=241&width=727&top_left_y=476&top_left_x=921)

To learn more about the conditions under which Newton's Method converges and for a discussion of error questions, you should consult a book on numerical analysis. For a more in-depth discussion of Newton's Method and its relationship to contemporary studies of chaos and fractals, you may want to read the article, "Newton's Method and Fractal Patterns," by Philip Straffin, which appears in Applications of Calculus, MAA Notes, Vol. 3, No. 29, 1993, published by the Mathematical Association of America.

## QUICK CHECK EXERCISES 4.7 (See page 302 for answers.)

1. Use the accompanying graph to estimate $x_{2}$ and $x_{3}$ if Newton's Method is applied to the equation $y=f(x)$ with $x_{1}=8$.
2. Suppose that $f(1)=2$ and $f^{\prime}(1)=4$. If Newton's Method is applied to $y=f(x)$ with $x_{1}=1$, then $x_{2}=$ $\_\_\_\_$ .
3. Suppose we are given that $f(0)=3$ and that $x_{2}=3$ when Newton's Method is applied to $y=f(x)$ with $x_{1}=0$. Then $f^{\prime}(0)=$ $\_\_\_\_$ .
4. If Newton's Method is applied to $y=e^{x}-1$ with $x_{1}=\ln 2$,

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-234.jpg?height=401&width=401&top_left_y=1267&top_left_x=1127)
< Figure Ex-1

EXERCISE SET 4.7 Graphing Utility

In this exercise set, express your answers with as many decimal digits as your calculating utility can display, but use the procedure in the Technology Mastery on p. 298. $\square$

1. Approximate $\sqrt{2}$ by applying Newton's Method to the equation $x^{2}-2=0$.
2. Approximate $\sqrt{5}$ by applying Newton's Method to the equation $x^{2}-5=0$.
3. Approximate $\sqrt[3]{6}$ by applying Newton's Method to the equation $x^{3}-6=0$.
4. To what equation would you apply Newton's Method to approximate the $n$th root of $a$ ?

5-8 The given equation has one real solution. Approximate it by Newton's Method. $\square$
5. $x^{3}-2 x-2=0$
6. $x^{3}+x-1=0$
7. $x^{5}+x^{4}-5=0$
8. $x^{5}-3 x+3=0$

9-14 Use a graphing utility to determine how many solutions the equation has, and then use Newton's Method to approximate the solution that satisfies the stated condition.
9. $x^{4}+x^{2}-4=0 ; x<0$
10. $x^{5}-5 x^{3}-2=0 ; x>0$
11. $2 \cos x=x ; x>0$
12. $\sin x=x^{2} ; x>0$
13. $x-\tan x=0 ; \pi / 2<x<3 \pi / 2$
14. $1+e^{x} \sin x=0 ; \pi / 2<x<3 \pi / 2$

15-20 Use a graphing utility to determine the number of times the curves intersect and then apply Newton's Method, where needed, to approximate the $x$-coordinates of all intersections.
15. $y=x^{3}$ and $y=1-x$
16. $y=\sin x$ and $y=x^{3}-2 x^{2}+1$
17. $y=x^{2}$ and $y=\sqrt{2 x+1}$
18. $y=\frac{1}{8} x^{3}-1$ and $y=\cos x-2$
19. $y=1$ and $y=e^{x} \sin x ; 0<x<\pi$
20. $y=e^{-x}$ and $y=\ln x$

21-24 True-False Determine whether the statement is true or false. Explain your answer.
21. Newton's Method uses the tangent line to $y=f(x)$ at $x=x_{n}$ to compute $x_{n+1}$.
22. Newton's Method is a process to find exact solutions to $f(x)=0$.
23. If $f(x)=0$ has a root, then Newton's Method starting at $x=x_{1}$ will approximate the root nearest $x_{1}$.
24. Newton's Method can be used to appoximate a point of intersection of two curves.
25. The mechanic's rule for approximating square roots states that $\sqrt{a} \approx x_{n+1}$, where

$$
x_{n+1}=\frac{1}{2}\left(x_{n}+\frac{a}{x_{n}}\right), \quad n=1,2,3, \ldots
$$

and $x_{1}$ is any positive approximation to $\sqrt{a}$.
(a) Apply Newton's Method to

$$
f(x)=x^{2}-a
$$

to derive the mechanic's rule.
(b) Use the mechanic's rule to approximate $\sqrt{10}$.
26. Many calculators compute reciprocals using the approximation $1 / a \approx x_{n+1}$, where

$$
x_{n+1}=x_{n}\left(2-a x_{n}\right), \quad n=1,2,3, \ldots
$$

and $x_{1}$ is an initial approximation to $1 / a$. This formula makes it possible to perform divisions using multiplications and subtractions, which is a faster procedure than dividing directly.
(a) Apply Newton's Method to

$$
f(x)=\frac{1}{x}-a
$$

to derive this approximation.
(b) Use the formula to approximate $\frac{1}{17}$.
27. Use Newton's Method to approximate the absolute minimum of $f(x)=\frac{1}{4} x^{4}+x^{2}-5 x$.
28. Use Newton's Method to approximate the absolute maximum of $f(x)=x \sin x$ on the interval $[0, \pi]$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-235.jpg?height=319&width=323&top_left_y=949&top_left_x=1181)
- Figure Ex-32

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-235.jpg?height=295&width=286&top_left_y=973&top_left_x=1619)
- Figure Ex-33

29. For the function

$$
f(x)=\frac{e^{-x}}{1+x^{2}}
$$

use Newton's Method to approximate the $x$-coordinates of the inflection points to two decimal places.
30. Use Newton's Method to approximate the absolute maximum of $f(x)=(1-2 x) \tan ^{-1} x$.
31. Use Newton's Method to approximate the coordinates of the point on the parabola $y=x^{2}$ that is closest to the point $(1,0)$.
32. Use Newton's Method to approximate the dimensions of the rectangle of largest area that can be inscribed under the curve $y=\cos x$ for $0 \leq x \leq \pi / 2$ (Figure Ex-32).
33. (a) Show that on a circle of radius $r$, the central angle $\theta$ that subtends an arc whose length is 1.5 times the length $L$ of its chord satisfies the equation $\theta=3 \sin (\theta / 2)$ (Figure Ex-33).
(b) Use Newton's Method to approximate $\theta$.
34. Asegment of a circle is the region enclosed by an arc and its chord (Figure Ex-34). If $r$ is the radius of the circle and $\theta$ the angle subtended at the center of the circle, then it can be shown that the area $A$ of the segment is $A=\frac{1}{2} r^{2}(\theta-\sin \theta)$, where $\theta$ is in radians. Find the value of $\theta$ for which the area of the segment is one-fourth the area of the circle. Give $\theta$ to the nearest degree.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-235.jpg?height=272&width=267&top_left_y=1621&top_left_x=1181)
-Figure Ex-34

35-36 Use Newton's Method to approximate all real values of $y$ satisfying the given equation for the indicated value of $x$.
35. $x y^{4}+x^{3} y=1 ; x=1$
36. $x y-\cos \left(\frac{1}{2} x y\right)=0 ; x=2$
37. An annuity is a sequence of equal payments that are paid or received at regular time intervals. For example, you may want to deposit equal amounts at the end of each year into an interest-bearing account for the purpose of accumulating a lump sum at some future time. If, at the end of each year, interest of $i \times 100 \%$ on the account balance for that year is added to the account, then the account is said to pay $i \times 100 \%$ interest, compounded annually. It can be shown
that if payments of $Q$ dollars are deposited at the end of each year into an account that pays $i \times 100 \%$ compounded annually, then at the time when the $n$th payment and the accrued interest for the past year are deposited, the amount $S(n)$ in the account is given by the formula

$$
S(n)=\frac{Q}{i}\left[(1+i)^{n}-1\right]
$$

Suppose that you can invest $\$ 5000$ in an interest-bearing account at the end of each year, and your objective is to have $\$ 250,000$ on the 25 th payment. Approximately what annual compound interest rate must the account pay for you to achieve your goal? [Hint: Show that the interest rate $i$ satisfies the equation $50 i=(1+i)^{25}-1$, and solve it using Newton's Method.]

## FOCUS ON CONCEPTS

38. (a) Use a graphing utility to generate the graph of

$$
f(x)=\frac{x}{x^{2}+1}
$$

and use it to explain what happens if you apply Newton's Method with a starting value of $x_{1}=2$. Check your conclusion by computing $x_{2}, x_{3}, x_{4}$ and $x_{5}$.
(b) Use the graph generated in part (a) to explain what happens if you apply Newton's Method with a start-
ing value of $x_{1}=0.5$. Check your conclusion by computing $x_{2}, x_{3}, x_{4}$, and $x_{5}$.
39. (a) Apply Newton's Method to $f(x)=x^{2}+1$ with a starting value of $x_{1}=0.5$, and determine if the values of $x_{2}, \ldots, x_{10}$ appear to converge.
(b) Explain what is happening.
40. In each part, explain what happens if you apply Newton's Method to a function $f$ when the given condition is satisfied for some value of $n$.
(a) $f\left(x_{n}\right)=0$
(b) $x_{n+1}=x_{n}$
(c) $x_{n+2}=x_{n} \neq x_{n+1}$
41. Writing Compare Newton's Method and the IntermediateValue Theorem (1.5.7; see Example 5 in Section 1.5) as methods to locate solutions to $f(x)=0$.
42. Writing Newton's Method uses a local linear approximation to $y=f(x)$ at $x=x_{n}$ to find an "improved" approximation $x_{n+1}$ to a zero of $f$. Your friend proposes a process that uses a local quadratic approximation to $y=f(x)$ at $x=x_{n}$ (that is, matching values for the function and its first two derivatives) to obtain $x_{n+1}$. Discuss the pros and cons of this proposal. Support your statements with some examples.

## QUICK CHECK ANSWERS 4.7

1. $x_{2} \approx 4, x_{3} \approx 2$
2. $\frac{1}{2}$
3. -1
4. $\ln 2-\frac{1}{2} \approx 0.193147$

### 4.8 ROLLE'S THEOREM; MEAN-VALUE THEOREM

In this section we will discuss a result called the Mean-Value Theorem. This theorem has so many important consequences that it is regarded as one of the major principles in calculus.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-236.jpg?height=463&width=453&top_left_y=1782&top_left_x=170)
- Figure 4.8.1

## ROLLE'S THEOREM

We will begin with a special case of the Mean-Value Theorem, called Rolle's Theorem, in honor of the mathematician Michel Rolle. This theorem states the geometrically obvious fact that if the graph of a differentiable function intersects the $x$-axis at two places, $a$ and $b$, then somewhere between $a$ and $b$ there must be at least one place where the tangent line is horizontal (Figure 4.8.1). The precise statement of the theorem is as follows.
4.8.1 THEOREM (Rolle's Theorem) Let $f$ be continuous on the closed interval $[a, b]$ and differentiable on the open interval ( $a, b$ ). If

$$
f(a)=0 \quad \text { and } \quad f(b)=0
$$

then there is at least one point $c$ in the interval $(a, b)$ such that $f^{\prime}(c)=0$.

PROOF We will divide the proof into three cases: the case where $f(x)=0$ for all $x$ in $(a, b)$, the case where $f(x)>0$ at some point in $(a, b)$, and the case where $f(x)<0$ at some point in ( $a, b$ ).

CASE I If $f(x)=0$ for all $x$ in ( $a, b$ ), then $f^{\prime}(c)=0$ at every point $c$ in ( $a, b$ ) because $f$ is a constant function on that interval.

CASE 2 Assume that $f(x)>0$ at some point in $(a, b)$. Since $f$ is continuous on $[a, b]$, it follows from the Extreme-Value Theorem (4.4.2) that $f$ has an absolute maximum on $[a, b]$. The absolute maximum value cannot occur at an endpoint of $[a, b]$ because we have assumed that $f(a)=f(b)=0$, and that $f(x)>0$ at some point in $(a, b)$. Thus, the absolute maximum must occur at some point $c$ in $(a, b)$. It follows from Theorem 4.4.3 that $c$ is a critical point of $f$, and since $f$ is differentiable on ( $a, b$ ), this critical point must be a stationary point; that is, $f^{\prime}(c)=0$.

CASE 3 Assume that $f(x)<0$ at some point in $(a, b)$. The proof of this case is similar to Case 2 and will be omitted. $\square$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-237.jpg?height=493&width=399&top_left_y=1017&top_left_x=248)
Figure 4.8.2

- Example 1 Find the two $x$-intercepts of the function $f(x)=x^{2}-5 x+4$ and confirm that $f^{\prime}(c)=0$ at some point $c$ between those intercepts.

Solution. The function $f$ can be factored as

$$
x^{2}-5 x+4=(x-1)(x-4)
$$

so the $x$-intercepts are $x=1$ and $x=4$. Since the polynomial $f$ is continuous and differentiable everywhere, the hypotheses of Rolle's Theorem are satisfied on the interval [1,4]. Thus, we are guaranteed the existence of at least one point $c$ in the interval $(1,4)$ such that $f^{\prime}(c)=0$. Differentiating $f$ yields

$$
f^{\prime}(x)=2 x-5
$$

Solving the equation $f^{\prime}(x)=0$ yields $x=\frac{5}{2}$, so $c=\frac{5}{2}$ is a point in the interval ( 1,4 ) at which $f^{\prime}(c)=0$ (Figure 4.8.2).

- Example 2 The differentiability requirement in Rolle's Theorem is critical. If $f$ fails to be differentiable at even one place in the interval $(a, b)$, then the conclusion of the

Michel Rolle (1652-1719) French mathematician. Rolle, the son of a shopkeeper, received only an elementary education. He married early and as a young man struggled hard to support his family on the meager wages of a transcriber for notaries and attorneys. In spite of his financial problems and minimal education, Rolle studied algebra and Diophantine analysis (a branch of number theory) on his own. Rolle's fortune changed dramatically in 1682 when he published an elegant solution of a difficult, unsolved problem in Diophantine analysis. The public recognition of his achievement led to a patronage under minister Louvois, a job as an elementary mathematics teacher, and eventually to a short-term administrative post in the Ministry of War. In 1685 he joined the Académie des Sciences in a low-level position for which he received no regular salary until 1699. He stayed at the Académie until he died of apoplexy in 1719.

While Rolle's forte was always Diophantine analysis, his most important work was a book on the algebra of equations, called Traité d'algèbre, published in 1690. In that book Rolle firmly established the notation $\sqrt[n]{a}$ [earlier written as $\sqrt{(n) a}$ ] for the $n$th root of $a$, and proved a polynomial version of the theorem that today bears his name. (Rolle's Theorem was named by Giusto Bellavitis in 1846.) Ironically, Rolle was one of the most vocal early antagonists of calculus. He strove intently to demonstrate that it gave erroneous results and was based on unsound reasoning. He quarreled so vigorously on the subject that the Académie des Sciences was forced to intervene on several occasions. Among his several achievements, Rolle helped advance the currently accepted size order for negative numbers. Descartes, for example, viewed -2 as smaller than -5 . Rolle preceded most of his contemporaries by adopting the current convention in 1691.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-238.jpg?height=287&width=329&top_left_y=196&top_left_x=228)
A Figure 4.8.3

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-238.jpg?height=264&width=379&top_left_y=592&top_left_x=202)
Figure 4.8 .4

In Examples 1 and 3 we were able to find exact values of $c$ because the equation $f^{\prime}(x)=0$ was easy to solve. However, in the applications of Rolle's Theorem it is usually the existence of $c$ that is important and not its actual value.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-238.jpg?height=335&width=477&top_left_y=1866&top_left_x=154)
- Figure 4.8.6

The tangent line is parallel to the secant line where the vertical distance $v(x)$ between the secant line and the graph of $f$ is maximum.
theorem may not hold. For example, the function $f(x)=|x|-1$ graphed in Figure 4.8.3 has roots at $x=-1$ and $x=1$, yet there is no horizontal tangent to the graph of $f$ over the interval $(-1,1)$.

Example 3 If $f$ satisfies the conditions of Rolle's Theorem on $[a, b]$, then the theorem guarantees the existence of at least one point $c$ in ( $a, b$ ) at which $f^{\prime}(c)=0$. There may, however, be more than one such $c$. For example, the function $f(x)=\sin x$ is continuous and differentiable everywhere, so the hypotheses of Rolle's Theorem are satisfied on the interval $[0,2 \pi]$ whose endpoints are roots of $f$. As indicated in Figure 4.8.4, there are two points in the interval $[0,2 \pi]$ at which the graph of $f$ has a horizontal tangent, $c_{1}=\pi / 2$ and $c_{2}=3 \pi / 2$.

## THE MEAN-VALUE THEOREM

Rolle's Theorem is a special case of a more general result, called the Mean-Value Theorem. Geometrically, this theorem states that between any two points $A(a, f(a))$ and $B(b, f(b))$ on the graph of a differentiable function $f$, there is at least one place where the tangent line to the graph is parallel to the secant line joining $A$ and $B$ (Figure 4.8.5).

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-238.jpg?height=333&width=1233&top_left_y=1057&top_left_x=664)
△ Figure 4.8.5

Note that the slope of the secant line joining $A(a, f(a))$ and $B(b, f(b))$ is

$$
\frac{f(b)-f(a)}{b-a}
$$

and that the slope of the tangent line at $c$ in Figure 4.8.5 $a$ is $f^{\prime}(c)$. Similarly, in Figure 4.8.5b the slopes of the tangent lines at $c_{1}$ and $c_{2}$ are $f^{\prime}\left(c_{1}\right)$ and $f^{\prime}\left(c_{2}\right)$, respectively. Since nonvertical parallel lines have the same slope, the Mean-Value Theorem can be stated precisely as follows.
4.8.2 THEOREM (Mean-Value Theorem) Let $f$ be continuous on the closed interval $[a, b]$ and differentiable on the open interval ( $a, b$ ). Then there is at least one point $c$ in ( $a, b$ ) such that

$$
\begin{equation*}
f^{\prime}(c)=\frac{f(b)-f(a)}{b-a} \tag{1}
\end{equation*}
$$

MOTIVATION FOR THE PROOF OF THEOREM 4.8.2 Figure 4.8.6 suggests that (1) will hold (i.e., the tangent line will be parallel to the secant line) at a point $c$ where the vertical distance between the curve and the secant line is maximum. Thus, to prove the Mean-Value Theorem it is natural to begin by looking for a formula for the vertical distance $v(x)$ between the curve $y=f(x)$ and the secant line joining $(a, f(a))$ and $(b, f(b))$.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-239.jpg?height=468&width=465&top_left_y=1601&top_left_x=216)
△ Figure 4.8.7

PROOF OF THEOREM 4.8.2 Since the two-point form of the equation of the secant line joining ( $a, f(a)$ ) and ( $b, f(b)$ ) is

$$
y-f(a)=\frac{f(b)-f(a)}{b-a}(x-a)
$$

or, equivalently,

$$
y=\frac{f(b)-f(a)}{b-a}(x-a)+f(a)
$$

the difference $v(x)$ between the height of the graph of $f$ and the height of the secant line is

$$
\begin{equation*}
v(x)=f(x)-\left[\frac{f(b)-f(a)}{b-a}(x-a)+f(a)\right] \tag{2}
\end{equation*}
$$

Since $f(x)$ is continuous on $[a, b]$ and differentiable on $(a, b)$, so is $v(x)$. Moreover,

$$
v(a)=0 \quad \text { and } \quad v(b)=0
$$

so that $v(x)$ satisfies the hypotheses of Rolle's Theorem on the interval $[a, b]$. Thus, there is a point $c$ in ( $a, b$ ) such that $v^{\prime}(c)=0$. But from Equation (2)

$$
v^{\prime}(x)=f^{\prime}(x)-\frac{f(b)-f(a)}{b-a}
$$

so

$$
v^{\prime}(c)=f^{\prime}(c)-\frac{f(b)-f(a)}{b-a}
$$

Since $v^{\prime}(c)=0$, we have

$$
f^{\prime}(c)=\frac{f(b)-f(a)}{b-a}
$$

Example 4 Show that the function $f(x)=\frac{1}{4} x^{3}+1$ satisfies the hypotheses of the Mean-Value Theorem over the interval [ 0,2 ], and find all values of $c$ in the interval ( 0,2 ) at which the tangent line to the graph of $f$ is parallel to the secant line joining the points $(0, f(0))$ and $(2, f(2))$.

Solution. The function $f$ is continuous and differentiable everywhere because it is a polynomial. In particular, $f$ is continuous on $[0,2]$ and differentiable on $(0,2)$, so the hypotheses of the Mean-Value Theorem are satisfied with $a=0$ and $b=2$. But

$$
\begin{array}{ll}
f(a)=f(0)=1, & f(b)=f(2)=3 \\
f^{\prime}(x)=\frac{3 x^{2}}{4}, & f^{\prime}(c)=\frac{3 c^{2}}{4}
\end{array}
$$

so in this case Equation (1) becomes

$$
\frac{3 c^{2}}{4}=\frac{3-1}{2-0} \quad \text { or } \quad 3 c^{2}=4
$$

which has the two solutions $c= \pm 2 / \sqrt{3} \approx \pm 1.15$. However, only the positive solution lies in the interval $(0,2)$; this value of $c$ is consistent with Figure 4.8.7. $\square$

## VELOCITY INTERPRETATION OF THE MEAN-VALUE THEOREM

There is a nice interpretation of the Mean-Value Theorem in the situation where $x=f(t)$ is the position versus time curve for a car moving along a straight road. In this case, the right side of (1) is the average velocity of the car over the time interval from $a \leq t \leq b$, and the left side is the instantaneous velocity at time $t=c$. Thus, the Mean-Value Theorem implies that at least once during the time interval the instantaneous velocity must equal the
average velocity. This agrees with our real-world experience-if the average velocity for a trip is $40 \mathrm{mi} / \mathrm{h}$, then sometime during the trip the speedometer has to read $40 \mathrm{mi} / \mathrm{h}$.

Example 5 You are driving on a straight highway on which the speed limit is $55 \mathrm{mi} / \mathrm{h}$. At 8:05 A.M. a police car clocks your velocity at $50 \mathrm{mi} / \mathrm{h}$ and at 8:10 A.M. a second police car posted 5 mi down the road clocks your velocity at $55 \mathrm{mi} / \mathrm{h}$. Explain why the police have a right to charge you with a speeding violation.

Solution. You traveled 5 mi in $5 \mathrm{~min}\left(=\frac{1}{12} \mathrm{~h}\right)$, so your average velocity was $60 \mathrm{mi} / \mathrm{h}$. Therefore, the Mean-Value Theorem guarantees the police that your instantaneous velocity was $60 \mathrm{mi} / \mathrm{h}$ at least once over the 5 mi section of highway.

## CONSEQUENCES OF THE MEAN-VALUE THEOREM

We stated at the beginning of this section that the Mean-Value Theorem is the starting point for many important results in calculus. As an example of this, we will use it to prove Theorem 4.1.2, which was one of our fundamental tools for analyzing graphs of functions.
4.1.2 THEOREM (Revisited) Let $f$ be a function that is continuous on a closed interval $[a, b]$ and differentiable on the open interval ( $a, b$ ).
(a) If $f^{\prime}(x)>0$ for every value of $x$ in ( $a, b$ ), then $f$ is increasing on $[a, b]$.
(b) If $f^{\prime}(x)<0$ for every value of $x$ in $(a, b)$, then $f$ is decreasing on $[a, b]$.
(c) If $f^{\prime}(x)=0$ for every value of $x$ in $(a, b)$, then $f$ is constant on $[a, b]$.
proof (a) Suppose that $x_{1}$ and $x_{2}$ are points in $[a, b]$ such that $x_{1}<x_{2}$. We must show that $f\left(x_{1}\right)<f\left(x_{2}\right)$. Because the hypotheses of the Mean-Value Theorem are satisfied on the entire interval $[a, b]$, they are satisfied on the subinterval $\left[x_{1}, x_{2}\right]$. Thus, there is some point $c$ in the open interval $\left(x_{1}, x_{2}\right)$ such that

$$
f^{\prime}(c)=\frac{f\left(x_{2}\right)-f\left(x_{1}\right)}{x_{2}-x_{1}}
$$

or, equivalently,

$$
\begin{equation*}
f\left(x_{2}\right)-f\left(x_{1}\right)=f^{\prime}(c)\left(x_{2}-x_{1}\right) \tag{3}
\end{equation*}
$$

Since $c$ is in the open interval $\left(x_{1}, x_{2}\right)$, it follows that $a<c<b$; thus, $f^{\prime}(c)>0$. However, $x_{2}-x_{1}>0$ since we assumed that $x_{1}<x_{2}$. It follows from (3) that $f\left(x_{2}\right)-f\left(x_{1}\right)>0$ or, equivalently, $f\left(x_{1}\right)<f\left(x_{2}\right)$, which is what we were to prove. The proofs of parts (b) and (c) are similar and are left as exercises.

## THE CONSTANT DIFFERENCE THEOREM

We know from our earliest study of derivatives that the derivative of a constant is zero. Part (c) of Theorem 4.1.2 is the converse of that result; that is, a function whose derivative is zero on an interval must be constant on that interval. If we apply this to the difference of two functions, we obtain the following useful theorem.
4.8.3 THEOREM (Constant Difference Theorem) If $f$ and $g$ are differentiable on an interval, and if $f^{\prime}(x)=g^{\prime}(x)$ for all $x$ in that interval, then $f-g$ is constant on the interval; that is, there is a constant $k$ such that $f(x)-g(x)=k$ or, equivalently,

$$
f(x)=g(x)+k
$$

for all $x$ in the interval.

PROOF Let $x_{1}$ and $x_{2}$ be any points in the interval such that $x_{1}<x_{2}$. Since the functions $f$ and $g$ are differentiable on the interval, they are continuous on the interval. Since $\left[x_{1}, x_{2}\right]$ is a subinterval, it follows that $f$ and $g$ are continuous on $\left[x_{1}, x_{2}\right]$ and differentiable on $\left(x_{1}, x_{2}\right)$. Moreover, it follows from the basic properties of derivatives and continuity that the same is true of the function

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-241.jpg?height=345&width=473&top_left_y=466&top_left_x=212)
△ Figure 4.8.8

If $f^{\prime}(x)=g^{\prime}(x)$ on an interval, then the graphs of $f$ and $g$ are vertical translations of each other.

Since

$$
F(x)=f(x)-g(x)
$$

$$
F^{\prime}(x)=f^{\prime}(x)-g^{\prime}(x)=0
$$

it follows from part (c) of Theorem 4.1.2 that $F(x)=f(x)-g(x)$ is constant on the interval $\left[x_{1}, x_{2}\right]$. This means that $f(x)-g(x)$ has the same value at any two points $x_{1}$ and $x_{2}$ in the interval, and this implies that $f-g$ is constant on the interval.

Geometrically, the Constant Difference Theorem tells us that if $f$ and $g$ have the same derivative on an interval, then the graphs of $f$ and $g$ are vertical translations of each other over that interval (Figure 4.8.8).

- Example 6 Part ( $c$ ) of Theorem 4.1.2 is sometimes useful for establishing identities. For example, although we do not need calculus to prove the identity

$$
\begin{equation*}
\sin ^{-1} x+\cos ^{-1} x=\frac{\pi}{2} \quad(-1 \leq x \leq 1) \tag{4}
\end{equation*}
$$

it can be done by letting $f(x)=\sin ^{-1} x+\cos ^{-1} x$. It follows from Formulas (9) and (10) of Section 3.3 that

$$
f^{\prime}(x)=\frac{d}{d x}\left[\sin ^{-1} x\right]+\frac{d}{d x}\left[\cos ^{-1} x\right]=\frac{1}{\sqrt{1-x^{2}}}-\frac{1}{\sqrt{1-x^{2}}}=0
$$

so $f(x)=\sin ^{-1} x+\cos ^{-1} x$ is constant on the interval $[-1,1]$. We can find this constant by evaluating $f$ at any convenient point in this interval. For example, using $x=0$ we obtain

$$
f(0)=\sin ^{-1} 0+\cos ^{-1} 0=0+\frac{\pi}{2}=\frac{\pi}{2}
$$

which proves (4).

## QUICK CHECK EXERCISES 4.8 (See page 310 for answers.)

1. Let $f(x)=x^{2}-x$.
(a) An interval on which $f$ satisfies the hypotheses of Rolle's Theorem is $\_\_\_\_$ .
(b) Find all values of $c$ that satisfy the conclusion of Rolle's Theorem for the function $f$ on the interval in part (a).
2. Use the accompanying graph of $f$ to find an interval [ $a, b$ ] on which Rolle's Theorem applies, and find all values of $c$ in that interval that satisfy the conclusion of the theorem.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-241.jpg?height=357&width=367&top_left_y=2054&top_left_x=268)
\& Figure Ex-2

3. Let $f(x)=x^{2}-x$.
(a) Find a point $b$ such that the slope of the secant line through $(0,0)$ and $(b, f(b))$ is 1.
(b) Find all values of $c$ that satisfy the conclusion of the Mean-Value Theorem for the function $f$ on the interval $[0, b]$, where $b$ is the point found in part (a).
4. Use the graph of $f$ in the accompanying figure to estimate all values of $c$ that satisfy the conclusion of the Mean-Value Theorem on the interval
(a) $[0,8]$
(b) $[0,4]$.

\& Figure Ex-2
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-241.jpg?height=313&width=413&top_left_y=2098&top_left_x=1177)

- Figure Ex-4

5. Find a function $f$ such that the graph of $f$ contains the point $(1,5)$ and such that for every value of $x_{0}$ the tangent line
to the graph of $f$ at $x_{0}$ is parallel to the tangent line to the graph of $y=x^{2}$ at $x_{0}$.

EXERCISE SET 4.8 Graphing Utility

1-4 Verify that the hypotheses of Rolle's Theorem are satisfied on the given interval, and find all values of $c$ in that interval that satisfy the conclusion of the theorem.

1. $f(x)=x^{2}-8 x+15$; $[3,5]$
2. $f(x)=x^{3}-3 x^{2}+2 x ;[0,2]$
3. $f(x)=\cos x ;[\pi / 2,3 \pi / 2]$
4. $f(x)=\ln \left(4+2 x-x^{2}\right) ;[-1,3]$

5-8 Verify that the hypotheses of the Mean-Value Theorem are satisfied on the given interval, and find all values of $c$ in that interval that satisfy the conclusion of the theorem.
5. $f(x)=x^{2}-x ;[-3,5]$
6. $f(x)=x^{3}+x-4 ;[-1,2]$
7. $f(x)=\sqrt{x+1} ;[0,3]$
8. $f(x)=x-\frac{1}{x} ;[3,4]$
9. (a) Find an interval $[a, b]$ on which

$$
f(x)=x^{4}+x^{3}-x^{2}+x-2
$$

satisfies the hypotheses of Rolle's Theorem.
(b) Generate the graph of $f^{\prime}(x)$, and use it to make rough estimates of all values of $c$ in the interval obtained in part (a) that satisfy the conclusion of Rolle's Theorem.
(c) Use Newton's Method to improve on the rough estimates obtained in part (b).
10. Let $f(x)=x^{3}-4 x$.
(a) Find the equation of the secant line through the points $(-2, f(-2))$ and $(1, f(1))$.
(b) Show that there is only one point $c$ in the interval $(-2,1)$ that satisfies the conclusion of the Mean-Value Theorem for the secant line in part (a).
(c) Find the equation of the tangent line to the graph of $f$ at the point $(c, f(c))$.
(d) Use a graphing utility to generate the secant line in part (a) and the tangent line in part (c) in the same coordinate system, and confirm visually that the two lines seem parallel.

11-14 True-False Determine whether the statement is true or false. Explain your answer.
11. Rolle's Theorem says that if $f$ is a continuous function on $[a, b]$ and $f(a)=f(b)$, then there is a point between $a$ and $b$ at which the curve $y=f(x)$ has a horizontal tangent line.
12. If $f$ is continuous on a closed interval $[a, b]$ and differentiable on $(a, b)$, then there is a point between $a$ and $b$ at which the instantaneous rate of change of $f$ matches the average rate of change of $f$ over $[a, b]$.
13. The Constant Difference Theorem says that if two functions have derivatives that differ by a constant on an interval, then the functions are equal on the interval.
14. One application of the Mean-Value Theorem is to prove that a function with positive derivative on an interval must be increasing on that interval.

## FOCUS ON CONCEPTS

15. Let $f(x)=\tan x$.
(a) Show that there is no point $c$ in the interval $(0, \pi)$ such that $f^{\prime}(c)=0$, even though $f(0)=f(\pi)=0$.
(b) Explain why the result in part (a) does not contradict Rolle's Theorem.
16. Let $f(x)=x^{2 / 3}, a=-1$, and $b=8$.
(a) Show that there is no point $c$ in ( $a, b$ ) such that

$$
f^{\prime}(c)=\frac{f(b)-f(a)}{b-a}
$$

(b) Explain why the result in part (a) does not contradict the Mean-Value Theorem.
17. (a) Show that if $f$ is differentiable on $(-\infty,+\infty)$, and if $y=f(x)$ and $y=f^{\prime}(x)$ are graphed in the same coordinate system, then between any two $x$-intercepts of $f$ there is at least one $x$-intercept of $f^{\prime}$.
(b) Give some examples that illustrate this.
18. Review Formulas (8) and (9) in Section 2.1 and use the Mean-Value Theorem to show that if $f$ is differentiable on $(-\infty,+\infty)$, then for any interval $\left[x_{0}, x_{1}\right]$ there is at least one point in $\left(x_{0}, x_{1}\right)$ where the instantaneous rate of change of $y$ with respect to $x$ is equal to the average rate of change over the interval.

19-21 Use the result of Exercise 18 in these exercises.
19. An automobile travels 4 mi along a straight road in 5 min . Show that the speedometer reads exactly $48 \mathrm{mi} / \mathrm{h}$ at least once during the trip.
20. At 11 A.M. on a certain morning the outside temperature was $76^{\circ} \mathrm{F}$. At 11 P.M. that evening it had dropped to $52^{\circ} \mathrm{F}$.
(a) Show that at some instant during this period the temperature was decreasing at the rate of $2^{\circ} \mathrm{F} / \mathrm{h}$.
(b) Suppose that you know the temperature reached a high of $88^{\circ} \mathrm{F}$ sometime between 11 A.M. and 11 p.M. Show that at some instant during this period the temperature was decreasing at a rate greater than $3^{\circ} \mathrm{F} / \mathrm{h}$.
21. Suppose that two runners in a 100 m dash finish in a tie. Show that they had the same velocity at least once during the race.
22. Use the fact that

$$
\frac{d}{d x}[x \ln (2-x)]=\ln (2-x)-\frac{x}{2-x}
$$

to show that the equation $x=(2-x) \ln (2-x)$ has at least one solution in the interval $(0,1)$.
23. (a) Use the Constant Difference Theorem (4.8.3) to show that if $f^{\prime}(x)=g^{\prime}(x)$ for all $x$ in the interval $(-\infty,+\infty)$, and if $f$ and $g$ have the same value at some point $x_{0}$, then $f(x)=g(x)$ for all $x$ in $(-\infty,+\infty)$.
(b) Use the result in part (a) to confirm the trigonometric identity $\sin ^{2} x+\cos ^{2} x=1$.
24. (a) Use the Constant Difference Theorem (4.8.3) to show that if $f^{\prime}(x)=g^{\prime}(x)$ for all $x$ in $(-\infty,+\infty)$, and if $f\left(x_{0}\right)-g\left(x_{0}\right)=c$ at some point $x_{0}$, then

$$
f(x)-g(x)=c
$$

for all $x$ in $(-\infty,+\infty)$.
(b) Use the result in part (a) to show that the function

$$
h(x)=(x-1)^{3}-\left(x^{2}+3\right)(x-3)
$$

is constant for all $x$ in ( $-\infty,+\infty$ ), and find the constant.
(c) Check the result in part (b) by multiplying out and simplifying the formula for $h(x)$.
25. Let $g(x)=x e^{x}-e^{x}$. Find $f(x)$ so that $f^{\prime}(x)=g^{\prime}(x)$ and $f(1)=2$.
26. Let $g(x)=\tan ^{-1} x$. Find $f(x)$ so that $f^{\prime}(x)=g^{\prime}(x)$ and $f(1)=2$.

## FOCUS ON CONCEPTS

27. (a) Use the Mean-Value Theorem to show that if $f$ is differentiable on an interval, and if $\left|f^{\prime}(x)\right| \leq M$ for all values of $x$ in the interval, then

$$
|f(x)-f(y)| \leq M|x-y|
$$

for all values of $x$ and $y$ in the interval.
(b) Use the result in part (a) to show that

$$
|\sin x-\sin y| \leq|x-y|
$$

for all real values of $x$ and $y$.
28. (a) Use the Mean-Value Theorem to show that if $f$ is differentiable on an open interval, and if $\left|f^{\prime}(x)\right| \geq M$ for all values of $x$ in the interval, then

$$
|f(x)-f(y)| \geq M|x-y|
$$

for all values of $x$ and $y$ in the interval.
(b) Use the result in part (a) to show that

$$
|\tan x-\tan y| \geq|x-y|
$$

for all values of $x$ and $y$ in the interval $(-\pi / 2, \pi / 2)$.
(c) Use the result in part (b) to show that

$$
|\tan x+\tan y| \geq|x+y|
$$

for all values of $x$ and $y$ in the interval $(-\pi / 2, \pi / 2)$.
29. (a) Use the Mean-Value Theorem to show that

$$
\sqrt{y}-\sqrt{x}<\frac{y-x}{2 \sqrt{x}}
$$

if $0<x<y$.
(b) Use the result in part (a) to show that if $0<x<y$, then $\sqrt{x y}<\frac{1}{2}(x+y)$.
30. Show that if $f$ is differentiable on an open interval and $f^{\prime}(x) \neq 0$ on the interval, the equation $f(x)=0$ can have at most one real root in the interval.
31. Use the result in Exercise 30 to show the following:
(a) The equation $x^{3}+4 x-1=0$ has exactly one real root.
(b) If $b^{2}-3 a c<0$ and if $a \neq 0$, then the equation

$$
a x^{3}+b x^{2}+c x+d=0
$$

has exactly one real root.
32. Use the inequality $\sqrt{3}<1.8$ to prove that

$$
1.7<\sqrt{3}<1.75
$$

[Hint: Let $f(x)=\sqrt{x}, a=3$, and $b=4$ in the Mean-Value Theorem.]
33. Use the Mean-Value Theorem to prove that

$$
\frac{x}{1+x^{2}}<\tan ^{-1} x<x \quad(x>0)
$$

34. (a) Show that if $f$ and $g$ are functions for which

$$
f^{\prime}(x)=g(x) \quad \text { and } \quad g^{\prime}(x)=f(x)
$$

for all $x$, then $f^{2}(x)-g^{2}(x)$ is a constant.
(b) Show that the function $f(x)=\frac{1}{2}\left(e^{x}+e^{-x}\right)$ and the function $g(x)=\frac{1}{2}\left(e^{x}-e^{-x}\right)$ have this property.
35. (a) Show that if $f$ and $g$ are functions for which

$$
f^{\prime}(x)=g(x) \quad \text { and } \quad g^{\prime}(x)=-f(x)
$$

for all $x$, then $f^{2}(x)+g^{2}(x)$ is a constant.
(b) Give an example of functions $f$ and $g$ with this property.

## FOCUS ON CONCEPTS

36. Let $f$ and $g$ be continuous on $[a, b]$ and differentiable on $(a, b)$. Prove: If $f(a)=g(a)$ and $f(b)=g(b)$, then there is a point $c$ in ( $a, b$ ) such that $f^{\prime}(c)=g^{\prime}(c)$.
37. Illustrate the result in Exercise 36 by drawing an appropriate picture.
38. (a) Prove that if $f^{\prime \prime}(x)>0$ for all $x$ in $(a, b)$, then $f^{\prime}(x)=0$ at most once in $(a, b)$.
(b) Give a geometric interpretation of the result in (a).
39. (a) Prove part (b) of Theorem 4.1.2.
(b) Prove part (c) of Theorem 4.1.2.
40. Use the Mean-Value Theorem to prove the following result: Let $f$ be continuous at $x_{0}$ and suppose that $\lim _{x \rightarrow x_{0}} f^{\prime}(x)$ exists. Then $f$ is differentiable at $x_{0}$, and

$$
f^{\prime}\left(x_{0}\right)=\lim _{x \rightarrow x_{0}} f^{\prime}(x)
$$

[Hint: The derivative $f^{\prime}\left(x_{0}\right)$ is given by

$$
f^{\prime}\left(x_{0}\right)=\lim _{x \rightarrow x_{0}} \frac{f(x)-f\left(x_{0}\right)}{x-x_{0}}
$$

provided this limit exists.]

## FOCUS ON CONCEPTS

41. Let

$$
f(x)= \begin{cases}3 x^{2}, & x \leq 1 \\ a x+b, & x>1\end{cases}
$$

Find the values of $a$ and $b$ so that $f$ will be differentiable at $x=1$.
42. (a) Let

$$
f(x)= \begin{cases}x^{2}, & x \leq 0 \\ x^{2}+1, & x>0\end{cases}
$$

Show that

$$
\lim _{x \rightarrow 0^{-}} f^{\prime}(x)=\lim _{x \rightarrow 0^{+}} f^{\prime}(x)
$$

but that $f^{\prime}(0)$ does not exist.
(b) Let

$$
f(x)= \begin{cases}x^{2}, & x \leq 0 \\ x^{3}, & x>0\end{cases}
$$

Show that $f^{\prime}(0)$ exists but $f^{\prime \prime}(0)$ does not.
43. Use the Mean-Value Theorem to prove the following result: The graph of a function $f$ has a point of vertical tangency at ( $x_{0}, f\left(x_{0}\right)$ ) if $f$ is continuous at $x_{0}$ and $f^{\prime}(x)$ approaches either $+\infty$ or $-\infty$ as $x \rightarrow x_{0}^{+}$and as $x \rightarrow x_{0}^{-}$.
44. Writing Suppose that $p(x)$ is a nonconstant polynomial with zeros at $x=a$ and $x=b$. Explain how both the Extreme-Value Theorem (4.4.2) and Rolle's Theorem can be used to show that $p$ has a critical point between $a$ and $b$.
45. Writing Find and describe a physical situation that illustrates the Mean-Value Theorem.

## QUICK CHECK ANSWERS 4.8

1. (a) $[0,1]$
(b) $c=\frac{1}{2}$
2. $[-3,3] ; c=-2,0,2$
3. (a) $b=2$
(b) $c=1$
4. (a) 1.5
(b) 0.8
5. $f(x)=x^{2}+4$

## CHAPTER 4 REVIEW EXERCISES

Graphing Utility
c) CAS

1. (a) If $x_{1}<x_{2}$, what relationship must hold between $f\left(x_{1}\right)$ and $f\left(x_{2}\right)$ if $f$ is increasing on an interval containing $x_{1}$ and $x_{2}$ ? Decreasing? Constant?
(b) What condition on $f^{\prime}$ ensures that $f$ is increasing on an interval $[a, b]$ ? Decreasing? Constant?
2. (a) What condition on $f^{\prime}$ ensures that $f$ is concave up on an open interval? Concave down?
(b) What condition on $f^{\prime \prime}$ ensures that $f$ is concave up on an open interval? Concave down?
(c) In words, what is an inflection point of $f$ ?

3-10 Find: (a) the intervals on which $f$ is increasing, (b) the intervals on which $f$ is decreasing, (c) the open intervals on which $f$ is concave up, (d) the open intervals on which $f$ is concave down, and (e) the $x$-coordinates of all inflection points.
3. $f(x)=x^{2}-5 x+6$
4. $f(x)=x^{4}-8 x^{2}+16$
5. $f(x)=\frac{x^{2}}{x^{2}+2}$
6. $f(x)=\sqrt[3]{x+2}$
7. $f(x)=x^{1 / 3}(x+4)$
8. $f(x)=x^{4 / 3}-x^{1 / 3}$
9. $f(x)=1 / e^{x^{2}}$
10. $f(x)=\tan ^{-1} x^{2}$

11-14 Analyze the trigonometric function $f$ over the specified interval, stating where $f$ is increasing, decreasing, concave up, and concave down, and stating the $x$-coordinates of all inflection points. Confirm that your results are consistent with the graph of $f$ generated with a graphing utility.
11. $f(x)=\cos x ;[0,2 \pi]$
12. $f(x)=\tan x ;(-\pi / 2, \pi / 2)$
13. $f(x)=\sin x \cos x ;[0, \pi]$
14. $f(x)=\cos ^{2} x-2 \sin x ;[0,2 \pi]$
15. In each part, sketch a continuous curve $y=f(x)$ with the stated properties.
(a) $f(2)=4, f^{\prime}(2)=1, f^{\prime \prime}(x)<0$ for $x<2$, $f^{\prime \prime}(x)>0$ for $x>2$
(b) $f(2)=4, f^{\prime \prime}(x)>0$ for $x<2, f^{\prime \prime}(x)<0$ for $x>2$, $\lim _{x \rightarrow 2^{-}} f^{\prime}(x)=+\infty, \lim _{x \rightarrow 2^{+}} f^{\prime}(x)=+\infty$
(c) $f(2)=4, f^{\prime \prime}(x)<0$ for $x \neq 2, \lim _{x \rightarrow 2^{-}} f^{\prime}(x)=1$, $\lim _{x \rightarrow 2^{+}} f^{\prime}(x)=-1$
16. In parts (a)-(d), the graph of a polynomial with degree at most 6 is given. Find equations for polynomials that produce graphs with these shapes, and check your answers with a graphing utility.
(a)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-244.jpg?height=247&width=249&top_left_y=1834&top_left_x=1159)
(b)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-244.jpg?height=247&width=248&top_left_y=1834&top_left_x=1505)
(c)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-244.jpg?height=243&width=247&top_left_y=2146&top_left_x=1153)
(d)
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-244.jpg?height=247&width=248&top_left_y=2142&top_left_x=1505)
17. For a general quadratic polynomial

$$
f(x)=a x^{2}+b x+c \quad(a \neq 0)
$$

find conditions on $a, b$, and $c$ to ensure that $f$ is always increasing or always decreasing on $[0,+\infty)$.
18. For the general cubic polynomial

$$
f(x)=a x^{3}+b x^{2}+c x+d \quad(a \neq 0)
$$

find conditions on $a, b, c$, and $d$ to ensure that $f$ is always increasing or always decreasing on $(-\infty,+\infty)$.
19. Use a graphing utility to estimate the value of $x$ at which

$$
f(x)=\frac{2^{x}}{1+2^{x+1}}
$$

is increasing most rapidly.
20. Prove that for any positive constants $a$ and $k$, the graph of

$$
y=\frac{a^{x}}{1+a^{x+k}}
$$

has an inflection point at $x=-k$.
21. (a) Where on the graph of $y=f(x)$ would you expect $y$ to be increasing or decreasing most rapidly with respect to $x$ ?
(b) In words, what is a relative extremum?
(c) State a procedure for determining where the relative extrema of $f$ occur.
22. Determine whether the statement is true or false. If it is false, give an example for which the statement fails.
(a) If $f$ has a relative maximum at $x_{0}$, then $f\left(x_{0}\right)$ is the largest value that $f(x)$ can have.
(b) If the largest value for $f$ on the interval ( $a, b$ ) is at $x_{0}$, then $f$ has a relative maximum at $x_{0}$.
(c) A function $f$ has a relative extremum at each of its critical points.
23. (a) According to the first derivative test, what conditions ensure that $f$ has a relative maximum at $x_{0}$ ? A relative minimum?
(b) According to the second derivative test, what conditions ensure that $f$ has a relative maximum at $x_{0}$ ? A relative minimum?

24-26 Locate the critical points and identify which critical points correspond to stationary points.
24. (a) $f(x)=x^{3}+3 x^{2}-9 x+1$
(b) $f(x)=x^{4}-6 x^{2}-3$
25.
(a) $f(x)=\frac{x}{x^{2}+2}$
(b) $f(x)=\frac{x^{2}-3}{x^{2}+1}$
26.
(a) $f(x)=x^{1 / 3}(x-4)$
(b) $f(x)=x^{4 / 3}-6 x^{1 / 3}$
27. In each part, find all critical points, and use the first derivative test to classify them as relative maxima, relative minima, or neither.
(a) $f(x)=x^{1 / 3}(x-7)^{2}$
(b) $f(x)=2 \sin x-\cos 2 x, \quad 0 \leq x \leq 2 \pi$
(c) $f(x)=3 x-(x-1)^{3 / 2}$
28. In each part, find all critical points, and use the second derivative test (where possible) to classify them as relative maxima, relative minima, or neither.
(a) $f(x)=x^{-1 / 2}+\frac{1}{9} x^{1 / 2}$
(b) $f(x)=x^{2}+8 / x$
(c) $f(x)=\sin ^{2} x-\cos x, \quad 0 \leq x \leq 2 \pi$

29-36 Give a graph of the function $f$, and identify the limits as $x \rightarrow \pm \infty$, as well as locations of all relative extrema, inflection points, and asymptotes (as appropriate).
29. $f(x)=x^{4}-3 x^{3}+3 x^{2}+1$
30. $f(x)=x^{5}-4 x^{4}+4 x^{3}$
31. $f(x)=\tan \left(x^{2}+1\right)$
32. $f(x)=x-\cos x$
33. $f(x)=\frac{x^{2}}{x^{2}+2 x+5}$
34. $f(x)=\frac{25-9 x^{2}}{x^{3}}$
35. $f(x)= \begin{cases}\frac{1}{2} x^{2}, & x \leq 0 \\ -x^{2}, & x>0\end{cases}$
36. $f(x)=(1+x)^{2 / 3}(3-x)^{1 / 3}$

37-44 Use any method to find the relative extrema of the function $f$. $\square$
37. $f(x)=x^{3}+5 x-2$
38. $f(x)=x^{4}-2 x^{2}+7$
39. $f(x)=x^{4 / 5}$
40. $f(x)=2 x+x^{2 / 3}$
41. $f(x)=\frac{x^{2}}{x^{2}+1}$
42. $f(x)=\frac{x}{x+2}$
43. $f(x)=\ln \left(1+x^{2}\right)$
44. $f(x)=x^{2} e^{x}$

45-46 When using a graphing utility, important features of a graph may be missed if the viewing window is not chosen appropriately. This is illustrated in Exercises 45 and 46.
45. (a) Generate the graph of $f(x)=\frac{1}{3} x^{3}-\frac{1}{400} x$ over the interval $[-5,5]$, and make a conjecture about the locations and nature of all critical points.
(b) Find the exact locations of all the critical points, and classify them as relative maxima, relative minima, or neither.
(c) Confirm the results in part (b) by graphing $f$ over an appropriate interval.
46. (a) Generate the graph of

$$
f(x)=\frac{1}{5} x^{5}-\frac{7}{8} x^{4}+\frac{1}{3} x^{3}+\frac{7}{2} x^{2}-6 x
$$

over the interval $[-5,5]$, and make a conjecture about the locations and nature of all critical points.
(b) Find the exact locations of all the critical points, and classify them as relative maxima, relative minima, or neither.
(c) Confirm the results in part (b) by graphing portions of $f$ over appropriate intervals. [Note: It will not be possible to find a single window in which all of the critical points are discernible.]
47. (a) Use a graphing utility to generate the graphs of $y=x$ and $y=\left(x^{3}-8\right) /\left(x^{2}+1\right)$ together over the interval $[-5,5]$, and make a conjecture about the relationship between the two graphs.
(b) Confirm your conjecture in part (a).
48. Use implicit differentiation to show that a function defined implicitly by $\sin x+\cos y=2 y$ has a critical point whenever $\cos x=0$. Then use either the first or second derivative test to classify these critical points as relative maxima or minima.
49. Let

$$
f(x)=\frac{2 x^{3}+x^{2}-15 x+7}{(2 x-1)\left(3 x^{2}+x-1\right)}
$$

Graph $y=f(x)$, and find the equations of all horizontal and vertical asymptotes. Explain why there is no vertical asymptote at $x=\frac{1}{2}$, even though the denominator of $f$ is zero at that point.
50. Let

$$
f(x)=\frac{x^{5}-x^{4}-3 x^{3}+2 x+4}{x^{7}-2 x^{6}-3 x^{5}+6 x^{4}+4 x-8}
$$

(a) Use a CAS to factor the numerator and denominator of $f$, and use the results to determine the locations of all vertical asymptotes.
(b) Confirm that your answer is consistent with the graph of $f$.
51. (a) What inequality must $f(x)$ satisfy for the function $f$ to have an absolute maximum on an interval $I$ at $x_{0}$ ?
(b) What inequality must $f(x)$ satisfy for $f$ to have an absolute minimum on an interval $I$ at $x_{0}$ ?
(c) What is the difference between an absolute extremum and a relative extremum?
52. According to the Extreme-Value Theorem, what conditions on a function $f$ and a given interval guarantee that $f$ will have both an absolute maximum and an absolute minimum on the interval?
53. In each part, determine whether the statement is true or false, and justify your answer.
(a) If $f$ is differentiable on the open interval $(a, b)$, and if $f$ has an absolute extremum on that interval, then it must occur at a stationary point of $f$.
(b) If $f$ is continuous on the open interval ( $a, b$ ), and if $f$ has an absolute extremum on that interval, then it must occur at a stationary point of $f$.

54-56 In each part, find the absolute minimum $m$ and the absolute maximum $M$ of $f$ on the given interval (if they exist), and state where the absolute extrema occur.
54. (a) $f(x)=1 / x ;[-2,-1]$
(b) $f(x)=x^{3}-x^{4} ;\left[-1, \frac{3}{2}\right]$
(c) $f(x)=x-\tan x ;[-\pi / 4, \pi / 4]$
(d) $f(x)=-\left|x^{2}-2 x\right| ;[1,3]$
55. (a) $f(x)=x^{2}-3 x-1 ;(-\infty,+\infty)$
(b) $f(x)=x^{3}-3 x-2 ;(-\infty,+\infty)$

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-246.jpg?height=288&width=207&top_left_y=1621&top_left_x=1125)
- Figure Ex-60

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-246.jpg?height=320&width=432&top_left_y=1589&top_left_x=1441)
- Figure Ex-61

(c) $f(x)=e^{x} / x^{2} ;(0,+\infty)$
(d) $f(x)=x^{x} ;(0,+\infty)$
56. (a) $f(x)=2 x^{5}-5 x^{4}+7 ;(-1,3)$
(b) $f(x)=(3-x) /(2-x) ;(0,2)$
(c) $f(x)=2 x /\left(x^{2}+3\right) ;(0,2]$
(d) $f(x)=x^{2}(x-2)^{1 / 3} ;(0,3]$
57. In each part, use a graphing utility to estimate the absolute maximum and minimum values of $f$, if any, on the stated interval, and then use calculus methods to find the exact values.
(a) $f(x)=\left(x^{2}-1\right)^{2} ;(-\infty,+\infty)$
(b) $f(x)=x /\left(x^{2}+1\right) ;[0,+\infty)$
(c) $f(x)=2 \sec x-\tan x ;[0, \pi / 4]$
(d) $f(x)=x / 2+\ln \left(x^{2}+1\right) ;[-4,0]$
58. Prove that $x \leq \sin ^{-1} x$ for all $x$ in $[0,1]$.
c 59. Let

$$
f(x)=\frac{x^{3}+2}{x^{4}+1}
$$

(a) Generate the graph of $y=f(x)$, and use the graph to make rough estimates of the coordinates of the absolute extrema.
(b) Use a CAS to solve the equation $f^{\prime}(x)=0$ and then use it to make more accurate approximations of the coordinates in part (a).
60. A church window consists of a blue semicircular section surmounting a clear rectangular section as shown in the accompanying figure. The blue glass lets through half as much light per unit area as the clear glass. Find the radius $r$ of the window that admits the most light if the perimeter of the entire window is to be $P$ feet.
61. Find the dimensions of the rectangle of maximum area that can be inscribed inside the ellipse $(x / 4)^{2}+(y / 3)^{2}=1$ (see the accompanying figure).

C 62. As shown in the accompanying figure on the next page, suppose that a boat enters the river at the point $(1,0)$ and maintains a heading toward the origin. As a result of the strong current, the boat follows the path

$$
y=\frac{x^{10 / 3}-1}{2 x^{2 / 3}}
$$

where $x$ and $y$ are in miles.
(a) Graph the path taken by the boat.
(b) Can the boat reach the origin? If not, discuss its fate and find how close it comes to the origin.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-247.jpg?height=401&width=487&top_left_y=188&top_left_x=268)
< Figure Ex-62

63. A sheet of cardboard 12 in square is used to make an open box by cutting squares of equal size from the four corners and folding up the sides. What size squares should be cut to obtain a box with largest possible volume?
64. Is it true or false that a particle in rectilinear motion is speeding up when its velocity is increasing and slowing down when its velocity is decreasing? Justify your answer.
65. (a) Can an object in rectilinear motion reverse direction if its acceleration is constant? Justify your answer using a velocity versus time curve.
(b) Can an object in rectilinear motion have increasing speed and decreasing acceleration? Justify your answer using a velocity versus time curve.
66. Suppose that the position function of a particle in rectilinear motion is given by the formula $s(t)=t /\left(2 t^{2}+8\right)$ for $t \geq 0$.
(a) Use a graphing utility to generate the position, velocity, and acceleration versus time curves.
(b) Use the appropriate graph to make a rough estimate of the time when the particle reverses direction, and then find that time exactly.
(c) Find the position, velocity, and acceleration at the instant when the particle reverses direction.
(d) Use the appropriate graphs to make rough estimates of the time intervals on which the particle is speeding up and the time intervals on which it is slowing down, and then find those time intervals exactly.
(e) When does the particle have its maximum and minimum velocities?
C 67. For parts (a)-(f), suppose that the position function of a particle in rectilinear motion is given by the formula

$$
s(t)=\frac{t^{2}+1}{t^{4}+1}, \quad t \geq 0
$$

(a) Use a CAS to find simplified formulas for the velocity function $v(t)$ and the acceleration function $a(t)$.
(b) Graph the position, velocity, and acceleration versus time curves.
(c) Use the appropriate graph to make a rough estimate of the time at which the particle is farthest from the origin and its distance from the origin at that time.
(d) Use the appropriate graph to make a rough estimate of the time interval during which the particle is moving in the positive direction.
(e) Use the appropriate graphs to make rough estimates of the time intervals during which the particle is speeding up and the time intervals during which it is slowing down.
(f) Use the appropriate graph to make a rough estimate of the maximum speed of the particle and the time at which the maximum speed occurs.
68. Draw an appropriate picture, and describe the basic idea of Newton's Method without using any formulas.
69. Use Newton's Method to approximate all three solutions of $x^{3}-4 x+1=0$.
70. Use Newton's Method to approximate the smallest positive solution of $\sin x+\cos x=0$.
71. Use a graphing utility to determine the number of times the curve $y=x^{3}$ intersects the curve $y=(x / 2)-1$. Then apply Newton's Method to approximate the $x$-coordinates of all intersections.
72. According to Kepler's law, the planets in our solar system move in elliptical orbits around the Sun. If a planet's closest approach to the Sun occurs at time $t=0$, then the distance $r$ from the center of the planet to the center of the Sun at some later time $t$ can be determined from the equation

$$
r=a(1-e \cos \phi)
$$

where $a$ is the average distance between centers, $e$ is a positive constant that measures the "flatness" of the elliptical orbit, and $\phi$ is the solution of Kepler's equation

$$
\frac{2 \pi t}{T}=\phi-e \sin \phi
$$

in which $T$ is the time it takes for one complete orbit of the planet. Estimate the distance from the Earth to the Sun when $t=90$ days. [First find $\phi$ from Kepler's equation, and then use this value of $\phi$ to find the distance. Use $a=150 \times 10^{6} \mathrm{~km}, e=0.0167$, and $T=365$ days.]
73. Using the formulas in Exercise 72, find the distance from the planet Mars to the Sun when $t=1$ year. For Mars use $a=228 \times 10^{6} \mathrm{~km}, e=0.0934$, and $T=1.88$ years.
74. Suppose that $f$ is continuous on the closed interval $[a, b]$ and differentiable on the open interval ( $a, b$ ), and suppose that $f(a)=f(b)$. Is it true or false that $f$ must have at least one stationary point in $(a, b)$ ? Justify your answer.
75. In each part, determine whether all of the hypotheses of Rolle's Theorem are satisfied on the stated interval. If not, state which hypotheses fail; if so, find all values of $c$ guaranteed in the conclusion of the theorem.
(a) $f(x)=\sqrt{4-x^{2}}$ on $[-2,2]$
(b) $f(x)=x^{2 / 3}-1$ on $[-1,1]$
(c) $f(x)=\sin \left(x^{2}\right)$ on $[0, \sqrt{\pi}]$
76. In each part, determine whether all of the hypotheses of the Mean-Value Theorem are satisfied on the stated interval. If not, state which hypotheses fail; if so, find all values of $c$ guaranteed in the conclusion of the theorem.
(a) $f(x)=|x-1|$ on $[-2,2]$
(b) $f(x)=\frac{x+1}{x-1}$ on $[2,3]$
(c) $f(x)=\left\{\begin{array}{ll}3-x^{2} & \text { if } x \leq 1 \\ 2 / x & \text { if } x>1\end{array}\right.$ on [0,2]
77. Use the fact that

$$
\frac{d}{d x}\left(x^{6}-2 x^{2}+x\right)=6 x^{5}-4 x+1
$$

to show that the equation $6 x^{5}-4 x+1=0$ has at least one solution in the interval $(0,1)$.
78. Let $g(x)=x^{3}-4 x+6$. Find $f(x)$ so that $f^{\prime}(x)=g^{\prime}(x)$ and $f(1)=2$.

## CHAPTER 4 MAKING CONNECTIONS

1. Suppose that $g(x)$ is a function that is defined and differentiable for all real numbers $x$ and that $g(x)$ has the following properties:
(i) $g(0)=2$ and $g^{\prime}(0)=-\frac{2}{3}$.
(ii) $g(4)=3$ and $g^{\prime}(4)=3$.
(iii) $g(x)$ is concave up for $x<4$ and concave down for $x>4$.
(iv) $g(x) \geq-10$ for all $x$.

Use these properties to answer the following questions.
(a) How many zeros does $g$ have?
(b) How many zeros does $g^{\prime}$ have?
(c) Exactly one of the following limits is possible:

$$
\lim _{x \rightarrow+\infty} g^{\prime}(x)=-5, \quad \lim _{x \rightarrow+\infty} g^{\prime}(x)=0, \quad \lim _{x \rightarrow+\infty} g^{\prime}(x)=5
$$

Identify which of these results is possible and draw a rough sketch of the graph of such a function $g(x)$. Explain why the other two results are impossible.
2. The two graphs in the accompanying figure depict a function $r(x)$ and its derivative $r^{\prime}(x)$.
(a) Approximate the coordinates of each inflection point on the graph of $y=r(x)$.
(b) Suppose that $f(x)$ is a function that is continuous everywhere and whose derivative satisfies

$$
f^{\prime}(x)=\left(x^{2}-4\right) \cdot r(x)
$$

What are the critical points for $f(x)$ ? At each critical point, identify whether $f(x)$ has a (relative) maximum, minimum, or neither a maximum or minimum. Approximate $f^{\prime \prime}(1)$.
![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-248.jpg?height=371&width=529&top_left_y=1978&top_left_x=194)

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-248.jpg?height=284&width=531&top_left_y=664&top_left_x=1109)
Figure Ex-2

3. With the function $r(x)$ as provided in Exercise 2, let $g(x)$ be a function that is continuous everywhere such that $g^{\prime}(x)=x-r(x)$. For which values of $x$ does $g(x)$ have an inflection point?
4. Suppose that $f$ is a function whose derivative is continuous everywhere. Assume that there exists a real number $c$ such that when Newton's Method is applied to $f$, the inequality

$$
\left|x_{n}-c\right|<\frac{1}{n}
$$

is satisfied for all values of $n=1,2,3, \ldots$.
(a) Explain why

$$
\left|x_{n+1}-x_{n}\right|<\frac{2}{n}
$$

for all values of $n=1,2,3, \ldots$.
(b) Show that there exists a positive constant $M$ such that

$$
\left|f\left(x_{n}\right)\right| \leq M\left|x_{n+1}-x_{n}\right|<\frac{2 M}{n}
$$

for all values of $n=1,2,3, \ldots$.
(c) Prove that if $f(c) \neq 0$, then there exists a positive integer $N$ such that

$$
\frac{|f(c)|}{2}<\left|f\left(x_{n}\right)\right|
$$

if $n>N$. [Hint: Argue that $f(x) \rightarrow f(c)$ as $x \rightarrow c$ and then apply Definition 1.4.1 with $\epsilon=\frac{1}{2}|f(c)|$.]
(d) What can you conclude from parts (b) and (c)?
5. What are the important elements in the argument suggested by Exercise 4? Can you extend this argument to a wider collection of functions?
6. A bug crawling on a linoleum floor along the edge of a plush carpet encounters an irregularity in the form of a 2 in by 3 in rectangular section of carpet that juts out into the linoleum as illustrated in Figure Ex-6a on the next page.

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-249.jpg?height=189&width=335&top_left_y=224&top_left_x=256)
<Figure Ex-6a

The bug crawls at $0.7 \mathrm{in} / \mathrm{s}$ on the linoleum, but only at $0.3 \mathrm{in} / \mathrm{s}$ through the carpet, and its goal is to travel from point $A$ to point $B$. Four possible routes from $A$ to $B$ are as follows: (i) crawl on linoleum along the edge of the carpet; (ii) crawl through the carpet to a point on the wider side of the rectangle, and finish the journey on linoleum along the edge of the carpet; (iii) crawl through the carpet to a point on the shorter side of the rectangle, and finish the journey on linoleum along the edge of the carpet; or (iv) crawl through the carpet directly to point $B$. (See Figure Ex-6b.)
(a) Calculate the times it would take the bug to crawl from $A$ to $B$ via routes (i) and (iv).
(b) Suppose the bug follows route (ii) and use $x$ to represent the total distance the bug crawls on linoleum. Identify the appropriate interval for $x$ in this case, and determine the shortest time for the bug to complete the journey using route (ii).
(c) Suppose the bug follows route (iii) and again use $x$ to represent the total distance the bug crawls on linoleum. Identify the appropriate interval for $x$ in this case, and determine the shortest time for the bug to complete the journey using route (iii).
(d) Which of routes (i), (ii), (iii), or (iv) is quickest? What is the shortest time for the bug to complete the journey?

![](https://cdn.mathpix.com/cropped/84333fdc-d75a-4de5-aded-d41110c1154d-249.jpg?height=253&width=1340&top_left_y=859&top_left_x=208)
- Figure Ex-6b


[^0]:    Explain why an error estimate of at most $\pm \frac{1}{32}$ inch is reasonable for a ruler that is calibrated in sixteenths of an inch.

[^1]:    ${ }^{*}$ Recall that for $n \geq 1$ the expression $n!$, read $\boldsymbol{n}$-factorial, denotes the product of the first $n$ positive integers.

[^2]:    4.4.3 THEOREM If $f$ has an absolute extremum on an open interval ( $a, b$ ), then it must occur at a critical point of $f$.

[^3]:    *In writing $s=s(t)$, rather than the more familiar $s=f(t)$, we are using the letter $s$ both as the dependent variable and the name of the function. This is common practice in engineering and physics.

