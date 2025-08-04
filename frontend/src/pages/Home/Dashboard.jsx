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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-100/40 to-purple-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-100/40 to-cyan-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto pt-8 pb-24 relative z-10">
          {/* Header Section */}
          <div className="mb-12 px-4 md:px-0">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                <LuSparkles className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                  Interview Prep Dashboard
                </h1>
                <p className="text-slate-600 mt-1">
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
          </div>

          {/* Sessions Grid */}
          {sessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
              {sessions?.map((data, index) => (
                <div
                  key={data?.id || data?._id || index}
                  className="transform hover:scale-105 transition-all duration-300"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <SummaryCard
                    colors={Card_BG[index % Card_BG.length]}
                    role={data?.role || ""}
                    topicsToFocus={data?.topicsToFocus || ""}
                    experience={data?.experience || ""}
                    questions={data?.questions?.length || ""}
                    description={data?.description || ""}
                    lastUpdated={
                      data?.updatedAt
                        ? moment(data.updatedAt).format("Do MMM YYYY")
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
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mb-8">
                <LuSparkles className="text-indigo-500 text-4xl" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-3">
                No Sessions Yet
              </h3>
              <p className="text-slate-600 text-center max-w-md mb-8 leading-relaxed">
                Create your first interview preparation session to get started
                with AI-powered learning and practice.
              </p>
              <button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-4 rounded-full hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                onClick={() => setOpenCreateModal(true)}
              >
                <LuPlus className="text-lg" />
                Create First Session
              </button>
            </div>
          )}


          {/* Extended FAB for larger screens */}
          {sessions.length > 0 && (
            <button
              className="hidden lg:flex fixed bottom-8 right-8 h-14 items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-4 rounded-full hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl z-20"
              onClick={() => setOpenCreateModal(true)}
            >
              <LuPlus className="text-lg" />
              <span>New Session</span>
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
