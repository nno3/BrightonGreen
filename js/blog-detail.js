document.addEventListener('DOMContentLoaded', function() {
    console.log('Blog detail page loaded');
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = localStorage.getItem('currentUser') || '';
    
    // Create comment success modal
    function createCommentSuccessModal() {
        // Check if modal already exists
        if (document.getElementById('commentSuccessModal')) return;
        
        const modalHTML = `
            <div class="modal fade" id="commentSuccessModal" tabindex="-1" aria-labelledby="commentSuccessModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title" id="commentSuccessModalLabel">Comment Posted!</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-center py-4">
                            <i class="fas fa-comments text-success" style="font-size: 4rem; margin-bottom: 1rem;"></i>
                            <h4>Your comment has been posted successfully!</h4>
                            <p class="text-muted">Thank you for sharing your thoughts!</p>
                        </div>
                        <div class="modal-footer justify-content-center">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" id="viewCommentBtn">View Comment</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listener for View Comment button
        document.getElementById('viewCommentBtn').addEventListener('click', function() {
            const commentSuccessModal = bootstrap.Modal.getInstance(document.getElementById('commentSuccessModal'));
            commentSuccessModal.hide();
            
            // Scroll to the first comment (which is the user's most recent comment)
            const firstComment = document.querySelector('.comment');
            if (firstComment) {
                firstComment.scrollIntoView({ behavior: 'smooth' });
                
                // Highlight the comment briefly
                firstComment.classList.add('comment-highlight');
                setTimeout(() => {
                    firstComment.classList.remove('comment-highlight');
                }, 2000);
            }
        });
    }
    
    // Don't reload blogs from script.js - we already have them loaded
    window.skipBlogReload = true;
    
    // Add the comment success modal to the document
    createCommentSuccessModal();
    
    // Update auth UI if script.js is loaded
    if (typeof updateAuthUI === 'function') {
        updateAuthUI();
    }
    
    // Get blog ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    // Add back button based on referrer
    addBackButton();

    if (!blogId) {
        console.error('No blog ID provided in URL');
        showError('Blog post not found. Please return to the blogs page.');
        return;
    }

    // Since we're initializing sampleBlogs directly in the HTML, we don't need to load it again
    if (!window.sampleBlogs || window.sampleBlogs.length === 0) {
        // If for some reason sampleBlogs isn't defined yet, get it from localStorage
        const storedBlogs = localStorage.getItem('blogs');
        if (!storedBlogs) {
            console.error('No blogs data found in localStorage');
            showError('Blog data not available. Please return to the blogs page.');
            return;
        }
        
        // Parse blogs data
        try {
            window.sampleBlogs = JSON.parse(storedBlogs);
            console.log('Loaded blogs from localStorage:', sampleBlogs.length);
        } catch (e) {
            console.error('Error parsing blogs data:', e);
            showError('Error loading blog data. Please try again later.');
            return;
        }
    }
    
    // Load blog content
    loadBlogContent(blogId);
});

// Function to add back button based on referrer
function addBackButton() {
    const backButtonContainer = document.getElementById('back-button-container');
    if (!backButtonContainer) return;
    
    // Check if we have a referrer stored in session storage
    const referrer = document.referrer;
    let backButtonText = 'Back to Blogs';
    let backButtonUrl = 'blogs.html';
    
    // Determine the appropriate back button text and URL based on referrer
    if (referrer.includes('all-blogs.html')) {
        backButtonText = 'Back to Blog Leaderboard';
        backButtonUrl = 'all-blogs.html';
    }
    
    // Create back button
    const backButton = document.createElement('a');
    backButton.href = backButtonUrl;
    backButton.className = 'back-button mb-4';
    backButton.innerHTML = `<i class="fas fa-arrow-left"></i> ${backButtonText}`;
    
    // Add to container
    backButtonContainer.appendChild(backButton);
}

function showError(message) {
    const blogContent = document.getElementById('blog-content');
    blogContent.innerHTML = `
        <div class="alert alert-danger" role="alert">
            <h4 class="alert-heading">Error</h4>
            <p>${message}</p>
            <hr>
            <a href="blogs.html" class="btn btn-primary">Return to Blogs</a>
        </div>
    `;
}

function loadBlogContent(blogId) {
    console.log('Loading blog content for ID:', blogId);
    
    // Find the blog in the sample data
    const blog = window.sampleBlogs.find(b => b.id === parseInt(blogId));
    
    if (!blog) {
        console.error('Blog not found with ID:', blogId);
        showError('The requested blog post could not be found.');
        return;
    }

    console.log('Found blog:', blog.title);
    
    // Get the current user name from localStorage (if available)
    const currentUser = localStorage.getItem('currentUser') || '';

    // Check if this is the author's blog to show edit/delete options
    const isAuthor = blog.author === currentUser;
    
    // Update page title
    document.title = `${blog.title} - Brighton City Breaks`;

    // Initialize current image index if multiple images exist
    blog.currentImageIndex = 0;
    
    // Create blog content HTML
    const blogContent = document.getElementById('blog-content');
    blogContent.innerHTML = `
        <article class="blog-post">
            <div class="blog-image">
                <img src="${blog.image}" alt="Photo for blog: ${blog.title} - ${blog.shortDescription || 'Brighton experience shared by a visitor'}" class="img-fluid blog-detail-image" data-blog-id="${blog.id}">
                ${blog.images && blog.images.length > 1 ? `
                    <div class="blog-carousel-controls">
                        <button class="blog-carousel-btn prev-image" onclick="navigateDetailImages(${blog.id}, 'prev')" aria-label="View previous image">
                            <i class="fas fa-chevron-left" aria-hidden="true"></i>
                        </button>
                        <button class="blog-carousel-btn next-image" onclick="navigateDetailImages(${blog.id}, 'next')" aria-label="View next image">
                            <i class="fas fa-chevron-right" aria-hidden="true"></i>
                        </button>
                    </div>
                    <div class="image-count" aria-live="polite">
                        <i class="fas fa-images" aria-hidden="true"></i> <span class="current-image-index">1</span>/${blog.images.length}
                    </div>
                ` : ''}
                <div class="blog-likes">
                    <button class="like-button ${isBlogLiked(blog.id) ? 'liked' : ''}" onclick="toggleLike(${blog.id})" aria-label="${isBlogLiked(blog.id) ? 'Unlike this blog' : 'Like this blog'}">
                        <i class="fas fa-heart" aria-hidden="true"></i>
                        <span class="like-count">${blog.likes}</span>
                    </button>
                </div>
            </div>
            <div class="blog-content">
                <div class="d-flex justify-content-between align-items-start">
                    <h1 class="blog-title">${blog.title}</h1>
                    ${isAuthor ? `
                        <div class="blog-actions-buttons">
                            <button class="btn btn-sm btn-outline-primary edit-blog-btn" onclick="editBlog(${blog.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-sm btn-outline-danger delete-blog-btn" onclick="deleteBlog(${blog.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    ` : ''}
                </div>
                <div class="blog-meta">
                    <div class="blog-author">
                        <i class="fas fa-user"></i> ${blog.author}
                    </div>
                    <div class="blog-date">
                        <i class="fas fa-calendar"></i> ${formatDate(blog.date)}
                    </div>
                </div>
                <div class="blog-text">
                    ${blog.fullContent ? blog.fullContent.replace(/\n/g, '<br>') : blog.content}
                </div>
            </div>
        </article>
    `;

    // Load comments
    loadComments(blog.id);
}

function loadComments(blogId) {
    console.log('Loading comments for blog ID:', blogId);
    
    const commentsList = document.getElementById('comments-list');
    const blog = window.sampleBlogs.find(b => b.id === parseInt(blogId));
    
    // Get the current user name from localStorage (if available)
    const currentUser = localStorage.getItem('currentUser') || '';
    
    if (!blog.comments || blog.comments.length === 0) {
        commentsList.innerHTML = '<p class="text-muted">No comments yet. Be the first to comment!</p>';
        return;
    }

    commentsList.innerHTML = blog.comments.map((comment, index) => {
        const isCommentAuthor = (comment.name || comment.author) === currentUser;
        
        return `
            <div class="comment mb-3" data-comment-index="${index}">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <h6 class="card-subtitle mb-2 text-muted">${comment.name || comment.author}</h6>
                            ${isCommentAuthor ? `
                                <div class="comment-actions">
                                    <button class="btn btn-sm btn-link edit-comment-btn" onclick="editComment(${blogId}, ${index})">
                                        <i class="fas fa-edit"></i> Edit
                                    </button>
                                    <button class="btn btn-sm btn-link text-danger delete-comment-btn" onclick="deleteComment(${blogId}, ${index})">
                                        <i class="fas fa-trash"></i> Delete
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                        <p class="card-text">${comment.text}</p>
                        <small class="text-muted">${formatDate(comment.date)}</small>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Edit blog function
function editBlog(blogId) {
    const blog = window.sampleBlogs.find(b => b.id === parseInt(blogId));
    if (!blog) return;
    
    // Create edit modal if it doesn't exist yet
    if (!document.getElementById('editBlogModal')) {
        const editModalHTML = `
            <div class="modal fade" id="editBlogModal" tabindex="-1" aria-labelledby="editBlogModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editBlogModalLabel">Edit Your Blog</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="edit-blog-form">
                                <div class="mb-3">
                                    <label for="edit-blog-title" class="form-label">Title</label>
                                    <input type="text" class="form-control" id="edit-blog-title" required>
                                </div>
                                <div class="mb-3">
                                    <label for="edit-blog-content" class="form-label">Content</label>
                                    <textarea class="form-control" id="edit-blog-content" rows="10" required></textarea>
                                </div>
                                <input type="hidden" id="edit-blog-id">
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="save-blog-edit-btn">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', editModalHTML);
        
        // Add event listener for the save button
        document.getElementById('save-blog-edit-btn').addEventListener('click', saveBlogEdit);
    }
    
    // Populate the form with current blog data
    document.getElementById('edit-blog-title').value = blog.title;
    document.getElementById('edit-blog-content').value = blog.fullContent || blog.content;
    document.getElementById('edit-blog-id').value = blog.id;
    
    // Show the modal
    const editBlogModal = new bootstrap.Modal(document.getElementById('editBlogModal'));
    editBlogModal.show();
}

// Save blog edits
function saveBlogEdit() {
    const blogId = parseInt(document.getElementById('edit-blog-id').value);
    const title = document.getElementById('edit-blog-title').value;
    const content = document.getElementById('edit-blog-content').value;
    
    if (!title || !content) {
        alert('Please fill in all fields');
        return;
    }
    
    const blog = window.sampleBlogs.find(b => b.id === blogId);
    if (blog) {
        blog.title = title;
        blog.content = content.substring(0, 200) + (content.length > 200 ? '...' : '');
        blog.fullContent = content;
        
        // Save to localStorage
        localStorage.setItem('blogs', JSON.stringify(window.sampleBlogs));
        
        // Close the modal
        bootstrap.Modal.getInstance(document.getElementById('editBlogModal')).hide();
        
        // Reload blog content
        loadBlogContent(blogId);
    }
}

// Delete blog function
function deleteBlog(blogId) {
    if (confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
        const index = window.sampleBlogs.findIndex(b => b.id === parseInt(blogId));
        if (index !== -1) {
            window.sampleBlogs.splice(index, 1);
            
            // Save to localStorage
            localStorage.setItem('blogs', JSON.stringify(window.sampleBlogs));
            
            // Redirect to blogs page
            window.location.href = 'blogs.html';
        }
    }
}

// Edit comment function
function editComment(blogId, commentIndex) {
    const blog = window.sampleBlogs.find(b => b.id === parseInt(blogId));
    if (!blog || !blog.comments || !blog.comments[commentIndex]) return;
    
    const comment = blog.comments[commentIndex];
    
    // Create edit comment modal if it doesn't exist yet
    if (!document.getElementById('editCommentModal')) {
        const editCommentModalHTML = `
            <div class="modal fade" id="editCommentModal" tabindex="-1" aria-labelledby="editCommentModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="editCommentModalLabel">Edit Your Comment</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="edit-comment-form">
                                <div class="mb-3">
                                    <label for="edit-comment-text" class="form-label">Comment</label>
                                    <textarea class="form-control" id="edit-comment-text" rows="4" required></textarea>
                                </div>
                                <input type="hidden" id="edit-comment-blog-id">
                                <input type="hidden" id="edit-comment-index">
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="save-comment-edit-btn">Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', editCommentModalHTML);
        
        // Add event listener for the save button
        document.getElementById('save-comment-edit-btn').addEventListener('click', saveCommentEdit);
    }
    
    // Populate the form with current comment data
    document.getElementById('edit-comment-text').value = comment.text;
    document.getElementById('edit-comment-blog-id').value = blogId;
    document.getElementById('edit-comment-index').value = commentIndex;
    
    // Show the modal
    const editCommentModal = new bootstrap.Modal(document.getElementById('editCommentModal'));
    editCommentModal.show();
}

// Save comment edits
function saveCommentEdit() {
    const blogId = parseInt(document.getElementById('edit-comment-blog-id').value);
    const commentIndex = parseInt(document.getElementById('edit-comment-index').value);
    const text = document.getElementById('edit-comment-text').value;
    
    if (!text) {
        alert('Please enter your comment');
        return;
    }
    
    const blog = window.sampleBlogs.find(b => b.id === blogId);
    if (blog && blog.comments && blog.comments[commentIndex]) {
        blog.comments[commentIndex].text = text;
        blog.comments[commentIndex].edited = true;
        
        // Save to localStorage
        localStorage.setItem('blogs', JSON.stringify(window.sampleBlogs));
        
        // Close the modal
        bootstrap.Modal.getInstance(document.getElementById('editCommentModal')).hide();
        
        // Reload comments
        loadComments(blogId);
    }
}

// Delete comment function
function deleteComment(blogId, commentIndex) {
    if (confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
        const blog = window.sampleBlogs.find(b => b.id === parseInt(blogId));
        if (blog && blog.comments && blog.comments[commentIndex]) {
            blog.comments.splice(commentIndex, 1);
            
            // Save to localStorage
            localStorage.setItem('blogs', JSON.stringify(window.sampleBlogs));
            
            // Reload comments
            loadComments(blogId);
        }
    }
}

// Handle comment submission
document.getElementById('comment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        if (confirm('You need to sign in to add a comment. Would you like to sign in now?')) {
            // Save current URL to return after login
            localStorage.setItem('returnUrl', window.location.href);
            window.location.href = 'signUp.html';
        }
        return;
    }
    
    const nameInput = document.getElementById('comment-name');
    const textInput = document.getElementById('comment-text');
    
    // Use the logged in username
    const name = localStorage.getItem('currentUser');
    const text = textInput.value;
    
    if (!name || !text) {
        alert('Please fill in all fields');
        return;
    }
    
    // Pre-populate the name field with the current user's name
    if (nameInput) {
        nameInput.value = name;
        // Make the field readonly since we're using the logged-in user's name
        nameInput.readOnly = true;
    }
    
    const comment = {
        name: name,
        text: text,
        date: new Date().toISOString()
    };

    // Add comment to the blog
    const blogId = new URLSearchParams(window.location.search).get('id');
    const blog = window.sampleBlogs.find(b => b.id === parseInt(blogId));
    
    if (blog) {
        if (!blog.comments) {
            blog.comments = [];
        }
        blog.comments.unshift(comment);
        
        // Save to localStorage
        localStorage.setItem('blogs', JSON.stringify(window.sampleBlogs));
        
        // Reload comments
        loadComments(blog.id);
        
        // Clear form
        textInput.value = '';
        
        // Show success modal
        const commentSuccessModal = new bootstrap.Modal(document.getElementById('commentSuccessModal'));
        commentSuccessModal.show();
    }
});

// Helper function to format dates
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Helper function to check if a blog is liked
function isBlogLiked(blogId) {
    const likedBlogs = JSON.parse(localStorage.getItem('likedBlogs') || '[]');
    return likedBlogs.includes(parseInt(blogId));
}

// Toggle like status
function toggleLike(blogId) {
    const likedBlogs = JSON.parse(localStorage.getItem('likedBlogs') || '[]');
    const blog = window.sampleBlogs.find(b => b.id === parseInt(blogId));
    
    if (!blog) return;

    const index = likedBlogs.indexOf(parseInt(blogId));
    if (index === -1) {
        // Like the blog
        likedBlogs.push(parseInt(blogId));
        blog.likes++;
    } else {
        // Unlike the blog
        likedBlogs.splice(index, 1);
        blog.likes--;
    }

    // Update localStorage
    localStorage.setItem('likedBlogs', JSON.stringify(likedBlogs));
    localStorage.setItem('blogs', JSON.stringify(window.sampleBlogs));

    // Update UI
    const likeButton = document.querySelector('.like-button');
    const likeCount = document.querySelector('.like-count');
    
    likeButton.classList.toggle('liked');
    likeCount.textContent = blog.likes;
}

// Function to navigate through blog detail images
function navigateDetailImages(blogId, direction) {
    const blog = window.sampleBlogs.find(b => b.id === parseInt(blogId));
    if (!blog || !blog.images || blog.images.length <= 1) return;
    
    // Update current image index based on direction
    if (direction === 'next') {
        blog.currentImageIndex = (blog.currentImageIndex + 1) % blog.images.length;
    } else {
        blog.currentImageIndex = (blog.currentImageIndex - 1 + blog.images.length) % blog.images.length;
    }
    
    // Update image source
    const imgElement = document.querySelector(`.blog-detail-image[data-blog-id="${blogId}"]`);
    if (imgElement) {
        imgElement.src = blog.images[blog.currentImageIndex];
    }
    
    // Update image counter
    const counterElement = document.querySelector('.current-image-index');
    if (counterElement) {
        counterElement.textContent = blog.currentImageIndex + 1;
    }

    // Update alt text with image number for better screen reader experience
    imgElement.alt = `Photo ${blog.currentImageIndex + 1} of ${blog.images.length} for blog: ${blog.title} - ${blog.shortDescription || 'Brighton experience'}`;
}

// Make functions globally available
window.editBlog = editBlog;
window.deleteBlog = deleteBlog;
window.editComment = editComment;
window.deleteComment = deleteComment;
window.navigateDetailImages = navigateDetailImages;

// Function to update blog image and refresh display
window.updateBlogImage = function(blogId, newImageUrl) {
    // Find the blog by ID
    const blog = window.sampleBlogs.find(b => b.id === parseInt(blogId));
    if (!blog) {
        console.error('Blog not found with ID:', blogId);
        return false;
    }
    
    // Update the image URLs
    blog.image = newImageUrl;
    
    // If the blog has an images array, update the first image or add it
    if (blog.images && blog.images.length > 0) {
        blog.images[0] = newImageUrl;
    } else {
        blog.images = [newImageUrl];
    }
    
    // Save to localStorage
    localStorage.setItem('blogs', JSON.stringify(window.sampleBlogs));
    
    // Refresh the display - reload the blog content
    loadBlogContent(blogId);
    
    return true;
};

// Initialize sampleBlogs from localStorage if available
let sampleBlogs = [];
const storedBlogs = localStorage.getItem('blogs');
if (storedBlogs) {
    sampleBlogs = JSON.parse(storedBlogs);
} else {
    // Sample fallback data in case localStorage is empty
    sampleBlogs = [
        {
            id: 1,
            title: "A Perfect Weekend in Brighton",
            author: "Sarah Johnson",
            date: "2023-06-15",
            content: "My weekend in Brighton was absolutely amazing! I started with a stroll along the iconic Brighton Pier, followed by a visit to the Royal Pavilion. The architecture is breathtaking, and the gardens are so peaceful. I highly recommend trying the local seafood at one of the restaurants along the beachfront.",
            fullContent: "My weekend in Brighton was absolutely amazing! I started with a stroll along the iconic Brighton Pier, followed by a visit to the Royal Pavilion. The architecture is breathtaking, and the gardens are so peaceful. I highly recommend trying the local seafood at one of the restaurants along the beachfront.\n\nOn my second day, I explored the North Laine area, which is full of quirky shops and cafes. I spent hours browsing the vintage stores and enjoying coffee at local spots. The street art around the city is also worth checking out.\n\nFor dinner, I tried the local seafood at one of the restaurants along the beachfront. The fish and chips were the best I've ever had! I also visited the Brighton Marina and took a boat tour. The sunset views from the marina are spectacular!\n\nOn my last day, I visited Preston Park, which is beautiful, and enjoyed a picnic there. I also visited the Brighton Open Air Theatre and caught a show. The combination of nature and culture makes Brighton unique.",
            image: "images/Brighton-Palace-Pier.jpg",
            images: ["images/Brighton-Palace-Pier.jpg"],
            likes: 42,
            comments: [
                { name: "John Smith", date: "2023-06-16", text: "Great post! I'm planning to visit Brighton next month." },
                { name: "Emma Davis", date: "2023-06-17", text: "The Royal Pavilion is definitely a must-see!" }
            ]
        },
        {
            id: 2,
            title: "Exploring Brighton's Hidden Gems",
            author: "Michael Brown",
            date: "2023-06-10",
            content: "I discovered so many hidden gems during my weekend in Brighton! The North Laine area is full of quirky shops and cafes. I spent hours browsing the vintage stores and enjoying coffee at local spots. The street art around the city is also worth checking out.",
            fullContent: "I discovered so many hidden gems during my weekend in Brighton! The North Laine area is full of quirky shops and cafes. I spent hours browsing the vintage stores and enjoying coffee at local spots. The street art around the city is also worth checking out.\n\nOne of my favorite finds was a small bookshop tucked away in a side street. The owner was incredibly knowledgeable about local history and recommended several books about Brighton's past. I also found a vintage clothing store where I picked up a unique jacket that's now my favorite piece of clothing.\n\nFor lunch, I stumbled upon a tiny cafe that served the most amazing homemade cakes. The owner told me the recipe had been in her family for generations. I also visited the Brighton Open Market, which is a great place to find local produce and handmade crafts.\n\nIn the evening, I discovered a small jazz club that wasn't in any of the tourist guides. The atmosphere was incredible, and I met several locals who shared their favorite spots in the city. It was a perfect end to a day of exploration.",
            image: "images/North_laine.jpeg",
            images: ["images/North_laine.jpeg"],
            likes: 38,
            comments: [
                { name: "Lisa Johnson", date: "2023-06-11", text: "I love the North Laine area too! So many unique shops." }
            ]
        },
        {
            id: 3,
            title: "Brighton Beach and Beyond",
            author: "Emma Wilson",
            date: "2023-06-05",
            content: "The pebble beach in Brighton is unlike any other beach I've visited. I spent a morning just sitting and listening to the waves. In the afternoon, I explored the Brighton Marina and took a boat tour. The sunset views from the marina are spectacular!",
            fullContent: "The pebble beach in Brighton is unlike any other beach I've visited. I spent a morning just sitting and listening to the waves. In the afternoon, I explored the Brighton Marina and took a boat tour. The sunset views from the marina are spectacular!\n\nI started my day early with a walk along the beach. The sound of the pebbles underfoot and the waves crashing against the shore was incredibly peaceful. I found a quiet spot to sit and just take in the beauty of the sea. The morning light made everything look magical.\n\nAfter lunch, I headed to the Brighton Marina. It's much larger than I expected, with plenty of shops, restaurants, and activities. I booked a boat tour that took us along the coast, offering stunning views of the cliffs and the city from the water. The guide was very informative, sharing interesting facts about the area's history and marine life.\n\nAs the day drew to a close, I found a spot at one of the marina's restaurants to watch the sunset. The sky turned beautiful shades of orange and pink, reflecting off the water. It was the perfect end to a perfect day.",
            image: "images/Background.jpg",
            images: ["images/Background.jpg"],
            likes: 35,
            comments: [
                { name: "David Miller", date: "2023-06-06", text: "The sunset at the marina is indeed spectacular!" },
                { name: "Sophie Brown", date: "2023-06-07", text: "I love the pebble beach too. It's so unique!" }
            ]
        }
    ];
    // Save the sample data to localStorage
    localStorage.setItem('blogs', JSON.stringify(sampleBlogs));
}