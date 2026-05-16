import React, { useState, useEffect } from "react";
import { LuPlus, LuSparkles } from "react-icons/lu";
import Card_BG from "../../utils/data";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../utils/apiPaths";
import axioInstance from "../../utils/axioInstance";
import SummaryCard from "../../components/cards/SummaryCard";
import moment from "moment";
import Modal from "../../components/Modal";
import CreateSessionForm from "./CreateSessionForm";
import DeleteAlertContent from "../../components/DeleteAlertContent";

const Dashboard = () => {
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  const fetchAllSessions = async () => {
    try {
      const response = await axioInstance.get(API_PATHS.SESSION.GET_ALL);
      console.log("API response:", response);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching session data:", error);
    }
  };

  const deleteSession = async (sessionData) => {
    try {
      const res = await axioInstance.delete(
        API_PATHS.SESSION.DELETE(sessionData._id)
      );

      setSessions((prev) => prev.filter((s) => s._id !== sessionData._id));
      setOpenDeleteAlert({ open: false, data: null });

      toast.success("Session deleted successfully");
    } catch (error) {
      toast.error("Failed to delete session");
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto pt-10 pb-24 relative z-10 px-6 max-w-7xl">
          {/* Header Section */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 text-white">
                <LuSparkles className="text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  Interview Prep Dashboard
                </h1>
                <p className="text-gray-500 font-medium mt-1 text-sm">
                  {sessions.length > 0
                    ? `Manage your ${
                        sessions.length
                      } interview preparation session${
                        sessions.length !== 1 ? "s" : ""
                      }`
                    : "Start your interview preparation journey"}
                </p>
              </div>
            </div>
            {sessions.length > 0 && (
              <button
                className="hidden md:flex items-center gap-2 bg-gray-900 text-white font-medium px-6 py-3 rounded-xl hover:bg-black transition-all shadow-md active:scale-[0.98]"
                onClick={() => setOpenCreateModal(true)}
              >
                <LuPlus className="text-lg" />
                <span>New Session</span>
              </button>
            )}
          </div>

          {/* Sessions Grid */}
          {sessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions?.map((data, index) => (
                <div
                  key={data?.id || data?._id || index}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <SummaryCard
                    role={data?.role || ""}
                    topicsToFocus={data?.topicsToFocus || ""}
                    experience={data?.experience || ""}
                    questions={data?.questions?.length || ""}
                    description={data?.description || ""}
                    lastUpdated={
                      data?.updatedAt
                        ? moment(data.updatedAt).format("MMM Do, YYYY")
                        : ""
                    }
                    onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                    onDelete={() => setOpenDeleteAlert({ open: true, data })}
                  />
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-24 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                <LuSparkles className="text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No Sessions Yet
              </h3>
              <p className="text-gray-500 font-medium text-center max-w-sm mb-8 leading-relaxed">
                Create your first interview preparation session to get started
                with AI-powered learning and practice.
              </p>
              <button
                className="bg-blue-600 text-white font-medium px-8 py-3.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                onClick={() => setOpenCreateModal(true)}
              >
                <LuPlus className="text-xl" />
                Create First Session
              </button>
            </div>
          )}

          {/* Extended FAB for mobile screens */}
          {sessions.length > 0 && (
            <button
              className="md:hidden fixed bottom-8 right-8 h-14 w-14 items-center justify-center bg-blue-600 text-white font-bold rounded-full shadow-lg shadow-blue-600/30 z-20 hover:scale-105 active:scale-95 transition-all"
              onClick={() => setOpenCreateModal(true)}
            >
              <LuPlus className="text-2xl mx-auto" />
            </button>
          )}
        </div>
      </div>

      <Modal
        isOpen={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false);
        }}
        hideHeader
      >
        <div>
          <CreateSessionForm />
        </div>
      </Modal>

      {openDeleteAlert.open && (
        <Modal
          isOpen={openDeleteAlert?.open}
          onClose={() => {
            setOpenDeleteAlert({ open: false, data: null });
          }}
          title="Delete Session"
        >
          <div className="w-full">
            <DeleteAlertContent
              content="Are you sure you want to delete this session? This action cannot be undone."
              onDelete={() => deleteSession(openDeleteAlert.data)}
            />
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
