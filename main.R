rm(list = ls())

setwd("./Downloads/a3/")


# --------------- Function Defintion -----------------
### convert inverse covariance matrix to links
wi2link <- function(mat) {
  mat <- abs(mat)
  diag(mat) <- 0
  min <- min(mat)
  max <- max(mat)
  links <- data.frame(from = NA, to = NA, weight = NA)
  for (i in 1:nrow(mat)) {
    for (j in 1:ncol(mat)) {
      if (mat[i,j] != 0 & i != j) {
        links <- rbind(links, c(i-1,j-1,range01(mat[i,j],min,max)))
      } 
    } 
  }
  return(links[-1,])
}

### scale to range [0,1]
range01 <- function(var, min, max) {
  res <- (var-min)/(max-min)
  return(res)
}

# ---------------- Prepare Links -----------------------
nodes <- read.table(file = "./Documents/github/fp-jyfeather/AAL_Yan.csv", sep = ",", header = T)
dat.org <- read.table(file = "PET_AD.csv", sep = ",", header = T)
dat.nodes <- dat.org[,nodes$name]

library(glasso)
res.wi <- glasso(s = cov(dat.nodes), rho = 0.003)$wi
res.links <- wi2link(res.wi)
res.links <- res.links[which(res.links$weight>=0.3),]
dim(res.links)

# --------------- networkD3 Visualization --------------------
library(networkD3)
vis <- forceNetwork(Nodes = nodes, Links = res.links,
                    Source = "from", Target = "to",
                    Value = "weight", NodeID = "name",
                    Group = "region", zoom = TRUE)
saveNetwork(vis, file = "main.html")

# -------------- Prepare Coordinates -------------------
dat.cord <- read.table(file = "./Documents/github/fp-jyfeather/BrainRegions.csv", sep = ";")
