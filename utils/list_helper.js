const dummy = (blogs) => {
    // ...
    return (
        1
        )
  }


  const totalLikes = (blogs) => {
    var likes = 0
    blogs.map(j => likes += j.likes)
    return likes
  }


  const favoriteBlog = (blogs) => {
    var FindingmostLikes = blogs.map(object => {return object.likes})
    const mostLikes = Math.max(...FindingmostLikes)
    const theObject = blogs.find(j => j.likes === mostLikes)
    console.log(theObject)
    console.log(mostLikes)
    console.log(FindingmostLikes)
    return theObject
  }
  
  
  module.exports = {
    totalLikes,
    dummy,
    favoriteBlog
    
  }