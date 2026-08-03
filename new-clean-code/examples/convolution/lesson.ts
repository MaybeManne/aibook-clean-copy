import { animate, defineLesson, explain, explorable, mcq } from "@lessonstudio/authoring";
import { article, md } from "@lessonstudio/intents";
import { buildCombine, buildFlip, buildSlide } from "./storyboards.js";
import { EDITOR_PRESETS } from "./kernels.js";
import "./figures.js";
import "./convolve2d.js";

export const lessonSpec = {
  id: "convolution-discrete",
  version: 1,
  title: "But what is a convolution?",
  flow: [
    animate({
      id: "combine",
      storyboard: buildCombine(),
      narration:
        "Here are two lists of numbers. There are a few natural ways to combine them. You can add them " +
        "term by term, or multiply them term by term — both give back a list of the same length. But there's " +
        "a third way, convolution, and it's the strange one. It's longer, and every entry mixes many pairs at " +
        "once. Working out what that operation really is, is the whole point of this lesson.",
      next: "dice",
    }),

    explorable({
      id: "dice",
      viz: { name: "dice-grid" },
      controls: [
        { key: "sum", label: "target sum", kind: "slider", min: 2, max: 12, step: 1 },
        { key: "__next", label: "continue →", kind: "button" },
      ],
      defaults: { sum: 2 },
      goal: { key: "sum", equals: 7 },
      task: md("**Drag to the most likely total.** Which sum sits on the longest diagonal — the one with the most ways to occur?"),
      success: md("Seven: six ways out of thirty-six, so $P = 6/36 = 1/6$. That count is a **diagonal sum** — a convolution of the die's distribution with itself."),
      note:
        "Each diagonal $i+j=n$ collects every dice pair that totals $n$. Counting the cells on it gives " +
        "$P(\\text{sum}=n)$ — the uniform die distribution convolved with itself.",
      narration:
        "Convolution shows up first in probability. Roll two dice. Each cell of this grid is one outcome, and " +
        "its value is the sum of the two dice. Drag to pick a target sum. The cells on one diagonal all give " +
        "that same total, and counting them gives its probability. That diagonal-counting is exactly a " +
        "convolution — of the die's distribution with itself.",
      next: "dice-formula",
    }),

    explain({
      id: "dice-formula",
      viz: { name: "dice-grid", props: { sum: 7 } },
      text: article(
        "**The pattern behind the dice.** To find how likely a total $n$ is, you add up the chance of every " +
        "pair that lands on it:\n\n" +
        "$$P(\\text{sum}=n) = \\sum_{i+j=n} a_i\\, b_j,$$\n\n" +
        "where $a$ and $b$ are the two dice's distributions (here uniform, $1/6$ each). That sum over **all " +
        "pairs with $i+j=n$** is exactly one entry of a convolution — the same diagonal you just highlighted.",
      ),
      narration:
        "Look at what counting a diagonal actually does. To get the chance of a total n, you add up a-sub-i " +
        "times b-sub-j over every pair where i plus j equals n. That sum, over all pairs that add to n, is the " +
        "definition of convolution.",
      next: "intro",
    }),

    explorable({
      id: "intro",
      viz: { name: "conv-setup" },
      controls: [{ key: "__next", label: "compute it →", kind: "button" }],
      note:
        "Now compute one by hand with small numbers: $a = (1,2,3)$ and $b = (4,5,6)$. Their **convolution** " +
        "$a * b$ is a third sequence; each term collects *every* way the two combine to land at index $n$:\n\n" +
        "$$(a * b)[n] = \\sum_k a[k]\\, b[n-k].$$\n\n" +
        "That's the formula. The rest is just *seeing* it: **flip, slide, multiply, sum.**",
      narration:
        "Let's compute a convolution by hand, with small numbers: a is one, two, three, and b is four, five, " +
        "six. The definition collects every way the two sequences combine to land at each index n.",
      next: "flip",
    }),

    animate({
      id: "flip",
      storyboard: buildFlip(),
      narration: "First, flip b. Reversed, it reads six, five, four.",
      next: "slide",
    }),

    animate({
      id: "slide",
      storyboard: buildSlide(),
      narration:
        "Now slide the flipped strip across a. At each shift, multiply the overlapping pairs and " +
        "add them up — that single number is one entry of the output.",
      next: "explore",
    }),

    explorable({
      id: "explore",
      viz: { name: "conv-boxes" },
      controls: [
        { key: "shift", label: "shift  n", kind: "slider", min: 0, max: 4, step: 1 },
        { key: "__next", label: "I've got it — continue →", kind: "button" },
      ],
      defaults: { shift: 0 },
      goal: { key: "shift", equals: 4 },
      task: md("**Drag the slider** through every shift $n = 0 \\dots 4$. Watch the flipped strip move, the aligned products appear, and the output row fill in."),
      success: md("That's the whole convolution: $a * b = (4,\\,13,\\,28,\\,27,\\,18)$. Each entry is one flip-slide-multiply-sum."),
      note:
        "At shift $n$, $b$ is flipped and slid so $b[j]$ sits under $a[n-j]$. The overlapping columns " +
        "multiply — those green products — and their sum is $(a*b)[n]$, dropped into the yellow output row.",
      narration:
        "Your turn. Drag the shift all the way through. At each step the flipped strip lines up under a, the " +
        "overlapping products light up, and their sum drops into the output row.",
      next: "product-grid",
    }),

    explorable({
      id: "product-grid",
      viz: { name: "prod-grid" },
      controls: [
        { key: "diag", label: "diagonal  d", kind: "slider", min: 0, max: 4, step: 1 },
        { key: "__next", label: "continue →", kind: "button" },
      ],
      defaults: { diag: 0 },
      goal: { key: "diag", equals: 4 },
      task: md("**Sweep through every diagonal** $d = 0 \\dots 4$. Watch each diagonal's product-sum match an entry of $a * b$."),
      success: md("Every diagonal sum is one output entry: $a * b = (4,\\,13,\\,28,\\,27,\\,18)$. The grid's diagonals ARE the convolution."),
      note:
        "Cell $(r,c)$ holds $a_r \\cdot b_c$. Summing the anti-diagonal $r+c=d$ gives $(a*b)[d]$ — and sliding " +
        "the flipped strip to shift $d$ picks out exactly that diagonal.",
      narration:
        "Here's why the flip-and-slide works. Put every product, a-sub-r times b-sub-c, into a grid. The " +
        "convolution output is just the sum along each diagonal — and each diagonal is one shift of the " +
        "sliding strip.",
      next: "polynomial",
    }),

    explain({
      id: "polynomial",
      viz: { name: "prod-grid", props: { diag: 4 } },
      text: article(
        "**Convolution's hidden identity: polynomial multiplication.** Treat each list as a polynomial's " +
        "coefficients:\n\n" +
        "$$a(x) = 1 + 2x + 3x^2, \\qquad b(x) = 4 + 5x + 6x^2.$$\n\n" +
        "Multiply them and collect like powers of $x$:\n\n" +
        "$$a(x)\\,b(x) = 4 + 13x + 28x^2 + 27x^3 + 18x^4.$$\n\n" +
        "Those coefficients $(4,13,28,27,18)$ are exactly $a * b$. Multiplying polynomials **is** convolving " +
        "their coefficient lists — the $x^n$ term collects every $a_i b_j$ with $i+j=n$, the same diagonal sum " +
        "as the grid.",
      ),
      narration:
        "And here is convolution's secret identity. Treat each list as the coefficients of a polynomial. " +
        "Multiply the two polynomials and collect like powers of x, and you get four, thirteen, twenty-eight, " +
        "twenty-seven, eighteen — exactly the convolution. Multiplying polynomials is convolving their " +
        "coefficients.",
      next: "check",
    }),

    mcq({
      id: "check",
      prompt: md("For $(a * b)[2]$, which computation gives the value **28**?"),
      choices: [
        { text: "3 × 6 = 18 — just the largest overlapping product.", misconception: "conv-is-single-product" },
        { text: "1·6 + 2·5 + 3·4 — sum of all aligned products at shift 2.", correct: true },
        { text: "(1+2+3) × (4+5+6) = 90 — the totals multiplied.", misconception: "conv-is-total-product" },
      ],
      skill: "convolution-definition",
      correctFeedback: "Right — at shift 2 the three columns 1·6, 2·5, 3·4 all overlap, and their sum is 28.",
      wrongFeedback: "Not quite — convolution sums the aligned products. Let's revisit the rule.",
      narration: "Quick check. For the entry at index two, which computation gives twenty-eight?",
      onWrong: "reteach",
      next: "image-2d",
    }),

    explain({
      id: "reteach",
      viz: { name: "conv-boxes", props: { shift: 2 } },
      text: article(
        "**One shift, step by step.** At shift $n=2$, the flipped $b = (6,5,4)$ lines up fully under " +
        "$a = (1,2,3)$:\n\n" +
        "- column 0: $1 \\cdot 6 = 6$\n" +
        "- column 1: $2 \\cdot 5 = 10$\n" +
        "- column 2: $3 \\cdot 4 = 12$\n\n" +
        "Add them: $6 + 10 + 12 = 28 = (a*b)[2]$. Convolution **sums the aligned products** — never a single one, never the totals multiplied.",
      ),
      narration: "Let's walk one shift slowly, column by column.",
      next: "image-2d",
    }),

    explorable({
      id: "image-2d",
      viz: {
        name: "conv2d",
        props: { image: 0, filter: 1, mode: "closeup" },
        persistent: true,
      },
      controls: [
        { key: "zoom", label: "zoom", kind: "slider", min: 1, max: 8, step: 0.5, unit: "×" },
        { key: "__next", label: "continue →", kind: "button" },
      ],
      defaults: { zoom: 2.6, kx: 5, ky: 6 },
      note:
        "**The same idea, now on an image.** A grayscale image is just a grid of numbers — one " +
        "brightness per pixel — and a **2-D convolution** slides a small grid of weights, the " +
        "**kernel**, over it: each output pixel is the weighted sum of the pixels under the kernel " +
        "(flip, slide, multiply, sum — now in two dimensions). This kernel is a **3×3 box blur** " +
        "($1/9$ each), so every output pixel is the **average of its nine neighbours**.\n\n" +
        "**Drag on the grid** to place the window yourself; **scroll to zoom in**, and when you're " +
        "zoomed the view follows the window as you drag. The swatch on the right is the single output " +
        "pixel this window produces.",
      narration:
        "Here's the payoff. An image is just a grid of numbers — one brightness per pixel. A two-dimensional " +
        "convolution slides a small grid of weights, the kernel, across it; each output pixel is the weighted " +
        "sum of the pixels under the kernel. This three-by-three kernel is a box blur — every weight is one " +
        "ninth, so each output pixel is the average of its nine neighbours. Drag the window around the sprite " +
        "to place it yourself, and scroll to zoom in on the pixels.",
      next: "image-blur",
    }),

    explorable({
      id: "image-blur",
      viz: { name: "conv2d", props: { image: 0, filter: 1, mode: "compare" }, persistent: true },
      controls: [
        { key: "sweep", label: "blur sweep", kind: "slider", min: 0, max: 100, step: 5, unit: "%" },
        { key: "__next", label: "continue →", kind: "button" },
      ],
      defaults: { sweep: 0 },
      goal: { key: "sweep", equals: 100 },
      task: md("**Drag the sweep to 100%.** The box blur wipes across the sprite left to right — watch the hard pixel edges soften into a smooth gradient."),
      success: md("That soft image is the box blur applied everywhere: every pixel replaced by the average of its 3×3 neighbourhood. The whole picture is *one* convolution."),
      note:
        "The sweep is just the sliding window's progress. On the left is the original sprite; on the right the " +
        "same sprite after a $3\\times3$ box-blur convolution — averaging neighbours blends the sharp edges.",
      narration:
        "Your turn. Drag the sweep all the way across. On the right, the box blur develops left to right, and " +
        "the sharp pixel edges melt into a smooth gradient. That whole softened image is a single convolution.",
      next: "image-filters",
    }),

    explorable({
      id: "image-filters",
      viz: { name: "conv2d", props: { image: 1, mode: "compare" }, persistent: true },
      controls: [
        { key: "image", label: "picture", kind: "choice", options: [
          { value: 1, label: "Einstein" },
          { value: 2, label: "City" },
          { value: 3, label: "Coffee" },
        ] },
        {
          key: "kernel", label: "kernel", kind: "matrix", rows: 3, cols: 3,
          cellKeys: ["k0", "k1", "k2", "k3", "k4", "k5", "k6", "k7", "k8"], divisorKey: "kdiv",
          presets: EDITOR_PRESETS,
        },
        { key: "zoom", label: "zoom", kind: "slider", min: 1, max: 6, step: 0.5, unit: "×" },
        { key: "__next", label: "continue →", kind: "button" },
      ],
      defaults: { image: 1, zoom: 1 },
      note:
        "**Now you hold the kernel.** The $3\\times3$ grid on the right is the actual convolution " +
        "kernel — nine weights and a divisor. **Load a preset**, or **edit any cell** to define your " +
        "own; the label reads *Custom* the moment your weights stop matching a preset. Each output " +
        "pixel is $\\left(\\sum_i w_i\\,p_i\\right)/\\text{div}$ over the $3\\times3$ neighbourhood.\n\n" +
        "Averaging kernels (weights summing to the divisor) **preserve brightness**; sharpen " +
        "**amplifies the centre**; a **gradient** kernel like Sobel-X sums to **zero**, so flat " +
        "regions vanish and only *changes* survive. *(Sobel-X here is the horizontal gradient — " +
        "signed; the summary shows the full Sobel edge **magnitude**, combining the X and Y gradients.)*",
      narration:
        "Now you hold the kernel yourself. The three-by-three grid is the actual convolution kernel — nine " +
        "weights and a divisor. Load a preset, or edit any cell to build your own; the label reads Custom as " +
        "soon as your weights leave the presets behind. Averaging kernels blur, sharpen amplifies the centre " +
        "pixel against its neighbours, and a gradient kernel like Sobel-X sums to zero, so flat areas vanish " +
        "and only changes in brightness survive. Same convolution — you choose the weights.",
      next: "summary",
    }),

    explain({
      id: "summary",
      viz: { name: "conv2d", props: { image: 1, filter: 4, mode: "compare" }, persistent: true },
      text: article(
        "**One operation, many faces.**\n\n" +
        "1. **A third way to combine** two lists — longer than add or multiply, and it mixes every pair.\n" +
        "2. **Probability**: rolling two dice, $P(\\text{sum}=n)$ is a diagonal sum — a distribution convolved with itself.\n" +
        "3. **Flip · slide · multiply · sum** — the recipe, which is just summing the diagonals of the product grid.\n" +
        "4. **Images**: a 2-D kernel sliding over a grid of pixels — **blur, sharpen, and edge-detection are all one convolution**, just different weights.\n\n" +
        "And its hidden identity — **multiplying polynomials**:\n\n" +
        "$$a * b = (1,2,3) * (4,5,6) = (4,\\,13,\\,28,\\,27,\\,18).$$\n\n" +
        "Same $\\sum_k a[k]\\,b[n-k]$ you started with — now seen five different ways.",
      ),
      narration:
        "So convolution has one operation but many faces: a third way to combine two lists, the diagonal sums " +
        "of a probability table, the flip-slide-multiply-sum recipe, the coefficients of a polynomial product, " +
        "and — sliding a kernel over an image — blur, sharpen, and edge detection. Same formula, seen five ways.",
      next: null,
    }),
  ],
};

export const lesson = defineLesson(lessonSpec);
