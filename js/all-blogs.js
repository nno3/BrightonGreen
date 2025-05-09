document.addEventListener('DOMContentLoaded', function() {
    // Get blogs data from localStorage
    const storedBlogs = localStorage.getItem('blogs');
    let blogs = [];
    
    if (storedBlogs) {
        blogs = JSON.parse(storedBlogs);
    } else {
        console.error('No blogs data found in localStorage');
        showError('Blog data not available. Please return to the blogs page.');
        return;
    }
    
    // Render all blogs
    renderAllBlogs(blogs);
});

function renderAllBlogs(blogs) {
    const allBlogsContainer = document.getElementById('all-blogs-container');
    
    // Clear container
    allBlogsContainer.innerHTML = '';
    
    // Sort blogs by likes (descending) for leaderboard ranking
    const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
    
    // Create table for blogs
    const table = document.createElement('table');
    table.className = 'table table-hover blog-leaderboard-table';
    
    // Create table header
    const tableHeader = document.createElement('thead');
    tableHeader.innerHTML = `
        <tr>
            <th scope="col" class="rank-column">Rank</th>
            <th scope="col" class="likes-column">Likes</th>
            <th scope="col" class="title-column">Blog Title</th>
            <th scope="col" class="author-column">Author</th>
            <th scope="col" class="action-column">Action</th>
        </tr>
    `;
    table.appendChild(tableHeader);
    
    // Create table body
    const tableBody = document.createElement('tbody');
    
    // Add each blog to the table
    sortedBlogs.forEach((blog, index) => {
        const row = document.createElement('tr');
        
        // Add rank class based on position
        let rankClass = '';
        if (index === 0) rankClass = 'rank-first';
        else if (index === 1) rankClass = 'rank-second';
        else if (index === 2) rankClass = 'rank-third';
        
        row.innerHTML = `
            <td class="rank-column ${rankClass}">${index + 1}</td>
            <td class="likes-column">
                <span class="likes-count"><i class="fas fa-heart"></i> ${blog.likes}</span>
            </td>
            <td class="title-column">${blog.title}</td>
            <td class="author-column">${blog.author}</td>
            <td class="action-column">
                <a href="blog-detail.html?id=${blog.id}" class="btn btn-primary read-full-blog-btn">
                    <i class="fas fa-book-open me-2"></i>Read Full Blog
                </a>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    table.appendChild(tableBody);
    allBlogsContainer.appendChild(table);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function showError(message) {
    const allBlogsContainer = document.getElementById('all-blogs-container');
    allBlogsContainer.innerHTML = `
        <div class="alert alert-danger" role="alert">
            <h4 class="alert-heading">Error</h4>
            <p>${message}</p>
            <hr>
            <a href="blogs.html" class="btn btn-primary">Return to Blogs</a>
        </div>
    `;
} 