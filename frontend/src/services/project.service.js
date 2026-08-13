import api from "./api";

class ProjectService {
  async getProjects() {
    const { data } = await api.get("/projects");
    return data;
  }

  async getProject(id) {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  }

  async createProject(project) {
    const { data } = await api.post("/projects", project);
    return data;
  }

  async updateProject(id, project) {
    const { data } = await api.put(`/projects/${id}`, project);
    return data;
  }

  async deleteProject(id) {
    const { data } = await api.delete(`/projects/${id}`);
    return data;
  }
}

export default new ProjectService();