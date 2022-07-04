// solution goes here



type CommentData = {
    id: number
    content: string
    imageId: number
  }
  
  type Image = {
    id: number
    title: string
    likes: number
    image: string
    comments: CommentData[]
  }
  
  type State = {
    images: Image[]
  }
  
  let state: State = {
    images: []
  }
  
  // Q: What images do I have? state.images
  
  function getImagesFromServer () {
    fetch('http://localhost:4000/images')
      .then(resp => resp.json())
      .then(imagesFromServer => {
        state.images = imagesFromServer
        render()
      })
  }
  
  function updateImage (image:Image) {
    return fetch(`http://localhost:4000/images/${image.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(image)
    }).then(resp => resp.json())
  }
  
  function render () {
    let imageContainer = document.querySelector<HTMLElement>('.image-container')
    if (imageContainer === null) return
    imageContainer.textContent = ''
  
    for (let image of state.images) {
      let articleEl = document.createElement('article')
      articleEl.className = 'image-card'
  
      let titleEl = document.createElement('h2')
      titleEl.className = 'title'
      titleEl.textContent = image.title
  
      let imgEl = document.createElement('img')
      imgEl.className = 'image'
      imgEl.src = image.image
  
      let likesSection = document.createElement('div')
      likesSection.className = 'likes-section'
  
      let likesSpan = document.createElement('span')
      likesSpan.className = 'likes'
      likesSpan.textContent = `${image.likes} likes`
  
      let likeBtn = document.createElement('button')
      likeBtn.className = 'like-button'
      likeBtn.textContent = '♥'
      likeBtn.addEventListener('click', function () {
        // updating state
        image.likes++
  
        // updating the server
        updateImage(image)
  
        // updating the page
        render()
      })
  
      let commentsUl = document.createElement('ul')
      commentsUl.className = 'comments'
  
      for (let comment of image.comments) {
        let commentLi = document.createElement('li')
        commentLi.textContent = comment.content
        commentsUl.append(commentLi)
      }
      let formEl = document.createElement('form')
      formEl.className = 'comment-form'
      let inp = document.createElement('input')
      inp.className = 'comment-input'
      inp.type = 'text'
      inp.name = 'comment'
      inp.placeholder = 'Add a comment...'
      let btnsub = document.createElement('button')
      btnsub.className = 'comment-button'
      btnsub.type = 'submit'
      btnsub.textContent = 'Post'
      likesSection.append(likesSpan, likeBtn)
      formEl.append(inp, btnsub)
      articleEl.append(titleEl, imgEl, likesSection, commentsUl, formEl)
  
      imageContainer.append(articleEl)
    }
  }
  
  getImagesFromServer()
  render()
