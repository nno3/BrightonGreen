// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Sample blog data (in a real application, this would come from a database)
    // Check if blogs data already exists in localStorage
    let blogs = [];
    const storedBlogs = localStorage.getItem('blogs');
    
    if (storedBlogs) {
        // Use stored blogs if available
        blogs = JSON.parse(storedBlogs);
        
        // Ensure each blog has a currentImageIndex
        blogs.forEach(blog => {
            if (typeof blog.currentImageIndex === 'undefined') {
                blog.currentImageIndex = 0;
            }
        });
        
        // Save back to localStorage
        localStorage.setItem('blogs', JSON.stringify(blogs));
    } else {
        // Otherwise initialize with sample data
        blogs = [
            {
                id: 1,
                title: "A Perfect Weekend in Brighton",
                author: "Sarah Johnson",
                date: "2023-06-15",
                content: "My weekend in Brighton was absolutely amazing! I started with a stroll along the iconic Brighton Pier, followed by a visit to the Royal Pavilion. The architecture is breathtaking, and the gardens are so peaceful. I highly recommend trying the local seafood at one of the restaurants along the beachfront.",
                fullContent: "My weekend in Brighton was absolutely amazing! I started with a stroll along the iconic Brighton Pier, followed by a visit to the Royal Pavilion. The architecture is breathtaking, and the gardens are so peaceful. I highly recommend trying the local seafood at one of the restaurants along the beachfront.\n\nOn my second day, I explored the North Laine area, which is full of quirky shops and cafes. I spent hours browsing the vintage stores and enjoying coffee at local spots. The street art around the city is also worth checking out.\n\nFor dinner, I tried the local seafood at one of the restaurants along the beachfront. The fish and chips were the best I've ever had! I also visited the Brighton Marina and took a boat tour. The sunset views from the marina are spectacular!\n\nOn my last day, I visited Preston Park, which is beautiful, and enjoyed a picnic there. I also visited the Brighton Open Air Theatre and caught a show. The combination of nature and culture makes Brighton unique.",
                image: "images/Brighton-Palace-Pier.jpg",
                images: ["images/Brighton-Palace-Pier.jpg"],
                currentImageIndex: 0,
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
                currentImageIndex: 0,
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
                image: "images/brighton_beach.jpg",
                images: ["images/brighton_beach.jpg"],
                currentImageIndex: 0,
                likes: 35,
                comments: [
                    { name: "David Miller", date: "2023-06-06", text: "The sunset at the marina is indeed spectacular!" },
                    { name: "Sophie Brown", date: "2023-06-07", text: "I love the pebble beach too. It's so unique!" }
                ]
            },
            {
                id: 4,
                title: "A Foodie's Guide to Brighton",
                author: "David Lee",
                date: "2023-05-28",
                content: "Brighton's food scene is incredible! I tried everything from traditional fish and chips to international cuisine. The Open Market is a must-visit for food lovers. I also took a cooking class at a local restaurant and learned to make some Brighton specialties.",
                fullContent: "Brighton's food scene is incredible! I tried everything from traditional fish and chips to international cuisine. The Open Market is a must-visit for food lovers. I also took a cooking class at a local restaurant and learned to make some Brighton specialties.\n\nMy culinary adventure began with breakfast at a small cafe in the Lanes. The avocado toast was perfectly prepared, and the coffee was some of the best I've ever had. The owner told me they source their beans from a local roastery, which explains the amazing flavor.\n\nFor lunch, I headed to the Open Market, which is a food lover's paradise. I sampled various local cheeses, fresh bread, and artisanal chocolates. I also picked up some ingredients for a picnic later in the day. The market vendors were friendly and happy to share their knowledge about their products.\n\nIn the afternoon, I took a cooking class at a local restaurant. The chef taught us how to make traditional Brighton fish and chips, as well as some other local specialties. It was a hands-on experience, and I learned techniques I can use at home. The best part was getting to eat what we cooked!\n\nFor dinner, I tried a restaurant that specializes in international cuisine. The menu featured dishes from around the world, all with a Brighton twist. I particularly enjoyed the seafood paella, which incorporated local ingredients.\n\nMy food journey in Brighton was a highlight of my trip, and I can't wait to return and try more of the city's culinary offerings.",
                image: "images/Open-Market1.jpg",
                images: ["images/Open-Market1.jpg","images/Open-Market2.jpg"],
                currentImageIndex: 0,
                likes: 29,
                comments: [
                    { name: "James Wilson", date: "2023-05-29", text: "The Open Market is my favorite place in Brighton!" },
                    { name: "Maria Garcia", date: "2023-05-30", text: "I'd love to take that cooking class next time I visit." }
                ]
            },
            {
                id: 5,
                title: "Brighton's Green Spaces",
                author: "Lisa Chen",
                date: "2023-05-20",
                content: "I was pleasantly surprised by how many green spaces Brighton has to offer. Preston Park is beautiful, and I enjoyed a picnic there. I also visited the Brighton Open Air Theatre and caught a show. The combination of nature and culture makes Brighton unique.",
                fullContent: "I was pleasantly surprised by how many green spaces Brighton has to offer. Preston Park is beautiful, and I enjoyed a picnic there. I also visited the Brighton Open Air Theatre and caught a show. The combination of nature and culture makes Brighton unique.\n\nMy exploration of Brighton's green spaces began at Preston Park, which is the largest urban park in the city. The park features beautiful gardens, a playground, and plenty of open space for picnics and activities. I spent a morning there, enjoying the peaceful atmosphere and watching people go about their day.\n\nNext, I visited the Brighton Open Air Theatre, which is located in a natural amphitheater. The setting is magical, with trees surrounding the stage and the sky as the backdrop. I was lucky enough to catch a performance of Shakespeare's 'A Midsummer Night's Dream,' which was enhanced by the natural setting.\n\nI also explored the Royal Pavilion Gardens, which are meticulously maintained and offer a perfect blend of formal and informal landscaping. The gardens provide a beautiful setting for the Royal Pavilion and are a great place to relax and take in the architecture.\n\nAnother highlight was the Brighton and Hove Seafront, which features a promenade lined with trees and gardens. I took a long walk along the seafront, enjoying the sea breeze and the views of the beach and the city.\n\nMy visit to Brighton's green spaces showed me that the city offers a perfect balance of urban and natural environments. The parks and gardens provide a welcome escape from the hustle and bustle of the city, while the cultural venues set in natural settings offer a unique experience.",
                image: "images/open-air-theatre.jpeg",
                images: ["images/open-air-theatre.jpeg"],
                currentImageIndex: 0,
                likes: 27,
                comments: [
                    { name: "Tom Harris", date: "2023-05-21", text: "Preston Park is my favorite place to relax in Brighton." },
                    { name: "Sarah Thompson", date: "2023-05-22", text: "The Open Air Theatre is amazing! I saw a play there last summer." }
                ]
            }
        ];
        
        // Store the initial data in localStorage
        localStorage.setItem('blogs', JSON.stringify(blogs));
    }

    // Store liked blogs in localStorage if not already there
    if (!localStorage.getItem('likedBlogs')) {
        localStorage.setItem('likedBlogs', JSON.stringify([]));
    }
    let likedBlogs = JSON.parse(localStorage.getItem('likedBlogs')) || [];
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentUser = localStorage.getItem('currentUser') || '';

    // Create user info display
    const createUserInfoDisplay = () => {
        const usernameDisplay = document.createElement('div');
        usernameDisplay.className = 'username-display mb-3';
        
        if (isLoggedIn && currentUser) {
            usernameDisplay.innerHTML = `
                <p class="mb-1">Logged in as: <strong>${currentUser}</strong></p>
            `;
        } else {
            usernameDisplay.innerHTML = `
                <p class="mb-1">Please <a href="signUp.html">sign in</a> to add blogs or comments.</p>
            `;
        }
        
        return usernameDisplay;
    };

    // Function to render blog cards
    function renderBlogs() {
        const blogCardsContainer = document.getElementById('blog-cards-container');
        blogCardsContainer.innerHTML = '';

        blogs.forEach(blog => {
            const isLiked = likedBlogs.includes(blog.id);
            const isAuthor = blog.author === currentUser;
            
            // Store the current image index for this blog
            blog.currentImageIndex = 0;
            
            const blogCard = document.createElement('div');
            blogCard.className = 'blog-card';
            blogCard.innerHTML = `
                <div class="blog-image">
                    <img src="${blog.image}" alt="${blog.title}" class="blog-card-image" data-blog-id="${blog.id}">
                    ${blog.images && blog.images.length > 1 ? `
                        <div class="blog-carousel-controls">
                            <button class="blog-carousel-btn prev-image" data-blog-id="${blog.id}">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button class="blog-carousel-btn next-image" data-blog-id="${blog.id}">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    ` : ''}
                    <div class="blog-likes">
                        <button class="like-button ${isLiked ? 'liked' : ''}" data-blog-id="${blog.id}">
                            <i class="fas fa-heart"></i>
                            <span class="like-count">${blog.likes}</span>
                        </button>
                    </div>
                    ${blog.images && blog.images.length > 1 ? 
                        `<div class="image-count">
                            <i class="fas fa-images"></i> <span class="current-image-index">1</span>/${blog.images.length}
                        </div>` : ''}
                </div>
                <div class="blog-content">
                    <div class="d-flex justify-content-between align-items-start">
                        <h3 class="blog-title">${blog.title}</h3>
                        ${isAuthor ? `
                            <div class="blog-actions-buttons">
                                <button class="btn btn-sm btn-outline-primary edit-blog-btn" data-blog-id="${blog.id}">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger delete-blog-btn" data-blog-id="${blog.id}">
                                    <i class="fas fa-trash"></i>
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
                    <p class="blog-text">${blog.content}</p>
                    <div class="blog-actions">
                        <a href="blog-detail.html?id=${blog.id}" class="btn btn-outline-primary read-more-btn">Read More</a>
                    </div>
                </div>
            `;
            blogCardsContainer.appendChild(blogCard);
        });

        // Add event listeners to like buttons
        document.querySelectorAll('.like-button').forEach(button => {
            button.addEventListener('click', handleLike);
        });
        
        // Add event listeners to edit buttons
        document.querySelectorAll('.edit-blog-btn').forEach(button => {
            button.addEventListener('click', function() {
                const blogId = parseInt(this.getAttribute('data-blog-id'));
                editBlog(blogId);
            });
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-blog-btn').forEach(button => {
            button.addEventListener('click', function() {
                const blogId = parseInt(this.getAttribute('data-blog-id'));
                deleteBlog(blogId);
            });
        });
        
        // Add event listeners for image carousel controls
        document.querySelectorAll('.prev-image').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                navigateImages(parseInt(this.getAttribute('data-blog-id')), 'prev');
            });
        });
        
        document.querySelectorAll('.next-image').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                navigateImages(parseInt(this.getAttribute('data-blog-id')), 'next');
            });
        });
    }

    // Function to navigate through blog images
    function navigateImages(blogId, direction) {
        const blog = blogs.find(b => b.id === blogId);
        if (!blog || !blog.images || blog.images.length <= 1) return;
        
        // Update current image index based on direction
        if (direction === 'next') {
            blog.currentImageIndex = (blog.currentImageIndex + 1) % blog.images.length;
        } else {
            blog.currentImageIndex = (blog.currentImageIndex - 1 + blog.images.length) % blog.images.length;
        }
        
        // Update image source
        const imgElement = document.querySelector(`.blog-card-image[data-blog-id="${blogId}"]`);
        if (imgElement) {
            imgElement.src = blog.images[blog.currentImageIndex];
        }
        
        // Update image counter
        const counterElement = imgElement.closest('.blog-image').querySelector('.current-image-index');
        if (counterElement) {
            counterElement.textContent = blog.currentImageIndex + 1;
        }
    }

    // Function to render leaderboard
    function renderLeaderboard() {
        const leaderboardList = document.getElementById('leaderboard-list');
        if (!leaderboardList) return;
        
        // Sort blogs by likes (descending)
        const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
        
        // Take top 5 for leaderboard
        const topBlogs = sortedBlogs.slice(0, 5);
        
        // Clear existing content
        leaderboardList.innerHTML = '';
        
        // Add each blog to leaderboard
        topBlogs.forEach((blog, index) => {
            const leaderboardItem = document.createElement('div');
            leaderboardItem.className = 'leaderboard-item';
            leaderboardItem.innerHTML = `
                <div class="leaderboard-rank">${index + 1}</div>
                <div class="leaderboard-content">
                    <div class="leaderboard-blog-title">${blog.title}</div>
                    <div class="leaderboard-blog-author">by ${blog.author}</div>
                </div>
                <div class="leaderboard-likes">
                    <i class="fas fa-heart"></i> ${blog.likes}
                </div>
            `;
            
            // Add click event to navigate to blog detail
            leaderboardItem.addEventListener('click', function() {
                window.location.href = `blog-detail.html?id=${blog.id}`;
            });
            
            leaderboardList.appendChild(leaderboardItem);
        });
        
        // Add "View Full Leaderboard" button
        const viewAllButton = document.createElement('div');
        viewAllButton.className = 'text-center mt-3';
        viewAllButton.innerHTML = `
            <a href="all-blogs.html" class="btn btn-outline-primary btn-sm">
                <i class="fas fa-list me-1"></i> View Full Leaderboard
            </a>
        `;
        leaderboardList.appendChild(viewAllButton);
    }

    // Function to handle like button clicks
    function handleLike(event) {
        const button = event.currentTarget;
        const blogId = parseInt(button.dataset.blogId);
        const blog = blogs.find(b => b.id === blogId);
        
        if (blog) {
            const isLiked = likedBlogs.includes(blogId);
            
            if (isLiked) {
                // Unlike
                blog.likes--;
                likedBlogs = likedBlogs.filter(id => id !== blogId);
                button.classList.remove('liked');
            } else {
                // Like
                blog.likes++;
                likedBlogs.push(blogId);
                button.classList.add('liked');
            }
            
            // Update like count
            button.querySelector('.like-count').textContent = blog.likes;
            
            // Save liked blogs to localStorage
            localStorage.setItem('likedBlogs', JSON.stringify(likedBlogs));
            localStorage.setItem('blogs', JSON.stringify(blogs));
            
            // Update leaderboard
            renderLeaderboard();
        }
    }
    
    // Edit blog function
    function editBlog(blogId) {
        const blog = blogs.find(b => b.id === parseInt(blogId));
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
        
        const blog = blogs.find(b => b.id === blogId);
        if (blog) {
            blog.title = title;
            blog.content = content.substring(0, 200) + (content.length > 200 ? '...' : '');
            blog.fullContent = content;
            
            // Save to localStorage
            localStorage.setItem('blogs', JSON.stringify(blogs));
            
            // Close the modal
            bootstrap.Modal.getInstance(document.getElementById('editBlogModal')).hide();
            
            // Re-render the blogs
            renderBlogs();
            renderLeaderboard();
        }
    }

    // Delete blog function
    function deleteBlog(blogId) {
        if (confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
            const index = blogs.findIndex(b => b.id === parseInt(blogId));
            if (index !== -1) {
                blogs.splice(index, 1);
                
                // Save to localStorage
                localStorage.setItem('blogs', JSON.stringify(blogs));
                
                // Re-render the blogs
                renderBlogs();
                renderLeaderboard();
            }
        }
    }

    // Function to format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    // Function to handle image uploads preview
    function handleImagePreview() {
        const imageInput = document.getElementById('blog-images');
        const previewContainer = document.getElementById('image-preview-container');
        const previewInner = document.getElementById('image-preview-inner');
        const clearImagesBtn = document.getElementById('clear-images-btn');
        
        if (!imageInput || !previewContainer || !previewInner) return;
        
        // Handle image selection
        imageInput.addEventListener('change', function() {
            // Clear previous previews
            previewInner.innerHTML = '';
            
            if (this.files.length > 0) {
                // Show preview container
                previewContainer.classList.remove('d-none');
                
                // Create preview for each image
                Array.from(this.files).forEach((file, index) => {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        const slide = document.createElement('div');
                        slide.className = `carousel-item ${index === 0 ? 'active' : ''}`;
                        slide.innerHTML = `
                            <div class="image-preview-item">
                                <img src="${e.target.result}" class="d-block w-100" alt="Preview image ${index + 1}">
                                <div class="carousel-caption d-none d-md-block">
                                    <h5>Image ${index + 1}</h5>
                                </div>
                            </div>
                        `;
                        previewInner.appendChild(slide);
                    };
                    
                    reader.readAsDataURL(file);
                });
            } else {
                // Hide preview container when no images
                previewContainer.classList.add('d-none');
            }
        });
        
        // Handle clear images button
        clearImagesBtn.addEventListener('click', function() {
            imageInput.value = '';
            previewInner.innerHTML = '';
            previewContainer.classList.add('d-none');
        });
    }

    // Create success modal for blog post creation
    function createSuccessModal() {
        // Check if modal already exists
        if (document.getElementById('successModal')) return;
        
        const modalHTML = `
            <div class="modal fade" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header bg-success text-white">
                            <h5 class="modal-title" id="successModalLabel">Success!</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-center py-4">
                            <i class="fas fa-check-circle text-success" style="font-size: 4rem; margin-bottom: 1rem;"></i>
                            <h4>Your Blog Post is Ready for Others to Read.</h4>
                            <p class="text-muted">Thank you for sharing your Brighton experience!</p>
                        </div>
                        <div class="modal-footer justify-content-center">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <a href="#" class="btn btn-primary" id="viewBlogBtn">View Blog</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // Add the success modal to the document
    createSuccessModal();

    // Function to add a new blog
    function addNewBlog(title, author, content, imageFiles) {
        // Process images
        let images = [];
        let mainImage = 'images/brighton_blog_default.jpg'; // Default image
        
        if (imageFiles && imageFiles.length > 0) {
            // Convert FileList to array and create data URLs
            images = Array.from(imageFiles).map(file => {
                return URL.createObjectURL(file);
            });
            
            // Set first image as main image
            mainImage = images[0];
        }
        
        const newBlog = {
            id: blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1,
            title: title,
            author: author,
            date: new Date().toISOString().split('T')[0],
            content: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
            fullContent: content,
            image: mainImage,
            images: images.length > 0 ? images : [mainImage], // Store all images
            currentImageIndex: 0, // Initialize the current image index
            likes: 0,
            comments: []
        };
        
        blogs.unshift(newBlog); // Add to beginning of array
        
        // Save to localStorage
        localStorage.setItem('blogs', JSON.stringify(blogs));
        
        renderBlogs();
        renderLeaderboard();
        
        // Return the new blog id for the success modal
        return newBlog.id;
    }

    // Add blog button click handler
    const addBlogBtn = document.getElementById('add-blog-btn');
    if (addBlogBtn) {
        addBlogBtn.addEventListener('click', function() {
            // Check if user is logged in
            if (!isLoggedIn) {
                if (confirm('You need to sign in to add a blog. Would you like to sign in now?')) {
                    window.location.href = 'signUp.html';
                }
                return;
            }
            
            // User is logged in, update the form
            const currentUserNameSpan = document.getElementById('current-user-name');
            if (currentUserNameSpan) {
                currentUserNameSpan.textContent = currentUser;
            }
            
            const addBlogModal = new bootstrap.Modal(document.getElementById('addBlogModal'));
            addBlogModal.show();
        });
    }

    // Submit blog form handler
    const submitBlogBtn = document.getElementById('submit-blog-btn');
    if (submitBlogBtn) {
        submitBlogBtn.addEventListener('click', function() {
            // Verify user is still logged in (in case they logged out in another tab)
            if (!localStorage.getItem('isLoggedIn') === 'true') {
                alert('Your session has expired. Please sign in again to post a blog.');
                window.location.href = 'signUp.html';
                return;
            }
            
            const title = document.getElementById('blog-title').value;
            const content = document.getElementById('blog-content').value;
            const imageInput = document.getElementById('blog-images');
            const author = localStorage.getItem('currentUser');
            
            if (!author) {
                alert('Please sign in before submitting a blog');
                return;
            }
            
            if (title && content) {
                // Get images files
                const imageFiles = imageInput.files;
                
                // Add new blog and get the blog id
                const blogId = addNewBlog(title, author, content, imageFiles);
                
                // Close the modal
                const addBlogModal = bootstrap.Modal.getInstance(document.getElementById('addBlogModal'));
                addBlogModal.hide();
                
                // Reset the form
                document.getElementById('blog-form').reset();
                
                // Reset image preview
                const previewContainer = document.getElementById('image-preview-container');
                if (previewContainer) {
                    previewContainer.classList.add('d-none');
                }
                
                // Set up the success modal
                const viewBlogBtn = document.getElementById('viewBlogBtn');
                if (viewBlogBtn) {
                    viewBlogBtn.href = `blog-detail.html?id=${blogId}`;
                }
                
                // Show the success modal
                const successModal = new bootstrap.Modal(document.getElementById('successModal'));
                successModal.show();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }
    
    // Replace username display with our new user info display
    const blogCardsContainer = document.getElementById('blog-cards-container');
    if (blogCardsContainer) {
        // Remove any existing username display
        const existingDisplay = document.querySelector('.username-display');
        if (existingDisplay) {
            existingDisplay.remove();
        }
        
        // Add our new user info display
        const userInfoDisplay = createUserInfoDisplay();
        blogCardsContainer.parentNode.insertBefore(userInfoDisplay, blogCardsContainer);
    }
    
    // Update auth UI if script.js is loaded
    if (typeof updateAuthUI === 'function') {
        updateAuthUI();
    }

    // Initialize image preview handler
    handleImagePreview();
    
    // Make blogs data globally available for other scripts
    window.sampleBlogs = blogs;

    // Function to update blog images and refresh display
    window.updateBlogImage = function(blogId, newImageUrl) {
        // Find the blog by ID
        const blog = blogs.find(b => b.id === blogId);
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
        localStorage.setItem('blogs', JSON.stringify(blogs));
        
        // Refresh the display
        renderBlogs();
        renderLeaderboard();
        
        return true;
    };

    // Initial render
    renderBlogs();
    renderLeaderboard();
}); 