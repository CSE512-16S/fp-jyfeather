# fp-jyfeather

## Team Members

1. Yan Jin (yanjin)

## Interactive Brain Connectivity Network
There are three main innovations in this project:

1. Graphical Lasso is implemented to convert the neuroimaging data (functional MRI) to large-scale brain connectivity network.
2. Intuition-oriented brain connectivity network analysis is provided to characterize the brain connectivity network with a small number of neurobiologically meaningful measures.
3. Visualization techniques are applied to unveil/visualize the underlying structures between brain regions using interactive interfaces.

## Running Instructions
Two ways to access interactive brain connectivity network:

1. access this link [http://cse512-16s.github.io/fp-jyfeather/](http://cse512-16s.github.io/fp-jyfeather/) with demo results.
2. download the master branch, run the file `main.R` in R with modifying the parameters, then move the result into the file `functional.json`; then run `jekyll serve`, and open the prompted web address, typically `127.0.0.1:4000`.

## Data Description
The data set is from FDG-PET images downloaded from the [ADNI](adni-info.org) website. The purpose of ADNI project is to analyze the Alzheimer's disease. So 42 anatomical volumes of interest are selected for brain connectivity modeling, as they are considered to be potentially to AD. One example of this data set could be referred to the file `PET_AD.csv`, and the nodes references could be found at `AAL_Yan.csv`.

## Storyboard
The goal is to draw an interactive brain connectivity network after the formatted data set is uploaded. There are a couple of functions that are required to implement initially.

- in the brain connectivity network, each node represents one region of interest (ROI), and each edge represent the connection between a pair of ROIs.
- using color to encode the group information of ROI.
- using thickness of edge to encode the strength of connection.
- node should be placed in specified location according to the 3D coordinates of brain atlas.
- the name of node is hidden in the beginning, and show up when mouse moves to it.
- when a new data set is uploaded, or the parameter is changed, the result of brain connectivity network should update itself.

## Changes from storyboard to final design
Basically, we implemented a half of tasks that are specified in the storyboard. There are still several works need to do:

- we do not use the 3D coordinates of brain atlas to locate the ROI in the brain connectivity network, then it is not easy to find the geographical relation within the ROIs.
- the names of ROIs (nodes) are always shown. We were trying to hide them, but failed. The result was always shown or always hidden.
- the brain connectivity network cannot easiliy update itself after the result is recalculated, until we move the result to `funtional.json` by hand.

## Development Process
The coding and debugging took the most time, since we are not familiar with the javascript programming. Specifically,

- Preparing, manipulating and parsing data (3 hours)
- brain storming (2 hours)
- initial implementation (5 hours)
- collecting suggestions and comments (1 hour)
- improvement and debugging (3 hours)
- documenting (2 hours)
