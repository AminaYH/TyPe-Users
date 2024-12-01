import axios from "axios";
import Todo from "../models/todo"; // Ensure the `Todo` type is correct

class TodoService {
  // Create an instance of axios with a base URL
  http = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL, // The base URL (e.g., http://localhost:8000)
  });

  // Fetch all todos
  async getAllTodos(): Promise<Todo[]> {
    try {
      const response = await this.http.get<Todo[]>("/todo"); // No '/api' prefix
      return response.data;
    } catch (error) {
      console.error("Error fetching todos:", error);
      throw error; // Re-throw to propagate the error
    }
  }

  // Fetch a todo by its ID
  async getTodoById(id: number): Promise<Todo> {
    try {
      const response = await this.http.get<Todo>(`/todo/${id}`); // No '/api' prefix
      return response.data;
    } catch (error) {
      console.error(`Error fetching todo with ID ${id}:`, error);
      throw error;
    }
  }
  async getUser(username:string):Promise<string>{
    return username;
  }
  // Add a new todo
  async addNewTodo(content: string): Promise<Todo> {
    try {
      const username = localStorage.getItem('username'); // Retrieve username from localStorage
      console.log('Retrieved username:', username);
      if (!username) {
        throw new Error(`${username} is required.`);
      }
      const response = await this.http.post<Todo>("/todo", { username, content }); // Include both username and content
      return response.data;

    } catch (error) {
      console.error("Error adding todo:", error);
      throw error;
    }
  }

  // Remove a todo by its ID
  async removeTodo(id: number): Promise<void> {
    try {
      const response = await this.http.delete(`/todo/${id}`); // No '/api' prefix
      return response.data;
    } catch (error) {
      console.error(`Error removing todo with ID ${id}:`, error);
      throw error;
    }
  }

  // Update a todo by its ID
  async updateTodo(
      id: number,
      content?: string,
      hasCompleted?: boolean
  ): Promise<Todo> {
    try {
      const response = await this.http.patch<Todo>(`/todo/${id}`, {
        content,
        hasCompleted,
      }); // No '/api' prefix
      return response.data;
    } catch (error) {
      console.error(`Error updating todo with ID ${id}:`, error);
      throw error;
    }
  }
}

// Export a single instance of the service
export default new TodoService();
